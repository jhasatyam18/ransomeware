import { faDatabase, faDesktop, faHdd, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import SimpleBar from 'simplebar-react';
import { PLATFORM_TYPES, STATIC_KEYS } from '../../constants/InputConstants';
import { clearValues, refresh, valueChange } from '../../store/actions';
import { onEditProtectionPlan } from '../../store/actions/DrPlanActions';
import { closeModal } from '../../store/actions/ModalActions';
import { setResyncIntialData } from '../../store/actions/ResyncDiskAction';
import { getDiskLabel, getValue } from '../../utils/InputUtils';
import RenderResetReplicationVMs from '../Common/RenderResetReplicationVMs';
import ResyncDiskDropdown from '../Common/ResyncDiskDropdown';
import { setDataForResyncSummary } from '../../utils/ResyncDiskUtils';

function ResetDiskReplicationModal({ t, dispatch, options, user }) {
  const { selectedPlan } = options;
  const { values } = user;
  const [searchStr, setsearchStr] = useState('');
  const { protectedEntities } = selectedPlan;
  const { virtualMachines } = protectedEntities;
  const [vms, setVms] = useState(virtualMachines || []);
  const [showConfirmation, setConfirmation] = useState(false);
  const { protectedSite } = selectedPlan;
  const isVMwareSource = protectedSite.platformType === PLATFORM_TYPES.VMware;

  useEffect(() => {
    let isUnmounting = false;
    if (!isUnmounting) {
      dispatch(setResyncIntialData(virtualMachines));
    }
    return () => {
      isUnmounting = true;
    };
  }, []);
  const onCancel = () => {
    dispatch(clearValues());
    dispatch(closeModal());
    dispatch(refresh());
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

  const renderSelectedDisks = () => {
    const resyncSelectedData = getValue(STATIC_KEYS.UI_RESYNC_SUMMARY_DATA, values);
    return (
      <div className="padding-top-10 resync_font_size">
        <p>{t('resync.summary')}</p>
        <Row className="mb-3 ms-2">
          <Col sm={3}>
            <FontAwesomeIcon size="lg" icon={faDesktop} />
            <span className="ms-2">{t('Workloads')}</span>
          </Col>
          <Col>{resyncSelectedData.vms}</Col>
        </Row>
        <Row className="mb-3 ms-2">
          <Col>
            <FontAwesomeIcon size="lg" icon={faHdd} />
            <span className="ms-2">{t('Disks')}</span>
          </Col>
          <Col>{t('total.disk', { totalDisks: resyncSelectedData.disks })}</Col>
          <Col>{t('os.disk.count', { osDisks: resyncSelectedData.osDisks })}</Col>
          <Col>{t('data.disk.count', { dataDisks: resyncSelectedData.dataDisks })}</Col>
        </Row>
        <Row className="ms-2">
          <Col>
            <FontAwesomeIcon size="lg" icon={faDatabase} />
            <span className="ms-2">{t('Storage')}</span>
          </Col>
          <Col>{t('total.disk.size', { totalDiskSize: resyncSelectedData.diskSize })}</Col>
          <Col>{t('os.disk.size', { osDisksSize: resyncSelectedData.osSize })}</Col>
          <Col>{t('data.disk.size', { dataDiskSize: resyncSelectedData.dataSize })}</Col>
        </Row>
      </div>
    );
  };

  const setSummaryData = () => {
    const resyncSelectedData = getValue(STATIC_KEYS.UI_RESYNC_SUMMARY_DATA, values);
    const { totalVMs, selectedDiskCount, selectedDiskSize, osDisks, dataDisks, osSize, dataSize } = setDataForResyncSummary(virtualMachines, user);
    dispatch(valueChange(STATIC_KEYS.UI_RESYNC_SUMMARY_DATA, { ...resyncSelectedData, vms: totalVMs, disks: selectedDiskCount, dataDisks, osDisks, diskSize: selectedDiskSize, osSize, dataSize }));
    setConfirmation(true);
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
        <button type="button" className="btn btn-success" onClick={() => setSummaryData()} disabled={disableConfirm}>{t('title.reset.replication')}</button>
      </div>
    );
  };

  const renderConfirmation = () => {
    if (showConfirmation) {
      return (
        <div style={{ paddingLeft: '15%' }}>
          <div className="container padding-20">
            <div className="row pt-4">
              <div className="col-sm-1 confirmation-icon">
                <p className="display-4"><i className="fas fa-exclamation-triangle icon__warning" /></p>
              </div>
              <div className="col-sm-9 confirmation_modal_msg">
                <p className="mb-0">{t('reset.disk.warning')}</p>
                <p>{t('reset.disk.warning.notice')}</p>
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
        <span className="input-group-append input-group-text bg-transparent">
          <div className="">
            <FontAwesomeIcon size="sm" icon={faSearch} onClick={onFilterClick} />
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
        <div className="text-warning mt-4 ms-4">
          <i className="fas fa-exclamation-triangle" />
          &nbsp;&nbsp;&nbsp;
          {`${t('resynk.disk.warning.with.checkpoint')}`}
        </div>
      );
    }
    return (
      <div className="text-warning mt-4 ms-4">
        <i className="fas fa-exclamation-triangle" />
        &nbsp;&nbsp;&nbsp;
        {`${t('resynk.disk.warning.without.checkpoint')}`}
      </div>
    );
  };

  const renderResyncSummary = () => {
    if (showConfirmation) {
      return null;
    }
    const { totalVMs, selectedDiskCount, selectedDiskSize } = setDataForResyncSummary(virtualMachines, user);
    return (
      <Row className="p-3 mt-4 mb-2">
        <Col sm={2}>{t('resync.summary')}</Col>
        <Col sm={2}>
          <FontAwesomeIcon size="lg" icon={faDesktop} />
          <span className="ps-3">{totalVMs}</span>
        </Col>
        <Col sm={2}>
          <FontAwesomeIcon size="lg" icon={faHdd} />
          <span className="ps-3">{`${selectedDiskCount} [${selectedDiskSize}]`}</span>
        </Col>
        <Col sm={6}>{renderFilter()}</Col>
      </Row>
    );
  };

  return (
    <>
      <Card>
        {!showConfirmation && showWarningMsg()}
        <SimpleBar className={`${showConfirmation ? '' : 'resync_modal_height resync_font_size'}`}>
          {virtualMachines.length > 1 && <ResyncDiskDropdown vms={virtualMachines} dispatch={dispatch} showConfirmation={showConfirmation} user={user} />}
          {renderResyncSummary()}
          {showConfirmation ? renderConfirmation()
            : vms.map((vm) => <RenderResetReplicationVMs vmData={vm} dispatch={dispatch} user={user} selectedPlan={selectedPlan} />)}
        </SimpleBar>
      </Card>
      {renderModalFooter()}
    </>
  );
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(ResetDiskReplicationModal));
