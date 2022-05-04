// import { addMessage, clearMessages } from './MessageActions';
import jsCookie from 'js-cookie';
import * as Types from '../../constants/actionTypes';
import { API_AUTHENTICATE, API_AWS_AVAILABILITY_ZONES, API_AWS_REGIONS, API_CHANGE_PASSWORD, API_GCP_AVAILABILITY_ZONES, API_GCP_REGIONS, API_INFO, API_SCRIPTS, API_USERS, API_USER_PRIVILEGES, API_USER_SCRIPT } from '../../constants/ApiConstants';
import { APP_TYPE, PLATFORM_TYPES, STATIC_KEYS } from '../../constants/InputConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { ALERTS_PATH, EMAIL_SETTINGS_PATH, EVENTS_PATH, JOBS_RECOVERY_PATH, JOBS_REPLICATION_PATH, LICENSE_SETTINGS_PATH, NODES_PATH, PROTECTION_PLANS_PATH, SITES_PATH, SUPPORT_BUNDLE_PATH, THROTTLING_SETTINGS_PATH } from '../../constants/RouterConstants';
import { APPLICATION_API_TOKEN, APPLICATION_API_USER, APPLICATION_API_USER_ID } from '../../constants/UserConstant';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { getCookie, setCookie } from '../../utils/CookieUtils';
import { onInit } from '../../utils/HistoryUtil';
import { getValue, isAWSCopyNic, isPlanWithSamePlatform } from '../../utils/InputUtils';
import { fetchByDelay } from '../../utils/SlowFetch';
import { getUnreadAlerts } from './AlertActions';
import { fetchDRPlanById, fetchDrPlans } from './DrPlanActions';
import { fetchEmailConfig, fetchEmailRecipients } from './EmailActions';
import { fetchLicenses } from './LicenseActions';
import { addMessage, clearMessages } from './MessageActions';
import { closeModal, openModal } from './ModalActions';
import { fetchNodes } from './NodeActions';
import { fetchSites } from './SiteActions';
import { fetchSupportBundles } from './SupportActions';
import { fetchBandwidthConfig, fetchBandwidthReplNodes } from './ThrottlingAction';
import { MODAL_USER_SCRIPT } from '../../constants/Modalconstant';
import { fetchRecoveryJobs, fetchReplicationJobs } from './JobActions';

export function refreshApplication() {
  return {
    type: Types.APP_REFRESH,
  };
}

export function login({ username, password, history }) {
  return (dispatch) => {
    dispatch(loginRequest());
    // dispatch(clearMessages());
    const obj = createPayload(API_TYPES.POST, { username, password });
    return callAPI(API_AUTHENTICATE, obj).then((json) => {
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        setSessionInfo(json.token, username);
        dispatch(getUserInfo());
        if (password === 'admin') {
          dispatch(saveApplicationToken(json.token));
          dispatch(initChangePassword(true, false));
          return;
        }
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
        dispatch(loginSuccess(json.token, getCookie(APPLICATION_API_USER)));
        const appType = json.serviceType === 'Client' ? APP_TYPE.CLIENT : APP_TYPE.SERVER;
        const { version, serviceType, nodeKey, licenses } = json;
        dispatch(changeAppType(appType, json.platformType, json.localVMIP, json.zone));
        fetchByDelay(dispatch, updateLicenseInfo, 2000, { nodeKey, version, serviceType, activeLicenses: licenses });
        // dispatch(validateLicense(licenseExpiredTime));
        dispatch(getUnreadAlerts());
        dispatch(getUserInfo());
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
    if (value === '') return;
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
    // dispatch refreshAction to notify selector component
    dispatch(refreshApplication());
    switch (pathname) {
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
        // dispatch(fetchAlerts());
        break;
      case EVENTS_PATH:
        // dispatch(fetchEvents());
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
      case THROTTLING_SETTINGS_PATH:
        dispatch(fetchBandwidthConfig());
        dispatch(fetchBandwidthReplNodes());
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

export function fetchScript(fieldKey, name) {
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
          if (fieldKey && name) {
            dispatch(valueChange(fieldKey, name));
          }
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
    const uID = getCookie(APPLICATION_API_USER_ID);
    const obj = createPayload(API_TYPES.PUT, { username: getCookie(APPLICATION_API_USER), oldPassword: oldPass, newPassword: newPass });
    return callAPI(API_CHANGE_PASSWORD.replace('<id>', uID), obj, token).then((json) => {
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

export function onAwsPublicIPChecked({ value, fieldKey }) {
  return (dispatch) => {
    if (value) {
      const networkKey = fieldKey.replace('isPublic', 'network');
      const publicIPKey = fieldKey.replace('isPublic', 'publicIP');
      dispatch(valueChange(networkKey, ''));
      dispatch(valueChange(publicIPKey, ''));
    }
  };
}

export function addAssociatedReverseIP({ fieldKey, ip, id }) {
  return (dispatch, getState) => {
    if (typeof ip === 'undefined' || ip === '' || typeof id === 'undefined') {
      return;
    }
    const { user } = getState();
    const { values } = user;
    let ips = getValue(STATIC_KEYS.UI_ASSOCIATED_RESERVE_IPS, values) || {};
    const hasKey = Object.keys(ips).filter((key) => ips[key].ip === ip);
    if (hasKey.length === 0) {
      ips = { ...ips, [ip]: { label: ip, value: id, fieldKey } };
      dispatch(valueChange(STATIC_KEYS.UI_ASSOCIATED_RESERVE_IPS, ips));
    }
  };
}

export function onGCPNetworkChange({ fieldKey }) {
  return (dispatch) => {
    if (fieldKey) {
      const subnetFieldKey = fieldKey.replace('-network', '-subnet');
      dispatch(valueChange(subnetFieldKey, ''));
    }
  };
}

export function setPrivileges(privileges) {
  return {
    type: Types.APP_USER_PRIVILEGES,
    privileges,
  };
}

export function getUserInfo() {
  return (dispatch) => {
    const username = getCookie(APPLICATION_API_USER);
    if (typeof username === 'undefined') {
      dispatch(logOutUser());
      return;
    }
    const url = `${API_USERS}?name=${username}`;
    dispatch(showApplicationLoader(url, 'Loading...'));
    return callAPI(url).then((json) => {
      dispatch(hideApplicationLoader(url));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        if (json && json.length >= 1) {
          setCookie(APPLICATION_API_USER_ID, json[0].id);
          dispatch(getUserPrivileges(json[0].id));
          return;
        }
        dispatch(addMessage('Failed to fetch user details', MESSAGE_TYPES.ERROR));
        dispatch(logOutUser());
      }
    },
    (err) => {
      dispatch(hideApplicationLoader(url));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

export function getUserPrivileges(id) {
  return (dispatch) => {
    const url = API_USER_PRIVILEGES.replace('<id>', id);
    dispatch(showApplicationLoader(API_USER_PRIVILEGES, 'Loading...'));
    return callAPI(url).then((json) => {
      dispatch(hideApplicationLoader(API_USER_PRIVILEGES));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(setPrivileges(json));
      }
    },
    (err) => {
      dispatch(hideApplicationLoader(API_USER_PRIVILEGES));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

export function deleteScript(id) {
  return (dispatch) => {
    dispatch(showApplicationLoader(API_USER_SCRIPT, 'Removing script...'));
    const obj = createPayload(API_TYPES.DELETE, {});
    return callAPI(`${API_USER_SCRIPT}/${id}`, obj)
      .then((json) => {
        dispatch(hideApplicationLoader(API_USER_SCRIPT));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(addMessage('Script deleted successfully', MESSAGE_TYPES.INFO));
          dispatch(refreshApplication());
          dispatch(closeModal());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(API_USER_SCRIPT));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function onScriptChange({ value, fieldKey }) {
  return (dispatch) => {
    if (value === '+NEW_SCRIPT') {
      dispatch(valueChange(fieldKey, ''));
      dispatch(openModal(MODAL_USER_SCRIPT, { title: 'Script', data: { fieldKey } }));
    }
  };
}

export function onAwsCopyNetConfigChange({ value, fieldKey }) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    if (!fieldKey) {
      return;
    }
    const networkKey = fieldKey.replace('-isFromSource', '');
    if (!value) {
      // reset all the values
      dispatch(valueChange(`${networkKey}-subnet`, ''));
      dispatch(valueChange(`${networkKey}-availZone`, ''));
      dispatch(valueChange(`${networkKey}-isPublic`, false));
      dispatch(valueChange(`${networkKey}-securityGroups`, ''));
      dispatch(valueChange(`${networkKey}-network`, ''));
      dispatch(valueChange(`${networkKey}-privateIP`, ''));
    } else {
      // set the source VM values
      const keys = fieldKey.split('-');
      if (keys.length > 3) {
        // nic index
        const index = keys[keys.length - 2];
        const vmKey = `${keys[0]}-${keys[1]}`;
        const selectedVMS = getValue('ui.site.seletedVMs', values);
        Object.keys(selectedVMS).forEach((key) => {
          if (vmKey === key) {
            const nics = selectedVMS[key].virtualNics;
            if (nics && nics.length >= index) {
              const nic = nics[index];
              dispatch(valueChange(`${networkKey}-subnet`, nic.Subnet));
              dispatch(valueChange(`${networkKey}-isPublic`, nic.isPublicIP));
              dispatch(valueChange(`${networkKey}-privateIP`, nic.privateIP));
              if (nic.securityGroups) {
                const sgp = nic.securityGroups.split(',');
                dispatch(valueChange(`${networkKey}-securityGroups`, sgp));
              }
            }
          }
        });
      }
    }
  };
}

/**
 * AWS Network subnet change
 * Set the subnet zone value
 * @param value value of the subnet
 * @param fieldKey field key for which value is changed
 */
export function onAwsSubnetChange({ value, fieldKey }) {
  return (dispatch, getState) => {
    if (value) {
      const { user } = getState();
      const { values } = user;
      let isCopyConfiguration = false;
      if (fieldKey && isPlanWithSamePlatform(user)) {
        isCopyConfiguration = isAWSCopyNic(fieldKey, '-subnet', user);
      }
      const dataSourceKey = (isCopyConfiguration === true ? STATIC_KEYS.UI_SUBNETS__SOURCE : STATIC_KEYS.UI_SUBNETS);
      const subnets = getValue(dataSourceKey, values) || [];
      for (let s = 0; s < subnets.length; s += 1) {
        if (subnets[s].id === value) {
          const availZoneKey = fieldKey.replace('-subnet', '-availZone');
          dispatch(valueChange(availZoneKey, subnets[s].zone));
        }
      }
    }
  };
}

/**
 * AWS Network VPC change
 * Set the subnet zone and sg value
 * @param value value of the subnet
 * @param fieldKey field key for which value is changed
 */
export function onAwsVPCChange({ value, fieldKey }) {
  return (dispatch) => {
    if (value) {
      const key = fieldKey.split('-');
      const networkKey = key.slice(0, key.length - 1).join('-');
      dispatch(valueChange(`${networkKey}-isFromSource`, false));
      dispatch(valueChange(`${networkKey}-subnet`, ''));
      dispatch(valueChange(`${networkKey}-availZone`, ''));
      dispatch(valueChange(`${networkKey}-isPublic`, false));
      dispatch(valueChange(`${networkKey}-privateIP`, ''));
      dispatch(valueChange(`${networkKey}-securityGroups`, ''));
      dispatch(valueChange(`${networkKey}-network`, ''));
    }
  };
}
