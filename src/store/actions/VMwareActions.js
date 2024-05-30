import { API_FETCH_VMWARE_ADAPTER_TYPE, API_GET_VMWARE_VMS } from '../../constants/ApiConstants';
import { STATIC_KEYS } from '../../constants/InputConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { MODAL_CBT_CONFIRMATION } from '../../constants/Modalconstant';
import { callAPI } from '../../utils/ApiUtils';
import { getValue } from '../../utils/InputUtils';
import { setVMGuestOSInfo } from './DrPlanActions';
import { addMessage } from './MessageActions';
import { openModal } from './ModalActions';
import { getComputeResources, getStorageForVMware, hideApplicationLoader, showApplicationLoader, valueChange } from './UserActions';

// getStorageForVMware
export function getVMwareAdapterType() {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const recoverySite = getValue('ui.values.recoverySiteID', values);
    dispatch(showApplicationLoader('vmware_compute', 'get vmware adapter type'));
    const url = API_FETCH_VMWARE_ADAPTER_TYPE.replace('<id>', recoverySite);
    return callAPI(url).then((json) => {
      dispatch(hideApplicationLoader('vmware_compute'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        const res = [];
        json.adapters.forEach((d) => {
          const val = {};
          val.label = d;
          val.value = d;
          res.push(val);
        });
        dispatch(valueChange('ui.drplan.adapterType', res));
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('vmware_compute'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

export function setVmwareInitialData(url, virtualMachines) {
  return (dispatch) => {
    callAPI(url)
      .then((json) => {
        if (json && json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          let data = json;
          if (data === null) {
            data = [];
          }
          const convertedData = [];
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
          let selectedVMS = [];
          const selectedvmWithname = [];
          virtualMachines.forEach((pvm) => {
            // for update vm id is required
            const obj = {};
            selectedVMS = [...selectedVMS, pvm.moref];
            obj.key = pvm.moref;
            obj.name = pvm.name;
            selectedvmWithname.push(obj);
          });
          dispatch(valueChange('ui.site.vmware.selectedvms', selectedVMS));
          dispatch(valueChange('ui.selectedvm.value', selectedvmWithname));
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(url));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function setVMwareTargetData(args) {
  return (dispatch) => {
    const [fieldKey, datastore, hostMoref] = args;
    dispatch(getComputeResources(`${fieldKey}.folderPath`, datastore));
    dispatch(getStorageForVMware({ fieldKey: `${fieldKey}.hostMoref`, hostMoref }));
  };
}

export function fetchVMwareComputeResource(url, fieldKey, reqField, entityKey) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const storageKey = fieldKey.replace('hostMoref', 'DATASTORE');
    const responseData = getVMwareConfigDataForField(reqField, entityKey, values);

    if (responseData !== null) {
      dispatch(clearVMwareStorageValIfNotPresent(responseData, fieldKey, storageKey, reqField, entityKey));
      return;
    }
    dispatch(showApplicationLoader('vmware_datastore', 'Loading vmware datastore'));
    return callAPI(url).then((json) => {
      dispatch(hideApplicationLoader('vmware_datastore'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(clearVMwareStorageValIfNotPresent(json, fieldKey, storageKey, reqField, entityKey));
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('vmware_datastore'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

/**
  on compute change this function will be called to fetch datatore data
  if for some reason user has already selected datastore value in case of vmware and user selects another compute
  and if the option list does not have previously selected datastore data then clear storage key from store

 * @param {*} data -> array of all the option
 * @param {*} fieldKey -> vmware compute fieldkey
 * @param {*} storageKey -> vmware storage key
 * @returns
 */

function clearVMwareStorageValIfNotPresent(data, fieldKey, storageKey, reqField, entityKey) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const storageFieldKey = fieldKey.replace('hostMoref', 'dataStoreMoref');
    const storageVal = getValue(storageFieldKey, values);
    let isStorageValPresent = false;
    const res = [];

    data.forEach((d) => {
      const val = {};
      val.label = d.name || d.label;
      val.value = d.id || d.value;
      if (storageVal && storageVal.value === val.value) {
        isStorageValPresent = true;
      }
      res.push(val);
    });

    // if the option list does not have previously selected storage data then clear storage key from store

    if (typeof storageVal === 'object' && Object.keys(storageVal).length > 0 && !isStorageValPresent) {
      dispatch(valueChange(storageFieldKey, ''));
    }

    dispatch(valueChange(storageKey, res));

    if (reqField && entityKey) {
      dispatch(setVMwareAPIResponseData(reqField, entityKey, res));
    }
  };
}

export function fetchVMwareNetwork(url, fieldKey, reqField, entityKey) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const networKey = fieldKey.split('-vmConfig.general.hostMoref');
    const [moref] = networKey;
    const responseData = getVMwareConfigDataForField(reqField, entityKey, values);
    if (responseData !== null) {
      dispatch(valueChange(`${moref}.general.network`, responseData));
      return;
    }
    dispatch(showApplicationLoader('vmware_network', 'Loading vmware Networks'));
    return callAPI(url).then((json) => {
      dispatch(hideApplicationLoader('vmware_network'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        const res = [];
        json.forEach((d) => {
          const val = {};
          val.label = d.name;
          val.value = d.id;
          res.push(val);
        });
        dispatch(valueChange(`${moref}.general.network`, res));
        if (reqField && entityKey) {
          dispatch(setVMwareAPIResponseData(reqField, entityKey, res));
        }
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('vmware_network'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

// on edit in vmware-vmware fetch selected vms properties

export function fetchSelectedVmsProperty(siteId, vmString, selectedVMS, dispatch) {
  let disabledCBT = false;
  const vms = selectedVMS;
  const url = API_GET_VMWARE_VMS;
  dispatch(showApplicationLoader('vmware_data', 'Loading vmware data'));
  return callAPI(url.replace('<id>', siteId).replace('vmstring', vmString)).then((json) => {
    dispatch(hideApplicationLoader('vmware_data'));
    if (json.hasError) {
      dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
    } else {
      json.forEach((vm) => {
        vms[vm.moref] = vm;
        if (!vm.changeTracking) {
          disabledCBT = true;
        }
      });
      dispatch(setVMGuestOSInfo(vms));
      if (disabledCBT) {
        const options = { title: 'Change Block Tracking (CBT) Confirmation', selectedVMs: vms, size: 'lg' };
        dispatch(openModal(MODAL_CBT_CONFIRMATION, options));
        return false;
      }
      dispatch(valueChange(STATIC_KEYS.UI_SITE_SELECTED_VMS, vms));
      return true;
    }
  },
  (err) => {
    dispatch(hideApplicationLoader('vmware_data'));
    dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    return false;
  });
}

export function filterDataForVMwareSearch(data, criteria) {
  const res = [];
  data.forEach((d) => {
    if (d.title.toLowerCase().indexOf(criteria.toLowerCase()) !== -1) {
      res.push(d);
    }
  });
  return res;
}

export function fetchVMwareSearchData(searchURL, dispatch) {
  callAPI(searchURL).then((json) => {
    if (json.hasError) {
      dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
    } else {
      const convertedData = [];
      // TODO
      json.forEach((d) => {
        const node = {};
        node.doneChildrenLoading = true;
        node.key = d.moref;
        node.type = 'VirtualMachine';
        node.value = d.moref;
        node.children = [];
        node.title = d.name;
        node.id = d.moref;
        convertedData.push(node);
      });
      return convertedData;
    }
  },
  (err) => {
    dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
  });
}

// function to store the response value data for VMware as target configuration
export function setVMwareAPIResponseData(requestedField, entity, data) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    // get store data
    const responses = getValue(STATIC_KEYS.UI_VMWARE_CONFIG_RESPONSES, values);
    // create a key to persist values, key should be combination on re entity$requestedField
    const key = `${entity}$${requestedField}`;
    // set data in the store
    if (responses && Object.keys(responses).length > 0) {
      // update store values
      const updatedData = { ...responses, [key]: data };
      dispatch(valueChange(STATIC_KEYS.UI_VMWARE_CONFIG_RESPONSES, updatedData));
    } else {
      dispatch(valueChange(STATIC_KEYS.UI_VMWARE_CONFIG_RESPONSES, { [key]: data }));
    }
  };
}

// getVMwareConfigDataForField
export function getVMwareConfigDataForField(requestedField, entity, values) {
  const responses = getValue(STATIC_KEYS.UI_VMWARE_CONFIG_RESPONSES, values);
  const key = `${entity}$${requestedField}`;
  if (responses && Object.keys(responses).length > 0) {
    const data = responses[key];
    if (typeof data !== 'undefined') {
      return responses[key];
    }
  }
  return null;
}
