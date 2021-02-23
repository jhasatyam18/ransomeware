import React, { Component } from 'react';
import { Card, CardBody, Col, Container, Form, Label, Row } from 'reactstrap';
import DMTable from '../Table/DMTable';
import { REPLICATION_JOBS, REPLICATION_VM_JOBS } from '../../constants/TableConstants';
import DMTPaginator from '../Table/DMTPaginator';
import { changeReplicationJobType, fetchReplicationJobs } from '../../store/actions/JobActions';
import { REPLICATION_JOB_TYPE } from '../../constants/InputConstants';
import ProtectionPlanReplications from './ProtectionPlanReplications';

class Replication extends Component {
  constructor() {
    super();
    this.state = { dataToDisplay: [] };
    this.setDataForDisplay = this.setDataForDisplay.bind(this);
    this.changeJobType = this.changeJobType.bind(this);
  }

  componentDidMount() {
    this.fethData();
  }

  componentWillUnmount() {
    this.state = null;
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
    dispatch(changeReplicationJobType(type));
    setTimeout(() => {
      dispatch(fetchReplicationJobs(protectionplanID));
    }, 1000);
  }

  renderOptions() {
    const { jobs } = this.props;
    const { replicationType } = jobs;
    // const isVM = (replicationType === REPLICATION_JOB_TYPE.VM);
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
    const { dataToDisplay } = this.state;
    const { dispatch } = this.props;
    return (
      <>
        <Container fluid>
          <Card>
            <CardBody>
              <Row className="padding-left-20">
                <Col sm={8}>
                  {this.renderOptions()}
                </Col>
                <Col sm={4}>
                  <div className="display__flex__reverse">
                    <DMTPaginator data={replication} setData={this.setDataForDisplay} showFilter="false" columns={REPLICATION_VM_JOBS} />
                  </div>
                </Col>
              </Row>
              <DMTable
                dispatch={dispatch}
                columns={REPLICATION_JOBS}
                data={dataToDisplay}
              />
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }

  renderVMJobs() {
    const { jobs } = this.props;
    const { replication } = jobs;
    const { dataToDisplay } = this.state;
    const { dispatch } = this.props;
    return (
      <>
        <Container fluid>
          <Card>
            <CardBody>
              <Row className="padding-left-20">
                <Col sm={8}>
                  {this.renderOptions()}
                </Col>
                <Col sm={4}>
                  <div className="display__flex__reverse">
                    <DMTPaginator data={replication} setData={this.setDataForDisplay} showFilter="false" columns={REPLICATION_VM_JOBS} />
                  </div>
                </Col>
              </Row>
              <DMTable
                dispatch={dispatch}
                columns={REPLICATION_VM_JOBS}
                data={dataToDisplay}
              />
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }

  renderDrReplications() {
    const { jobs } = this.props;
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
          {replication.map((plan) => <ProtectionPlanReplications title={plan.name} vms={plan.vms} />)}
        </Col>
      </Row>
    );
  }

  renderProtectionPlanJobs() {
    return (
      <>
        <Container fluid>
          <Card>
            <CardBody>
              <Row className="padding-left-20">
                <Col sm={12}>
                  {this.renderOptions()}
                </Col>
              </Row>
              {this.renderDrReplications()}
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }

  render() {
    const { jobs } = this.props;
    const { replicationType } = jobs;
    return (
      <>
        {replicationType === REPLICATION_JOB_TYPE.VM ? this.renderVMJobs() : null}
        {replicationType === REPLICATION_JOB_TYPE.DISK ? this.renderDiskJobs() : null}
        {replicationType === REPLICATION_JOB_TYPE.PLAN ? this.renderProtectionPlanJobs() : null}
      </>
    );
  }
}

export default Replication;
