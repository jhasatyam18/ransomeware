// import { addMessage, clearMessages } from './MessageActions';

import jsCookie from 'js-cookie';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import * as Types from '../../constants/actionTypes';
import { API_AUTHENTICATE, API_INFO } from '../../constants/ApiConstants';

import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { setCookie } from '../../utils/CookieUtils';
import { APPLICATION_API_TOKEN } from '../../constants/UserConstant';
import { addMessage, clearMessages } from './MessageActions';
import { onInit } from '../../utils/HistoryUtil';

export function login({ username, password, history }) {
  return (dispatch) => {
    dispatch(loginRequest());
    // dispatch(clearMessages());
    const obj = createPayload(API_TYPES.POST, { username, password });
    return callAPI(API_AUTHENTICATE, obj).then((json) => {
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        setCookie(APPLICATION_API_TOKEN, json.token);
        dispatch(loginSuccess(json.token, username));
        dispatch(clearMessages());
        if (history) {
          onInit(history);
        }
      }
    },
    (err) => {
      alert(err);
    });
  };
}
export function loginRequest() {
  return {
    type: Types.AUTHENTICATE_USER_REQUEST,
  };
}

export function loginSuccess(token, username) {
  return {
    type: Types.AUTHENTICATE_USER_SUCCESS,
    token,
    username,
  };
}

export function loginFailed() {
  return {
    type: Types.AUTHENTICATE_USER_FAILED,
  };
}

export function logOutUser() {
  jsCookie.remove(APPLICATION_API_TOKEN);
  return {
    type: Types.AUTHENTICATE_USER_FAILED,
  };
}

export function valueChange(key, value) {
  return {
    type: Types.VALUE_CHANGE,
    key,
    value,
  };
}

export function addErrorMessage(key, message) {
  return {
    type: Types.ADD_ERROR_MESSAGE,
    key,
    message,
  };
}

export function removeErrorMessage(key) {
  return {
    type: Types.DELETE_ERROR_MESSAGE,
    key,
  };
}
export function getInfo(history) {
  return (dispatch) => {
    dispatch(clearMessages());
    return callAPI(API_INFO).then((json) => {
      if (json.hasError) {
        setCookie(APPLICATION_API_TOKEN, json.token, '');
      } else {
        dispatch(loginSuccess(json.token, 'admin'));
        dispatch(clearMessages());
        if (history) {
          onInit(history);
        }
      }
    },
    (err) => {
      alert(err);
    });
  };
}
export function clearValues() {
  return {
    type: Types.CLEAR_VALUES,
  };
}

export function showApplicationLoader(key, value) {
  return {
    type: Types.ADD_KEY_TO_APPLICATION_LOADER, key, value,
  };
}
export function hideApplicationLoader(key) {
  return {
    type: Types.REMOVE_KEY_FROM_APPLICATION_LOADER, key,
  };
}
