import { addErrorMessage, removeErrorMessage, valueChange } from '../store/actions';
import { FIELDS } from '../constants/FieldsConstant';
import { getValue } from './InputUtils';

export function isRequired(value) {
  if (!value) {
    return 'Required';
  }
  return null;
}

export function validateField(fieldKey, value, dispatch, user) {
  const { patterns, validate, errorMessage } = FIELDS[fieldKey];
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
    const hasError = validate({ value, dispatch, user });
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
