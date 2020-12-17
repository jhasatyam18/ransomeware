import { FIELDS, FIELD_TYPE } from '../constants/FieldsConstant';
import { PLATFORM_TYPES } from '../constants/InputConstants';

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
