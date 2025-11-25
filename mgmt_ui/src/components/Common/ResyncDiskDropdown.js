import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import Select from 'react-select';
import { Col, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { valueChange } from '../../store/actions';
import { onApplyAction, resetDiskData } from '../../store/actions/ResyncDiskAction';
import { getValue } from '../../utils/InputUtils';
import { getSearchSelectStyle } from '../../utils/ApiUtils';
import { RESYNC_DISKS_TYPES, STATIC_KEYS } from '../../constants/InputConstants';
import { isVMRecoveredOrNotAvailable } from '../../utils/ResyncDiskUtils';

function ResyncDiskDropdown(props) {
  const { vms, dispatch, showConfirmation, user, t } = props;
  const { values } = user;
  const [workloadOptions, setWorkloadOptions] = useState([]);
  const [diskOptions, setDiskOptions] = useState([]);
  const selectedWorkload = getValue(STATIC_KEYS.UI_RESYNC_DISK_WORKLOAD, values) || [];
  const selectedDiskType = getValue(STATIC_KEYS.UI_RESYNC_DISK_DISKTYPE, values) || [];
  useEffect(() => {
    let isUnmounting = false;
    if (!isUnmounting) {
      const diskTypes = [];
      const workload = [];
      if (vms && vms.length > 0) {
        workload.push({ value: RESYNC_DISKS_TYPES.all, label: t('all') });
        vms.forEach((vm) => {
          if (!isVMRecoveredOrNotAvailable(vm)) {
            workload.push({ value: vm.moref, label: vm.name });
          }
        });
      }
      diskTypes.push({ value: RESYNC_DISKS_TYPES.all, label: t('all') });
      diskTypes.push({ value: RESYNC_DISKS_TYPES.os, label: t('os.disk') });
      diskTypes.push({ value: RESYNC_DISKS_TYPES.data, label: t('data.disk') });
      setDiskOptions(diskTypes);
      setWorkloadOptions(workload);
    }
    return () => {
      isUnmounting = true;
    };
  }, []);

  const onApplyConfig = () => {
    dispatch(onApplyAction(vms));
  };

  const onResetConfig = () => {
    dispatch(resetDiskData(vms));
  };
  const handleWorkloadChange = (selected) => {
    if (selected.length > 0) {
      if (selected[selected.length - 1].value === RESYNC_DISKS_TYPES.all) {
        dispatch(valueChange(STATIC_KEYS.UI_RESYNC_DISK_WORKLOAD, [{ label: RESYNC_DISKS_TYPES.all, value: RESYNC_DISKS_TYPES.all }]));
      } else {
        const result = selected.filter((s) => {
          if (s.value !== RESYNC_DISKS_TYPES.all) {
            return s;
          }
        });
        dispatch(valueChange(STATIC_KEYS.UI_RESYNC_DISK_WORKLOAD, result));
      }
    } else {
      dispatch(valueChange(STATIC_KEYS.UI_RESYNC_DISK_WORKLOAD, []));
    }
  };

  const handleDiskTypeChange = (selected) => {
    if (selected.length > 0) {
      if (selected[selected.length - 1].value === RESYNC_DISKS_TYPES.all) {
        dispatch(valueChange(STATIC_KEYS.UI_RESYNC_DISK_DISKTYPE, [{ label: RESYNC_DISKS_TYPES.all, value: RESYNC_DISKS_TYPES.all }]));
      } else {
        const result = selected.filter((s) => {
          if (s.value !== RESYNC_DISKS_TYPES.all) {
            return s;
          }
        });
        dispatch(valueChange(STATIC_KEYS.UI_RESYNC_DISK_DISKTYPE, result));
      }
    } else {
      dispatch(valueChange(STATIC_KEYS.UI_RESYNC_DISK_DISKTYPE, []));
    }
  };

  const renderApplyDropdowns = () => {
    const isMultiSelect = true;
    if (showConfirmation) {
      return null;
    }
    return (
      <>
        <Row className="p-3">
          <Col sm={4}>{t('select.workloads.for.resync')}</Col>
          <Col sm={4} className="ml-2">{t('select.disk.type')}</Col>
        </Row>
        <Row className="ps-3">
          <Col sm={4}>
            <Select
              inputId="resyncDisk_workloads_select"
              options={workloadOptions}
              isMulti={isMultiSelect}
              closeMenuOnSelect={false}
              onChange={handleWorkloadChange}
              allowSelectAll={isMultiSelect}
              value={selectedWorkload}
              styles={getSearchSelectStyle(false)}
              captureMenuScroll={false}
            />
          </Col>
          <Col sm={4}>
            <Select
              inputId="resyncDisk_diskType_select"
              options={diskOptions}
              isMulti={isMultiSelect}
              styles={getSearchSelectStyle(false)}
              value={selectedDiskType}
              onChange={handleDiskTypeChange}
            />
          </Col>
          <Col sm={4}>
            <button type="button" className="btn btn-success pt-1 pb-1" onClick={() => onApplyConfig()}>
              {t('apply')}
            </button>
            <button type="button" className="margin-left-20  pt-1 pb-1 btn btn-secondary" onClick={() => onResetConfig()}>
              {t('Reset')}
            </button>
          </Col>
        </Row>
      </>
    );
  };
  return (
    <>
      {renderApplyDropdowns()}
    </>
  );
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}

export default connect(mapStateToProps)(withTranslation()(ResyncDiskDropdown));
