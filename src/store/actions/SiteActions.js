// import { addMessage, clearMessages } from './MessageActions';

import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import * as Types from '../../constants/actionTypes';
import { API_AWS_AVAILABILLITY_ZONES, API_AWS_INSTANCES, API_CREATE_SITES, API_DELETE_SITES, API_FETCH_SITES, API_FETCH_SITE_VMS, API_GCP_AVAILABILLITY_ZONES, API_GCP_INSTANCES, API_SITE_NETWORKS } from '../../constants/ApiConstants';
import { addMessage } from './MessageActions';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { closeModal } from './ModalActions';
import { hideApplicationLoader, showApplicationLoader, valueChange } from './UserActions';
import { fetchByDelay } from '../../utils/SlowFetch';
import { getValue } from '../../utils/InputUtils';
import { PLATFORM_TYPES, STATIC_KEYS } from '../../constants/InputConstants';

export function fetchSites(key) {
  return (dispatch) => {
    dispatch(showApplicationLoader('Fetching', 'Loading configured sites'));
    return callAPI(API_FETCH_SITES)
      .then((json) => {
        dispatch(hideApplicationLoader('Fetching'));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(sitesFetched(json));
          if (key) {
            dispatch(valueChange(key, json));
          }
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

export function onProtectSiteChange({ value }) {
  return (dispatch) => {
    const url = API_FETCH_SITE_VMS.replace('<id>', value);
    return callAPI(url)
      .then((json) => {
        if (json && json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          let data = json;
          if (data === null) {
            data = [];
          }
          dispatch(valueChange('ui.site.vms', data));
        }
      },
      (err) => {
        alert(err);
      });
  };
}

export function onRecoverSiteChange({ value }) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const platfromType = getValue('ui.values.sites', values).filter((site) => `${site.id}` === `${value}`)[0].platformDetails.platformType;
    const url = (platfromType === PLATFORM_TYPES.AWS ? API_AWS_INSTANCES : API_GCP_INSTANCES);
    dispatch(fetchAvailibilityZones({ value }));
    dispatch(fetchNetworks(value));
    return callAPI(url)
      .then((json) => {
        if (json && json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          let data = json;
          if (data === null) {
            data = [];
          }
          dispatch(valueChange('ui.values.instances', data));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function fetchAvailibilityZones({ value }) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const platfromType = getValue('ui.values.sites', values).filter((site) => `${site.id}` === `${value}`)[0].platformDetails.platformType;
    const url = (platfromType === PLATFORM_TYPES.AWS ? API_AWS_AVAILABILLITY_ZONES : API_GCP_AVAILABILLITY_ZONES);
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

export function selectAllSites(value) {
  return (dispatch, getState) => {
    const { sites } = getState();
    if (value) {
      let newSites = {};
      sites.sites.forEach((key) => {
        newSites = { ...newSites, [key.id]: key };
      });
      dispatch(updateSelectedSites(newSites));
    } else {
      dispatch(updateSelectedSites([]));
    }
  };
}

export function handleSiteTableSelection(data, isSelected, primaryKey) {
  return (dispatch, getState) => {
    const { sites } = getState();
    const { selectedSites } = sites;
    if (isSelected) {
      if (!selectedSites || selectedSites.length === 0 || !selectedSites[data[primaryKey]]) {
        const newSites = { ...selectedSites, [data[primaryKey]]: data };
        dispatch(updateSelectedSites(newSites));
      }
    } else if (selectedSites[data[primaryKey]]) {
      const newSites = selectedSites;
      delete newSites[data[primaryKey]];
      dispatch(updateSelectedSites(newSites));
    }
  };
}

export function handleProtectVMSeletion(data, isSelected, primaryKey) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    let selectedVMs = getValue('ui.site.seletedVMs', values);
    if (!selectedVMs) {
      selectedVMs = {};
    }
    if (isSelected) {
      if (!selectedVMs || selectedVMs.length === 0 || !selectedVMs[data[primaryKey]]) {
        const newVMs = { ...selectedVMs, [data[primaryKey]]: data };
        dispatch(valueChange('ui.site.seletedVMs', newVMs));
      }
    } else if (selectedVMs[data[primaryKey]]) {
      const newVMs = selectedVMs;
      delete newVMs[data[primaryKey]];
      dispatch(valueChange('ui.site.seletedVMs', newVMs));
    }
  };
}

export function handleSelectAllRecoveryVMs(value) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const data = getValue('ui.recovery.vms', values);
    let selectedVMs = {};
    if (value) {
      data.forEach((vm) => {
        selectedVMs = { ...selectedVMs, [vm.moref]: vm };
      });
      dispatch(valueChange('ui.site.seletedVMs', selectedVMs));
    } else {
      dispatch(valueChange('ui.site.seletedVMs', selectedVMs));
    }
  };
}

export function fetchNetworks(id) {
  return (dispatch) => {
    dispatch(showApplicationLoader('FETCHING_SITE_NETWORK', 'Loading network info...'));
    const url = API_SITE_NETWORKS.replace('<id>', id);
    return callAPI(url)
      .then((json) => {
        dispatch(hideApplicationLoader('FETCHING_SITE_NETWORK'));
        if (json && json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          const data = json;
          dispatch(valueChange(STATIC_KEYS.UI_SECURITY_GROUPS, (data.securityGroups ? data.securityGroups : [])));
          dispatch(valueChange(STATIC_KEYS.UI_SUBNETS, (data.subnets ? data.subnets : [])));
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('FETCHING_SITE_SUBNET'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}
