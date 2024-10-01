import { getStorageWithUnit } from './AppUtils';
import { getValue } from './InputUtils';

export function setDataForResyncSummary(virtualMachines, user) {
  const { values } = user;
  let selectedDiskSize = 0;
  let selectedDiskCount = 0;
  let osSize = 0;
  let dataSize = 0;
  let osDisks = 0;
  let dataDisks = 0;
  let totalVMs = 0;
  virtualMachines.forEach((vm) => {
    const vmMoref = getValue(`reset-repl-vm-id-${vm.moref}`, values);
    let vmHasSelectedDisks = false;
    vm.virtualDisks.forEach((d, index) => {
      if (vmMoref[d.id] === true) {
        vmHasSelectedDisks = true;
        if (index === 0) {
          osSize += d.size;
          osDisks += 1;
        } else {
          dataSize += d.size;
          dataDisks += 1;
        }
        selectedDiskSize += d.size;
        selectedDiskCount += 1;
      }
    });
    if (vmHasSelectedDisks) {
      totalVMs += 1;
    }
  });
  selectedDiskSize = getStorageWithUnit(selectedDiskSize);
  osSize = getStorageWithUnit(osSize);
  dataSize = getStorageWithUnit(dataSize);
  return { totalVMs, selectedDiskCount, selectedDiskSize, osDisks, dataDisks, osSize, dataSize };
}

export const calculatePerVMDiskData = (vmData, virtualDisks, user) => {
  const { values } = user;
  let selectedDiskCount = 0;
  let selectedDiskSize = 0;
  virtualDisks.forEach((d) => {
    const vmMoref = getValue(`reset-repl-vm-id-${vmData.moref}`, values);
    if (vmMoref[d.id] === true) {
      selectedDiskCount += 1;
      selectedDiskSize += d.size;
    }
  });
  selectedDiskSize = getStorageWithUnit(selectedDiskSize);
  return { selectedDiskCount, selectedDiskSize };
};
