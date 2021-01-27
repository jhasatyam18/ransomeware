import { addErrorMessage, hideApplicationLoader, removeErrorMessage, showApplicationLoader, valueChange } from '../store/actions';
import { FIELDS, FIELD_TYPE } from '../constants/FieldsConstant';
import { getValue } from './InputUtils';
import { MESSAGE_TYPES } from '../constants/MessageConstants';
import { API_TYPES, callAPI, createPayload } from './ApiUtils';
import { API_UPDATE_VMS_SCRIPTS, API_VALIDATE_MIGRATION } from '../constants/ApiConstants';
import { getRecoveryPayload, getUpdateScriptPayload } from './PayloadUtil';
import { addMessage } from '../store/actions/MessageActions';

export function isRequired(value) {
  if (!value) {
    return 'Required';
  }
  return null;
}

export function validateField(fieldKey, value, dispatch, user) {
  const { patterns, validate, errorMessage } = FIELDS[fieldKey];
  const field = FIELDS[fieldKey];
  const { type } = field;
  const { errors } = user;
  if (patterns) {
    let isValid = false;
    patterns.forEach((pattern) => {
      const re = new RegExp(pattern);
      if (value.match(re) !== null) {
        isValid = true;
      }
    });
    if (!isValid) {
      dispatch(addErrorMessage(fieldKey, errorMessage));
      return false;
    }
  }
  if (typeof validate === 'function') {
    if (type === FIELD_TYPE.SELECT && value === '-') {
      dispatch(addErrorMessage(fieldKey, errorMessage));
      return false;
    }
    const hasError = validate({ value, dispatch, user, fieldKey });
    if (hasError) {
      dispatch(addErrorMessage(fieldKey, errorMessage));
      return false;
    }
  }
  if (errors[fieldKey]) {
    dispatch(removeErrorMessage(fieldKey));
  }
  return true;
}

export function isEmpty({ value }) {
  return (typeof value === 'undefined' || typeof value === 'string' && value.trim() === '' || value === null);
}

export function validateConfigureSite(user, dispatch) {
  const { values } = user;
  const fields = Object.keys(FIELDS).filter((key) => key.indexOf('configureSite') !== -1);
  let isClean = true;
  fields.map((fieldKey) => {
    const field = FIELDS[fieldKey];
    const { shouldShow } = field;
    const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);
    if (showField) {
      if (!validateField(fieldKey, getValue(fieldKey, values), dispatch, user)) {
        isClean = false;
      }
    } else {
      dispatch(valueChange(fieldKey, getValue(fieldKey, values)));
    }
  });
  return isClean;
}

export function validateSteps(user, dispatch, fields) {
  const { values } = user;
  let isClean = true;
  fields.map((fieldKey) => {
    const field = FIELDS[fieldKey];
    const { shouldShow } = field;
    const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);
    if (showField) {
      if (!validateField(fieldKey, getValue(fieldKey, values), dispatch, user)) {
        isClean = false;
      }
    }
  });
  return isClean;
}

export function validateDrSiteSelection({ user, fieldKey }) {
  const { values } = user;
  const fieldValue = getValue(fieldKey, values);
  const otherField = (fieldKey === 'drplan.protectedSite' ? 'drplan.recoverySite' : 'drplan.protectedSite');
  const otherFieldValue = getValue(otherField, values);
  if (!fieldValue) {
    return true;
  }
  if (fieldValue === otherFieldValue) {
    return true;
  }
  return false;
}

export function validateDRPlanProtectData({ user, dispatch }) {
  const { values } = user;
  const vms = getValue('ui.site.seletedVMs', values);
  if (!vms || Object.keys(vms).length === 0) {
    dispatch(addMessage('Select virtual machine.', MESSAGE_TYPES.ERROR));
    return false;
  }
  return true;
}

export function noValidate() {
  return true;
}

export async function validateMigrationVMs(user, dispatch) {
  const initialCheckPass = validateDRPlanProtectData({ user, dispatch });
  if (initialCheckPass) {
    try {
      const { values } = user;
      const vms = getValue('ui.site.seletedVMs', values);
      if (vms) {
        const payload = getRecoveryPayload(user);
        const obj = createPayload(API_TYPES.POST, { ...payload.recovery });
        dispatch(showApplicationLoader('VALIDATING_MIGRATION_MACHINBES', 'Validating virtual machines.'));
        const powerOnVMs = await callAPI(API_VALIDATE_MIGRATION, obj);
        dispatch(hideApplicationLoader('VALIDATING_MIGRATION_MACHINBES'));
        // TODO : remove this condition post BE FIX
        if (powerOnVMs === null) {
          return true;
        }
        if (powerOnVMs.length !== 0) {
          dispatch(addMessage('Make sure all selected virtual machines were powered off and their replication status is in In-Sync state.', MESSAGE_TYPES.ERROR, true));
          return false;
        }
      }
    } catch (error) {
      addErrorMessage(error.message, MESSAGE_TYPES.ERROR);
      return false;
    }
  } else {
    return false;
  }
  return true;
}

export async function updateScripts(user, dispatch) {
  try {
    const { values } = user;
    const vms = getValue('ui.site.seletedVMs', values);
    if (vms) {
      const payload = getUpdateScriptPayload(user);
      const obj = createPayload(API_TYPES.POST, { ...payload });
      dispatch(showApplicationLoader('UPDATING_VM_SCRIPTS', 'Updating virtualmachine scripts.'));
      const updatedVMs = await callAPI(API_UPDATE_VMS_SCRIPTS, obj);
      dispatch(hideApplicationLoader('UPDATING_VM_SCRIPTS'));
      if (updatedVMs.length === payload.virtualMachines.length) {
        return true;
      }
      return false;
    }
  } catch (error) {
    addErrorMessage(MESSAGE_TYPES.ERROR, error);
    return false;
  }
  return true;
}
