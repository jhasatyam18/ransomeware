import { addMessage } from '../store/actions/MessageActions';
import { FIELD_TYPE } from '../constants/FieldsConstant';
import { STACK_COMPONENT_NETWORK, STACK_COMPONENT_SECURITY_GROUP } from '../constants/StackConstants';
import { MESSAGE_TYPES } from '../constants/MessageConstants';
import { COPY_CONFIG, PLATFORM_TYPES, STATIC_KEYS, UI_WORKFLOW } from '../constants/InputConstants';
import { getInstanceTypeOptions, getAzureGeneralSettings, getRecoveryScript, getReplicationScript, getValue, getVMwareGeneralSettings, getNetworkOptions } from './InputUtils';
import { isEmpty } from './validationUtils';
import { getSourceConfig } from './PayloadUtil';
import { getMemoryInfo, getLabelWithResourceGrp } from './AppUtils';

export function createVMTestRecoveryConfig(vm, user, dispatch) {
  const { values } = user;
  const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
  const workflow = getValue(STATIC_KEYS.UI_WORKFLOW, values);
  switch (recoveryPlatform) {
    case PLATFORM_TYPES.AWS:
      return getAWSVMTestConfig(vm, workflow);
    case PLATFORM_TYPES.GCP:
      return getGCPVMTestConfig(vm, workflow);
    case PLATFORM_TYPES.VMware:
      return getVMwareVMTestConfig(vm, workflow);
    case PLATFORM_TYPES.Azure:
      return getAzureVMTestConfig(vm, workflow);
    default:
      dispatch(addMessage('Invalid recovery platform', MESSAGE_TYPES.ERROR));
  }
}

function getAWSVMTestConfig(vm, workflow) {
  const key = vm.moref;
  const config = { data: [{
    hasChildren: true,
    title: 'General',
    children: {
      [`${key}-vmConfig.general.instanceType`]: { label: 'Instance Type', fieldInfo: 'info.protectionplan.instance.type', type: FIELD_TYPE.SELECT_SEARCH, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select instance type.', shouldShow: true, options: (u) => getInstanceTypeOptions(u) },
    },
  },
  {
    hasChildren: true,
    title: 'Network',
    children: {
      [`${key}-vmConfig.network.net1`]: { label: 'IP Address', fieldInfo: 'info.protectionplan.instance.network.aws', type: STACK_COMPONENT_NETWORK, validate: null, errorMessage: '', shouldShow: true, options: (u) => getInstanceTypeOptions(u), data: vm },
    },
  }] };
  if (workflow === UI_WORKFLOW.REVERSE_PLAN) {
    config.data.push(...getReplicationScript(key));
  }
  config.data.push(...getRecoveryScript(key));
  return config;
}

function getGCPVMTestConfig(vm, workflow) {
  const key = vm.moref;
  const config = {
    data: [
      {
        hasChildren: true,
        title: 'General',
        children: {
          [`${key}-vmConfig.general.instanceType`]: { label: 'Instance Type', fieldInfo: 'info.protectionplan.instance.type', type: FIELD_TYPE.SELECT_SEARCH, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select instance type.', shouldShow: true, options: (u) => getInstanceTypeOptions(u) },
        },
      },
      {
        hasChildren: true,
        title: 'Network',
        children: {
          [`${key}-vmConfig.network.net1`]: { label: 'IP Address', fieldInfo: 'info.protectionplan.instance.network.aws', type: STACK_COMPONENT_NETWORK, validate: null, errorMessage: '', shouldShow: true, options: (u) => getInstanceTypeOptions(u), data: vm },
          [`${key}-vmConfig.network.securityGroup`]: { label: 'Firewall Tags', type: STACK_COMPONENT_SECURITY_GROUP, validate: null, errorMessage: '', shouldShow: true },
        },
      },
    ],
  };
  if (workflow === UI_WORKFLOW.REVERSE_PLAN) {
    config.data.push(...getReplicationScript(key));
  }
  config.data.push(...getRecoveryScript(key));
  return config;
}

function getVMwareVMTestConfig(vm, workflow) {
  const key = vm.moref;
  const config = {
    data: [
      ...getVMwareGeneralSettings(key, vm),
    ],
  };
  if (workflow === UI_WORKFLOW.REVERSE_PLAN) {
    config.data.push(...getReplicationScript(key));
  }
  config.data.push(...getRecoveryScript(key));
  return config;
}

/**
 *
 * @param {*} sourceMoref -> vm moref of vm whose recovery info we want
 * @param configToCopy -> recovery configurations which needs to be copied
 * @param recoveryConfig -> if we already have recovery config of vm
 * @param workFlow
 * used in to show summary in copy config and in recovery status last recovery info
 * @returns
 */

export function getRecoveryInfoForVM({ sourceMoref, user, configToCopy, recoveryConfig, workFlow }) {
  let sourceConfig = [];
  if (typeof recoveryConfig !== 'undefined' && sourceConfig) {
    sourceConfig = recoveryConfig;
  } else {
    sourceConfig = getSourceConfig(sourceMoref, user);
  }
  const data = [];
  configToCopy.forEach((conf) => {
    switch (conf.value) {
      case COPY_CONFIG.GENERAL_CONFIG:
        const keys = getGeneralConfig({ sourceConfig, workFlow, user });
        const genConf = { title: 'label.general', values: keys };
        data.push(genConf);
        break;
      case COPY_CONFIG.NETWORK_CONFIG:
        const nwKeys = getNetworkConfig({ sourceConfig, user, workFlow });
        const nwConf = { title: 'label.network', values: nwKeys };
        data.push(nwConf);
        break;
      case COPY_CONFIG.REP_SCRIPT_CONFIG:
        const repScripts = getRepScriptInfo(sourceConfig, user);
        if (repScripts) {
          const repS = { title: 'label.replication.scripts', values: repScripts };
          data.push(repS);
        }
        break;
      case COPY_CONFIG.REC_SCRIPT_CONFIG:
        const recScripts = getRecoveryScriptInfo(sourceConfig);
        if (recScripts) {
          const recS = { title: 'label.recovery.scripts', values: recScripts };
          data.push(recS);
        }
        break;
      default:
        return data;
    }
  });
  return data;
}

function getGeneralConfig({ sourceConfig, user, workFlow }) {
  const { values } = user;
  const { instanceType, volumeType, volumeIOPS, tags, folderPath, hostMoref, datastoreMoref, numCPU, datacenterMoref, securityGroup, availZone } = sourceConfig;
  const { memoryMB } = sourceConfig;
  let recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
  // if the workflow is to see last successfull test recovery then recovery platform will be the local platform
  if (typeof workFlow !== 'undefined' && workFlow === UI_WORKFLOW.LAST_TEST_RECOVERY_SUMMARY) {
    recoveryPlatform = user.platformType;
  }
  let memory = getMemoryInfo(memoryMB) || '';
  if (memory[0] === 0) {
    memory = '';
  } else {
    memory = memory.join(' ');
  }
  let tagData = '';
  if (tags && tags.length > 0) {
    tags.forEach((tag) => {
      tagData = `${tagData} ${tag.key}-${tag.value}`;
    });
  }
  let keys = [];
  switch (recoveryPlatform) {
    case PLATFORM_TYPES.AWS:
      keys = [
        { title: 'instance.type', value: instanceType },
        { title: 'volume.type', value: volumeType },
        { title: 'volume.iops', value: volumeIOPS },
        { title: 'label.instance.tags', value: tagData },
      ];
      break;
    case PLATFORM_TYPES.GCP:
      keys = [
        { title: 'instance.type', value: instanceType },
        { title: 'volume.type', value: volumeType },
        { title: 'label.instance.tags', value: tagData },
        { title: 'label.security.groups', value: securityGroup },
      ];
      break;
    case PLATFORM_TYPES.VMware:
      keys = [
        { title: 'label.datacenter', value: datacenterMoref },
        { title: 'label.folderPath', value: folderPath },
        { title: 'label.compute.resource', value: hostMoref },
        { title: 'label.storage', value: datastoreMoref },
        { title: 'label.cpu.nums', value: numCPU },
        { title: 'label.memory', value: memory },
      ];
      break;
    case PLATFORM_TYPES.Azure:
      keys = [
        { title: 'label.Resourcegrp', value: folderPath },
        { title: 'vm.size', value: instanceType },
        { title: 'volume.type', value: volumeType },
        { title: 'label.instance.tags', value: tagData },
        { title: 'label.network.tags', value: securityGroup },
        { title: 'label.available.zone', value: availZone },
      ];
      break;
    default:
      break;
  }

  return keys;
}

function getNetworkConfig({ sourceConfig, user, workFlow }) {
  const { values } = user;
  let recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
  let workflow;
  // if workflow is last successfull test recovery then use local site as recovery platform
  if (typeof workFlow !== 'undefined' && workFlow === UI_WORKFLOW.LAST_TEST_RECOVERY_SUMMARY) {
    recoveryPlatform = user.platformType;
    workflow = workFlow;
  } else {
    workflow = getValue(STATIC_KEYS.UI_WORKFLOW, values);
  }
  const { networks, availZone } = sourceConfig;
  const netWorkKeys = [];
  networks.forEach((nw, index) => {
    const { vpcId = '', Subnet = '', isPublicIP = '', networkTier = '', publicIP, privateIP, isFromSource, securityGroups, adapterType, networkMoref, macAddress, netmask, gateway, dns } = nw;
    let { subnet = '', network } = nw;
    if (subnet === '' && Subnet !== '') {
      subnet = Subnet;
    }
    let keys = [];
    switch (recoveryPlatform) {
      case PLATFORM_TYPES.AWS:
        keys = [
          { title: 'label.copy.fromSource', value: isFromSource },
          { title: 'label.vpc.id', value: vpcId },
          { title: 'label.subnet', value: subnet },
          { title: 'label.availZone', value: availZone },
          { title: 'label.auto.publicIP', value: isPublicIP },
          { title: 'label.networkTier', value: networkTier },
          { title: 'label.security.groups', value: securityGroups },
          { title: 'label.network', value: networkMoref },

        ];
        break;
      case PLATFORM_TYPES.GCP:
        const networkOption = getNetworkOptions(user);
        networkOption.forEach((netopt) => {
          if (netopt.value === network) {
            network = netopt.label;
          }
        });
        keys = [
          { title: 'label.network', value: network },
          { title: 'label.subnet', value: subnet },
          { title: 'label.networkTier', value: networkTier },
        ];
        break;
      case PLATFORM_TYPES.VMware:
        keys = [
          { title: 'label.network', value: network },
          { title: 'label.adapter.type', value: adapterType },
          { title: 'label.auto.publicIP', value: isPublicIP },
        ];
        break;
      case PLATFORM_TYPES.Azure:
        let networkLabel = '';
        let subnetLabel = '';
        let securityLabel = '';
        if (network !== '') {
          networkLabel = getLabelWithResourceGrp(network);
        }
        if (subnet !== '') {
          subnetLabel = getLabelWithResourceGrp(subnet);
        }
        if (securityGroups !== '') {
          securityLabel = getLabelWithResourceGrp(securityGroups);
        }
        keys = [
          { title: 'label.network', value: networkLabel || '' },
          { title: 'label.subnet', value: subnetLabel || '' },
          { title: 'label.auto.publicIP', value: isPublicIP },
          { title: 'label.security.groups', value: securityLabel || '' },
        ];
        break;
      default:
        break;
    }
    if (workflow !== UI_WORKFLOW.CREATE_PLAN) {
      keys = [...keys, { title: 'Private IP', value: privateIP },
        { title: 'Mac Address', value: macAddress },
        { title: 'Public IP', value: publicIP },
        { title: 'Netmask', value: netmask },
        { title: 'Gateway', value: gateway },
        { title: 'DNS', value: dns },
      ];
    }
    const nic = { title: `Nic-${index}`, values: keys };
    netWorkKeys.push(nic);
  });
  return netWorkKeys;
}

function getRecoveryScriptInfo(sourceConfig) {
  const { preScript, postScript } = sourceConfig;
  const keys = [
    { title: 'label.preScript', value: preScript },
    { title: 'label.postScript', value: postScript },
  ];
  if (preScript === '' || postScript === '' || typeof preScript === 'undefined' || typeof postScript === 'undefined') {
    return null;
  }
  return keys;
}

function getRepScriptInfo(sourceConfig, user) {
  const { repPostScript, repPreScript } = sourceConfig;
  const { values } = user;
  const workFlow = getValue(STATIC_KEYS.UI_WORKFLOW, values);
  const keys = [
    { title: 'label.preScript', value: repPreScript },
    { title: 'label.postScript', value: repPostScript },
  ];
  if (repPostScript === '' || repPreScript === '' || typeof repPostScript === 'undefined' || typeof repPreScript === 'undefined' || workFlow === UI_WORKFLOW.TEST_RECOVERY) {
    return null;
  }
  return keys;
}

function getAzureVMTestConfig(vm, workflow) {
  const key = vm.moref;
  const config = {
    data: [
      ...getAzureGeneralSettings(key, vm),
    ],
  };
  if (workflow === UI_WORKFLOW.REVERSE_PLAN) {
    config.data.push(...getReplicationScript(key));
  }
  config.data.push(...getRecoveryScript(key));
  return config;
}
