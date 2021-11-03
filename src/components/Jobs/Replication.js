import React, { Component } from 'react';
import { Card, CardBody, Col, Container, Form, Label, Row } from 'reactstrap';
import DMTable from '../Table/DMTable';
import { REPLICATION_JOBS, REPLICATION_VM_JOBS, TABLE_FILTER_TEXT } from '../../constants/TableConstants';
import DMTPaginator from '../Table/DMTPaginator';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import { changeReplicationJobType, fetchReplicationJobs } from '../../store/actions/JobActions';
import { REPLICATION_JOB_TYPE } from '../../constants/InputConstants';
import ProtectionPlanReplications from './ProtectionPlanReplications';
import { filterData } from '../../utils/AppUtils';

class Replication extends Component {
  constructor() {
    super();
    this.state = { dataToDisplay: [], hasFilterString: false, searchData: [] };
    this.setDataForDisplay = this.setDataForDisplay.bind(this);
    this.changeJobType = this.changeJobType.bind(this);
    this.onFilter = this.onFilter.bind(this);
  }

  componentDidMount() {
    this.fethData();
  }

  componentWillUnmount() {
    this.state = null;
  }

  onFilter(criteria) {
    const { jobs } = this.props;
    const { replication, replicationType } = jobs;
    const cols = (replicationType === REPLICATION_JOB_TYPE.DISK ? REPLICATION_JOBS : REPLICATION_VM_JOBS);
    if (criteria === '') {
      this.setState({ hasFilterString: false, searchData: [] });
    } else {
      const newData = filterData(replication, criteria, cols);
      this.setState({ hasFilterString: true, searchData: newData });
    }
  }

  setDataForDisplay(data) {
    this.setState({ dataToDisplay: data });
  }

  fethData() {
    const { dispatch, protectionplanID } = this.props;
    dispatch(fetchReplicationJobs(protectionplanID));
  }

  changeJobType(type) {
    const { dispatch, protectionplanID } = this.props;
    this.setState({ hasFilterString: false });
    dispatch(changeReplicationJobType(type));
    setTimeout(() => {
      dispatch(fetchReplicationJobs(protectionplanID));
    }, 1000);
  }

  renderOptions() {
    const { jobs } = this.props;
    const { replicationType } = jobs;
    return (
      <>
        <Form>
          <div className="form-check-inline">
            <Label className="form-check-label" for="plan-options">
              <input type="radio" className="form-check-input" id="plan-options" name="jobsType" value={replicationType === REPLICATION_JOB_TYPE.PLAN} checked={replicationType === REPLICATION_JOB_TYPE.PLAN} onChange={() => { this.changeJobType(REPLICATION_JOB_TYPE.PLAN); }} />
              Protection Plan
            </Label>
          </div>
          <div className="form-check-inline">
            <Label className="form-check-label" for="vms-options">
              <input type="radio" className="form-check-input" id="vms-options" name="jobsType" value={replicationType === REPLICATION_JOB_TYPE.VM} checked={replicationType === REPLICATION_JOB_TYPE.VM} onChange={() => { this.changeJobType(REPLICATION_JOB_TYPE.VM); }} />
              Virtual Machines
            </Label>
          </div>
          <div className="form-check-inline">
            <Label className="form-check-label" for="disks-options">
              <input type="radio" className="form-check-input" id="disks-options" name="jobsType" value={replicationType === REPLICATION_JOB_TYPE.DISK} checked={replicationType === REPLICATION_JOB_TYPE.DISK} onChange={() => { this.changeJobType(REPLICATION_JOB_TYPE.DISK); }} />
              Disks
            </Label>
          </div>
        </Form>
      </>
    );
  }

  renderDiskJobs() {
    const { jobs } = this.props;
    const { replication } = jobs;
    const { dataToDisplay, searchData, hasFilterString } = this.state;
    const { dispatch } = this.props;
    const data = (hasFilterString ? searchData : replication);
    return (
      <>

        <Row className="padding-left-20">
          <Col sm={5}>
            {this.renderOptions()}
          </Col>
          <Col sm={7}>
            <div className="padding-right-30">
              <DMTPaginator
                data={data}
                setData={this.setDataForDisplay}
                showFilter="true"
                columns={REPLICATION_JOBS}
                onFilter={this.onFilter}
                filterHelpText={TABLE_FILTER_TEXT.REPLICATION_JOBS}
              />
            </div>
          </Col>
        </Row>
        <DMTable
          dispatch={dispatch}
          columns={REPLICATION_JOBS}
          data={dataToDisplay}
        />

      </>
    );
  }

  renderVMJobs() {
    const { jobs } = this.props;
    const { replication } = jobs;
    const { dataToDisplay, searchData, hasFilterString } = this.state;
    const { dispatch } = this.props;
    const data = (hasFilterString ? searchData : replication);
    return (
      <>

        <Row className="padding-left-20">
          <Col sm={5}>
            {this.renderOptions()}
          </Col>
          <Col sm={7}>
            <div className="padding-right-30">
              <DMTPaginator
                data={data}
                setData={this.setDataForDisplay}
                showFilter="true"
                onFilter={this.onFilter}
                columns={REPLICATION_VM_JOBS}
                filterHelpText={TABLE_FILTER_TEXT.REPLICATION_VM_JOBS}
              />
            </div>
          </Col>
        </Row>
        <DMTable
          dispatch={dispatch}
          columns={REPLICATION_VM_JOBS}
          data={dataToDisplay}
        />

      </>
    );
  }

  renderDrReplications() {
    const { jobs, protectionplanID } = this.props;
    const { replication, replicationType } = jobs;
    if (replicationType !== REPLICATION_JOB_TYPE.PLAN || replication.length <= 0) {
      return null;
    }
    const data = replication[0];
    const { name } = data;
    if (typeof name === 'undefined') {
      return null;
    }
    return (
      <Row className="padding-top-20">
        <Col sm={12}>
          {replication.map((plan) => {
            if (protectionplanID === null || protectionplanID === 0) {
              return <ProtectionPlanReplications title={plan.name} vms={plan.vms} />;
            }
            if (protectionplanID !== 0 && protectionplanID === plan.id) {
              return <ProtectionPlanReplications title={plan.name} vms={plan.vms} />;
            }
            return null;
          })}
        </Col>
      </Row>
    );
  }

  renderProtectionPlanJobs() {
    return (
      <>

        <Row className="padding-left-20">
          <Col sm={12}>
            {this.renderOptions()}
          </Col>
        </Row>
        {this.renderDrReplications()}

      </>
    );
  }

  render() {
    const { jobs } = this.props;
    const { replicationType } = jobs;
    return (
      <>
        <>
          <Container fluid>
            <Card>
              <CardBody>
                <DMBreadCrumb links={[{ label: 'replication', link: '#' }]} />
                {replicationType === REPLICATION_JOB_TYPE.VM ? this.renderVMJobs() : null}
                {replicationType === REPLICATION_JOB_TYPE.DISK ? this.renderDiskJobs() : null}
                {replicationType === REPLICATION_JOB_TYPE.PLAN ? this.renderProtectionPlanJobs() : null}
              </CardBody>
            </Card>
          </Container>
        </>
      </>
    );
  }
}

export default Replication;
