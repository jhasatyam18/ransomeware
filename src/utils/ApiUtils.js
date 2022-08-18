import { PLATFORM_TYPES } from '../constants/InputConstants';
import { clearMessages } from '../store/actions/MessageActions';
import store from '../store/index';
import { clearValues, logOutUser } from '../store/actions';
import { getApplicationToken } from './CookieUtils';
import { closeModal } from '../store/actions/ModalActions';
import { closeWizard } from '../store/actions/WizardActions';
import { getValue } from './InputUtils';

export const API_TYPES = { POST: 'POST', PUT: 'PUT', DELETE: 'DELETE', PATCH: 'PATCH' };

export function createPayload(type, data) {
  if (type === API_TYPES.POST) {
    return { method: 'POST', body: JSON.stringify(data) };
  }
  switch (type) {
    case API_TYPES.POST:
      return { method: 'POST', body: JSON.stringify(data) };
    case API_TYPES.PUT:
      return { method: 'PUT', body: JSON.stringify(data) };
    case API_TYPES.DELETE:
      return { method: 'DELETE', body: JSON.stringify(data) };
    case API_TYPES.PATCH:
      return { method: 'PATCH', body: JSON.stringify(data) };
    default:
      return { method: 'GET' };
  }
}

export function getUrlPath(URL) {
  return `${window.location.origin}/${URL}`;
}

export function callAPI(URL, obj = {}, token = null) {
  const opts = {
    headers: { 'Content-Type': 'application/json', Authorization: (token && token !== null ? `Bearer ${token}` : getApplicationToken()) },
    ...obj,
  };
  return fetch(getUrlPath(URL), opts)
    .then((response) => {
      if (response.status === 401) {
        store.dispatch(logOutUser());
        store.dispatch(closeModal());
        store.dispatch(closeWizard());
        store.dispatch(clearMessages());
        store.dispatch(clearValues());
      }
      if (response.status !== 204 && !response.ok) {
        return response.text()
          .then((err) => Promise.reject(getErrorText(err)));
      }
      if (response.status === 204) {
        response.hasError = false;
        return response;
      }
      const data = response.json();
      data.hasError = false;
      data.statusText = '';
      data.status = response.status;
      return data;
    });
}

export function getErrorText(err) {
  return { code: 0, message: err };
}

export function getLabelForAzure({ user, fieldKey, label }) {
  const { values } = user;
  let res = label;
  const platFormType = getValue('configureSite.platformDetails.platformType', values);
  if (platFormType === PLATFORM_TYPES.Azure) {
    if (fieldKey === 'configureSite.platformDetails.projectId') {
      res = 'subscription.id';
    }
    if (fieldKey === 'configureSite.platformDetails.hostname') {
      res = 'storage.account';
    }
    if (fieldKey === 'configureSite.platformDetails.accessKey') {
      res = 'tenant.id';
    }
    if (fieldKey === 'configureSite.platformDetails.secretKey') {
      res = 'client.id';
    }
  }
  return res;
}
