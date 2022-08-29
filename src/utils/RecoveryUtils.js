import { addMessage } from '../store/actions/MessageActions';
import { onScriptChange } from '../store/actions';
import { FIELD_TYPE } from '../constants/FieldsConstant';
import { STACK_COMPONENT_NETWORK, STACK_COMPONENT_SECURITY_GROUP, STACK_COMPONENT_TAGS } from '../constants/StackConstants';
import { MESSAGE_TYPES } from '../constants/MessageConstants';
import { PLATFORM_TYPES } from '../constants/InputConstants';
import { getAvailibilityZoneOptions, getInstanceTypeOptions, getPostScriptsOptions, getPreScriptsOptions, getResourceTypeOptions, getStorageTypeOptions, getValue, shouldDisableStorageType } from './InputUtils';
import { isEmpty } from './validationUtils';
import { onAwsStorageTypeChange } from '../store/actions/AwsActions';

export function createVMTestRecoveryConfig(vm, user, dispatch) {
  const { values } = user;
  const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
  switch (recoveryPlatform) {
    case PLATFORM_TYPES.AWS:
      return getAWSVMTestConfig(vm);
    case PLATFORM_TYPES.GCP:
      return getGCPVMTestConfig(vm);
    case PLATFORM_TYPES.Azure:
      return getAzureVMTestConfig(vm);
    default:
      dispatch(addMessage('Invalid recovery platform', MESSAGE_TYPES.ERROR));
  }
}

function getAWSVMTestConfig(vm) {
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
        },
      },
      {
        hasChildren: true,
        title: 'Recovery Scripts',
        children: {
          [`${key}-vmConfig.scripts.preScript`]: { label: 'Pre', fieldInfo: 'info.protectionplan.instance.prescript', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPreScriptsOptions(u), onChange: (user, dispatch) => onScriptChange(user, dispatch) },
          [`${key}-vmConfig.scripts.postScript`]: { label: 'Post', fieldInfo: 'info.protectionplan.instance.postscript', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPostScriptsOptions(u), onChange: (user, dispatch) => onScriptChange(user, dispatch) },
        },
      },
    ],
  };
  return config;
}

function getGCPVMTestConfig(vm) {
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
      {
        hasChildren: true,
        title: 'Recovery Scripts',
        children: {
          [`${key}-vmConfig.scripts.preScript`]: { label: 'Pre', fieldInfo: 'info.protectionplan.instance.prescript', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPreScriptsOptions(u), onChange: (user, dispatch) => onScriptChange(user, dispatch) },
          [`${key}-vmConfig.scripts.postScript`]: { label: 'Post', fieldInfo: 'info.protectionplan.instance.postscript', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPostScriptsOptions(u), onChange: (user, dispatch) => onScriptChange(user, dispatch) },
        },
      },
    ],
  };
  return config;
}

function getAzureVMTestConfig(vm) {
  const key = vm.moref;
  const config = {
    data: [
      {
        hasChildren: true,
        title: 'General',
        children: {
          [`${key}-vmConfig.general.folderPath`]: { label: 'Resource Group', fieldInfo: 'info.protectionplan.instance.type', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select Resource Group', shouldShow: true, options: (u) => getResourceTypeOptions(u) },
          [`${key}-vmConfig.general.availibility.zone`]: { label: 'Availability Zone', fieldInfo: 'info.availability.zone', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select Availability Zone', shouldShow: true, options: (u) => getAvailibilityZoneOptions(u) },
          [`${key}-vmConfig.general.instanceType`]: { label: 'Instance Type', fieldInfo: 'info.protectionplan.instance.type', type: FIELD_TYPE.SELECT_SEARCH, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select instance type.', shouldShow: true, options: (u) => getInstanceTypeOptions(u) },
          [`${key}-vmConfig.general.volumeType`]: { label: 'Volume Type', fieldInfo: 'info.protectionplan.instance.volume.type.aws', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select volume type.', shouldShow: true, options: (u) => getStorageTypeOptions(u), onChange: (user, dispatch) => onAwsStorageTypeChange(user, dispatch), disabled: (u, f) => shouldDisableStorageType(u, f) },
          [`${key}-vmConfig.general.tags`]: { label: 'Tags', fieldInfo: 'info.protectionplan.instance.tags.aws', type: STACK_COMPONENT_TAGS, validate: null, errorMessage: '', shouldShow: true },
        },
      },
      {
        hasChildren: true,
        title: 'Network',
        children: {
          [`${key}-vmConfig.network.net1`]: { label: 'IP Address', fieldInfo: 'info.protectionplan.instance.network.aws', type: STACK_COMPONENT_NETWORK, validate: null, errorMessage: '', shouldShow: true, options: (u) => getInstanceTypeOptions(u), data: vm },
        },
      },
    ],
  };
  return config;
}
