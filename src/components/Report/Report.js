import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Button, Card, CardBody, Col, Form, Row } from 'reactstrap';
import { FIELDS } from '../../constants/FieldsConstant';
import { RECOVERY_JOBS, REPLICATION_VM_JOBS, TABLE_ALERTS, TABLE_EVENTS, TABLE_HEADER_DR_PLANS, TABLE_HEADER_SITES, TABLE_NODES, TABLE_REPORT_PROTECTED_VMS } from '../../constants/TableConstants';
import { valueChange } from '../../store/actions';
import { exportReportToPDF, generateAuditReport, getCriteria } from '../../store/actions/ReportActions';
import { hideApplicationLoader, showApplicationLoader } from '../../store/actions/UserActions';
import DMField from '../Shared/DMField';
import ReportSystemOverview from './ReportSystemOverview';
import ReportTables from './ReportTables';

class Report extends Component {
  constructor() {
    super();
    this.state = {
      openCollapse: false,
      printView: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const d = new Date();
    d.setDate(d.getDate() - 30);
    dispatch(valueChange('report.startDate', d));
    dispatch(valueChange('report.endDate', new Date()));
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
    dispatch(generateAuditReport());
    if (openCollapse) {
      this.toggleCollapse();
    }
  }

  exportToPDF = () => {
    const { dispatch } = this.props;
    this.setState({ printView: true });
    dispatch(showApplicationLoader('PDF_REPORT', 'Exporting data to pdf.'));
    setTimeout(() => {
      dispatch(exportReportToPDF());
    }, 1000);
    setTimeout(() => {
      this.setState({ printView: false });
      dispatch(hideApplicationLoader('PDF_REPORT'));
    }, 10000);
  }

  renderForm() {
    const { user, dispatch } = this.props;
    const fields = Object.keys(FIELDS).filter((key) => key.indexOf('report.') !== -1);
    const renderFields = [];
    fields.forEach((field) => {
      renderFields.push((<DMField dispatch={dispatch} user={user} fieldKey={field} key={`recipient-${field}`} />));
    });
    return (
      <Form>
        {
          renderFields
        }
      </Form>
    );
  }

  renderReportFilter() {
    const { openCollapse } = this.state;
    if (!openCollapse) {
      return null;
    }
    return (
      <Col sm={4}>
        <div className="container padding-top-10">
          {this.renderForm()}
        </div>
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
        {includeRecoveryJobs === true ? <ReportTables title="Recovery Jobs" columns={RECOVERY_JOBS} dataSource="recovery" printView={printView} /> : null }
      </>
    );
  }

  renderReportContents() {
    const { reports } = this.props;
    const { result } = reports;
    // const { values } = user;
    const { openCollapse } = this.state;
    // const startDate = getValue('report.startDate', values);
    // const endDate = getValue('report.endDate', values);
    const resultKeys = Object.keys(result).length;
    if (resultKeys === 0) {
      return (
        <Col sm={openCollapse === true ? 8 : 12}>
          <div className="report__content">
            <span className="no__data">
              No data to display
            </span>
          </div>
        </Col>
      );
    }
    return (
      <Col sm={openCollapse === true ? 8 : 12} id="datamotiveReport">
        <div className="report__content data">
          {this.renderReports()}
        </div>
      </Col>
    );
  }

  render() {
    const { openCollapse } = this.state;
    return (
      <Card>
        <CardBody>
          <div className="p-2">
            <Button className="btn btn-outline-success btn-sm" onClick={this.generateReport}>Create Report</Button>
            <Button className="btn btn-outline-dark btn-sm margin-left-10" onClick={this.toggleCollapse}>{openCollapse === true ? 'Hide Filter' : 'Show Filter'}</Button>
            <Button className="btn btn-outline-dark btn-sm margin-left-10" onClick={this.exportToPDF}>Export Data To PDF</Button>
            {/* <Button className="btn btn-outline-dark btn-sm margin-left-10" onClick={this.printReport}>Print</Button> */}
          </div>
          <Row>
            {this.renderReportFilter()}
            {this.renderReportContents()}
          </Row>
        </CardBody>
      </Card>
    );
  }
}

function mapStateToProps(state) {
  const { user, reports } = state;
  return { user, reports };
}
export default connect(mapStateToProps)(withTranslation()(Report));
