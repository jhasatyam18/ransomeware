import { FIELD_TYPE } from '../constants/FieldsConstant';
import { STACK_COMPONENT_NETWORK } from '../constants/StackConstants';
import { onScriptChange } from '../store/actions';
import { getInstanceTypeOptions, getPostScriptsOptions, getPreScriptsOptions, getValue } from './InputUtils';
import { isEmpty } from './validationUtils';

export function createVMTestRecoveryConfig(vm, user) {
  const { values } = user;
  const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
  switch (recoveryPlatform) {
    default:
      return getAWSVMTestConfig(vm);
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
          [`${key}-vmConfig.general.instanceType`]: { label: 'Instance Type', fieldInfo: 'info.protectionplan.instance.type', type: FIELD_TYPE.SELECT, validate: (value, user) => isEmpty(value, user), errorMessage: 'Select instance type.', shouldShow: true, options: (u) => getInstanceTypeOptions(u) },
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
        title: 'Replication Scripts',
        children: {
          [`${key}-protection.scripts.preScript`]: { label: 'Pre', fieldInfo: 'info.protectionplan.protection.prescript', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPreScriptsOptions(u), onChange: (user, dispatch) => onScriptChange(user, dispatch) },
          [`${key}-protection.scripts.postScript`]: { label: 'Post', fieldInfo: 'info.protectionplan.protection.postscript', type: FIELD_TYPE.SELECT, validate: null, errorMessage: '', shouldShow: true, options: (u) => getPostScriptsOptions(u), onChange: (user, dispatch) => onScriptChange(user, dispatch) },
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
