import * as Types from '../../constants/actionTypes';
import { API_AWS_AVAILABILITY_ZONES, API_AZURE_AVAILIBITY_ZONES, API_CREATE_SITES, API_DELETE_SITES, API_FETCH_SITES, API_FETCH_SITE_VMS, API_FETCH_VMWARE_INVENTORY, API_GCP_AVAILABILITY_ZONES, API_SITE_NETWORKS } from '../../constants/ApiConstants';
import { CHECKPOINT_TYPE, PLATFORM_TYPES, STATIC_KEYS, UI_WORKFLOW } from '../../constants/InputConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { STORE_KEYS } from '../../constants/StoreKeyConstants';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { getMatchingFirmwareType, getMatchingOSType, getValue } from '../../utils/InputUtils';
import { fetchByDelay } from '../../utils/SlowFetch';
import { fetchAvailibilityZonesForAzure } from './AzureAction';
import { setRecoveryVMDetails } from './DrPlanActions';
import { addMessage } from './MessageActions';
import { closeModal } from './ModalActions';
import { fetchRegions, hideApplicationLoader, loadRecoveryLocationData, showApplicationLoader, valueChange } from './UserActions';

export function fetchSites(key, setProtectionPlatform) {
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
          if (setProtectionPlatform) {
            dispatch(addProtectionSiteId(json));
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

function addProtectionSiteId(json) {
  return (dispatch) => {
    for (let j = 0; j < json.length; j += 1) {
      if (json[j].node.isLocalNode) {
        dispatch(onProtectSiteChange({ value: json[j].id }));
        break;
      }
    }
  };
}

export function confiureSite(payload, isEdit = false) {
  return (dispatch) => {
    let url = API_CREATE_SITES;
    if (isEdit) {
      url = `${url}/${payload.id}`;
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
    dispatch(valueChange('drplan.protectedSite', value));
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

export function onRecoverSiteChange({ value }) {
  return (dispatch, getState) => {
    if (value === '') {
      dispatch(valueChange('ui.values.instances', []));
      return;
    }
    const { user } = getState();
    const { values } = user;
    const recoverySite = getValue('ui.values.sites', values).filter((site) => `${site.id}` === `${value}`)[0];
    const { platformType } = { ...recoverySite.platformDetails };
    dispatch(valueChange('ui.values.recoveryPlatform', platformType));
    dispatch(fetchRegions(platformType));
    dispatch(valueChange('ui.values.recoverySiteID', value));
    if (PLATFORM_TYPES.VMware === platformType) {
      dispatch(loadRecoveryLocationData(value));
    }
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
export function fetchAvailibilityZones(type) {
  return (dispatch) => {
    let url = (type === PLATFORM_TYPES.AWS ? API_AWS_AVAILABILITY_ZONES : API_GCP_AVAILABILITY_ZONES);
    if (PLATFORM_TYPES.Azure === type) {
      url = API_AZURE_AVAILIBITY_ZONES;
    }
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
    let selectedVMs = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
    const recoveryPath = getValue(STATIC_KEYS.UI_CHECKPOINT_RECOVERY_TYPE, values);
    // Recovery checkpoint based on point-in-time is already set for recovery on Commn checkpoint changes
    if (!selectedVMs) {
      selectedVMs = {};
    }
    if (isSelected) {
      if (!selectedVMs || selectedVMs.length === 0 || !selectedVMs[data[primaryKey]]) {
        const newVMs = { ...selectedVMs, [data[primaryKey]]: data };
        dispatch(valueChange(`${data[primaryKey]}-vmConfig.general.guestOS`, getMatchingOSType(data.guestOS)));
        dispatch(valueChange(`${data[primaryKey]}-vmConfig.general.firmwareType`, getMatchingFirmwareType(data.firmwareType)));
        dispatch(valueChange(`${data[primaryKey]}-vmConfig.recovery.status`, data.recoveryStatus));
        if (recoveryPath === CHECKPOINT_TYPE.POINT_IN_TIME) {
          const plan = getValue(STORE_KEYS.UI_CHECKPOINT_PLAN, values);
          if (Object.keys(plan).length > 0) {
            dispatch(setRecoveryVMDetails(data[primaryKey], plan));
            const { protectedEntities } = plan;
            const { virtualMachines } = protectedEntities;
            Object.keys(newVMs).forEach((moref) => {
              virtualMachines.forEach((machine) => {
                if (machine.moref === moref) {
                  newVMs[moref].virtualDisks = machine.virtualDisks;
                }
              });
            });
          }
        } else {
          dispatch(setRecoveryVMDetails(data[primaryKey]));
        }
        dispatch(valueChange(STATIC_KEYS.UI_SITE_SELECTED_VMS, newVMs));
      }
    } else if (selectedVMs[data[primaryKey]]) {
      const newVMs = selectedVMs;
      delete newVMs[data[primaryKey]];
      dispatch(valueChange(STATIC_KEYS.UI_SITE_SELECTED_VMS, newVMs));
    }
  };
}

/**
 *
 * @param {*} value - true or false
 * @param {*} data - array of data wheather it's searched or normal data
 * @returns
 */

export function handleSelectAllRecoveryVMs(value, data) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const recoveryPath = getValue(STATIC_KEYS.UI_CHECKPOINT_RECOVERY_TYPE, values) || '';
    const plan = getValue(STORE_KEYS.UI_CHECKPOINT_PLAN, values);
    let selectedVMs = {};
    if (value) {
      data.forEach((vm) => {
        if (!(typeof vm.isDisabled !== 'undefined' && vm.isDisabled === true)) {
          selectedVMs = { ...selectedVMs, [vm.moref]: vm };
          if (recoveryPath !== CHECKPOINT_TYPE.POINT_IN_TIME) {
            dispatch(setRecoveryVMDetails(vm.moref));
          } else if (Object.keys(plan).length > 0) {
            dispatch(setRecoveryVMDetails(vm.moref, plan));
            const { protectedEntities } = plan;
            const { virtualMachines } = protectedEntities;
            Object.keys(selectedVMs).forEach((moref) => {
              virtualMachines.forEach((machine) => {
                if (machine.moref === moref) {
                  selectedVMs[moref].virtualDisks = machine.virtualDisks;
                }
              });
            });
          }
          dispatch(valueChange(`${vm.moref}-vmConfig.recovery.status`, vm.recoveryStatus));
        }
      });
      dispatch(valueChange(STATIC_KEYS.UI_SITE_SELECTED_VMS, selectedVMs));
    } else {
      dispatch(valueChange(STATIC_KEYS.UI_SITE_SELECTED_VMS, selectedVMs));
    }
  };
}

export function fetchNetworks(id, sourceNet = undefined) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const recoveryPlateform = getValue('ui.values.recoveryPlatform', values);
    dispatch(showApplicationLoader('FETCHING_SITE_NETWORK', 'Loading network info...'));
    const url = API_SITE_NETWORKS.replace('<id>', id);
    return callAPI(url)
      .then((json) => {
        dispatch(hideApplicationLoader('FETCHING_SITE_NETWORK'));
        if (json && json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          const data = json;
          if (typeof sourceNet !== 'undefined') {
            dispatch(valueChange(STATIC_KEYS.UI_SECURITY_GROUPS_SOURCE, (data.securityGroups ? data.securityGroups : [])));
            dispatch(valueChange(STATIC_KEYS.UI_SUBNETS__SOURCE, (data.subnets ? data.subnets : [])));
            return;
          }
          if (data.instanceTypes) {
            const insTypes = [];
            data.instanceTypes.forEach((t) => {
              insTypes.push({ value: t.value, label: t.name });
            });
            dispatch(valueChange('ui.values.instances', insTypes));
          }
          let ips = getValue(STATIC_KEYS.UI_EDIT_RESERVE_IPS, values) || [];
          const address = data.ipAddress || [];
          ips = [...ips, ...address];
          dispatch(valueChange(STATIC_KEYS.UI_SECURITY_GROUPS, (data.securityGroups ? data.securityGroups : [])));
          dispatch(valueChange(STATIC_KEYS.UI_SUBNETS, (data.subnets ? data.subnets : [])));
          dispatch(valueChange(STATIC_KEYS.UI_RESERVE_IPS, (data.ipAddress ? ips : [])));
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
          // for aws encryption keys
          if (data.encryptionKeys && data.encryptionKeys.length > 0) {
            const keys = [];
            data.encryptionKeys.forEach((key) => {
              if (key.encryptionArn !== '' && typeof key.encryptionArn !== 'undefined') {
                keys.push({ label: key.name, value: key.encryptionArn });
              }
            });
            dispatch(valueChange(STATIC_KEYS.UI_ENCRYPTION_KEYS, keys));
          }
          dispatch(valueChange(STATIC_KEYS.UI_AVAILABILITY_ZONES, zones));
          dispatch(valueChange(STATIC_KEYS.RESOURCE_GROUP, data.resourceGroups));
          dispatch(valueChange(STATIC_KEYS.UI_NETWORKS, data.networks));
          if (PLATFORM_TYPES.Azure === recoveryPlateform && zones.length === 0) {
            dispatch(fetchAvailibilityZonesForAzure());
          }
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
    const { values } = user;
    const recoveryID = getValue('drplan.recoverySite', user.values);
    const protectionPlatform = getValue('ui.values.protectionPlatform', values);
    const recoverySite = getValue('ui.values.sites', values).filter((site) => `${site.id}` === `${recoveryID}`)[0];
    const { platformType } = { ...recoverySite.platformDetails };
    const flow = getValue(STATIC_KEYS.UI_WORKFLOW, user.values) || '';
    dispatch(onRecoverSiteChange({ value: recoveryID }));
    dispatch(fetchNetworks(recoveryID, undefined));
    if (flow !== UI_WORKFLOW.EDIT_PLAN) {
      if (protectionPlatform === PLATFORM_TYPES.AWS && platformType === PLATFORM_TYPES.AWS) {
        const protectionID = getValue('ui.values.protectionSiteID', user.values);
        dispatch(fetchNetworks(protectionID, 'source_network'));
      }
    }
  };
}
