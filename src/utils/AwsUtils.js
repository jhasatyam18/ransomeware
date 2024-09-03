import { AWS_TARGET_HOST_TYPES, AWS_TENANCY_TYPES } from '../constants/InputConstants';
import { getValue } from './InputUtils';

export function showTenancyOptions(user, fieldKey) {
  const { values } = user;
  const keys = fieldKey.split('-vmConfig.general');
  if (keys.length > 1) {
    const vmTenancyKey = `${keys[0]}-vmConfig.general.tenancy`;
    const val = getValue(vmTenancyKey, values);
    return val === 'host';
  }
  return false;
}

export function getAwsHostAffinityOptions() {
  return [{ label: 'Off', value: 'default' }, { label: 'Host', value: 'host' }];
}

export function showDedicatedHostIDField(user, fieldKey) {
  const { values } = user;
  const keys = fieldKey.split('-vmConfig.general');
  if (keys.length > 1 && showTenancyOptions(user, fieldKey)) {
    const placementType = `${keys[0]}-vmConfig.general.hostType`;
    const val = getValue(placementType, values);
    return val === AWS_TARGET_HOST_TYPES.Host_ID;
  }
  return false;
}

export function showDedicatedHostGroupField(user, fieldKey) {
  const { values } = user;
  const keys = fieldKey.split('-vmConfig.general');
  if (keys.length > 1 && showTenancyOptions(user, fieldKey)) {
    const placementType = `${keys[0]}-vmConfig.general.hostType`;
    const val = getValue(placementType, values);
    return val === AWS_TARGET_HOST_TYPES.Host_Resource_Group;
  }
  return false;
}

// AWS tenancy
export function getAwsTenancyOptions() {
  const tenancyTypes = [];
  Object.keys(AWS_TENANCY_TYPES).forEach((key) => {
    const obj = {};
    obj.label = key.split('_').join(' ');
    obj.value = AWS_TENANCY_TYPES[key];
    tenancyTypes.push(obj);
  });
  return tenancyTypes;
}

// AWS tenancy by
export function getAwsTenancyOptionBy() {
  const tenancyBy = [];
  Object.keys(AWS_TARGET_HOST_TYPES).forEach((key) => {
    const obj = {};
    obj.label = key.split('_').join(' ');
    obj.value = AWS_TARGET_HOST_TYPES[key];
    tenancyBy.push(obj);
  });
  return tenancyBy;
}

export function getAwsHostMorefLabel(user, fieldKey) {
  const { values } = user;
  const keys = fieldKey.split('-vmConfig.general.hostMoref');
  let hostTypeKey = '';
  if (keys.length > 1) {
    hostTypeKey = `${keys[0]}-vmConfig.general.hostType`;
  }
  const value = getValue(hostTypeKey, values);
  if (value === AWS_TARGET_HOST_TYPES.Host_Resource_Group) {
    return 'Target Host Group Arn';
  }
  return 'Target Host ID';
}

export function showHostByIdOrArnErrorMessage({ fieldKey, user }) {
  const { values } = user;
  const hostFieldKey = fieldKey.replace('hostMoref', 'hostType');
  const hostType = getValue(hostFieldKey, values);
  if (hostType === AWS_TARGET_HOST_TYPES.Host_ID) {
    return 'Please enter dedicated host ID';
  }
  return 'Please enter host group arn';
}

export function validateAWSHostMoref({ value, user, fieldKey }) {
  if (fieldKey) {
    const { values } = user;
    const hostFieldKey = fieldKey.replace('hostMoref', 'hostType');
    const hostType = getValue(hostFieldKey, values);
    if (hostType === AWS_TARGET_HOST_TYPES.Host_ID || hostType === AWS_TARGET_HOST_TYPES.Host_Resource_Group) {
      if (value === '') {
        return true;
      }
    }
  }
  return false;
}
