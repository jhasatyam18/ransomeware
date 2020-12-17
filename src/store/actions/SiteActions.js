// import { addMessage, clearMessages } from './MessageActions';

import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import * as Types from '../../constants/actionTypes';
import { API_CREATE_SITES, API_DELETE_SITES, API_FETCH_SITES } from '../../constants/ApiConstants';
import { addMessage, clearMessages } from './MessageActions';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { closeModal } from './ModalAcions';
import { hideApplicationLoader, showApplicationLoader } from './UserActions';
import { fetchByDelay } from '../../utils/SlowFetch';

export function fetchSites() {
  return (dispatch) => {
    dispatch(clearMessages());
    return callAPI(API_FETCH_SITES)
      .then((json) => {
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(sitesFetched(json));
        }
      },
      (err) => {
        alert(err);
      });
  };
}
export function sitesFetched(sites) {
  return {
    type: Types.FETCH_SITES,
    sites,
  };
}

export function handleSiteTableSelection(data, isSelected) {
  return (dispatch, getState) => {
    const { sites } = getState();
    const { selectedSites } = sites;
    if (isSelected) {
      if (!selectedSites || selectedSites.length === 0 || !selectedSites[data.id]) {
        const newSites = { ...selectedSites, [data.id]: data };
        dispatch(updateSelectedSites(newSites));
      }
    } else if (selectedSites[data.id]) {
      const newSites = selectedSites;
      delete newSites[data.id];
      dispatch(updateSelectedSites(newSites));
    }
  };
}

export function updateSelectedSites(selectedSites) {
  return {
    type: Types.UPDATE_SELECTED_SITES,
    selectedSites,
  };
}

export function loginSuccess(token, username) {
  return {
    type: Types.AUTHENTICATE_USER_SUCCESS,
    token,
    username,
  };
}

export function confiureSite(payload, isEdit = false) {
  return (dispatch) => {
    let url = API_CREATE_SITES;
    if (isEdit) {
      url = `${url}\\${payload.id}`;
    }
    const obj = createPayload(isEdit ? API_TYPES.PUT : API_TYPES.POST, { ...payload.configureSite });
    dispatch(showApplicationLoader('configuring-new-site', 'Configuring Site...'));
    return callAPI(url, obj).then((json) => {
      dispatch(hideApplicationLoader('configuring-new-site'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(addMessage('Site configuration successful', MESSAGE_TYPES.SUCCESS));
        dispatch(closeModal());
        fetchByDelay(dispatch, fetchSites, 2000);
      }
    },
    (err) => {
      alert(err);
    });
  };
}

export function deleteSites() {
  return (dispatch, getState) => {
    const { sites } = getState();
    const { selectedSites } = sites;
    const ids = Object.keys(selectedSites);
    const calls = [];
    ids.forEach((id) => {
      calls.push(dispatch(deleteSite(id)));
    });
  };
}

export function deleteSite(id) {
  return (dispatch) => {
    const url = API_DELETE_SITES.replace('<id>', id);
    const obj = createPayload(API_TYPES.DELETE, {});
    return callAPI(url, obj).then((json) => {
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(clearMessages());
        dispatch(addMessage('Site configuration deleted.', MESSAGE_TYPES.SUCCESS));
        fetchByDelay(dispatch, fetchSites, 2000);
        dispatch(closeModal());
      }
    },
    (err) => {
      dispatch(addMessage(err, MESSAGE_TYPES.ERROR));
    });
  };
}
