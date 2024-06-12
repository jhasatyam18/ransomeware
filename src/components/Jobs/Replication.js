import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, Col, Container, Form, Label, Row } from 'reactstrap';
import { API_PROTECTION_PLAN_REPLICATION_JOBS_STATUS, API_PROTECTOIN_PLAN_REPLICATION_JOBS, API_PROTECTTION_PLAN_REPLICATION_VM_JOBS, API_REPLICATION_JOBS, API_REPLICATION_VM_JOBS } from '../../constants/ApiConstants';
import { REPLICATION_JOB_TYPE } from '../../constants/InputConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { REPLICATION_JOBS, REPLICATION_VM_JOBS, TABLE_FILTER_TEXT } from '../../constants/TableConstants';
import { changeReplicationJobType, setReplicationJobs } from '../../store/actions/JobActions';
import { addMessage } from '../../store/actions/MessageActions';
import { callAPI } from '../../utils/ApiUtils';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import DMAPIPaginator from '../Table/DMAPIPaginator';
import DMTable from '../Table/DMTable';
import ProtectionPlanReplications from './ProtectionPlanReplications';

class Replication extends Component {
  constructor() {
    super();
    this.state = { plansData: [] };
    this.changeJobType = this.changeJobType.bind(this);
  }

  componentDidMount() {
    this.fetchReplicationJobs();
  }

  componentDidUpdate(prevProps) {
    const { user, jobs } = this.props;
    const { refresh } = user.context;
    const prevRefresh = prevProps.user.context.refresh;
    const { replicationType } = jobs;
    if (refresh !== prevRefresh && replicationType === REPLICATION_JOB_TYPE.PLAN) {
      this.fetchReplicationJobs();
    }
  }

  componentWillUnmount() {
    this.state = null;
  }

  fetchReplicationJobs() {
    const { protectionplanID, dispatch } = this.props;
    const url = (protectionplanID === 0 ? API_PROTECTION_PLAN_REPLICATION_JOBS_STATUS : `${API_PROTECTION_PLAN_REPLICATION_JOBS_STATUS}?protectionplanid=${protectionplanID}`);
    callAPI(url).then((json) => {
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        this.setState({ plansData: json });
      }
    },
    (err) => {
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  }

  changeJobType(type) {
    const { dispatch } = this.props;
    dispatch(changeReplicationJobType(type));
  }

  renderOptions() {
    const { jobs, t } = this.props;
    const { replicationType } = jobs;
    return (
      <>
        <Form>
          <div className="form-check-inline">
            <Label className="form-check-label" for="plan-options">
              <input type="radio" className="form-check-input" id="plan-options" name="jobsType" value={replicationType === REPLICATION_JOB_TYPE.PLAN} checked={replicationType === REPLICATION_JOB_TYPE.PLAN} onChange={() => { this.changeJobType(REPLICATION_JOB_TYPE.PLAN); }} />
              {t('protection.plan')}
            </Label>
          </div>
          <div className="form-check-inline">
            <Label className="form-check-label" for="vms-options">
              <input type="radio" className="form-check-input" id="vms-options" name="jobsType" value={replicationType === REPLICATION_JOB_TYPE.VM} checked={replicationType === REPLICATION_JOB_TYPE.VM} onChange={() => { this.changeJobType(REPLICATION_JOB_TYPE.VM); }} />
              {t('virtual.machines')}
            </Label>
          </div>
          <div className="form-check-inline">
            <Label className="form-check-label" for="disks-options">
              <input type="radio" className="form-check-input" id="disks-options" name="jobsType" value={replicationType === REPLICATION_JOB_TYPE.DISK} checked={replicationType === REPLICATION_JOB_TYPE.DISK} onChange={() => { this.changeJobType(REPLICATION_JOB_TYPE.DISK); }} />
              {t('disks')}
            </Label>
          </div>
        </Form>
      </>
    );
  }

  renderDiskJobs() {
    const { jobs, protectionplanID, dispatch } = this.props;
    const { replication } = jobs;
    const url = (protectionplanID === 0 ? API_REPLICATION_JOBS : API_PROTECTOIN_PLAN_REPLICATION_JOBS.replace('<id>', protectionplanID));
    return (
      <>
        <Row className="padding-left-20">
          <Col sm={5}>
            {this.renderOptions()}
          </Col>
          <Col sm={7}>
            <div className="padding-right-30 padding-left-10">
              <DMAPIPaginator
                showFilter="true"
                columns={REPLICATION_JOBS}
                filterHelpText={TABLE_FILTER_TEXT.REPLICATION_JOBS}
                apiUrl={url}
                isParameterizedUrl={protectionplanID === 0 ? 'false' : 'true'}
                storeFn={setReplicationJobs}
                name="replicationDisks"
                fetchInInterval
              />
            </div>
          </Col>
        </Row>
        <DMTable
          dispatch={dispatch}
          columns={REPLICATION_JOBS}
          data={replication}
        />

      </>
    );
  }

  renderVMJobs() {
    const { jobs, protectionplanID, dispatch } = this.props;
    const { replication } = jobs;
    const url = (protectionplanID === 0 ? API_REPLICATION_VM_JOBS : API_PROTECTTION_PLAN_REPLICATION_VM_JOBS.replace('<id>', protectionplanID));
    return (
      <>
        <Row className="padding-left-20">
          <Col sm={5}>
            {this.renderOptions()}
          </Col>
          <Col sm={7}>
            <div className="padding-right-30 padding-left-10">
              <DMAPIPaginator
                showFilter="true"
                columns={REPLICATION_VM_JOBS}
                filterHelpText={TABLE_FILTER_TEXT.REPLICATION_VM_JOBS}
                apiUrl={url}
                isParameterizedUrl={protectionplanID === 0 ? 'false' : 'true'}
                storeFn={setReplicationJobs}
                name="replicationVMs"
                fetchInInterval
              />
            </div>
          </Col>
        </Row>
        <DMTable
          dispatch={dispatch}
          columns={REPLICATION_VM_JOBS}
          data={replication}
        />

      </>
    );
  }

  renderDrReplications() {
    const { jobs, protectionplanID } = this.props;
    const { replicationType } = jobs;
    const { plansData } = this.state;
    if (replicationType !== REPLICATION_JOB_TYPE.PLAN || plansData.length <= 0) {
      return null;
    }
    const data = plansData[0];
    const { name } = data;
    if (typeof name === 'undefined') {
      return null;
    }
    return (
      <Row className="padding-top-20">
        <Col sm={12}>
          {plansData.map((plan) => {
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

export default (withTranslation()(Replication));
