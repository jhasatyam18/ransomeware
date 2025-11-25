import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Col, Label, Row } from 'reactstrap';
import { faPlay, faStop } from '@fortawesome/free-solid-svg-icons';
import SimpleBar from 'simplebar-react';
import { useNavigate } from 'react-router-dom';
import { KEY_CONSTANTS } from '../../constants/UserConstant';
import { removeErrorMessage, valueChange } from '../../store/actions';
import { MODAL_CONFIRMATION_WARNING } from '../../constants/Modalconstant';
import { closeModal, openModal } from '../../store/actions/ModalActions';
import ActionButton from '../Common/ActionButton';
import DMFieldText from '../Shared/DMFieldText';
import { FIELDS } from '../../constants/FieldsConstant';
import { getValue } from '../../utils/InputUtils';
import { RECOVERY_STATUS, STATIC_KEYS, STOP_REPLICATION_TYPE } from '../../constants/InputConstants';
import { allSelectiveVmReplication, handleSelectiveVmSelection, startPlan, stopPlan } from '../../store/actions/DrPlanActions';
import DMTPaginator from '../Table/DMTPaginator';
import { TABLE_FILTER_TEXT, SELECTIVE_REPLICATION_VM_LIST } from '../../constants/TableConstants';
import { filterData } from '../../utils/AppUtils';
import DMTable from '../Table/DMTable';
// isDisabled
function SelectiveReplicationVm(props) {
  const [configDataToDisplay, setConfigDataToDisplay] = useState([]);
  const [configSearchData, setConfigSearchData] = useState([]);
  const [stopReplType, setStopReplType] = useState('');
  const [configHasFilterString, setConfigHasFilterString] = useState(false);
  const { dispatch, user, t, protectionPlan } = props;
  const history = useNavigate();
  const { values } = user;
  const { id, name, protectedEntities, enablePPlanLevelScheduling } = protectionPlan;
  const { virtualMachines } = protectedEntities;
  const configCols = SELECTIVE_REPLICATION_VM_LIST;
  const reason = getValue('stop.repl.reason', values) || '';
  const selectedVMs = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
  const path = window.location.pathname.split('/');
  const workflow = path[path.length - 1];
  const notRecoveredVm = virtualMachines.filter((el) => el.recoveryStatus !== RECOVERY_STATUS.RECOVERED);
  const setDataForDisplay = (data) => {
    setConfigDataToDisplay(data);
  };

  useEffect(() => {
    const vmConfigData = (configHasFilterString ? configSearchData : virtualMachines) || [];
    setDataForDisplay(vmConfigData);
  }, [configSearchData, virtualMachines]);

  useEffect(() => () => {
    dispatch(valueChange('stop.repl.reason', ''));
    dispatch(valueChange(STATIC_KEYS.UI_SITE_SELECTED_VMS, {}));
    dispatch(removeErrorMessage('stop.repl.reason'));
    dispatch(valueChange('ui.stop.repl.type', ''));
  }, []);

  const onFilter = (criteria) => {
    const data = (virtualMachines.length > 0 ? virtualMachines : []);
    if (criteria.trim() === '') {
      setConfigHasFilterString(false);
      setConfigSearchData([]);
    } else {
      const newData = filterData(data, criteria.trim(), configCols);
      setConfigHasFilterString(true);
      setConfigSearchData(newData);
    }
  };

  const renderVmList = () => (
    <>
      <Col sm="12">
        <DMTable
          dispatch={dispatch}
          columns={configCols}
          data={configDataToDisplay}
          isSelectable
          onSelect={handleSelectiveVmSelection}
          selectedData={selectedVMs}
          primaryKey="moref"
          name="replivmlist"
          onSelectAll={allSelectiveVmReplication}
        />
      </Col>
    </>
  );

  const onChange = (e) => {
    dispatch(valueChange('ui.stop.repl.type', e));
    setStopReplType(e);
  };
  const renderOptions = () => (
    <Row>
      <Col sm={6}>
        <div className="form-check-inline">
          <p className="form-check-label fs-30">
            <input type="radio" className="form-check-input" name="stopReplType" value={STOP_REPLICATION_TYPE.COMPLETE_REPLICATION} checked={stopReplType === STOP_REPLICATION_TYPE.COMPLETE_REPLICATION} onChange={(e) => onChange(e.target.value)} />
            {t('stop.repl.option.two.title')}
            <br />
            <small>
              {t('stop.repl.option.two.subtext')}
            </small>
          </p>
        </div>
      </Col>
      <Col sm={6}>
        <div className="form-check-inline ">
          <p className="form-check-label">
            <input type="radio" className="form-check-input" name="stopReplType" value={STOP_REPLICATION_TYPE.IMMEDIATE} checked={stopReplType === STOP_REPLICATION_TYPE.IMMEDIATE} onChange={(e) => onChange(e.target.value)} />
            {t('stop.repl.option.one.title')}
            <br />
            <small>
              {t('stop.repl.option.one.subtext')}

            </small>
          </p>
        </div>
      </Col>
    </Row>
  );

  const onClose = () => {
    dispatch(closeModal());
  };

  const onConfirm = () => {
    const action = workflow === KEY_CONSTANTS.STOP ? stopPlan : startPlan;
    dispatch(action(id, history));
  };
  const renderFooter = () => (
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        {t('close')}
      </button>
      {!enablePPlanLevelScheduling || (notRecoveredVm.length === Object.keys(selectedVMs).length && enablePPlanLevelScheduling) ? (
        <button type="button" className="btn btn-danger" onClick={onConfirm}>
          {t('confirm')}
        </button>
      ) : null}
    </div>
  );

  const confirmationModalComponent = () => (
    <>
      {enablePPlanLevelScheduling && notRecoveredVm.length !== Object.keys(selectedVMs).length ? (
        <>
          <Row className="ps-4">
            <Col className="d-flex align-items-center" sm={2}>
              <i style={{ fontSize: '100px' }} className="fas fa-exclamation-triangle text-warning" />
            </Col>
            <Col sm={10}>
              <p style={{ textAlign: 'left', marginBottom: '0px' }}>
                {t('title.synchronize.vm.disabled')}
              </p>
              <p style={{ textAlign: 'left' }}>
                {t('title.two.synchronize.vm.disabled', { workflow: workflow === KEY_CONSTANTS.START ? 'Starting' : 'Stopping' })}
              </p>
              <p style={{ textAlign: 'left', marginBottom: '0px' }}>{`To ${workflow === KEY_CONSTANTS.STOP ? 'stop' : 'start'} replication, you have two options:`}</p>
              <ul style={{ textAlign: 'left' }}>
                <li>
                  Edit the protection plan and disable the
                  {' '}
                  <small style={{ fontWeight: 'bold', fontSize: '12px' }}>Synchronize All VMs Replication</small>
                  {' '}
                  option in the replication configuration.
                </li>
                <li>
                  If you choose to keep
                  {' '}
                  <small style={{ fontWeight: 'bold', fontSize: '12px' }}>Synchronize All VMs Replication</small>
                  {' '}
                  {` enabled, you must select all workloads in the plan to ${workflow === KEY_CONSTANTS.STOP ? 'stop' : 'start'} replication.`}
                </li>
              </ul>
            </Col>
          </Row>
        </>
      ) : (
        <Row className="ps-4">
          <Col className="d-flex align-items-center" sm={2}>
            <i style={{ fontSize: '100px' }} className="fas fa-exclamation-triangle text-warning" />
          </Col>
          <Col sm={10}>
            <p style={{ textAlign: 'left' }} className="text-warning">
              Are you sure want to
              {' '}
              {workflow === KEY_CONSTANTS.STOP ? 'stop' : 'start'}
              {' '}
              replication for following workloads.
            </p>
            <ul>
              {workflow === KEY_CONSTANTS.STOP ? (
                <li style={{ textAlign: 'left' }}>
                  {t('stop.repl.type')}
                  {t(`${getValue('ui.stop.repl.type', values)}`)}
                </li>
              ) : null}
              <li style={{ textAlign: 'left' }}>
                {t('workloads')}
                <SimpleBar style={{ maxHeight: '40vh', minHeight: '4vh' }}>
                  <ul>
                    {Object.values(selectedVMs).map((el) => <li style={{ textAlign: 'left' }} key={el.id}>{el.name}</li>)}
                  </ul>
                </SimpleBar>
              </li>
              <li style={{ textAlign: 'left' }}>
                {t('user.provide.reason')}
                {getValue('stop.repl.reason', values)}
              </li>
            </ul>
          </Col>
        </Row>
      )}

    </>
  );

  const openStopConfirmationModal = () => {
    const title = enablePPlanLevelScheduling ? `Warning ${workflow === KEY_CONSTANTS.STOP ? 'Stop' : 'Start'} Replication : ${name}` : `Confirmation ${workflow === KEY_CONSTANTS.STOP ? 'Stop' : 'Start'} Replication : ${name}`;
    const options = { title, size: 'lg', footerComponent: renderFooter, component: confirmationModalComponent, id, message: 'Are you sure you want   ?' };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  };
  const render = () => {
    const vmConfigData = (configHasFilterString ? configSearchData : virtualMachines) || [];
    const fieldInput = FIELDS['stop.repl.reason'];
    return (
      <div>
        <Row className="pr-4 p-3">
          {workflow === KEY_CONSTANTS.STOP ? (
            <>
              <Col sm={3}>
                {workflow === KEY_CONSTANTS.STOP ? <p>Stop Replication Type</p> : <p>Start Replication</p>}
              </Col>
              <Col sm={9}>
                {renderOptions()}
              </Col>
            </>
          ) : null}
          <Col className="mt-2" sm={3}>
            <Label>{t('reason')}</Label>
          </Col>
          <Col className="mt-2" sm={6}>
            <DMFieldText dispatch={dispatch} fieldKey="stop.repl.reason" hideLabel field={fieldInput} user={user} />
          </Col>
          <Col sm={3} />

          <Col sm={5} className="mt-2">
            {workflow === KEY_CONSTANTS.STOP ? <ActionButton isDisabled={!reason || Object.keys(selectedVMs).length === 0 || stopReplType === ''} onClick={openStopConfirmationModal} label="Stop Replication" icon={faStop} t={t} key={`stop-${faStop}`} />
              : <ActionButton isDisabled={!reason || Object.keys(selectedVMs).length === 0} onClick={openStopConfirmationModal} label="Start Replication" icon={faPlay} t={t} key={`start-${faPlay}`} />}
          </Col>
          <Col sm={7}>
            <DMTPaginator
              id="recoveryconfig"
              data={vmConfigData}
              setData={setDataForDisplay}
              showFilter="true"
              onFilter={onFilter}
              columns={configCols}
              filterHelpText={TABLE_FILTER_TEXT.TABLE_SELECTIVE_VM_REPLICATION}
            />
          </Col>
        </Row>
        <Row>
          {renderVmList()}
        </Row>
      </div>
    );
  };

  return render();
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(SelectiveReplicationVm));
