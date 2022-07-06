import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import * as Types from '../../constants/actionTypes';
import { API_AWS_AVAILABILITY_ZONES, API_FETCH_VMWARE_INVENTORY, API_CREATE_SITES, API_DELETE_SITES, API_FETCH_SITES, API_FETCH_SITE_VMS, API_GCP_AVAILABILITY_ZONES, API_SITE_NETWORKS, API_SITE_NETWORKS_ZONE } from '../../constants/ApiConstants';
import { addMessage } from './MessageActions';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { closeModal } from './ModalActions';
import { hideApplicationLoader, showApplicationLoader, valueChange } from './UserActions';
import { fetchByDelay } from '../../utils/SlowFetch';
import { getValue, isPlanWithSamePlatform } from '../../utils/InputUtils';
import { PLATFORM_TYPES, STATIC_KEYS } from '../../constants/InputConstants';
import { setRecoveryVMDetails } from './DrPlanActions';

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
        dispatch(hideApplicationLoader('Fetching'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
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
      dispatch(hideApplicationLoader('configuring-new-site'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
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
    dispatch(showApplicationLoader(url, 'Deleting site...'));
    return callAPI(url, obj).then((json) => {
      dispatch(hideApplicationLoader(url));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(addMessage('Site configuration deleted.', MESSAGE_TYPES.SUCCESS));
        fetchByDelay(dispatch, fetchSites, 2000);
        dispatch(closeModal());
      }
    },
    (err) => {
      dispatch(hideApplicationLoader(url));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

export function onProtectSiteChange({ value }) {
  return (dispatch, getState) => {
    if (value === '') {
      dispatch(valueChange('ui.site.vms', []));
      return;
    }
    const { user } = getState();
    const { values } = user;
    const platfromType = getValue('ui.values.sites', values).filter((site) => `${site.id}` === `${value}`)[0].platformDetails.platformType;
    dispatch(valueChange('ui.values.protectionPlatform', platfromType));
    dispatch(valueChange('ui.values.protectionSiteID', value));
    const url = (platfromType === PLATFORM_TYPES.VMware) ? API_FETCH_VMWARE_INVENTORY.replace('<id>', value) : API_FETCH_SITE_VMS.replace('<id>', value);
    dispatch(showApplicationLoader(url, 'Loading virtual machines'));
    return callAPI(url)
      .then((json) => {
        dispatch(hideApplicationLoader(url));
        if (json && json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          let data = json;
          if (data === null) {
            data = [];
          }
          if (platfromType === PLATFORM_TYPES.VMware && data !== null) {
            const convertedData = [];
            // TODO
            data.forEach((d) => {
              const node = {};
              node.doneChildrenLoading = false;
              node.key = d.id;
              node.type = d.type;
              node.value = d.id;
              node.children = [];
              node.title = d.name;
              convertedData.push(node);
            });
            dispatch(valueChange('ui.drplan.vms.location', convertedData));
            dispatch(valueChange('ui.site.vms.data', convertedData));
            return;
          }
          dispatch(valueChange('ui.site.vms', data));
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(url));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function onRecoverSiteChange({ value, availZone }) {
  return (dispatch, getState) => {
    if (value === '') {
      dispatch(valueChange('ui.values.instances', []));
      return;
    }
    const { user } = getState();
    const { values } = user;
    const recoverySite = getValue('ui.values.sites', values).filter((site) => `${site.id}` === `${value}`)[0];
    const { platformType } = { ...recoverySite.platformDetails };
    dispatch(fetchNetworks(value, undefined, availZone));
    dispatch(valueChange('ui.values.recoveryPlatform', platformType));
    dispatch(valueChange('ui.values.recoverySiteID', value));
  };
}

export function updateAvailabilityZones({ value }) {
  return (dispatch, getState) => {
    if (value === '') {
      dispatch(valueChange('ui.values.availabilityZones', []));
      return;
    }
    const { user } = getState();
    const { values } = user;
    const data = getValue('ui.values.regions', values);
    const zones = data.filter((item) => item.value === value);
    dispatch(valueChange('ui.values.availabilityZones', (zones[0] ? zones[0].zones : [])));
  };
}

export function fetchAvailibilityZones({ value }) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const platfromType = getValue('ui.values.sites', values).filter((site) => `${site.id}` === `${value}`)[0].platformDetails.platformType;
    const url = (platfromType === PLATFORM_TYPES.AWS ? API_AWS_AVAILABILITY_ZONES : API_GCP_AVAILABILITY_ZONES);
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
        dispatch(setRecoveryVMDetails(data[primaryKey]));
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
        if (!(typeof vm.isDisabled !== 'undefined' && vm.isDisabled === true)) {
          selectedVMs = { ...selectedVMs, [vm.moref]: vm };
          dispatch(setRecoveryVMDetails(vm.moref));
        }
      });
      dispatch(valueChange('ui.site.seletedVMs', selectedVMs));
    } else {
      dispatch(valueChange('ui.site.seletedVMs', selectedVMs));
    }
  };
}

export function fetchNetworks(id, sourceNet = undefined, availZone) {
  return (dispatch) => {
    dispatch(showApplicationLoader('FETCHING_SITE_NETWORK', 'Loading network info...'));
    let url = API_SITE_NETWORKS.replace('<id>', id);
    if (typeof availZone !== 'undefined' && availZone !== '') {
      url += API_SITE_NETWORKS_ZONE.replace('<zone>', availZone);
    }
    return callAPI(url)
      .then((json) => {
        dispatch(hideApplicationLoader('FETCHING_SITE_NETWORK'));
        if (json && json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          const data = json;
          if (data.instanceTypes) {
            const insTypes = [];
            data.instanceTypes.forEach((t) => {
              insTypes.push({ value: t.value, label: t.name });
            });
            dispatch(valueChange('ui.values.instances', insTypes));
          }
          if (typeof sourceNet !== 'undefined') {
            dispatch(valueChange(STATIC_KEYS.UI_SECURITY_GROUPS_SOURCE, (data.securityGroups ? data.securityGroups : [])));
            dispatch(valueChange(STATIC_KEYS.UI_SUBNETS__SOURCE, (data.subnets ? data.subnets : [])));
            return;
          }
          dispatch(valueChange(STATIC_KEYS.UI_SECURITY_GROUPS, (data.securityGroups ? data.securityGroups : [])));
          dispatch(valueChange(STATIC_KEYS.UI_SUBNETS, (data.subnets ? data.subnets : [])));
          dispatch(valueChange(STATIC_KEYS.UI_RESERVE_IPS, (data.ipAddress ? data.ipAddress : [])));
          dispatch(valueChange(STATIC_KEYS.UI_VPC_TARGET, (data.networks ? data.networks : [])));
          if (data.volumeTypes) {
            const volumetype = [];
            data.volumeTypes.forEach((d) => {
              volumetype.push({ label: d.name, value: d.value });
            });
            dispatch(valueChange(STATIC_KEYS.UI_VOLUMETYPES, volumetype));
          }
          // for aws push zone names
          const zones = [];
          if (data.subnets) {
            data.subnets.forEach((sub) => {
              if (sub.zone !== '' && typeof sub.zone !== 'undefined') {
                const hasElement = zones.some((z) => z.value === sub.zone);
                if (!hasElement) {
                  zones.push({ label: sub.zone, value: sub.zone });
                }
              }
            });
          }
          dispatch(valueChange(STATIC_KEYS.UI_AVAILABILITY_ZONES, zones));
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('FETCHING_SITE_NETWORK'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function postPlanSitesSelected() {
  return (dispatch, getState) => {
    const { user } = getState();
    if (isPlanWithSamePlatform(user)) {
      const protectionID = getValue('ui.values.protectionSiteID', user.values);
      dispatch(fetchNetworks(protectionID, 'source_network'));
    } else {
      const recoveryID = getValue('ui.values.recoverySiteID', user.values);
      const zone = getValue('ui.values.sites', user.values).filter((site) => `${site.id}` === `${recoveryID}`)[0].platformDetails.availZone;
      dispatch(fetchNetworks(recoveryID, undefined, zone));
    }
  };
}
