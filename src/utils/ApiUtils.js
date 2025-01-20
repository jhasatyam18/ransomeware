import Cookies from 'js-cookie';
import { clearMessages } from '../store/actions/MessageActions';
import store from '../store/index';
import { logOutUser, removeCookies } from '../store/actions';
import { closeModal } from '../store/actions/ModalActions';
import { closeWizard } from '../store/actions/WizardActions';

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

export function callAPI(URL, obj = {}) {
  const opts = { headers: { 'Content-Type': 'application/json', token: Cookies.get('token') }, ...obj };
  return fetch(getUrlPath(URL), opts)
    .then((response) => {
      if (response.status === 401) {
        store.dispatch(logOutUser());
        store.dispatch(removeCookies());
        store.dispatch(closeModal(true));
        store.dispatch(closeWizard());
        store.dispatch(clearMessages());
      }
      if (response.status === 403) {
        const data = {};
        data.hasError = false;
        data.status = response.status;
        return data;
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

export function getSearchSelectStyle(hasError) {
  const hoverColor = '#2a3042';
  const bckClr = '#2e3548';
  const fontClr = '#bfc8e2';
  const borderClr = hasError ? '#f46a6a' : '#32394e';
  return {
    control: (base, state) => ({
      ...base,
      background: bckClr,
      backgroundColor: bckClr,
      borderColor: borderClr,
      boxShadow: state.isFocused ? null : null,
    }),
    menu: (base) => ({
      ...base,
      borderRadius: 0,
      marginTop: 0,
      background: bckClr,
      backgroundColor: bckClr,
      zIndex: 9999,
    }),
    menuList: (base) => ({
      ...base,
      opacity: 1000,
      padding: 0,
      background: bckClr,
      backgroundColor: bckClr,
    }),
    singleValue: (base) => ({
      ...base,
      padding: 0,
      color: fontClr,
    }),
    input: (base) => ({
      ...base,
      color: fontClr,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#2684FF' : bckClr,
      '&:hover': {
        backgroundColor: hoverColor,
        color: 'white',
      },
    }),
  };
}

export const removeSimilarQuery = (url, apiQuery) => {
  let queryParam = '';
  Object.keys(apiQuery).map((apiQ) => {
    if (apiQuery[apiQ].length === 1) {
      queryParam += `&${apiQ}=${apiQuery[apiQ][0]}`;
    }
  });

  if (queryParam.length > 0) {
    return `${url}${queryParam}`;
  }

  return url;
};
