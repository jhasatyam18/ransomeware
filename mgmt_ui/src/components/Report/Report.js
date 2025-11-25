import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Button, Card, CardBody, Col, Container, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import { faArrowDown, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MILI_SECONDS_TIME } from '../../constants/EventConstant';
import { PLATFORM_TYPES, REPORT_DURATION, STATIC_KEYS } from '../../constants/InputConstants';
import { DATE_ITEM_RENDERER, RECOVERY_JOBS, REPLICATION_VM_JOBS, TABLE_ALERTS, TABLE_EVENTS, TABLE_HEADER_SITES, TABLE_NODES, TABLE_REPORTS_CARD_CHECKPOINT, TABLE_REPORT_PROTECTED_VMS, TABLE_REPORT_PROTECTION_PLAN } from '../../constants/TableConstants';
import { valueChange } from '../../store/actions';
import { fetchDrPlans } from '../../store/actions/DrPlanActions';
import { exportReportToPDF, fetchSchedule, generateAuditReport, getCriteria, setReportCriteria, setReportObject } from '../../store/actions/ReportActions';
import { clearValues, hideApplicationLoader, setActiveTabReport, showApplicationLoader } from '../../store/actions/UserActions';
import { getValue } from '../../utils/InputUtils';
import { hasRequestedPrivileges } from '../../utils/PrivilegeUtils';
import { exportTableToExcel, showSelectPlanError, showSiteDetails } from '../../utils/ReportUtils';
import { isDateEmpty, isEmpty } from '../../utils/validationUtils';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import ReportSideBar from './ReportSideBar';
import ReportSystemOverview from './ReportSystemOverview';
import ReportTables from './ReportTables';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { addMessage } from '../../store/actions/MessageActions';
import { PLAN_DETAIL_TABS } from '../../constants/UserConstant';
import ScheduledReport from './ScheduledReport';

class Report extends Component {
  constructor() {
    super();
    this.state = {
      openCollapse: true,
      printView: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchDrPlans(STATIC_KEYS.UI_PROTECTION_PLANS));
    dispatch(valueChange('report.system.includeSystemOverView', true));
    dispatch(fetchSchedule());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(setReportObject({}));
    dispatch(setReportCriteria({}));
    dispatch(clearValues());
    dispatch(setActiveTabReport('1'));
  }

  toggleCollapse = () => {
    const { openCollapse } = this.state;
    this.setState({ openCollapse: !openCollapse });
  };

  generateReport = () => {
    const { dispatch, user } = this.props;
    const { openCollapse } = this.state;
    const { values } = user;
    const startDate = getValue(STATIC_KEYS.REPORT_DURATION_START_DATE, values);
    const endDate = getValue(STATIC_KEYS.REPORT_DURATION_END_DATE, values);
    const durationType = getValue(STATIC_KEYS.REPORT_DURATION_TYPE, values);
    if (durationType === REPORT_DURATION.CUSTOM && (isDateEmpty({ value: startDate }) || isDateEmpty({ value: endDate }))) {
      const date = new Date();
      if (isDateEmpty({ value: startDate }) && isDateEmpty({ value: endDate })) {
        dispatch(valueChange(STATIC_KEYS.REPORT_DURATION_START_DATE, date));
        dispatch(valueChange(STATIC_KEYS.REPORT_DURATION_END_DATE, date));
      } else if (isDateEmpty({ value: endDate })) {
        dispatch(valueChange(STATIC_KEYS.REPORT_DURATION_END_DATE, date));
      } else {
        dispatch(valueChange(STATIC_KEYS.REPORT_DURATION_START_DATE, date));
      }
    }
    if (showSelectPlanError(user)) {
      dispatch(addMessage('Please select protection plan', MESSAGE_TYPES.ERROR));
      return;
    }
    dispatch(valueChange('report.system.includeSystemOverView', true));
    dispatch(generateAuditReport());
    if (openCollapse) {
      this.toggleCollapse();
    }
  };

  exportToPDF = () => {
    const { dispatch, t } = this.props;
    this.setState({ printView: true });
    dispatch(showApplicationLoader('PDF_REPORT', t('report.export.pdf')));
    setTimeout(() => {
      dispatch(exportReportToPDF());
    }, MILI_SECONDS_TIME.ONE_THOUSAND);
    setTimeout(() => {
      this.setState({ printView: false });
      dispatch(hideApplicationLoader('PDF_REPORT'));
    }, MILI_SECONDS_TIME.TEN_THOUSAND);
  };

  exportToExcel = () => {
    const { dispatch, dashboard, t, reports, user } = this.props;
    const { result } = reports;
    const { sites = [] } = result;
    const { platformType } = user;
    let siteDetails;
    const localSite = sites.filter((site) => site.node.isLocalNode);
    const { name } = localSite[0];
    if (platformType === PLATFORM_TYPES.VMware) {
      siteDetails = `${name}`;
    } else {
      siteDetails = showSiteDetails(sites);
    }
    dispatch(showApplicationLoader('EXCEL_REPORT', t('report.export.excel')));
    setTimeout(() => {
      exportTableToExcel(dashboard, result, siteDetails, user);
    }, MILI_SECONDS_TIME.TEN_THOUSAND);
    setTimeout(() => {
      this.setState({ printView: false });
      dispatch(hideApplicationLoader('EXCEL_REPORT'));
    }, MILI_SECONDS_TIME.TEN_THOUSAND);
  };

  toggleTab(tab) {
    const { dispatch, user } = this.props;
    const { reportActiveTab } = user;
    const activeTab = reportActiveTab;
    if (activeTab !== tab) {
      dispatch(setActiveTabReport(tab));
    }
  }

  renderForm() {
    return (
      <ReportSideBar />
    );
  }

  renderNavLink() {
    const { t, user } = this.props;
    const { reportActiveTab } = user;
    const activeTab = reportActiveTab;
    return (
      <Nav tabs className="nav-tabs-custom nav-justified nav-resp-width">
        <NavItem>
          <NavLink className={`${classnames({ active: activeTab === PLAN_DETAIL_TABS.ONE })} cursor-pointer`} onClick={() => { this.toggleTab(PLAN_DETAIL_TABS.ONE); }}>
            <span className="d-none d-sm-block">{t('Reports')}</span>
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={`${classnames({ active: activeTab === PLAN_DETAIL_TABS.TWO })} cursor-pointer`} onClick={() => { this.toggleTab(PLAN_DETAIL_TABS.TWO); }}>
            <span className="d-none d-sm-block">{t('Scheduled Reports')}</span>
          </NavLink>
        </NavItem>
      </Nav>
    );
  }

  renderReportFilter() {
    const { openCollapse } = this.state;
    const { user, t } = this.props;
    const { values } = user;
    const durationType = getValue(STATIC_KEYS.REPORT_DURATION_TYPE, values);
    const disabled = !hasRequestedPrivileges(user, ['report.create']) || isEmpty({ value: durationType });
    if (!openCollapse) {
      return null;
    }
    return (
      <Col sm={12}>
        <div className="padding-top-10">
          {this.renderForm()}
        </div>
        <Button className="btn btn-sm margin-bottom-10 bg-secondary" onClick={this.generateReport} disabled={disabled}>{t('generate.report')}</Button>
      </Col>
    );
  }

  renderReports() {
    const { printView } = this.state;
    const { user } = this.props;
    const criteria = getCriteria(user);
    const { includeSystemOverView = false, includeNodes, includeEvents, includeAlerts, includeReplicationJobs, includeRecoveryJobs, includeProtectedVMS, includeCheckpoints } = criteria;
    const jobsColumns = RECOVERY_JOBS.map((col) => ({ ...col }));
    jobsColumns.splice(1, 0, { label: 'Start Time', field: 'startTime', itemRenderer: DATE_ITEM_RENDERER }, { label: 'End Time', field: 'endTime', itemRenderer: DATE_ITEM_RENDERER });
    return (
      <>
        {includeSystemOverView === true ? <ReportSystemOverview printView={printView} /> : null}
        {includeNodes === true ? <ReportTables title="Nodes" columns={TABLE_NODES} dataSource="nodes" printView={printView} /> : null}
        <ReportTables title="Sites" columns={TABLE_HEADER_SITES} dataSource="sites" printView={printView} />
        <ReportTables title="Protection Plans" columns={TABLE_REPORT_PROTECTION_PLAN} dataSource="plans" printView={printView} />
        {includeProtectedVMS === true ? <ReportTables title="Protected Machines" columns={TABLE_REPORT_PROTECTED_VMS} dataSource="protectedVMS" printView={printView} /> : null}
        {includeEvents === true ? <ReportTables title="Events" columns={TABLE_EVENTS} dataSource="events" printView={printView} /> : null}
        {includeAlerts === true ? <ReportTables title="Alerts" columns={TABLE_ALERTS} dataSource="alerts" printView={printView} /> : null}
        {includeReplicationJobs === true ? <ReportTables title="Replication Jobs" columns={REPLICATION_VM_JOBS} dataSource="replication" printView={printView} /> : null}
        {includeRecoveryJobs === true ? <ReportTables title="Recovery Jobs" columns={jobsColumns} dataSource="recovery" printView={printView} /> : null}
        {includeCheckpoints ? <ReportTables title="Point In Time Checkpoints" columns={TABLE_REPORTS_CARD_CHECKPOINT} dataSource="point_in_time_checkpoints" printView={printView} /> : null}
      </>
    );
  }

  renderReportContents() {
    const { reports, t } = this.props;
    const { result } = reports;
    // const { values } = user;
    const { openCollapse } = this.state;
    // const startDate = getValue('report.startDate', values);
    // const endDate = getValue('report.endDate', values);
    const resultKeys = Object.keys(result).length;
    if (resultKeys === 0) {
      return (
        <Col sm={openCollapse === true ? 8 : 12} className="margin-bottom-20 margin-top-10 container">
          <div className="d-flex justify-content-center">
            <span className="no__data ">
              {t('no.data.to.display')}
            </span>
          </div>
        </Col>
      );
    }
    return (
      <Col sm={12} id="datamotiveReport">
        <div className="report__content padding-top-5">
          {this.renderReports()}
        </div>
      </Col>
    );
  }

  render() {
    const { reports, t, user } = this.props;
    const { reportActiveTab } = user;
    const { openCollapse } = this.state;
    const { result = {} } = reports;
    const keys = Object.keys(result).length;
    const hasData = keys !== 0;
    return (
      <>
        <>
          <Container fluid>
            <Card>
              <CardBody>
                <DMBreadCrumb links={[{ label: 'report', link: '#' }]} />
                {this.renderNavLink()}
                <TabContent activeTab={reportActiveTab}>
                  <TabPane tabId={PLAN_DETAIL_TABS.TWO} className="p-3">
                    <ScheduledReport />
                  </TabPane>
                </TabContent>
                <TabContent activeTab={reportActiveTab}>
                  <TabPane tabId={PLAN_DETAIL_TABS.ONE} className="p-3">
                    {hasData ? (
                      <>
                        <Button className="btn btn-secondary btn-sm margin-bottom-15 margin-left-19 " onClick={this.toggleCollapse}>
                          {openCollapse ? <FontAwesomeIcon size="sm" icon={faArrowDown} /> : <FontAwesomeIcon size="sm" icon={faArrowRight} />}
                          <span className="padding-left-5">{t('filter')}</span>
                        </Button>
                        <Button className="btn btn-secondary btn-sm margin-left-10 margin-bottom-15" onClick={this.exportToPDF}>
                          <i className="far fa-file-pdf text-danger icon_font" title="Export to PDF" />
                          <span className="padding-left-5">{t('export.pdf')}</span>
                        </Button>
                        <Button className="btn btn-secondary btn-sm margin-left-10 margin-bottom-15" onClick={this.exportToExcel}>
                          <i className="fa fa-solid fa-file-excel text-success icon_font" />
                          <span className="padding-left-5">{t('export.excel')}</span>
                        </Button>
                      </>
                    ) : null}
                    <Row className="margin-left-8">
                      {this.renderReportFilter()}
                    </Row>
                    <Row className="margin-left-5">
                      {this.renderReportContents()}
                    </Row>
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Container>
        </>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { user, reports, dashboard } = state;
  return { user, reports, dashboard };
}
export default connect(mapStateToProps)(withTranslation()(Report));
