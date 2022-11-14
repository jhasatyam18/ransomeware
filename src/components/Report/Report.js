import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Button, Card, CardBody, Col, Container, Row } from 'reactstrap';
import { MILI_SECONDS_TIME } from '../../constants/EventConstant';
import { exportTableToExcel } from '../../utils/ReportUtils';
import { fetchDrPlans } from '../../store/actions/DrPlanActions';
import ReportSideBar from './ReportSideBar';
import ReportSystemOverview from './ReportSystemOverview';
import ReportTables from './ReportTables';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import { exportReportToPDF, generateAuditReport, getCriteria, resetReport } from '../../store/actions/ReportActions';
import { hideApplicationLoader, showApplicationLoader } from '../../store/actions/UserActions';
import { valueChange } from '../../store/actions';
import { RECOVERY_JOBS, REPLICATION_VM_JOBS, TABLE_ALERTS, TABLE_EVENTS, TABLE_HEADER_DR_PLANS, TABLE_HEADER_SITES, TABLE_NODES, TABLE_REPORT_PROTECTED_VMS } from '../../constants/TableConstants';
import { STATIC_KEYS } from '../../constants/InputConstants';

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
    dispatch(valueChange('report.protectionPlan.protectionPlans', 0));
    // const d = new Date();
    // d.setDate(d.getDate() - 30);
    // dispatch(valueChange('report.startDate', d));
    // dispatch(valueChange('report.endDate', new Date()));
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(resetReport());
  }

  toggleCollapse = () => {
    const { openCollapse } = this.state;
    this.setState({ openCollapse: !openCollapse });
  }

  generateReport = () => {
    const { dispatch } = this.props;
    const { openCollapse } = this.state;
    // const { dispatch, user } = this.props;
    // const { values } = user;
    // const startDate = getValue('report.startDate', values);
    // const endDate = getValue('report.endDate', values);
    // if (isEmpty({ value: startDate }) || isEmpty({ value: endDate })) {
    //   dispatch(addMessage('Select report time duration', MESSAGE_TYPES.ERROR));
    //   return;
    // }
    dispatch(valueChange('report.system.includeSystemOverView', true));
    dispatch(generateAuditReport());
    if (openCollapse) {
      this.toggleCollapse();
    }
  }

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
  }

  exportToExcel = () => {
    const { dispatch, dashboard, t } = this.props;
    this.setState({ printView: true });
    dispatch(showApplicationLoader('EXCEL_REPORT', t('report.export.excel')));
    setTimeout(() => {
      exportTableToExcel(dashboard);
    }, MILI_SECONDS_TIME.TEN_THOUSAND);
    setTimeout(() => {
      this.setState({ printView: false });
      dispatch(hideApplicationLoader('EXCEL_REPORT'));
    }, MILI_SECONDS_TIME.TEN_THOUSAND);
  }

  renderForm() {
    return (
      <ReportSideBar />
    );
  }

  renderReportFilter() {
    const { openCollapse } = this.state;
    if (!openCollapse) {
      return null;
    }
    return (
      <Col sm={12}>
        <div className="padding-top-10">
          {this.renderForm()}
        </div>
        <Button className="btn btn-outline-success btn-sm margin-bottom-10" onClick={this.generateReport}>Generate Report</Button>
      </Col>
    );
  }

  renderReports() {
    const { printView } = this.state;
    const { user } = this.props;
    const criteria = getCriteria(user);
    const { includeSystemOverView = false, includeNodes, includeEvents, includeAlerts, includeReplicationJobs, includeRecoveryJobs, includeProtectedVMS } = criteria;
    return (
      <>
        {includeSystemOverView === true ? <ReportSystemOverview printView={printView} /> : null}
        <ReportTables title="Protection Plans" columns={TABLE_HEADER_DR_PLANS} dataSource="plans" printView={printView} />
        <ReportTables title="Sites" columns={TABLE_HEADER_SITES} dataSource="sites" printView={printView} />
        {includeProtectedVMS === true ? <ReportTables title="Protected Machines" columns={TABLE_REPORT_PROTECTED_VMS} dataSource="protectedVMS" printView={printView} /> : null}
        {includeNodes === true ? <ReportTables title="Nodes" columns={TABLE_NODES} dataSource="nodes" printView={printView} /> : null}
        {includeEvents === true ? <ReportTables title="Events" columns={TABLE_EVENTS} dataSource="events" printView={printView} /> : null}
        {includeAlerts === true ? <ReportTables title="Alerts" columns={TABLE_ALERTS} dataSource="alerts" printView={printView} /> : null}
        {includeReplicationJobs === true ? <ReportTables title="Replication Jobs" columns={REPLICATION_VM_JOBS} dataSource="replication" printView={printView} /> : null}
        {includeRecoveryJobs === true ? <ReportTables title="Recovery Jobs" columns={RECOVERY_JOBS} dataSource="recovery" printView={printView} /> : null}
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
          <div className="report__content ">
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
    const { reports, t } = this.props;
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
                {hasData ? (
                  <>
                    <Button className="btn btn-outline-dark btn-sm margin-left-10 margin-bottom-15" onClick={this.exportToPDF}>
                      <i className="far fa-file-pdf text-danger icon_font" title="Export to PDF" />
                      <span className="padding-left-5">{t('export.pdf')}</span>
                    </Button>
                    <Button className="btn btn-outline-dark btn-sm margin-left-10 margin-bottom-15" onClick={this.exportToExcel}>
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
