import { PLATFORM_TYPES, STATIC_KEYS } from '../constants/InputConstants';
import { FIELDS } from '../constants/FieldsConstant';
import { getValue,
  shouldShowNodePlatformType,
  shouldShowNodeManagementPort,
  shouldShowNodeReplicationPort,
  shouldShowNodeEncryptionKey,
  getAWSNetworkIDFromName } from './InputUtils';

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
  const selectedNodeID = getValue('configureSite.node', values);
  const nodes = getValue(STATIC_KEYS.UI_SITE_NODES, values);
  let selectedNode = null;
  nodes.forEach((node) => {
    if (`${node.id}` === selectedNodeID) {
      selectedNode = node;
    }
  });
  const payload = getKeyStruct('configureSite.', values);
  payload.configureSite.node = selectedNode;
  return payload;
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
    const preScript = getValue(`${key}-protection.scripts.preScript`, values);
    const postScript = getValue(`${key}-protection.scripts.postScript`, values);
    vm.preScript = preScript;
    vm.postScript = postScript;
    result.drplan.protectedEntities.VirtualMachines.push(vm);
  });
  result.drplan.protectedEntities.Name = 'dummy';
  result.drplan.recoveryEntities.instanceDetails = getVMConfigPayload(user);
  result.drplan.replicationInterval = getReplicationInterval(getValue(STATIC_KEYS.REPLICATION_INTERVAL_TYPE, values), getValue('drplan.replicationInterval', values));
  result.drplan.startTime = getUnixTimeFromDate(result.drplan.startTime);
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
    const sourceMoref = vms[key].moref;
    const id = getValue(`${key}-vmConfig.general.id`, values);
    let instanceType = '';
    const insType = getValue(`${key}-vmConfig.general.instanceType`, values);
    if (typeof insType === 'object' && insType.value) {
      instanceType = insType.value;
    } else {
      instanceType = insType;
    }
    const volumeType = getValue(`${key}-vmConfig.general.volumeType`, values);
    let volumeIOPS = getValue(`${key}-vmConfig.general.volumeIOPS`, values) || 0;
    if (volumeType === 'gp2') {
      volumeIOPS = 0;
    }
    const tags = getValue(`${key}-vmConfig.general.tags`, values) || [];
    const bootPriority = parseInt(getValue(`${key}-vmConfig.general.bootOrder`, values), 10);
    // const isPublicIP = (getValue(`${key}-vmConfig.network.net1`, values) === 'public');
    // const privateIP = (isPublicIP ? '' : getValue(`${key}-vmConfig.network.net1-manual-ip`, values));
    const networks = getVMNetworkConfig(key, values);
    const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
    let sgs = getValue(`${key}-vmConfig.network.securityGroup`, values);
    if (recoveryPlatform === PLATFORM_TYPES.AWS) {
      sgs = [];
    }
    const securityGroups = joinArray(sgs, ',');
    const preScript = getValue(`${key}-vmConfig.scripts.preScript`, values);
    const postScript = getValue(`${key}-vmConfig.scripts.postScript`, values);
    if (typeof id !== 'undefined' && id !== '') {
      instanceDetails.push({ sourceMoref, id, instanceName, instanceType, volumeType, volumeIOPS, tags, bootPriority, networks, securityGroups, preScript, postScript });
    } else {
      instanceDetails.push({ sourceMoref, instanceName, instanceType, volumeType, volumeIOPS, tags, bootPriority, networks, securityGroups, preScript, postScript });
    }
  });
  return instanceDetails;
}

export function getVMNetworkConfig(key, values) {
  const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
  const networkKey = `${key}-vmConfig.network.net1`;
  const eths = getValue(networkKey, values) || [];
  let networks = [];
  let hasPublicIP = false;
  for (let index = 0; index < eths.length; index += 1) {
    const id = getValue(`${networkKey}-eth-${index}-id`, values);
    const vpcId = getValue(`${networkKey}-eth-${index}-vpcId`, values);
    const isPublicIP = getValue(`${networkKey}-eth-${index}-isPublic`, values) || false;
    let isFromSource = getValue(`${networkKey}-eth-${index}-isFromSource`, values);
    const subnet = getValue(`${networkKey}-eth-${index}-subnet`, values);
    const privateIP = getValue(`${networkKey}-eth-${index}-privateIP`, values) || '';
    let publicIP = getValue(`${networkKey}-eth-${index}-publicIP`, values) || '';
    const sgs = getValue(`${networkKey}-eth-${index}-securityGroups`, values) || '';
    const networkTier = getValue(`${networkKey}-eth-${index}-networkTier`, values) || '';
    const network = getValue(`${networkKey}-eth-${index}-network`, values) || '';
    if (typeof isFromSource !== 'boolean') {
      isFromSource = false;
    }
    if (isPublicIP) {
      hasPublicIP = true;
    }
    if (network !== '' && recoveryPlatform === PLATFORM_TYPES.AWS) {
      publicIP = getAWSNetworkIDFromName(values, network) || publicIP;
    }
    if (typeof id !== 'undefined' && id !== '') {
      networks.push({ id, isPublicIP, subnet, privateIP, securityGroups: joinArray(sgs, ','), publicIP, networkTier, network, isFromSource, vpcId });
    } else {
      networks.push({ isPublicIP, subnet, privateIP, securityGroups: joinArray(sgs, ','), publicIP, networkTier, network, isFromSource, vpcId });
    }
  }

  // aws. if public ip is associated then additional networks not allowed
  if (hasPublicIP && recoveryPlatform === PLATFORM_TYPES.AWS) {
    networks = networks.filter((net) => net.isPublicIP);
  }
  return networks;
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
  const instanceConfig = getVMConfigPayload(user);
  Object.keys(vms).forEach((key) => {
    const vm = vms[key];
    const { name, moref } = vm;
    const userName = getValue(`${moref}-username`, values);
    const password = getValue(`${moref}-password`, values);
    let instanceDetails = {};
    instanceConfig.forEach((ins) => {
      if (ins.sourceMoref === moref) {
        instanceDetails = ins;
      }
    });
    machineDetails.push({ instanceDetails, vmName: name, username: (userName && userName !== '' ? userName : ''), password: (password && password !== '' ? password : '') });
  });
  return machineDetails;
}

export function getReversePlanPayload(user) {
  const { values } = user;
  const sites = getValue('ui.values.sites', values);
  const drplan = getValue('ui.reverse.drPlan', values);
  const selectedRSite = getValue('reverse.recoverySite', values);
  const rSite = sites.filter((site) => getFilteredObject(site, selectedRSite, 'id'))[0];
  const replType = getValue('reverse.replType', values);
  const recoverySufffix = getValue('reverse.suffix', values);
  if (replType === STATIC_KEYS.DIFFERENTIAL) {
    drplan.isDifferential = true;
  } else {
    drplan.isDifferential = false;
  }
  drplan.recoverySite = rSite;
  drplan.recoveryEntities.suffix = recoverySufffix;
  return drplan;
}

function joinArray(data, delimiter) {
  if (data && data.length > 0) {
    return data.join(delimiter);
  }
  return '';
}

export function getNodePayload(user) {
  const { values } = user;
  const node = getKeyStruct('node.', values);
  if (!shouldShowNodePlatformType(user)) {
    node.node.platformType = '';
  }
  if (!shouldShowNodeManagementPort(user)) {
    node.node.managementPort = 0;
  }
  if (!shouldShowNodeReplicationPort(user)) {
    node.node.replicationCtrlPort = 0;
    node.node.replicationDataPort = 0;
  }
  if (!shouldShowNodeEncryptionKey(user)) {
    node.node.encryptionKey = '';
  }
  return node;
}

export function getFormPayload(formKey, user) {
  const { values } = user;
  return getKeyStruct(formKey, values);
}

function getUnixTimeFromDate(date) {
  if (date === null) {
    return 0;
  }
  if (date === '') {
    const d = new Date();
    return parseInt((d.getTime() / 1000).toFixed(0), 10);
  }
  if (typeof date.getMonth === 'function') {
    return parseInt((date.getTime() / 1000).toFixed(0), 10);
  }
  return date;
}

export function getBandwidthPayload(formKey, user) {
  const payload = getFormPayload(formKey, user);
  payload.throttling.startTime = getTimeFromDate(payload.throttling.startTime);
  payload.throttling.endTime = getTimeFromDate(payload.throttling.endTime);
  return payload;
}

function getTimeFromDate(value) {
  if (value === '') {
    return '';
  }
  const date = new Date(value);
  return `${date.getHours()}:${date.getMinutes()}`;
}

export function getEditProtectionPlanPayload(user, sites) {
  const { values } = user;
  const vms = getValue('ui.site.seletedVMs', values);
  const result = getKeyStruct('drplan.', values);
  const rSite = sites.filter((site) => getFilteredObject(site, result.drplan.recoverySite, 'id'))[0];
  const pSite = sites.filter((site) => getFilteredObject(site, result.drplan.protectedSite, 'id'))[0];
  result.drplan.recoverySite = rSite;
  result.drplan.protectedSite = pSite;
  result.drplan.recoveryEntities.name = 'dummy';
  result.drplan.protectedEntities.id = getValue('ui.edit.plan.protectedEntities.id', values);
  result.drplan.recoveryEntities.id = getValue('ui.edit.plan.recoveryEntities.id', values);
  result.drplan.remoteProtectionPlanId = getValue('ui.edit.plan.remoteProtectionPlanId', values);
  result.drplan.id = getValue('ui.edit.plan.id', values);
  result.drplan.status = getValue('ui.edit.plan.status', values);
  result.drplan.protectedEntities.VirtualMachines = [];
  Object.keys(vms).forEach((key) => {
    const vm = vms[key];
    const preScript = getValue(`${key}-protection.scripts.preScript`, values) || '';
    const postScript = getValue(`${key}-protection.scripts.postScript`, values) || '';
    vm.preScript = preScript;
    vm.postScript = postScript;
    result.drplan.protectedEntities.VirtualMachines.push(vm);
  });
  result.drplan.protectedEntities.Name = 'dummy';
  result.drplan.recoveryEntities.instanceDetails = getVMConfigPayload(user);
  result.drplan.replicationInterval = getReplicationInterval(getValue(STATIC_KEYS.REPLICATION_INTERVAL_TYPE, values), getValue('drplan.replicationInterval', values));
  result.drplan.startTime = getUnixTimeFromDate(result.drplan.startTime);
  return result;
}
