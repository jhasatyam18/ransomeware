import { FIELDS } from '../constants/FieldsConstant';
import { getValue } from './InputUtils';

export function getKeyStruct(filterKey, values) {
  const result = {};
  Object.keys((FIELDS))
    .filter((key) => key.indexOf(filterKey) === 0)
    .forEach((key) => {
      const value = getValue(key, values);
      setObject(key, value, result);
    });
  return result;
}

function setObject(path, value, data) {
  const formData = data;
  const parts = path.split('.');
  const currentPath = parts[0];
  if (parts.length === 1) {
    formData[currentPath] = value;
    return;
  }
  if (!(currentPath in data)) {
    formData[currentPath] = {};
  }
  setObject(parts.slice(1).join('.'), value, formData[currentPath]);
}

export function getConfigureSitePayload(user) {
  const { values } = user;
  return getKeyStruct('configureSite.', values);
}

export function getCreateDRPlanPayload(user, sites) {
  const { values } = user;
  const vms = getValue('ui.site.seletedVMs', values);
  const result = getKeyStruct('drplan.', values);
  const rSite = sites.filter((site) => getFilteredObject(site, result.drplan.recoverySite, 'id'))[0];
  const pSite = sites.filter((site) => getFilteredObject(site, result.drplan.protectedSite, 'id'))[0];
  result.drplan.recoverySite = rSite;
  result.drplan.protectedSite = pSite;
  result.drplan.protectedEntities.Name = 'dummy';
  result.drplan.protectedEntities.VirtualMachines = [];
  Object.keys(vms).forEach((key) => {
    const vm = vms[key];
    vm.id = 0;
    result.drplan.protectedEntities.VirtualMachines.push(vm);
  });
  return result;
}

function getFilteredObject(data, keyToMatch, arrayFieldKey) {
  return String(data[arrayFieldKey]) === String(keyToMatch);
}

export function getRecoveryPayload(user, isMigration = false) {
  const { values } = user;
  const vms = getValue('ui.site.seletedVMs', values);
  const result = getKeyStruct('recovery.', values);
  const vmnames = [];
  Object.keys(vms).forEach((key) => {
    const { name } = vms[key];
    vmnames.push(name);
  });
  result.recovery.vmNames = vmnames;
  result.recovery.protectionplanID = parseInt(`${result.recovery.protectionplanID}`, 10);
  result.recovery.isMigration = isMigration;
  return result;
}

export function getUpdateScriptPayload(user) {
  const { values } = user;
  const vms = getValue('ui.site.seletedVMs', values);
  const result = {};
  const virtualMachines = [];
  Object.keys(vms).forEach((key) => {
    virtualMachines.push(vms[key]);
  });
  result.virtualMachines = virtualMachines;
  return result;
}
