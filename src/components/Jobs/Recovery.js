import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, Col, Container, Form, Label, Row } from 'reactstrap';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import DropdownActions from '../Common/DropdownActions';
import { API_PROTECTION_PLAN_RECOVERY_JOBS_STATUS, API_RECOVERY_JOBS } from '../../constants/ApiConstants';
import { RECOVERY_JOB_TYPE } from '../../constants/InputConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { PROTECTION_PLAN_RECOVERY_JOBS, RECOVERY_JOBS } from '../../constants/TableConstants';
import { changeRecoveryJobType, setRecoveryJobs } from '../../store/actions/JobActions';
import { addMessage } from '../../store/actions/MessageActions';
import { fetchRefreshRecoveryData } from '../../store/actions/RefreshRecoveryActions';
import { callAPI } from '../../utils/ApiUtils';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import DMAPIPaginator from '../Table/DMAPIPaginator';
import DMTable from '../Table/DMTable';
import ProtectionPlanRecovery from './ProtectionPlanRecovery';

class Recovery extends Component {
  constructor() {
    super();
    this.state = { plansData: [] };
    this.changeJobType = this.changeJobType.bind(this);
    this.openRefreshRecovery = this.openRefreshRecovery.bind(this);
  }

  componentDidMount() {
    this.fetchRecoveryJobs();
  }

  componentDidUpdate(prevProps) {
    const { user, jobs } = this.props;
    const { refresh } = user.context;
    const prevRefresh = prevProps.user.context.refresh;
    const { recoveryType } = jobs;
    if (refresh !== prevRefresh && recoveryType === RECOVERY_JOB_TYPE.PLAN) {
      this.fetchRecoveryJobs();
    }
  }

  componentWillUnmount() {
    this.state = null;
  }

  fetchRecoveryJobs() {
    const { protectionplanID, dispatch } = this.props;
    const url = (protectionplanID === 0 ? API_PROTECTION_PLAN_RECOVERY_JOBS_STATUS : `${API_PROTECTION_PLAN_RECOVERY_JOBS_STATUS}?protectionplanid=${protectionplanID}`);
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
    dispatch(changeRecoveryJobType(type));
  }

  openRefreshRecovery() {
    return () => {
      const { protectionplanID, dispatch } = this.props;
      dispatch(fetchRefreshRecoveryData(protectionplanID, true));
    };
  }

  renderOptions() {
    const { jobs, t } = this.props;
    const { recoveryType } = jobs;
    return (
      <>
        <Form>
          <div className="form-check-inline">
            <Label className="form-check-label" for="rec-plan-options">
              <input type="radio" className="form-check-input" id="rec-plan-options" name="jobsType" value={recoveryType === RECOVERY_JOB_TYPE.PLAN} checked={recoveryType === RECOVERY_JOB_TYPE.PLAN} onChange={() => { this.changeJobType(RECOVERY_JOB_TYPE.PLAN); }} />
              {t('protection.plan')}
            </Label>
          </div>
          <div className="form-check-inline">
            <Label className="form-check-label" for="rec-vms-options">
              <input type="radio" className="form-check-input" id="rec-vms-options" name="jobsType" value={recoveryType === RECOVERY_JOB_TYPE.VM} checked={recoveryType === RECOVERY_JOB_TYPE.VM} onChange={() => { this.changeJobType(RECOVERY_JOB_TYPE.VM); }} />
              {t('virtual.machines')}
            </Label>
          </div>
        </Form>
      </>
    );
  }

  renderActions() {
    const { dispatch, t, protectionplanID } = this.props;
    const actions = [{ label: 'Refresh recovery status', action: this.openRefreshRecovery, id: protectionplanID, disabled: false, icon: faRefresh }];

    return (
      <DropdownActions css="margin-top-10 mb-0 ml-1" title={t('actions')} dispatch={dispatch} actions={actions} align="left" alignLeft={0} />
    );
  }

  renderVMJobs() {
    const { dispatch, protectionplanID, jobs, user } = this.props;
    const { recovery } = jobs;
    const cols = (protectionplanID === null || protectionplanID === 0 ? RECOVERY_JOBS : PROTECTION_PLAN_RECOVERY_JOBS);
    const url = (protectionplanID === 0 ? API_RECOVERY_JOBS : `${API_RECOVERY_JOBS}?protectionplanid=${protectionplanID}`);
    return (
      <>

        <Row className="padding-left-20">
          <Col sm={5}>
            {this.renderOptions()}
            {this.renderActions()}
          </Col>
          <Col sm={7}>
            <div className="padding-right-30">
              <DMAPIPaginator
                showFilter="true"
                columns={cols}
                apiUrl={url}
                isParameterizedUrl={protectionplanID === 0 ? 'false' : 'true'}
                storeFn={setRecoveryJobs}
                name="recoveryVMs"
              />
            </div>
          </Col>
        </Row>
        <DMTable
          dispatch={dispatch}
          columns={cols}
          data={recovery}
          user={user}
        />

      </>
    );
  }

  renderDrRecovery() {
    const { jobs, protectionplanID } = this.props;
    const { recoveryType } = jobs;
    const { plansData } = this.state;
    if (recoveryType !== RECOVERY_JOB_TYPE.PLAN || plansData.length <= 0) {
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

export default (withTranslation()(Recovery));
