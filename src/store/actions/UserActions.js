// import { addMessage, clearMessages } from './MessageActions';

import jsCookie from 'js-cookie';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import * as Types from '../../constants/actionTypes';
import { API_AUTHENTICATE, API_AWS_AVAILABILITY_ZONES, API_AWS_REGIONS, API_GCP_REGIONS, API_GCP_AVAILABILITY_ZONES, API_INFO, API_SCRIPTS } from '../../constants/ApiConstants';

import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { setCookie } from '../../utils/CookieUtils';
import { APPLICATION_API_TOKEN, APPLICATION_API_USER } from '../../constants/UserConstant';
import { addMessage, clearMessages } from './MessageActions';
import { onInit } from '../../utils/HistoryUtil';
import { APP_TYPE, PLATFORM_TYPES, STATIC_KEYS } from '../../constants/InputConstants';
import { fetchDRPlanById, fetchDrPlans } from './DrPlanActions';
import { fetchDashboardData } from './DashboardActions';
import { JOBS, PROTECTION_PLANS_PATH, SITES_PATH, DASHBOARD_PATH, ALERTS, EVENTS } from '../../constants/RouterConstants';
import { fetchSites } from './SiteActions';
import { fetchRecoveryJobs, fetchReplicationJobs } from './JobActions';
import { fetchByDelay } from '../../utils/SlowFetch';
import { fetchAlerts, getUnreadAlerts } from './AlertActions';
import { fetchEvents } from './EventActions';

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
        setCookie(APPLICATION_API_USER, username);
        dispatch(loginSuccess(json.token, username));
        dispatch(getInfo());
        if (history) {
          onInit(history);
        }
      }
    },
    (err) => {
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
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
export function changeAppType(appType, platformType = '') {
  return {
    type: Types.APP_TYPE,
    appType,
    platformType,
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
        setCookie(APPLICATION_API_USER, 'admin');
        const appType = json.serviceType === 'Client' ? APP_TYPE.CLIENT : APP_TYPE.SERVER;
        const { licenseType, isLicenseExpired, licenseExpiredTime, version, serviceType } = json;
        dispatch(changeAppType(appType, json.platformType));
        fetchByDelay(dispatch, updateLicenseInfo, 2000, { licenseType, isLicenseExpired, licenseExpiredTime, version, serviceType });
        dispatch(validateLicense(licenseExpiredTime));
        dispatch(getUnreadAlerts());
        if (history) {
          onInit(history);
        }
      }
    },
    (err) => {
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
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
      dispatch(fetchRegions(PLATFORM_TYPES.AWS));
      dispatch(fetchAvailibilityZones(PLATFORM_TYPES.AWS));
    } else {
      dispatch(fetchRegions(PLATFORM_TYPES.GCP));
      dispatch(fetchAvailibilityZones(PLATFORM_TYPES.GCP));
    }
  };
}

export function fetchRegions(TYPE) {
  return (dispatch) => {
    const url = (PLATFORM_TYPES.AWS === TYPE ? API_AWS_REGIONS : API_GCP_REGIONS);
    return callAPI(url)
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
    const url = (type === PLATFORM_TYPES.AWS ? API_AWS_AVAILABILITY_ZONES : API_GCP_AVAILABILITY_ZONES);
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
      case DASHBOARD_PATH:
        dispatch(fetchDashboardData());
        break;
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
      case ALERTS:
        dispatch(fetchAlerts());
        break;
      case EVENTS:
        dispatch(fetchEvents());
        break;
      default:
        dispatch(detailPathChecks(pathname));
    }
  };
}

export function detailPathChecks(pathname) {
  return (dispatch) => {
    if (pathname.indexOf('protection/plan/details') !== -1) {
      const pathArray = pathname.split('/');
      dispatch(fetchDRPlanById(pathArray[pathArray.length - 1]));
    }
    return null;
  };
}
export function fetchScript() {
  return (dispatch) => {
    const url = API_SCRIPTS;
    return callAPI(url)
      .then((json) => {
        if (json && json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          const data = json;
          dispatch(valueChange(STATIC_KEYS.UI_SCRIPT_PRE, data.preScripts));
          dispatch(valueChange(STATIC_KEYS.UI_SCRIPT_POST, data.postScripts));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function updateLicenseInfo(license) {
  return {
    type: Types.APP_LICENSE_INFO,
    license,
  };
}

export function validateLicense(licenseExpiredTime) {
  return (dispatch) => {
    const today = new Date();
    const eDate = new Date(licenseExpiredTime * 1000);
    const diff = Math.ceil(eDate - today);
    const difference = 691100000;
    if (difference > diff) {
      dispatch(addMessage('There is expired or expiring license. Please check about info for more details.', MESSAGE_TYPES.WARNING, true));
    }
  };
}
