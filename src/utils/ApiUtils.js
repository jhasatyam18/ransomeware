import { logOutUser } from '../store/actions';
import { getApplicationToken } from './CookieUtils';
import store from '../store/index';
import { closeModal } from '../store/actions/ModalActions';
import { closeWizard } from '../store/actions/WizardActions';

export const API_TYPES = { POST: 'POST', PUT: 'PUT', DELETE: 'DELETE' };

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
      return { method: 'DELETE' };
    default:
      return { method: 'GET' };
  }
}

export function getUrlPath(URL) {
  return `${window.location.origin}/${URL}`;
}

export function callAPI(URL, obj = {}) {
  const opts = {
    headers: { 'Content-Type': 'application/json', Authorization: getApplicationToken() },
    ...obj,
  };
  return fetch(getUrlPath(URL), opts)
    .then((response) => {
      if (response.status === 401) {
        store.dispatch(logOutUser());
        store.dispatch(closeModal());
        store.dispatch(closeWizard());
      }
      if (response.status !== 204 && !response.ok) {
        return { hasError: true, message: response.statusText, status: response.status, body: response.body };
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
