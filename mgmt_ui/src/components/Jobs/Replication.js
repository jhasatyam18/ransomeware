import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Card, CardBody, Col, Form, Label, Row } from 'reactstrap';
import { getValue } from '../../utils/InputUtils';
import { KEY_CONSTANTS } from '../../constants/UserConstant';
import { hideApplicationLoader, showApplicationLoader, valueChange } from '../../store/actions';
import { API_PROTECTION_PLAN_REPLICATION_JOBS_STATUS, API_PROTECTOIN_PLAN_REPLICATION_JOBS, API_PROTECTTION_PLAN_REPLICATION_VM_JOBS, API_REPLICATION_JOBS, API_REPLICATION_VM_JOBS } from '../../constants/ApiConstants';
import { REPLICATION_JOB_TYPE } from '../../constants/InputConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { REPLICATION_JOBS, REPLICATION_VM_JOBS, TABLE_FILTER_TEXT } from '../../constants/TableConstants';
import { changeReplicationJobType, setDiskReplicationJobs, setReplicationJobs } from '../../store/actions/JobActions';
import { addMessage } from '../../store/actions/MessageActions';
import { callAPI } from '../../utils/ApiUtils';
import DMAPIPaginator from '../Table/DMAPIPaginator';
import DMTable from '../Table/DMTable';
import ProtectionPlanReplications from './ProtectionPlanReplications';
import Spinner from '../Common/Spinner';

function Replication(props) {
  const [plansData, setPlanData] = useState([]);
  const refresh = useSelector((state) => state.user.context.refresh);
  const { protectionplanID, dispatch, jobs, t } = props;

  useEffect(() => {
    fetchReplicationJobs();
    return () => {
      dispatch(valueChange(KEY_CONSTANTS.UI_REPL_VM_NAME, ''));
    };
  }, [refresh, protectionplanID]);

  function fetchReplicationJobs() {
    const url = (protectionplanID === 0 ? API_PROTECTION_PLAN_REPLICATION_JOBS_STATUS : `${API_PROTECTION_PLAN_REPLICATION_JOBS_STATUS}?protectionplanid=${protectionplanID}`);
    dispatch(showApplicationLoader('REPL_PROTECTION_PLAN', 'Loading protection plans...'));
    callAPI(url).then((json) => {
      dispatch(hideApplicationLoader('REPL_PROTECTION_PLAN', 'Loading protection plans...'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        setPlanData(json);
      }
    },
    (err) => {
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  }

  function changeJobType(type) {
    dispatch(changeReplicationJobType(type));
  }

  function renderOptions() {
    const { replicationType } = jobs;
    return (
      <>
        <Form>
          <div className="form-check-inline">
            <Label className="form-check-label" for="plan-options">
              <input type="radio" className="form-check-input" id="plan-options" name="jobsType" value={replicationType === REPLICATION_JOB_TYPE.PLAN} checked={replicationType === REPLICATION_JOB_TYPE.PLAN} onChange={() => { changeJobType(REPLICATION_JOB_TYPE.PLAN); }} />
              {t('protection.plan')}
            </Label>
          </div>
          <div className="form-check-inline">
            <Label className="form-check-label" for="vms-options">
              <input type="radio" className="form-check-input" id="vms-options" name="jobsType" value={replicationType === REPLICATION_JOB_TYPE.VM} checked={replicationType === REPLICATION_JOB_TYPE.VM} onChange={() => { changeJobType(REPLICATION_JOB_TYPE.VM); }} />
              {t('virtual.machines')}
            </Label>
          </div>
          <div className="form-check-inline">
            <Label className="form-check-label" for="disks-options">
              <input type="radio" className="form-check-input" id="disks-options" name="jobsType" value={replicationType === REPLICATION_JOB_TYPE.DISK} checked={replicationType === REPLICATION_JOB_TYPE.DISK} onChange={() => { changeJobType(REPLICATION_JOB_TYPE.DISK); }} />
              {t('disks')}
            </Label>
          </div>
        </Form>
      </>
    );
  }

  function renderDiskJobs() {
    const { diskReplication } = jobs;
    const url = (protectionplanID === 0 ? API_REPLICATION_JOBS : API_PROTECTOIN_PLAN_REPLICATION_JOBS.replace('<id>', protectionplanID));
    return (
      <>
        <Row className="padding-left-20">
          <Col sm={5} />
          <Col sm={7}>
            <div className="padding-right-30 padding-left-10">
              <DMAPIPaginator
                showFilter="true"
                columns={REPLICATION_JOBS}
                filterHelpText={TABLE_FILTER_TEXT.REPLICATION_JOBS}
                apiUrl={url}
                isParameterizedUrl={protectionplanID === 0 ? 'false' : 'true'}
                storeFn={setDiskReplicationJobs}
                name="replicationDisks"
                fetchInInterval
              />
            </div>
          </Col>
        </Row>
        <DMTable
          dispatch={dispatch}
          columns={REPLICATION_JOBS}
          data={diskReplication}
        />

      </>
    );
  }

  function renderVMJobs() {
    const { replication } = jobs;
    const { user } = props;
    const { values } = user;
    const selectedVmName = getValue(KEY_CONSTANTS.UI_REPL_VM_NAME, values);
    const url = (protectionplanID === 0 ? API_REPLICATION_VM_JOBS : API_PROTECTTION_PLAN_REPLICATION_VM_JOBS.replace('<id>', protectionplanID));
    return (
      <>
        <Row className="padding-left-20">
          <Col sm={5} />
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
                dispatch={dispatch}
                searchString={selectedVmName}
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

  function renderDrReplications() {
    const { replicationType } = jobs;
    if (replicationType !== REPLICATION_JOB_TYPE.PLAN || plansData.length <= 0) {
      return null;
    }
    const data = plansData[0];
    const { name } = data;
    if (typeof name === 'undefined') {
      return null;
    }
    return plansData.map((plan) => {
      if (protectionplanID === null || protectionplanID === 0) {
        return <ProtectionPlanReplications dispatch={dispatch} plan={plan} t={t} />;
      }
      if (protectionplanID !== 0 && protectionplanID === plan.id) {
        return <ProtectionPlanReplications dispatch={dispatch} plan={plan} t={t} />;
      }
      return null;
    });
  }

  function renderProtectionPlanJobs() {
    return renderDrReplications();
  }

  const { replicationType } = jobs;
  return (
    <>
      <>
        <Card>
          <CardBody>
            <span className="text-muted pt-2">
              Replication
            </span>
            <Row className="mt-3 p-2">
              <Col className="mb-2" sm={5}>
                {renderOptions()}
              </Col>
            </Row>
            {replicationType === REPLICATION_JOB_TYPE.VM ? renderVMJobs() : null}
            {replicationType === REPLICATION_JOB_TYPE.DISK ? renderDiskJobs() : null}
            {replicationType === REPLICATION_JOB_TYPE.PLAN && plansData.length === 0 ? (
              <>
                <div className="ms-3 text-info">
                  <Spinner />
                  <span> Loading data...</span>
                </div>
              </>
            ) : renderProtectionPlanJobs() }
          </CardBody>
        </Card>
      </>
    </>
  );
}

function mapStateToProps(state) {
  const { jobs, user } = state;
  return { jobs, user };
}
export default connect(mapStateToProps)(withTranslation()(Replication));
