import i18n from 'i18next';
import { PLATFORM_TYPES } from '../constants/InputConstants';
import { getValue } from './InputUtils';

export function getLabel({ user, fieldKey, label }) {
  const { values } = user;
  let res = label;
  const platFormType = getValue('configureSite.platformDetails.platformType', values);
  if (platFormType === PLATFORM_TYPES.Azure) {
    if (fieldKey === 'configureSite.platformDetails.projectId') {
      res = 'subscription.id';
    }
  }
  return res;
}

export function getErrorMessage({ fieldKey, user }) {
  const { values } = user;
  let res = '';
  const platFormType = getValue('configureSite.platformDetails.platformType', values);
  if (platFormType === PLATFORM_TYPES.Azure) {
    if (fieldKey === 'configureSite.platformDetails.projectId') {
      res = i18n.t(`error.${fieldKey}`);
    }
  }
  return res;
}

export function getFieldInfo({ fieldKey, user }) {
  const { values } = user;
  let res = '';
  const platFormType = getValue('configureSite.platformDetails.platformType', values);
  if (platFormType === PLATFORM_TYPES.Azure) {
    if (fieldKey === 'configureSite.platformDetails.projectId') {
      res = i18n.t(`info.azure.${fieldKey}`);
    }
    if (fieldKey === 'configureSite.platformDetails.username') {
      res = i18n.t(`info.azure.${fieldKey}`);
    }
    if (fieldKey === 'configureSite.platformDetails.password') {
      res = i18n.t(`info.azure.${fieldKey}`);
    }
  }
  return res;
}
