import { FIELDS } from '../constants/FieldsConstant';
import { getValue } from './InputUtils';

export function getConfigureSitePayload(user) {
  const { values } = user;
  const result = {};
  Object.keys((FIELDS))
    .filter((key) => key.indexOf('configureSite.') === 0)
    .forEach((key) => {
      const value = getValue(key, values);
      setObject(key, value, result);
    });
  return result;
}

function setObject(path, value, data) {
  const formData = data;
  const parts = path.split('.');
  const currentPath = parts[0];
  if (parts.length === 1) {
    formData[currentPath] = value;
    return;
  }
  if (!(currentPath in data)) {
    formData[currentPath] = {};
  }
  setObject(parts.slice(1).join('.'), value, formData[currentPath]);
}
