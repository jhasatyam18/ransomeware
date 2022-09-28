import { getValue } from '../../utils/InputUtils';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { API_FETCH_VMWARE_ADAPTER_TYPE } from '../../constants/ApiConstants';
import { callAPI } from '../../utils/ApiUtils';
import { addMessage } from './MessageActions';
import { getComputeResources, getStorageForVMware, hideApplicationLoader, showApplicationLoader, valueChange } from './UserActions';
import { STATIC_KEYS } from '../../constants/InputConstants';

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
          dispatch(valueChange('ui.drplan.vms.location', convertedData));
          dispatch(valueChange('ui.site.vms.data', convertedData));
        }

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
    const computeKey = fieldKey.replace('hostMoref', 'DATASTORE');
    const responseData = getVMwareConfigDataForField(reqField, entityKey, values);
    if (responseData !== null) {
      dispatch(valueChange(computeKey, responseData));
      return;
    }
    dispatch(showApplicationLoader('vmware_compute', 'Loading vmware datastore'));
    return callAPI(url).then((json) => {
      dispatch(hideApplicationLoader('vmware_compute'));
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
        dispatch(valueChange(computeKey, res));
        if (reqField && entityKey) {
          dispatch(setVMwareAPIResponseData(reqField, entityKey, res));
        }
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('vmware_compute'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

export function fetchVMwareNetwork(url, fieldKey, reqField, entityKey) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const networKey = fieldKey.replace('hostMoref', 'network');
    const responseData = getVMwareConfigDataForField(reqField, entityKey, values);
    if (responseData !== null) {
      dispatch(valueChange(networKey, responseData));
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
        dispatch(valueChange(networKey, res));
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

export function fetchSelectedVmsProperty(siteId, vmString, selectedVMS) {
  return (dispatch) => {
    const vms = selectedVMS;
    dispatch(showApplicationLoader('vmware_data', 'Loading vmware data'));
    return callAPI(`api/v1/sites/${siteId}/vms?details=true&vms=${vmString}`).then((json) => {
      dispatch(hideApplicationLoader('vmware_data'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        json.forEach((vm) => {
          vms[vm.moref] = vm;
        });
        dispatch(valueChange('ui.site.seletedVMs', vms));
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('vmware_data'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
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
