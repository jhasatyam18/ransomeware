import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, Col, Container, Form, Label, Row } from 'reactstrap';
import { valueChange } from '../../store/actions';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import DropdownActions from '../Common/DropdownActions';
import DMAPIPaginator from '../Table/DMAPIPaginator';
import DMTable from '../Table/DMTable';
import VmRecoveryCheckpoints from './VmRecoveryCheckpoints';
import { openDeleteCheckpointModal, handleRecoveryCheckpointTableSelection, preserveCheckpoint, setVmlevelCheckpoints, handleAllRecoveryCheckpointTableSelection, changeCheckpointType } from '../../store/actions/checkpointActions';
import { API_RECOVERY_CHECKPOINT } from '../../constants/ApiConstants';
import { VM_RECOVERY_CHECKPOINTS } from '../../constants/TableConstants';
import { RECOVERY_CHECKPOINT_TYPE } from '../../constants/InputConstants';
import { STORE_KEYS } from '../../constants/StoreKeyConstants';
import { getValue } from '../../utils/InputUtils';

function RecoveryCheckpoints(props) {
  const { drPlans, user, t, jobs, dispatch } = props;
  const { vmCheckpoint, selectedCheckpoints, checkpointType } = jobs;
  const { values, localVMIP } = user;
  const { protectionPlan } = drPlans;
  const { recoveryEntities, id, recoverySite } = protectionPlan;
  const { instanceDetails } = recoveryEntities;
  const instance = getValue(STORE_KEYS.RECOVERY_CHECKPOINT_JOB_LINK_INSTANCE, values);

  useEffect(() => {
    // remove the recovery checkpoint id once rendered
    dispatch(valueChange(STORE_KEYS.RECOVERY_CHECKPOINT_JOB_LINK_INSTANCE, undefined));
  }, []);

  if (typeof instanceDetails === 'undefined' || instanceDetails.length === 0) {
    return null;
  }

  const changeJobType = (tab) => {
    dispatch(changeCheckpointType(tab));
  };
  const renderActions = () => {
    const selectedCheckpointsKeys = Object.keys(selectedCheckpoints);
    const disablePreserve = selectedCheckpointsKeys.length === 1 ? selectedCheckpoints[selectedCheckpointsKeys[0]].isPreserved : true;
    const disableDelete = selectedCheckpointsKeys.length === 0;
    let actions = [];
    if (localVMIP === recoverySite.node.hostname) {
      actions = [{ label: t('preserve'), action: preserveCheckpoint, icon: 'fa fa-plus', disabled: disablePreserve, id: selectedCheckpoints },
        { label: t('delete'), action: openDeleteCheckpointModal, icon: 'fa fa-trash', disabled: disableDelete, id: selectedCheckpoints }];
    } else {
      return null;
    }
    return (
      <DropdownActions className="action_align_left" title={t('actions')} dispatch={dispatch} actions={actions} />
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

      </Form>
    </>
  );

  const renderPplanLevelCheckpoints = () => (
    <>
      <Row className="padding-left-20">
        <Col sm={5}>
          {renderOptions()}
        </Col>
      </Row>
      <Row className="padding-top-20 padding-left-15">
        <Col sm={12}>
          {instanceDetails.map((el) => (
            <VmRecoveryCheckpoints {...props} moref={el.sourceMoref} vmName={el.instanceName} renderActions={renderActions} />
          ))}
        </Col>
      </Row>
    </>
  );

  const renderVMLevelCheckpoints = () => {
    let url = API_RECOVERY_CHECKPOINT.replace('<id>', id);
    if (instance && instance.recoveryCheckpointID) {
      url = `${url}&searchstr=${instance.recoveryCheckpointID}&searchcol=id`;
    }

    return (
      <>
        <Row className="padding-left-20">
          <Col sm={11}>
            {renderOptions()}
          </Col>
        </Row>
        <Row className="padding-top-30 padding-left-20 ">
          <Col sm={2}>{renderActions()}</Col>
          <Col sm={3} />
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
        <Card>
          <CardBody>
            <DMBreadCrumb links={[{ label: 'Recovery Checkpoints', link: '#' }]} />
            {checkpointType === RECOVERY_CHECKPOINT_TYPE.PLAN ? renderPplanLevelCheckpoints() : null}
            {checkpointType === RECOVERY_CHECKPOINT_TYPE.VM ? renderVMLevelCheckpoints() : null}
          </CardBody>
        </Card>
      </Container>
    </>
  );
}

export default (withTranslation()(RecoveryCheckpoints));
