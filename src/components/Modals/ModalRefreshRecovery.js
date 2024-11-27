import React, { useEffect, useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Form, Label, Row, Col } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { MILI_SECONDS_TIME } from '../../constants/EventConstant';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { addMessage } from '../../store/actions/MessageActions';
import { JOB_COMPLETION_STATUS, JOB_FAILED, JOB_IN_PROGRESS } from '../../constants/AppStatus';
import DMTPaginator from '../Table/DMTPaginator';
import { closeModal, openModal } from '../../store/actions/ModalActions';
import { RECOVERY_TYPE, REF_REC_REFRESH_CONSTANT, STATIC_KEYS } from '../../constants/InputConstants';
import { TABLE_REFRESH_RECOVERY_STATUS } from '../../constants/TableConstants';
import { filterData } from '../../utils/AppUtils';
import { handleRefreshVMSelection, handleSelectAllRefreshVMs, onResetSelectedWorkload, refreshStatusOperation, resetRefreshSelectionData } from '../../store/actions/RefreshRecoveryActions';
import { getValue } from '../../utils/InputUtils';
import DMTable from '../Table/DMTable';
import { MODAL_CONFIRMATION_WARNING } from '../../constants/Modalconstant';
import { REFRESH_OPS } from '../../constants/ApiConstants';

function ModalRefreshRecovery(props) {
  const { dispatch, t, user, options } = props;
  const { values } = user;
  const { planID = null } = options;
  const [recoveryType, setRecoveryType] = useState(RECOVERY_TYPE.FULL_RECOVERY);
  const [dataToDisplay, updateDataForDisplay] = useState([]);
  const [searchData, setSearchData] = useState([]);
  const [hasFilterString, setFilterString] = useState(false);
  const [data, setData] = useState([]);
  const colms = TABLE_REFRESH_RECOVERY_STATUS;
  const validationState = getValue('refresh.status.operation.state', values);
  const dataLoadState = getValue('ui.refresh.data.loading', values);
  const timerId = useRef(null);
  if (validationState === JOB_IN_PROGRESS && timerId.current === null) {
    timerId.current = setInterval(() => {
      dispatch(refreshStatusOperation(REFRESH_OPS.poll));
    }, MILI_SECONDS_TIME.FIVE_THROUSAND);
  } else if (validationState !== JOB_IN_PROGRESS && timerId.current !== null) {
    clearInterval(timerId.current);
    timerId.current = null;
  }

  useEffect(() => {
    let isUnmounting = false;
    if (!isUnmounting) {
      const vms = getValue(STATIC_KEYS.UI_REFRESH_STATUS_VMS, values) || [];
      const fullRecVMs = vms.filter((vm) => (vm.recoveryType === RECOVERY_TYPE.FULL_RECOVERY || vm.recoveryType === RECOVERY_TYPE.MIGRATION)) || [];
      if (fullRecVMs.length === 0) {
        const testRecVMs = vms.filter((vm) => vm.recoveryType === RECOVERY_TYPE.TEST_RECOVERY);
        setData((testRecVMs && testRecVMs.length > 0 ? testRecVMs : fullRecVMs));
        setRecoveryType(((testRecVMs && testRecVMs.length > 0 ? RECOVERY_TYPE.TEST_RECOVERY : RECOVERY_TYPE.FULL_RECOVERY)));
        dispatch(handleSelectAllRefreshVMs(true, testRecVMs));
      } else {
        setData(fullRecVMs);
        setRecoveryType(RECOVERY_TYPE.FULL_RECOVERY);
        dispatch(handleSelectAllRefreshVMs(true, fullRecVMs));
      }
    }
    return () => {
      isUnmounting = true;
      clearInterval(timerId.current);
      timerId.current = null;
    };
  }, [dataLoadState]);

  const onClose = () => {
    dispatch(closeModal());
    dispatch(resetRefreshSelectionData({ id: 0, refreshData: REF_REC_REFRESH_CONSTANT.GLOBAL }));
  };
  const onReset = () => {
    const opts = { title: 'Confirmation', confirmAction: onResetSelectedWorkload, message: 'Are you sure want to reset ? All the validation states will be reset. ?', id: planID };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, opts));
  };

  const onRecoveryTypeChange = (type) => {
    setRecoveryType(type);
    let refData = getValue(STATIC_KEYS.UI_REFRESH_STATUS_VMS, values) || [];
    if (type === RECOVERY_TYPE.FULL_RECOVERY) {
      refData = refData.filter((vm) => (vm.recoveryType === RECOVERY_TYPE.FULL_RECOVERY || vm.recoveryType === RECOVERY_TYPE.MIGRATION)) || [];
    } else {
      refData = refData.filter((vm) => vm.recoveryType === RECOVERY_TYPE.TEST_RECOVERY);
    }
    setData(refData);
    updateDataForDisplay(refData);
  };

  const refreshStatus = () => {
    const currentState = getValue(STATIC_KEYS.UI_REFRESH_OP_STATE, values);
    const slecetdVms = getValue(STATIC_KEYS.UI_REFRESH_SELECTED_VMS, values);
    if (Object.keys(slecetdVms).length === 0) {
      dispatch(addMessage(t('please.select.vm'), MESSAGE_TYPES.ERROR));
      return;
    }
    const isTestRecoveredVms = Object.keys(slecetdVms).filter((el) => slecetdVms[el].recoveryType === RECOVERY_TYPE.TEST_RECOVERY);
    const isFUllRecoveredVms = Object.keys(slecetdVms).filter((el) => slecetdVms[el].recoveryType === RECOVERY_TYPE.FULL_RECOVERY || slecetdVms[el].recoveryType === RECOVERY_TYPE.MIGRATION);
    // If both full recovered and test recovered vm is selected the add warning to select only one type of vm
    if (isTestRecoveredVms.length > 0 && isFUllRecoveredVms.length > 0) {
      dispatch(addMessage(t('full.test.workload.selection.warn'), MESSAGE_TYPES.ERROR));
      return;
    } if (isTestRecoveredVms.length > 0) {
      // if in selected vm all vm's are test recovered the direct user to test recovery flow
      if (recoveryType === RECOVERY_TYPE.FULL_RECOVERY) {
        onRecoveryTypeChange(RECOVERY_TYPE.TEST_RECOVERY);
      }
    } else if (isFUllRecoveredVms.length > 0) {
      // if in selected vm all vm's are full recovered the direct user to full recovery flow
      if (recoveryType === RECOVERY_TYPE.TEST_RECOVERY) {
        onRecoveryTypeChange(RECOVERY_TYPE.FULL_RECOVERY);
      }
    }
    if (currentState === '') {
      dispatch(refreshStatusOperation(REFRESH_OPS.validate));
    } else if (currentState === JOB_COMPLETION_STATUS || currentState === JOB_FAILED) {
      dispatch(refreshStatusOperation(REFRESH_OPS.update, planID));
    }
  };

  const onFilter = (criteria) => {
    if (criteria === '') {
      setFilterString(false);
      setSearchData([]);
    } else {
      const newData = filterData(data, criteria, colms);
      setFilterString(true);
      setSearchData(newData);
    }
  };

  const renderOptions = () => (
    <>
      <Form className="padding-10 pl-4">
        <div className="form-check-inline">
          <Label className="form-check-label cursor-pointer" for="test-recovery-options" onClick={() => onRecoveryTypeChange(RECOVERY_TYPE.FULL_RECOVERY)}>
            <input type="radio" className="form-check-input" id="full-rec-options" name="recJobsType" value={recoveryType === RECOVERY_TYPE.FULL_RECOVERY} checked={recoveryType === RECOVERY_TYPE.FULL_RECOVERY} onChange={() => { onRecoveryTypeChange(RECOVERY_TYPE.FULL_RECOVERY); }} />
            {t('full.recovery.migration')}
          </Label>
        </div>
        <div className="form-check-inline">
          <Label className="form-check-label cursor-pointer" for="test-recovery-options" onClick={() => onRecoveryTypeChange(RECOVERY_TYPE.TEST_RECOVERY)}>
            <input type="radio" className="form-check-input" id="test-rec-options" name="recJobsType" value={recoveryType === RECOVERY_TYPE.TEST_RECOVERY} checked={recoveryType === RECOVERY_TYPE.TEST_RECOVERY} onChange={() => { onRecoveryTypeChange(RECOVERY_TYPE.TEST_RECOVERY); }} />
            {t('test.recovery')}
          </Label>
        </div>
      </Form>
    </>
  );

  const renderFooter = () => {
    let op = '';
    const slecetdVms = getValue(STATIC_KEYS.UI_REFRESH_SELECTED_VMS, values);
    const disabledCond = (validationState !== JOB_IN_PROGRESS) && (Object.keys(slecetdVms).length !== 0);
    if (validationState === '') {
      op = 'get.latest.recovery.status';
    } else if (validationState === JOB_COMPLETION_STATUS || validationState === JOB_FAILED) {
      op = 'confirm.recovery.status.update';
    } else {
      op = 'validating...';
    }
    return (
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>Close </button>
        <button type="button" className="btn btn-secondary" onClick={onReset} disabled={validationState === JOB_IN_PROGRESS || !disabledCond}>
          {t('reset.selection')}
        </button>
        <button type="button" className="btn btn-success" onClick={refreshStatus} disabled={!disabledCond}>
          {t(op)}
        </button>
      </div>
    );
  };

  const renderPaginator = () => {
    const tData = (hasFilterString ? searchData : data);
    return (
      <div className="padding-top-10 padding-right-15">
        <DMTPaginator
          defaultLayout="true"
          data={tData}
          setData={updateDataForDisplay}
          columns={colms}
          showFilter="true"
          onFilter={onFilter}
          id="refresh-recovery-search"
        />
      </div>
    );
  };

  const renderTable = () => {
    const selectedVMs = getValue(STATIC_KEYS.UI_REFRESH_SELECTED_VMS, values);
    return (
      <DMTable
        dispatch={dispatch}
        columns={colms}
        data={dataToDisplay}
        onSelect={handleRefreshVMSelection}
        selectedData={selectedVMs}
        primaryKey="id"
        name="refeshrecovery"
        onSelectAll={handleSelectAllRefreshVMs}
        isSelectable
      />
    );
  };

  const render = () => (
    <>
      <div>
        <div className={`${validationState === JOB_IN_PROGRESS ? 'unclickable' : ''}`}>
          <Row>
            <Col sm={6}>
              {renderOptions()}
            </Col>
            <Col sm={6}>
              {renderPaginator()}
            </Col>
          </Row>
          <Row>
            <Col sm={5} />
            <Col sm={6} className="mt-2">
              {validationState === JOB_IN_PROGRESS ? (
                <>
                  <i className="fa fa-spinner fa-spin text-info" />
            &nbsp;&nbsp;
                  <span className="text-info fw-bold mb-0">
                    {t('Loading Latest Recovery Status')}
                  </span>

                </>
              ) : null}
            </Col>
            <Col sm={12} style={{ minHeight: '55vh' }} className="mt-0">
              <SimpleBar style={{ maxHeight: '53vh' }}>
                {renderTable()}
              </SimpleBar>
            </Col>
          </Row>
        </div>
      </div>
      {renderFooter()}
    </>
  );
  return render();
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(ModalRefreshRecovery));
