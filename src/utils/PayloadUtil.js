import { STATIC_KEYS } from '../constants/InputConstants';
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
  result.drplan.recoveryEntities.name = 'dummy';
  result.drplan.protectedEntities.VirtualMachines = [];
  Object.keys(vms).forEach((key) => {
    const vm = vms[key];
    vm.id = 0;
    result.drplan.protectedEntities.VirtualMachines.push(vm);
  });
  result.drplan.protectedEntities.Name = 'dummy';
  result.drplan.recoveryEntities.instanceDetails = getVMConfigPayload(user);
  result.drplan.replicationInterval = getReplicationInterval(getValue(STATIC_KEYS.REPLICATION_INTERVAL_TYPE, values), getValue('drplan.replicationInterval', values));
  return result;
}

export function getFilteredObject(data, keyToMatch, arrayFieldKey) {
  return String(data[arrayFieldKey]) === String(keyToMatch);
}

export function getRecoveryPayload(user, isMigration = false) {
  const { values } = user;
  // const vms = getValue('ui.site.seletedVMs', values);
  const result = getKeyStruct('recovery.', values);
  // Object.keys(vms).forEach((key) => {
  //   const { name } = vms[key];
  //   vmnames.push(name);
  // });
  result.recovery.machineDetails = [];
  result.recovery.machineDetails = getRecoveryConfigVMDetails(user);
  result.recovery.protectionplanID = parseInt(`${result.recovery.protectionplanID}`, 10);
  result.recovery.isMigration = isMigration;
  return result;
}

export function getVMConfigPayload(user) {
  const { values } = user;
  const vms = getValue('ui.site.seletedVMs', values);
  const instanceDetails = [];
  Object.keys(vms).forEach((key) => {
    const { name } = vms[key];
    const instanceName = name;
    const instanceType = getValue(`${key}-vmConfig.general.instanceType`, values);
    const volumeType = getValue(`${key}-vmConfig.general.volumeType`, values);
    const tags = getValue(`${key}-vmConfig.general.tags`, values) || [];
    const bootPriority = parseInt(getValue(`${key}-vmConfig.general.bootOrder`, values), 10);
    const isPublicIP = (getValue(`${key}-vmConfig.network.net1`, values) === 'public');
    const privateIP = (isPublicIP ? '' : getValue(`${key}-vmConfig.network.net1-manual-ip`, values));
    const sgs = getValue(`${key}-vmConfig.network.securityGroup`, values);
    const securityGroups = joinArray(sgs, ',');
    const preScript = getValue(`${key}-vmConfig.scripts.preScript`, values);
    const postScript = getValue(`${key}-vmConfig.scripts.postScript`, values);
    instanceDetails.push({ instanceName, instanceType, volumeType, tags, bootPriority, isPublicIP, privateIP, securityGroups, preScript, postScript });
  });
  return instanceDetails;
}

function getReplicationInterval(type, value) {
  const val = parseInt(value, 10);
  switch (type) {
    case STATIC_KEYS.REPLICATION_INTERVAL_TYPE_DAY:
      return val * 24 * 60;
    case STATIC_KEYS.REPLICATION_INTERVAL_TYPE_HOUR:
      return val * 60;
    default:
      return val;
  }
}

function getRecoveryConfigVMDetails(user) {
  const { values } = user;
  const vms = getValue('ui.site.seletedVMs', values);
  const machineDetails = [];
  Object.keys(vms).forEach((key) => {
    const vm = vms[key];
    const { name, moref } = vm;
    const userName = getValue(`${moref}-username`, values);
    const password = getValue(`${moref}-password`, values);
    machineDetails.push({ vmName: name, winUser: (userName && userName !== '' ? userName : ''), winPassword: (password && password !== '' ? password : '') });
  });
  return machineDetails;
}

function joinArray(data, delimiter) {
  if (data && data.length > 0) {
    return data.join(delimiter);
  }
  return '';
}
