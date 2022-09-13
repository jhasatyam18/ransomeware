import { API_FETCH_VMWARE_LOCATION } from '../constants/ApiConstants';
import { addMessage } from '../store/actions/MessageActions';
import { onScriptChange, getStorageForVMware } from '../store/actions';
import { FIELD_TYPE } from '../constants/FieldsConstant';
import { STACK_COMPONENT_LOCATION, STACK_COMPONENT_MEMORY, STACK_COMPONENT_NETWORK, STACK_COMPONENT_SECURITY_GROUP } from '../constants/StackConstants';
import { MESSAGE_TYPES } from '../constants/MessageConstants';
import { PLATFORM_TYPES } from '../constants/InputConstants';
import { enableNodeDatastore, getComputeResourceOptions, getDatastoreOptions, getInstanceTypeOptions, getPostScriptsOptions, getPreScriptsOptions, getReacoveryLocationData, getValue } from './InputUtils';
import { isEmpty, isMemoryValueValid } from './validationUtils';

export function createVMTestRecoveryConfig(vm, user, dispatch) {
  const { values } = user;
  const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
  switch (recoveryPlatform) {
    case PLATFORM_TYPES.AWS:
      return getAWSVMTestConfig(vm);
    case PLATFORM_TYPES.GCP:
      return getGCPVMTestConfig(vm);
    case PLATFORM_TYPES.VMware:
      return getVMwareVMTestConfig(vm);
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

function getVMwareVMTestConfig(vm) {
  const key = vm.moref;
  const config = {
    data: [
      {
        hasChildren: true,
        title: 'General',
        children: {
          [`${key}-vmConfig.general.folderPath`]: { label: 'Location', description: '', type: STACK_COMPONENT_LOCATION, dataKey: 'ui.drplan.vms.location', isMultiSelect: false, errorMessage: 'Required virtual machine path', shouldShow: true, validate: (value, user) => isEmpty(value, user), fieldInfo: 'info.vmware.folder.location', getTreeData: ({ values, dataKey }) => getReacoveryLocationData({ values, dataKey }), baseURL: API_FETCH_VMWARE_LOCATION, baseURLIDReplace: '<id>:ui.values.recoverySiteID', urlParms: ['type', 'entity'], urlParmKey: ['static:Folder', 'object:value'], enableSelection: (node) => enableNodeDatastore(node) },
          [`${key}-vmConfig.general.hostMoref`]: { label: 'Compute', fieldInfo: 'info.vmware.compute', type: FIELD_TYPE.SELECT_SEARCH, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select compute resourced.', shouldShow: true, options: (u, fieldKey) => getComputeResourceOptions(u, fieldKey), onChange: (user, dispatch) => getStorageForVMware(user, dispatch) },
          [`${key}-vmConfig.general.dataStoreMoref`]: { label: 'Storage', fieldInfo: 'info.vmware.storage', type: FIELD_TYPE.SELECT_SEARCH, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select storage', shouldShow: true, options: (u, fieldKey) => getDatastoreOptions(u, fieldKey) },
          [`${key}-vmConfig.general.numcpu`]: { label: 'CPU', description: '', type: FIELD_TYPE.NUMBER, errorMessage: 'Required Memory', shouldShow: true, validate: (value, user) => isEmpty(value, user), fieldInfo: 'info.vmware.cpu', min: 1, max: 128, defaultValue: 2 },
          [`${key}-vmConfig.general`]: { label: 'Memory', description: '', validate: ({ user, fieldKey }) => isMemoryValueValid({ user, fieldKey }), type: STACK_COMPONENT_MEMORY, errorMessage: 'Required Memory Units', shouldShow: true, fieldInfo: 'info.vmware.memory.unit', min: 1, max: 12 },
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
