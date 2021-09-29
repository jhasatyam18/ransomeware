import { addErrorMessage, hideApplicationLoader, removeErrorMessage, showApplicationLoader, valueChange } from '../store/actions';
import { FIELDS, FIELD_TYPE } from '../constants/FieldsConstant';
import { createVMConfigStackObject, getValue } from './InputUtils';
import { MESSAGE_TYPES } from '../constants/MessageConstants';
import { API_TYPES, callAPI, createPayload } from './ApiUtils';
import { API_VALIDATE_MIGRATION, API_VALIDATE_RECOVERY, API_VALIDATE_REVERSE_PLAN } from '../constants/ApiConstants';
import { getRecoveryPayload, getReversePlanPayload } from './PayloadUtil';
import { addMessage } from '../store/actions/MessageActions';

export function isRequired(value) {
  if (!value) {
    return 'Required';
  }
  return null;
}

export function validateField(field, fieldKey, value, dispatch, user) {
  const { patterns, validate, errorMessage } = field;
  // const field = FIELDS[fieldKey];
  const { type } = field;
  const { errors } = user;
  if (patterns) {
    let isValid = false;
    patterns.forEach((pattern) => {
      const re = new RegExp(pattern);
      if (value) {
        if (value.match(re) !== null) {
          isValid = true;
        }
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
      if (!validateField(field, fieldKey, getValue(fieldKey, values), dispatch, user)) {
        isClean = false;
      }
    } else {
      dispatch(valueChange(field, fieldKey, getValue(fieldKey, values)));
    }
  });
  return isClean;
}

export function validateSteps(user, dispatch, fields, staticFields) {
  const { values } = user;
  let isClean = true;
  fields.map((fieldKey) => {
    const field = staticFields ? staticFields[fieldKey] : FIELDS[fieldKey];
    const { shouldShow } = field;
    const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);
    if (showField) {
      if (!validateField(field, fieldKey, getValue(fieldKey, values), dispatch, user)) {
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

export async function validateMigrationVMs({ user, dispatch }) {
  const initialCheckPass = validateDRPlanProtectData({ user, dispatch });
  if (initialCheckPass) {
    try {
      const { values } = user;
      const vms = getValue('ui.site.seletedVMs', values);
      if (vms) {
        const payload = getRecoveryPayload(user, true);
        const obj = createPayload(API_TYPES.POST, { ...payload.recovery });
        dispatch(showApplicationLoader('VALIDATING_MIGRATION_MACHINBES', 'Validating virtual machines.'));
        const response = await callAPI(API_VALIDATE_MIGRATION, obj);
        dispatch(hideApplicationLoader('VALIDATING_MIGRATION_MACHINBES'));
        if (response.failedVMs === null) {
          return true;
        }
        if (response.failedVMs.length !== 0) {
          dispatch(addMessage('Make sure all selected virtual machines were powered off and have zero changed data.', MESSAGE_TYPES.ERROR, false));
        }
        return false;
      }
    } catch (err) {
      dispatch(hideApplicationLoader('VALIDATING_MIGRATION_MACHINBES'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      return false;
    }
  } else {
    return false;
  }
  return true;
}

export function validateVMConfiguration({ user, dispatch }) {
  const { values } = user;
  const vms = getValue('ui.site.seletedVMs', values);
  let fields = {};
  Object.keys(vms).forEach((vm) => {
    const vmConfig = createVMConfigStackObject(vm);
    const { data } = vmConfig;
    data.forEach((item) => {
      const { children } = item;
      Object.keys(children).forEach((key) => {
        fields = { ...fields, [key]: children[key] };
      });
    });
  });
  const response = validateSteps(user, dispatch, Object.keys(fields), fields);
  if (!response) {
    dispatch(addMessage('Check node configuration. One or more required field data is not provided.', MESSAGE_TYPES.ERROR));
  }
  return response;
}

export async function validateRecoveryVMs({ user, dispatch }) {
  const initialCheckPass = validateDRPlanProtectData({ user, dispatch });
  if (initialCheckPass) {
    try {
      const { values } = user;
      const vms = getValue('ui.site.seletedVMs', values);
      if (vms) {
        const payload = getRecoveryPayload(user);
        const obj = createPayload(API_TYPES.POST, { ...payload.recovery });
        dispatch(showApplicationLoader('VALIDATING_RECOVERY_MACHINES', 'Validating virtual machines.'));
        const response = await callAPI(API_VALIDATE_RECOVERY, obj);
        dispatch(hideApplicationLoader('VALIDATING_RECOVERY_MACHINES'));
        if (response.failedVMs === null && response.warningVMs === null) {
          return true;
        }
        if (response.failedVMs.length !== 0) {
          dispatch(addMessage(`Following virtual machines [${response.failedVMs.join(', ')}] has not completed any replication iteration.`, MESSAGE_TYPES.ERROR, false));
        }
        if (response.warningVMs.length !== 0) {
          dispatch(addMessage(`Folloing virtual machines [${response.warningVMs.join(',')}] replciation running. Are you sure want to continue.`, MESSAGE_TYPES.ERROR, false));
          return true;
        }
        return false;
      }
    } catch (err) {
      dispatch(hideApplicationLoader('VALIDATING_RECOVERY_MACHINES'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      return false;
    }
  } else {
    return false;
  }
  return true;
}

export function validateForm(formKey, user, dispatch) {
  const { values } = user;
  const fields = Object.keys(FIELDS).filter((key) => key.indexOf(formKey) !== -1);
  let isClean = true;
  fields.map((fieldKey) => {
    const field = FIELDS[fieldKey];
    const { shouldShow, validate, patterns } = field;
    const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);
    if (showField && (typeof validate !== 'undefined' || typeof patterns !== 'undefined')) {
      if (!validateField(field, fieldKey, getValue(fieldKey, values), dispatch, user)) {
        isClean = false;
      }
    }
  });
  return isClean;
}

export function validatePassword({ value, user }) {
  const { values } = user;
  const password = getValue('user.newPassword', values);
  return value !== password;
}

export function validateReplicationValue({ user }) {
  const { values = {} } = user;
  const d = getValue('ui.values.replication.interval.days', values);
  const h = getValue('ui.values.replication.interval.hours', values);
  const m = getValue('ui.values.replication.interval.min', values);
  const z = '0';
  if (d !== z || h !== z && m !== z) {
    return true;
  }
  return false;
}

export async function validateReversePlan({ user, dispatch }) {
  const initialCheckPass = validateReverseData({ user, dispatch });
  if (initialCheckPass) {
    try {
      const drplan = getReversePlanPayload(user);
      const obj = createPayload(API_TYPES.POST, { ...drplan });
      const url = API_VALIDATE_REVERSE_PLAN.replace('<id>', drplan.id);
      dispatch(showApplicationLoader('VALIDATING_REVERSE_PLAN', 'Validating reverse plan.'));
      const response = await callAPI(url, obj);
      dispatch(hideApplicationLoader('VALIDATING_REVERSE_PLAN'));
      if (!response.isRecoverySiteOnline) {
        dispatch(addMessage('Recovery site is not reachable. Please select a different recovery site.', MESSAGE_TYPES.ERROR, true));
        return false;
      }
      if (response.failedVMs === null) {
        return true;
      }
      if (response.failedVMs.length !== 0) {
        dispatch(addMessage(`Some virtual machines [${response.failedVMs.join(', ')}] do not have snapshot on the recovery site. Please select full incremental for replication type and click next.`, MESSAGE_TYPES.ERROR, true));
      }
      return false;
    } catch (err) {
      dispatch(hideApplicationLoader('VALIDATING_REVERSE_PLAN'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      return false;
    }
  } else {
    return false;
  }
}

export function validateReverseData({ user, dispatch }) {
  const { values } = user;
  const field = FIELDS['reverse.suffix'];
  if (!validateField(field, 'reverse.suffix', getValue('reverse.suffix', values), dispatch, user)) {
    return false;
  }
  return true;
}
