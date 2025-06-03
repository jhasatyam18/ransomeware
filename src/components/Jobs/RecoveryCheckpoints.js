import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Col, Container, Form, Label, Row } from 'reactstrap';
import { API_GET_PRESERVED_CHECKPOINTS, API_RECOVERY_CHECKPOINT } from '../../constants/ApiConstants';
import { RECOVERY_CHECKPOINT_TYPE } from '../../constants/InputConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { STORE_KEYS } from '../../constants/StoreKeyConstants';
import { VM_RECOVERY_CHECKPOINTS } from '../../constants/TableConstants';
import { KEY_CONSTANTS } from '../../constants/UserConstant';
import { valueChange } from '../../store/actions';
import { changeCheckpointType, handleAllRecoveryCheckpointTableSelection, handleRecoveryCheckpointTableSelection, openDeleteCheckpointModal, preserveCheckpoint, setVmlevelCheckpoints, updateSelectedCheckpoints } from '../../store/actions/checkpointActions';
import { addMessage } from '../../store/actions/MessageActions';
import { callAPI } from '../../utils/ApiUtils';
import { getRecoveryCheckpointSummary } from '../../utils/AppUtils';
import { getValue } from '../../utils/InputUtils';
import { hasRequestedPrivileges } from '../../utils/PrivilegeUtils';
import ActionButton from '../Common/ActionButton';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import DropdownActions from '../Common/DropdownActions';
import DMAPIPaginator from '../Table/DMAPIPaginator';
import DMTable from '../Table/DMTable';
import VmRecoveryCheckpoints from './VmRecoveryCheckpoints';

function RecoveryCheckpoints(props) {
  const { drPlans, user, t, jobs, dispatch } = props;
  const { vmCheckpoint, selectedCheckpoints, checkpointType } = jobs;
  const { values, localVMIP } = user;
  const { protectionPlan } = drPlans;
  const { recoveryEntities, id, recoverySite, recoveryPointConfiguration } = protectionPlan;
  const { instanceDetails } = recoveryEntities;
  const instance = getValue(STORE_KEYS.RECOVERY_CHECKPOINT_JOB_LINK_INSTANCE, values);
  const checkpointConfigurationSummary = getRecoveryCheckpointSummary(recoveryPointConfiguration);
  const [preservedCheckpointCount, setPreservedCheckpoint] = useState('');
  const [totalCheckpointCount, setTotalCheckpoint] = useState('');
  const refresh = useSelector((state) => state.user.context.refresh);

  useEffect(() => {
    // to filter selected checkpoint from checkpoint job's we set the link in the store and once rendered remove the link from the store
    dispatch(valueChange(STORE_KEYS.RECOVERY_CHECKPOINT_JOB_LINK_INSTANCE, undefined));
    dispatch(updateSelectedCheckpoints({}));

    // to get checkpoint and preserved checkpoint count
    callAPI(API_GET_PRESERVED_CHECKPOINTS.replace('<id>', id))
      .then((json) => {
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          setPreservedCheckpoint(json.totalRecords);
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });

    callAPI(API_RECOVERY_CHECKPOINT.replace('<id>', id))
      .then((json) => {
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          setTotalCheckpoint(json.totalRecords);
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  }, [refresh]);

  if (typeof instanceDetails === 'undefined' || instanceDetails.length === 0) {
    return null;
  }

  const changeJobType = (tab) => {
    dispatch(changeCheckpointType(tab));
  };
  const renderActions = () => {
    const selectedCheckpointsKeys = Object.keys(selectedCheckpoints);
    const disablePreserve = selectedCheckpointsKeys.length > 0 ? selectedCheckpointsKeys.some((el) => selectedCheckpoints[el].isPreserved === true || selectedCheckpoints[el].checkpointStatus === KEY_CONSTANTS.CHECKPOINT_DELETED_FROM_PLATFORM) : true;
    const disableDelete = selectedCheckpointsKeys.length === 0;
    let actions = [];
    if (localVMIP === recoverySite.node.hostname) {
      if (checkpointType === RECOVERY_CHECKPOINT_TYPE.PRESERVED_CHECKPOINTS) {
        return <ActionButton label="Delete Checkpoint" onClick={() => dispatch(openDeleteCheckpointModal())} icon={faTrash} t={t} key="delet" isDisabled={selectedCheckpointsKeys.length === 0} />;
      }
      actions = [{ label: t('preserve'), action: preserveCheckpoint, icon: faPlus, disabled: disablePreserve || !hasRequestedPrivileges(user, ['checkpoint.edit']), id: selectedCheckpoints },
        { label: t('delete'), action: openDeleteCheckpointModal, icon: faTrash, disabled: disableDelete || !hasRequestedPrivileges(user, ['checkpoint.delete']), id: selectedCheckpoints }];
    } else {
      return null;
    }

    return (
      <DropdownActions align="left" title={t('actions')} dispatch={dispatch} actions={actions} uniqueID="point-in-time-checkpoint-action" />
    );
  };

  const renderOptions = () => (
    <>
      <Form>
        <div className="form-check-inline">
          <Label className="form-check-label" for="plan-options">
            <input type="radio" className="form-check-input" id="plan-options" name="jobsType" value={checkpointType === RECOVERY_CHECKPOINT_TYPE.PLAN} checked={checkpointType === RECOVERY_CHECKPOINT_TYPE.PLAN} onChange={() => { changeJobType(RECOVERY_CHECKPOINT_TYPE.PLAN); }} />
            {t('protection.plan')}
          </Label>
        </div>
        <div className="form-check-inline">
          <Label className="form-check-label" for="vms-options">
            <input type="radio" className="form-check-input" id="vms-options" name="jobsType" value={checkpointType === RECOVERY_CHECKPOINT_TYPE.VM} checked={checkpointType === RECOVERY_CHECKPOINT_TYPE.VM} onChange={() => { changeJobType(RECOVERY_CHECKPOINT_TYPE.VM); }} />
            {t('virtual.machines')}
          </Label>
        </div>
        <div className="form-check-inline">
          <Label className="form-check-label" for="preserve-options">
            <input type="radio" className="form-check-input" id="preserve-options" name="jobsType" value={checkpointType === RECOVERY_CHECKPOINT_TYPE.PRESERVED_CHECKPOINTS} checked={checkpointType === RECOVERY_CHECKPOINT_TYPE.PRESERVED_CHECKPOINTS} onChange={() => { changeJobType(RECOVERY_CHECKPOINT_TYPE.PRESERVED_CHECKPOINTS); }} />
            {t('Preserved')}
          </Label>
        </div>

      </Form>
    </>
  );

  const renderPplanLevelCheckpoints = () => (
    <>
      <Row className="padding-top-20 padding-left-15">
        <Col sm={12}>
          {instanceDetails.map((el) => (
            <VmRecoveryCheckpoints {...props} moref={el.sourceMoref} vmName={el.instanceName} renderActions={renderActions} />
          ))}
        </Col>
      </Row>
    </>
  );

  const renderVMLevelCheckpoints = (urlLink) => {
    let url = urlLink || API_RECOVERY_CHECKPOINT;
    url = url.replace('<id>', id);
    if (instance && instance.checkpointID && !urlLink) {
      url = `${url}&searchstr=${instance.checkpointID}&searchcol=id`;
    }

    return (
      <>
        <Row className="padding-top-30 padding-left-20 ">
          <Col sm={3}>{renderActions()}</Col>
          <Col sm={2} />
          <Col sm={7}>
            <div className="padding-right-25">
              <DMAPIPaginator
                showFilter="true"
                columns={VM_RECOVERY_CHECKPOINTS}
                apiUrl={url}
                isParameterizedUrl="true"
                storeFn={setVmlevelCheckpoints}
                name="checkpoin-vm"
              />
            </div>
          </Col>
        </Row>
        <DMTable
          showFilter="true"
          columns={VM_RECOVERY_CHECKPOINTS}
          data={vmCheckpoint}
          isSelectable={localVMIP === recoverySite.node.hostname}
          selectedData={selectedCheckpoints}
          primaryKey="id"
          onSelect={handleRecoveryCheckpointTableSelection}
          user={user}
          dispatch={dispatch}
          name="checkpoint"
          onSelectAll={handleAllRecoveryCheckpointTableSelection}
        />
      </>
    );
  };

  return (
    <>
      <Container fluid>
        <DMBreadCrumb links={[{ label: t('point.in.time.checkpoint'), link: '#' }]} />
        <>
          <p className="checkpoint_summary text-muted margin-bottom-6">{checkpointConfigurationSummary}</p>
          <div className="d-flex ">
            {preservedCheckpointCount ? (
              <p className="checkpoint_summary text-muted">
                {`${t('checkpoint.preserve.count')}
${preservedCheckpointCount}`}
              </p>
            ) : null}
            {totalCheckpointCount ? (
              <p className="checkpoint_summary text-muted">
                {`${t('checkpoint.total.count')}
                 ${totalCheckpointCount}`}
              </p>
            ) : null}

          </div>
        </>
        <Row className="padding-left-20">
          <Col sm={12}>
            {renderOptions()}
          </Col>
        </Row>
        {checkpointType === RECOVERY_CHECKPOINT_TYPE.PLAN ? renderPplanLevelCheckpoints() : null}
        {checkpointType === RECOVERY_CHECKPOINT_TYPE.VM ? renderVMLevelCheckpoints() : null}
        {checkpointType === RECOVERY_CHECKPOINT_TYPE.PRESERVED_CHECKPOINTS ? renderVMLevelCheckpoints(API_GET_PRESERVED_CHECKPOINTS) : null}

      </Container>
    </>
  );
}

export default (withTranslation()(RecoveryCheckpoints));
