// import { addMessage, clearMessages } from './MessageActions';
import jsCookie from 'js-cookie';
import * as Types from '../../constants/actionTypes';
import { API_AUTHENTICATE, API_AWS_AVAILABILITY_ZONES, API_AWS_REGIONS, API_CHANGE_PASSWORD, API_GCP_AVAILABILITY_ZONES, API_GCP_REGIONS, API_INFO, API_SCRIPTS } from '../../constants/ApiConstants';
import { APP_TYPE, PLATFORM_TYPES, STATIC_KEYS } from '../../constants/InputConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { ALERTS_PATH, DASHBOARD_PATH, EMAIL_SETTINGS_PATH, EVENTS_PATH, JOBS_RECOVERY_PATH, JOBS_REPLICATION_PATH, LICENSE_SETTINGS_PATH, NODES_PATH, PROTECTION_PLANS_PATH, SITES_PATH, SUPPORT_BUNDLE_PATH } from '../../constants/RouterConstants';
import { APPLICATION_API_TOKEN, APPLICATION_API_USER } from '../../constants/UserConstant';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { setCookie } from '../../utils/CookieUtils';
import { onInit } from '../../utils/HistoryUtil';
import { getValue } from '../../utils/InputUtils';
import { fetchByDelay } from '../../utils/SlowFetch';
import { fetchAlerts, getUnreadAlerts } from './AlertActions';
import { fetchDashboardData } from './DashboardActions';
import { fetchDRPlanById, fetchDrPlans } from './DrPlanActions';
import { fetchEmailConfig, fetchEmailRecipients } from './EmailActions';
import { fetchEvents } from './EventActions';
import { fetchRecoveryJobs, fetchReplicationJobs } from './JobActions';
import { fetchLicenses } from './LicenseActions';
import { addMessage, clearMessages } from './MessageActions';
import { fetchNodes } from './NodeActions';
import { fetchSites } from './SiteActions';
import { fetchSupportBundles } from './SupportActions';

export function login({ username, password, history }) {
  return (dispatch) => {
    dispatch(loginRequest());
    // dispatch(clearMessages());
    const obj = createPayload(API_TYPES.POST, { username, password });
    return callAPI(API_AUTHENTICATE, obj).then((json) => {
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        if (username === 'admin' && password === 'admin') {
          dispatch(saveApplicationToken(json.token));
          dispatch(initChangePassword(true, false));
          return;
        }
        setSessionInfo(json.token, username);
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
export function changeAppType(appType, platformType = '', localVMIP = '', zone = '') {
  return {
    type: Types.APP_TYPE,
    appType,
    platformType,
    localVMIP,
    zone,
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
        const { version, serviceType, nodeKey, licenses } = json;
        dispatch(changeAppType(appType, json.platformType, json.localVMIP, json.zone));
        fetchByDelay(dispatch, updateLicenseInfo, 2000, { nodeKey, version, serviceType, activeLicenses: licenses });
        // dispatch(validateLicense(licenseExpiredTime));
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
    dispatch(valueChange('configureSite.node', ''));
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
      case JOBS_REPLICATION_PATH:
        dispatch(fetchReplicationJobs(0));
        break;
      case JOBS_RECOVERY_PATH:
        dispatch(fetchRecoveryJobs(0));
        break;
      case ALERTS_PATH:
        dispatch(fetchAlerts());
        break;
      case EVENTS_PATH:
        dispatch(fetchEvents());
        break;
      case LICENSE_SETTINGS_PATH:
        dispatch(fetchLicenses());
        break;
      case SUPPORT_BUNDLE_PATH:
        dispatch(fetchSupportBundles());
        break;
      case NODES_PATH:
        dispatch(fetchNodes());
        break;
      case EMAIL_SETTINGS_PATH:
        dispatch(fetchEmailConfig());
        dispatch(fetchEmailRecipients());
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

export function initChangePassword(passwordChangeReq, allowCancel) {
  return {
    type: Types.APP_USER_CHANGE_PASSWORD,
    passwordChangeReq,
    allowCancel,
  };
}

export function saveApplicationToken(token) {
  return {
    type: Types.AUTHENTICATE_USER_SUCCESS_PARTIAL,
    token,
  };
}

export function setSessionInfo(token, username) {
  setCookie(APPLICATION_API_TOKEN, token);
  setCookie(APPLICATION_API_USER, username);
}

export function changeUserPassword(oldPass, newPass) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { token } = user;
    dispatch(showApplicationLoader('CHANGE_PASSWORD', 'Changing password...'));
    const obj = createPayload(API_TYPES.PUT, { username: 'admin', oldPassword: oldPass, newPassword: newPass, id: 1 });
    return callAPI(API_CHANGE_PASSWORD, obj, token).then((json) => {
      dispatch(hideApplicationLoader('CHANGE_PASSWORD'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(logOutUser());
        window.location.reload();
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('CHANGE_PASSWORD'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

export function removeNicConfig(networkKey, index) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const nicCards = getValue(networkKey, values);
    if (nicCards && nicCards.length >= 2) {
      const newNicCards = [];
      nicCards.forEach((nic, i) => {
        if (i !== index) {
          newNicCards.push(nic);
        }
      });
      dispatch(valueChange(networkKey, newNicCards));
    }
  };
}

export function onAwsStorageTypeChange({ value, fieldKey }) {
  return (dispatch) => {
    if (value === 'gp2') {
      const keys = fieldKey.split('.');
      const iopsKey = `${keys.slice(0, keys.length - 1).join('.')}.volumeIOPS`;
      dispatch(valueChange(iopsKey, '0'));
    }
  };
}
