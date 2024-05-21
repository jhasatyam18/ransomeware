import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { clearValues } from '../../store/actions';
import { onEditProtectionPlan } from '../../store/actions/DrPlanActions';
import { closeModal } from '../../store/actions/ModalActions';
import RenderResetReplicationVMs from '../Common/RenderResetReplicationVMs';
import { getDiskLabel, getValue } from '../../utils/InputUtils';
import { PLATFORM_TYPES } from '../../constants/InputConstants';

function ResetDiskReplicationModal({ t, dispatch, options, user }) {
  const { selectedPlan } = options;
  const [searchStr, setsearchStr] = useState('');
  const { protectedEntities } = selectedPlan;
  const { virtualMachines } = protectedEntities;
  const [vms, setVms] = useState(virtualMachines || []);
  const [showConfirmation, setConfirmation] = useState(false);
  const { protectedSite } = selectedPlan;
  const isVMwareSource = protectedSite.platformType === PLATFORM_TYPES.VMware;
  const onCancel = () => {
    dispatch(clearValues());
    dispatch(closeModal());
  };

  const onSave = () => {
    dispatch(onEditProtectionPlan());
  };

  const onFilter = (criteria) => {
    let newvm = [];
    if (criteria.length > 0) {
      virtualMachines.forEach((element) => {
        if (element.name.indexOf(criteria) !== -1) {
          newvm.push(element);
        }
      });
    } else {
      newvm = virtualMachines;
    }
    setVms(newvm);
  };

  const onSearchChange = (e) => {
    setsearchStr(e.target.value);
    onFilter(e.target.value);
  };

  const onFilterClick = (e = null) => {
    const criteria = (e !== null && typeof e.target.value !== 'undefined' ? e.target.value : searchStr);
    if (onFilter) {
      onFilter(criteria);
    }
  };

  const onFilterKeyPress = (e) => {
    if (e.key === 'Enter') {
      onFilter(searchStr);
    }
  };

  const onBlur = () => {
    onFilter(searchStr);
  };

  const getSelectedDisks = () => {
    const selectedVMS = {};
    virtualMachines.forEach((vm) => {
      const { virtualDisks } = vm;
      const vmDisks = getValue(`reset-repl-vm-id-${vm.moref}`, user.values);
      virtualDisks.forEach((disk, index) => {
        const isDiskSelected = vmDisks[disk.id];
        if (isDiskSelected) {
          const diskLabel = getDiskLabel(disk, index, isVMwareSource);
          if (selectedVMS[vm.moref]) {
            selectedVMS[vm.moref].disks.push(diskLabel);
          } else {
            selectedVMS[vm.moref] = { name: vm.name, disks: [diskLabel] };
          }
        }
      });
    });
    return selectedVMS;
  };

  const renderSelectedDiskName = (selectedVMS) => {
    if (!selectedVMS) {
      return null;
    }
    return Object.keys(selectedVMS).map((disk, index) => (
      <div key={`selected-disk-${index + 1}`}>
        <span className="padding-top-10">
          {selectedVMS[disk].name}
          : &nbsp;&nbsp;&nbsp;
        </span>
        <span className="text-muted">
          {selectedVMS[disk].disks.join(', ')}
        </span>
      </div>
    ));
  };

  const renderSelectedDisks = () => {
    const selectedVMS = getSelectedDisks();
    return (
      <div className="padding-top-10">
        {renderSelectedDiskName(selectedVMS)}
      </div>
    );
  };

  const renderModalFooter = () => {
    const selectedVMS = getSelectedDisks();
    const disableConfirm = (typeof selectedVMS === 'undefined' || Object.keys(selectedVMS).length === 0);
    if (showConfirmation) {
      return (
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => setConfirmation(false)}>{t('title.cancel')}</button>
          <button type="button" className="btn btn-success" onClick={onSave}>{t('Confirm')}</button>
        </div>
      );
    }
    return (
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>{t('title.cancel')}</button>
        <button type="button" className="btn btn-success" onClick={() => setConfirmation(true)} disabled={disableConfirm}>{t('title.reset.replication')}</button>
      </div>
    );
  };

  const renderConfirmation = () => {
    if (showConfirmation) {
      return (
        <div style={{ paddingLeft: '20%' }}>
          <div className="container padding-20">
            <div className="row">
              <div className="col-sm-3 confirmation-icon">
                <i className="fas fa-exclamation-triangle" />
              </div>
              <div className="col-sm-8 confirmation_modal_msg">
                {t('reset.disk.warning')}
                <br />
                {t('reset.disk.warning.notice')}
                {renderSelectedDisks()}
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderFilter = () => {
    if (showConfirmation) {
      return null;
    }
    return (
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          id="datableSearch"
          placeholder="Search"
          onKeyPress={onFilterKeyPress}
          onBlur={onBlur}
          onChange={onSearchChange}
          autoComplete="off"
        />
        <span className="input-group-append">
          <div className="input-group-text bg-transparent">
            <box-icon name="search" className="search__icon" size="15px" color="#FFF" onClick={onFilterClick} />
          </div>
        </span>
      </div>
    );
  };

  const showWarningMsg = () => {
    const { recoveryPointConfiguration } = selectedPlan;
    const { isRecoveryCheckpointEnabled } = recoveryPointConfiguration;
    const selectedVMS = getSelectedDisks();
    const hideMsg = (typeof selectedVMS === 'undefined' || Object.keys(selectedVMS).length === 0);
    if (hideMsg) {
      return null;
    }
    if (isRecoveryCheckpointEnabled) {
      return (
        <div className="text-warning mt-4 ml-4">
          <i className="fas fa-exclamation-triangle" />
          &nbsp;&nbsp;&nbsp;
          {`${t('resynk.disk.warning.with.checkpoint')}`}
        </div>
      );
    }
    return (
      <div className="text-warning mt-4 ml-4">
        <i className="fas fa-exclamation-triangle" />
        &nbsp;&nbsp;&nbsp;
        {`${t('resynk.disk.warning.without.checkpoint')}`}
      </div>
    );
  };

  return (
    <>
      {!showConfirmation && showWarningMsg()}
      <Row>
        <Col sm={6} className="padding-20 margin-left-10">
          {renderFilter()}
        </Col>
      </Row>
      <SimpleBar style={{ minHeight: '40vh', maxHeight: '65vh' }}>
        {showConfirmation ? renderConfirmation()
          : vms.map((vm) => <RenderResetReplicationVMs vmData={vm} dispatch={dispatch} user={user} selectedPlan={selectedPlan} />)}
      </SimpleBar>
      {renderModalFooter()}
    </>
  );
}

export default (withTranslation()(ResetDiskReplicationModal));
