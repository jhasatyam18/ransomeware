import React, { Component } from 'react';
import { Card, CardBody, Col, Container, Form, Label, Row } from 'reactstrap';
import DMTable from '../Table/DMTable';
import { PROTECTION_PLAN_RECOVERY_JOBS, RECOVERY_JOBS } from '../../constants/TableConstants';
import DMTPaginator from '../Table/DMTPaginator';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import { fetchRecoveryJobs, changeRecoveryJobType } from '../../store/actions/JobActions';
import { fetchDrPlans } from '../../store/actions/DrPlanActions';
import { RECOVERY_JOB_TYPE } from '../../constants/InputConstants';
import ProtectionPlanRecovery from './ProtectionPlanRecovery';
import { filterData } from '../../utils/AppUtils';

class Recovery extends Component {
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
    const { jobs, protectionplanID } = this.props;
    const { recovery } = jobs;
    const cols = (protectionplanID === null || protectionplanID === 0 ? RECOVERY_JOBS : PROTECTION_PLAN_RECOVERY_JOBS);
    if (criteria === '') {
      this.setState({ hasFilterString: false, searchData: [] });
    } else {
      const newData = filterData(recovery, criteria, cols);
      this.setState({ hasFilterString: true, searchData: newData });
    }
  }

  setDataForDisplay(data) {
    this.setState({ dataToDisplay: data });
  }

  fethData() {
    const { dispatch, protectionplanID } = this.props;
    dispatch(fetchDrPlans('ui.values.drplan'));
    dispatch(fetchRecoveryJobs(protectionplanID));
  }

  changeJobType(type) {
    const { dispatch, protectionplanID } = this.props;
    this.setState({ hasFilterString: false });
    dispatch(changeRecoveryJobType(type));
    setTimeout(() => {
      dispatch(fetchRecoveryJobs(protectionplanID));
    }, 1000);
  }

  renderOptions() {
    const { jobs } = this.props;
    const { recoveryType } = jobs;
    return (
      <>
        <Form>
          <div className="form-check-inline">
            <Label className="form-check-label" for="rec-plan-options">
              <input type="radio" className="form-check-input" id="rec-plan-options" name="jobsType" value={recoveryType === RECOVERY_JOB_TYPE.PLAN} checked={recoveryType === RECOVERY_JOB_TYPE.PLAN} onChange={() => { this.changeJobType(RECOVERY_JOB_TYPE.PLAN); }} />
              Protection Plan
            </Label>
          </div>
          <div className="form-check-inline">
            <Label className="form-check-label" for="rec-vms-options">
              <input type="radio" className="form-check-input" id="rec-vms-options" name="jobsType" value={recoveryType === RECOVERY_JOB_TYPE.VM} checked={recoveryType === RECOVERY_JOB_TYPE.VM} onChange={() => { this.changeJobType(RECOVERY_JOB_TYPE.VM); }} />
              Virtual Machines
            </Label>
          </div>
        </Form>
      </>
    );
  }

  renderVMJobs() {
    const { jobs, user } = this.props;
    const { recovery } = jobs;
    const { dataToDisplay, searchData, hasFilterString } = this.state;
    const { dispatch, protectionplanID } = this.props;
    const cols = (protectionplanID === null || protectionplanID === 0 ? RECOVERY_JOBS : PROTECTION_PLAN_RECOVERY_JOBS);
    const data = (hasFilterString ? searchData : recovery);
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
                columns={cols}
                onFilter={this.onFilter}
              />
            </div>
          </Col>
        </Row>
        <DMTable
          dispatch={dispatch}
          columns={cols}
          data={dataToDisplay}
          user={user}
        />

      </>
    );
  }

  renderDrRecovery() {
    const { jobs, protectionplanID } = this.props;
    const { recovery, recoveryType } = jobs;
    if (recoveryType !== RECOVERY_JOB_TYPE.PLAN || recovery.length <= 0) {
      return null;
    }
    const data = recovery[0];
    const { name } = data;
    if (typeof name === 'undefined') {
      return null;
    }
    return (
      <Row className="padding-top-20">
        <Col sm={12}>
          {recovery.map((plan) => {
            if (protectionplanID === null || protectionplanID === 0) {
              return <ProtectionPlanRecovery title={plan.name} vms={plan.protectionPlanJobs} />;
            }
            if (protectionplanID !== 0 && protectionplanID === plan.id) {
              return <ProtectionPlanRecovery title={plan.name} vms={plan.protectionPlanJobs} />;
            }
            return null;
          })}
        </Col>
      </Row>
    );
  }

  renderPlanJobs() {
    return (
      <>
        <Row className="padding-left-20">
          <Col sm={12}>
            {this.renderOptions()}
          </Col>
        </Row>
        {this.renderDrRecovery()}
      </>
    );
  }

  render() {
    const { jobs } = this.props;
    const { recoveryType } = jobs;
    try {
      return (
        <>
          <>
            <Container fluid>
              <Card>
                <CardBody>
                  <DMBreadCrumb links={[{ label: 'recovery', link: '#' }]} />
                  {recoveryType === RECOVERY_JOB_TYPE.VM ? this.renderVMJobs() : null}
                  {recoveryType === RECOVERY_JOB_TYPE.PLAN ? this.renderPlanJobs() : null}
                </CardBody>
              </Card>
            </Container>
          </>
        </>
      );
    } catch (err) {
      return (
        'ERROR'
      );
    }
  }
}

export default Recovery;
