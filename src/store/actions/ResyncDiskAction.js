import { RESYNC_DISKS_TYPES, STATIC_KEYS } from '../../constants/InputConstants';
import { setDataForResyncSummary } from '../../utils/ResyncDiskUtils';
import { getValue } from '../../utils/InputUtils';
import { updateValues, valueChange } from './UserActions';

export function onApplyAction(virtualMachines) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const workload = getValue(STATIC_KEYS.UI_RESYNC_DISK_WORKLOAD, values) || [];
    const diskType = getValue(STATIC_KEYS.UI_RESYNC_DISK_DISKTYPE, values) || [];
    dispatch(setResyncValues(workload, diskType, virtualMachines));
  };
}

export function setResyncIntialData(virtualMachines) {
  return (dispatch) => {
    // summary Object
    const resyncSummary = {
      resyncSummary: { vms: 0, disks: 0, osDisks: 0, dataDisks: 0, diskSize: 0 },
    };
    dispatch(updateValues(resyncSummary));
    let data = {};
    virtualMachines.forEach((vm) => {
      let disks = {};
      vm.virtualDisks.forEach((d) => {
        disks = { ...disks, [d.id]: false };
      });

      data = {
        ...data, [`reset-repl-vm-id-${vm.moref}`]: { ...disks },
      };
    });
    dispatch(updateValues(data));
  };
}

export function setResyncValues(workload, diskType, virtualMachines) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    dispatch(resetDiskData(virtualMachines));
    let data = {};
    const resyncSelectedData = getValue(STATIC_KEYS.UI_RESYNC_SUMMARY_DATA, values);
    const includeOSDisks = diskType.some((item) => item.value === RESYNC_DISKS_TYPES.os);
    const includeDataDisks = diskType.some((item) => item.value === RESYNC_DISKS_TYPES.data);
    const isAll = diskType.some((item) => item.value === RESYNC_DISKS_TYPES.all) || (includeOSDisks && includeDataDisks);
    // workloads
    const isAllWorkloads = workload.some((item) => item.value === RESYNC_DISKS_TYPES.all);
    virtualMachines.forEach((vm) => {
      let disks = {};
      vm.virtualDisks.forEach((d, index) => {
        if (isAll) {
          disks = { ...disks, [d.id]: true };
        } else if (includeOSDisks) {
          disks = { ...disks, [d.id]: (index === 0) };
        } else if (includeDataDisks) {
          disks = { ...disks, [d.id]: (index !== 0) };
        }
      });
      if (isAllWorkloads) {
        data = {
          ...data, [`reset-repl-vm-id-${vm.moref}`]: { ...disks },
        };
      } else {
        workload.forEach((w) => {
          if (w.value === vm.moref) {
            data = {
              ...data, [`reset-repl-vm-id-${vm.moref}`]: { ...disks },
            };
          }
        });
      }
    });
    dispatch(updateValues(data));
    const { totalVMs, selectedDiskCount, selectedDiskSize, osDisks, dataDisks, osSize, dataSize } = setDataForResyncSummary(virtualMachines, user);
    dispatch(valueChange(STATIC_KEYS.UI_RESYNC_SUMMARY_DATA, { ...resyncSelectedData, vms: totalVMs, disks: selectedDiskCount, dataDisks, osDisks, diskSize: selectedDiskSize, osSize, dataSize }));
  };
}

export function resetDiskData(virtualMachines) {
  return (dispatch) => {
    let data = {};
    virtualMachines.forEach((vm) => {
      let disk = {};
      vm.virtualDisks.forEach((d) => {
        disk = { ...disk, [d.id]: false };
      });
      data = { ...data, [`reset-repl-vm-id-${vm.moref}`]: { ...disk } };
    });
    dispatch(updateValues(data));
    dispatch(valueChange(STATIC_KEYS.UI_RESYNC_SUMMARY_DATA, { vms: 0, disks: 0, dataDisks: 0, osDisks: 0, diskSize: '0KB', osSize: '0KB', dataSize: '0KB' }));
  };
}
