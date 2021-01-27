import { FIELDS, FIELD_TYPE } from '../constants/FieldsConstant';
import { PLATFORM_TYPES, SCRIPT_TYPES } from '../constants/InputConstants';

export function getValue(key, values) {
  const ret = values[key];
  return typeof ret === 'undefined' ? getDefaultValueForType(key) : ret;
}

export function getDefaultValueForType(key) {
  try {
    const type = FIELDS && FIELDS[key].type;
    if (type) {
      switch (type) {
        case FIELD_TYPE.CHECKBOX: return false;
        case FIELD_TYPE.NUMBER: return 0;
        case FIELD_TYPE.SELECT: return null;
        default:
          return '';
      }
    }
  } catch (error) {
    return '';
  }
}

export function isPlatformTypeVMware(user) {
  const { values } = user;
  if (getValue('configureSite.platformDetails.platformType', values) === PLATFORM_TYPES.VMware) {
    return true;
  }
  return false;
}

export function isPlatformTypeAWS(user) {
  const { values } = user;
  if (getValue('configureSite.platformDetails.platformType', values) === PLATFORM_TYPES.AWS) {
    return true;
  }
  return false;
}
export function isPlatformTypeGCP(user) {
  const { values } = user;
  if (getValue('configureSite.platformDetails.platformType', values) === PLATFORM_TYPES.GCP) {
    return true;
  }
  return false;
}

export function getSitesOptions(user) {
  const { values } = user;
  const sites = getValue('ui.values.sites', values);
  const result = [];
  if (sites) {
    sites.reduce((previous, next) => {
      previous.push({ label: next.platformDetails.platformName, value: next.id });
      return previous;
    }, result);
  }
  return result;
}

export function getDRPlanOptions(user) {
  const { values } = user;
  const plans = getValue('ui.values.drplan', values);
  const result = [];
  if (plans) {
    plans.reduce((previous, next) => {
      previous.push({ label: next.name, value: next.id });
      return previous;
    }, result);
  }
  return result;
}

export function getInstanceTypeOptions(user) {
  const { values } = user;
  const instanceTypes = getValue('ui.values.instances', values);
  const result = [];
  if (instanceTypes) {
    instanceTypes.reduce((previous, next) => {
      previous.push({ label: next.label, value: next.value });
      return previous;
    }, result);
  }
  return result;
}

export function getAvailibilityZoneOptions(user) {
  const { values } = user;
  const zones = getValue('ui.values.availabilityZones', values);
  const result = [];
  if (zones) {
    zones.reduce((previous, next) => {
      previous.push({ label: next.label, value: next.value });
      return previous;
    }, result);
  }
  return result;
}

export function getRegionOptions(user) {
  const { values } = user;
  const zones = getValue('ui.values.regions', values);
  const result = [];
  if (zones) {
    zones.reduce((previous, next) => {
      previous.push({ label: next.label, value: next.value });
      return previous;
    }, result);
  }
  return result;
}

export function getScriptsOptions({ user, type }) {
  const { values } = user;
  const options = (type === SCRIPT_TYPES.POST_SCRIPT ? getValue('ui.scripts.post', values) : getValue('ui.scripts.pre', values));
  const result = [];
  if (options) {
    options.reduce((previous, next) => {
      previous.push({ label: next, value: next });
      return previous;
    }, result);
  }
  return result;
}
