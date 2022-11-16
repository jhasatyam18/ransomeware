import { onAwsStorageTypeChange } from '../store/actions/AwsActions';
import { addMessage } from '../store/actions/MessageActions';
import { FIELD_TYPE } from '../constants/FieldsConstant';
import { STACK_COMPONENT_NETWORK, STACK_COMPONENT_SECURITY_GROUP, STACK_COMPONENT_TAGS } from '../constants/StackConstants';
import { MESSAGE_TYPES } from '../constants/MessageConstants';
import { PLATFORM_TYPES, UI_WORKFLOW } from '../constants/InputConstants';
import { isEmpty } from './validationUtils';
import { getAvailibilityZoneOptions, getInstanceTypeOptions, getRecoveryScript, getReplicationScript, getResourceTypeOptions, getStorageTypeOptions, getValue, getVMwareGeneralSettings, shouldDisableStorageType } from './InputUtils';

export function createVMTestRecoveryConfig(vm, user, dispatch) {
  const { values } = user;
  const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
  const workflow = getValue('ui.workflow', values);
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
          [`${key}-vmConfig.general.instanceType`]: { label: 'Instance Type', fieldInfo: 'info.protectionplan.instance.type', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select instance type.', shouldShow: true, options: (u) => getInstanceTypeOptions(u) },
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

function getAzureVMTestConfig(vm, workflow) {
  const key = vm.moref;
  const config = {
    data: [
      {
        hasChildren: true,
        title: 'General',
        children: {
          [`${key}-vmConfig.general.folderPath`]: { label: 'Resource Group', fieldInfo: 'info.protectionplan.resource.group.azure', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select Resource Group', shouldShow: true, options: (u) => getResourceTypeOptions(u) },
          [`${key}-vmConfig.general.availibility.zone`]: { label: 'Availability Zone', fieldInfo: 'info.protectionplan.availibility.zone.azure', type: FIELD_TYPE.SELECT, errorMessage: 'Select Availability Zone', shouldShow: true, options: (u) => getAvailibilityZoneOptions(u) },
          [`${key}-vmConfig.general.instanceType`]: { label: 'VM Size', fieldInfo: 'info.protectionplan.vmsize.azure', type: FIELD_TYPE.SELECT_SEARCH, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select instance type.', shouldShow: true, options: (u) => getInstanceTypeOptions(u) },
          [`${key}-vmConfig.general.volumeType`]: { label: 'Volume Type', fieldInfo: 'info.protectionplan.volume.type.azure', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select volume type.', shouldShow: true, options: (u) => getStorageTypeOptions(u), onChange: (user, dispatch) => onAwsStorageTypeChange(user, dispatch), disabled: (u, f) => shouldDisableStorageType(u, f) },
          [`${key}-vmConfig.general.tags`]: { label: 'Tags', fieldInfo: 'info.protectionplan.tags.azure', type: STACK_COMPONENT_TAGS, validate: null, errorMessage: '', shouldShow: true },
        },
      },
      {
        hasChildren: true,
        title: 'Network',
        children: {
          [`${key}-vmConfig.network.net1`]: { label: 'IP Address', fieldInfo: 'info.protectionplan.instance.network.aws', type: STACK_COMPONENT_NETWORK, validate: null, errorMessage: '', shouldShow: true, options: (u) => getInstanceTypeOptions(u), data: vm },
        },
      },
      ...getRecoveryScript(key),
    ],
  };
  if (workflow === UI_WORKFLOW.REVERSE_PLAN) {
    config.data.push(...getReplicationScript(key));
  }
  return config;
}
