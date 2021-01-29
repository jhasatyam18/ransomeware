// import { addMessage, clearMessages } from './MessageActions';

import jsCookie from 'js-cookie';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import * as Types from '../../constants/actionTypes';
import { API_AUTHENTICATE, API_AWS_AVAILABILLITY_ZONES, API_AWS_RGIONS, API_GCP_AVAILABILLITY_ZONES, API_INFO } from '../../constants/ApiConstants';

import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { setCookie } from '../../utils/CookieUtils';
import { APPLICATION_API_TOKEN } from '../../constants/UserConstant';
import { addMessage, clearMessages } from './MessageActions';
import { onInit } from '../../utils/HistoryUtil';
import { APP_TYPE, PLATFORM_TYPES } from '../../constants/InputConstants';
import { fetchDRPlanById, fetchDrPlans } from './DrPlanActions';
import { JOBS, PROTECTION_PLANS_PATH, SITES_PATH } from '../../constants/RouterConstants';
import { fetchSites } from './SiteActions';
import { fetchRecoveryJobs, fetchReplicationJobs } from './JobActions';

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
        dispatch(getInfo());
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
export function changeAppType(appType) {
  return {
    type: Types.APP_TYPE,
    appType,
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
        const appType = (json.serviceType === 'Client' ? APP_TYPE.CLIENT : APP_TYPE.SERVER);
        dispatch(changeAppType(appType));
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

export function onPlatformTypeChange({ value }) {
  return (dispatch) => {
    if (value === PLATFORM_TYPES.AWS) {
      dispatch(fetchAwsRegion());
      dispatch(fetchAvailibilityZones(PLATFORM_TYPES.AWS));
    } else {
      dispatch(fetchAvailibilityZones(PLATFORM_TYPES.GCP));
    }
  };
}

export function fetchAwsRegion() {
  return (dispatch) => {
    dispatch(clearMessages());
    return callAPI(API_AWS_RGIONS)
      .then((json) => {
        if (json && json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          let data = json;
          if (data === null) {
            data = [];
          }
          dispatch(valueChange('ui.values.regions', data));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function fetchAvailibilityZones(type) {
  return (dispatch) => {
    const url = (type === PLATFORM_TYPES.AWS ? API_AWS_AVAILABILLITY_ZONES : API_GCP_AVAILABILLITY_ZONES);
    return callAPI(url)
      .then((json) => {
        if (json && json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          let data = json;
          if (data === null) {
            data = [];
          }
          dispatch(valueChange('ui.values.availabilityZones', data));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function refresh() {
  return (dispatch) => {
    const { location } = window;
    const { pathname } = location;
    switch (pathname) {
      case PROTECTION_PLANS_PATH:
        dispatch(fetchDrPlans());
        break;
      case SITES_PATH:
        dispatch(fetchSites());
        break;
      case JOBS:
        dispatch(fetchRecoveryJobs(0));
        dispatch(fetchReplicationJobs(0));
        break;
      case pathname.indexOf('/protection/plan/details') !== -1:
        dispatch(fetchDRPlanById(5));
        break;
      default:
        dispatch(addMessage('NO PATH MATCH', MESSAGE_TYPES.ERROR));
    }
  };
}
