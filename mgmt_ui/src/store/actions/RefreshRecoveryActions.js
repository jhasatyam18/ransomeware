import { MODAL_REFRESH_RECOVERY_STATUS } from '../../constants/Modalconstant';
import { addMessage } from './MessageActions';
import { hideApplicationLoader, refresh, showApplicationLoader, valueChange } from './UserActions';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { API_REFRESH_RECOVERY_OPS, API_REFRESH_RECOVERY_VMS, REFRESH_OPS } from '../../constants/ApiConstants';
import { REFRESH_RECOVERY_TYPE_FILTER, REF_REC_REFRESH_CONSTANT, STATIC_KEYS, UI_WORKFLOW } from '../../constants/InputConstants';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { getValue } from '../../utils/InputUtils';
import { createRefreshStatusPayload } from '../../utils/PayloadUtil';
import { closeModal, openModal } from './ModalActions';

/**
 * @param {*} id - protection plan id, optional
 * @returns
 */
export function getRefreshRecStatusVMs(id, recoveryType) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    let API_URL = API_REFRESH_RECOVERY_VMS.replace('<recoveryType>', recoveryType);
    if (id && id !== 0) {
      API_URL = `${API_URL}&protectionplanid=${id}`;
    }
    dispatch(valueChange('ui.refresh.data.loading', 0));
    dispatch(showApplicationLoader('refresh-jobs', 'Loading recovery jobs for refresh...'));
    return callAPI(API_URL)
      .then((json) => {
        dispatch(hideApplicationLoader('refresh-jobs'));
        let vms = getValue(STATIC_KEYS.UI_REFRESH_STATUS_VMS, values) || [];
        dispatch(valueChange(STATIC_KEYS.UI_REFRESH_STATUS_VMS, []));
        if (json === null) {
          // case where no data backend return null
          dispatch(valueChange(STATIC_KEYS.UI_REFRESH_STATUS_VMS, vms));
        } else if (json && json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          // before setting data need to order them as per plan and boot order
          let data = json || [];
          if (data && data.length > 0) {
            data = [...data].sort((a, b) => {
              if (typeof a.protectionPlanID !== 'number' || typeof b.protectionPlanID !== 'number') {
                return 0; // Skip comparison, treat as equal
              }
              if (typeof a.bootOrder !== 'number' || typeof b.bootOrder !== 'number') {
                return 0; // Skip comparison, treat as equal
              }
              // If protectionPlanID is the same, sort by bootOrder
              if (a.protectionPlanID === b.protectionPlanID) {
                return a.bootOrder - b.bootOrder;
              }
              // Sort by protectionPlanID
              return a.protectionPlanID - b.protectionPlanID;
            });
          }
          if (json && json.length === data.length) {
            data = [...vms, ...data];
            dispatch(valueChange(STATIC_KEYS.UI_REFRESH_STATUS_VMS, data));
          } else {
            // case where the sort fail due to field is empty
            vms = [...vms, ...json];
            dispatch(valueChange(STATIC_KEYS.UI_REFRESH_STATUS_VMS, vms));
          }
        }
        dispatch(valueChange('ui.refresh.data.loading', 1));
      },
      (err) => {
        dispatch(hideApplicationLoader('refresh-jobs'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function handleRefreshVMSelection(data, isSelected, primaryKey) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const state = getValue(STATIC_KEYS.UI_REFRESH_OP_STATE, values);
    if (state === 'completed' || state === 'failed') {
      return;
    }
    let refreshSelectedVMS = getValue(STATIC_KEYS.UI_REFRESH_SELECTED_VMS, values);
    if (!refreshSelectedVMS) {
      refreshSelectedVMS = {};
    }
    if (isSelected) {
      if (!refreshSelectedVMS || refreshSelectedVMS.length === 0 || !refreshSelectedVMS[data[primaryKey]]) {
        const newVMs = { ...refreshSelectedVMS, [data[primaryKey]]: data };
        dispatch(valueChange(STATIC_KEYS.UI_REFRESH_SELECTED_VMS, newVMs));
        // dispatch(setRecoveryVMDetails(data[primaryKey]));
      }
    } else if (refreshSelectedVMS[data[primaryKey]]) {
      const newVMs = refreshSelectedVMS;
      delete newVMs[data[primaryKey]];
      dispatch(valueChange(STATIC_KEYS.UI_REFRESH_SELECTED_VMS, newVMs));
    }
  };
}

export function refreshStatusOperation(op, id) {
  return (dispatch) => {
    switch (op) {
      case REFRESH_OPS.validate:
        dispatch(startValidation());
        break;
      case REFRESH_OPS.update:
        dispatch(updateStatus(id));
        break;
      case REFRESH_OPS.poll:
        dispatch(pollStatus());
        break;
      default:
        dispatch(addMessage(`Invalid Operation ${op}`, MESSAGE_TYPES.WARNING));
    }
  };
}

/**
 *
 * @param {*} value - true or false
 * @param {*} data - array of data wheather it's searched or normal data
 * @returns
 */

export function handleSelectAllRefreshVMs(value, data) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const state = getValue(STATIC_KEYS.UI_REFRESH_OP_STATE, values);
    if (state === 'completed' || state === 'failed') {
      return;
    }
    let selectedVMs = {};
    if (value) {
      data.forEach((vm) => {
        if (!(typeof vm.isDisabled !== 'undefined' && vm.isDisabled === true)) {
          selectedVMs = { ...selectedVMs, [vm.id]: vm };
        }
      });
      dispatch(valueChange(STATIC_KEYS.UI_REFRESH_SELECTED_VMS, selectedVMs));
    } else {
      dispatch(valueChange(STATIC_KEYS.UI_REFRESH_SELECTED_VMS, selectedVMs));
    }
  };
}

export function resetRefreshSelectionData({ id, refreshData }) {
  return (dispatch) => {
    // setting validation state to empty
    dispatch(valueChange(STATIC_KEYS.UI_REFRESH_OP_STATE, ''));
    // setting resetting vm data
    dispatch(valueChange(STATIC_KEYS.UI_REFRESH_VALIDATION_OBJ, {}));
    dispatch(valueChange(STATIC_KEYS.UI_REFRESH_SELECTED_VMS, {}));
    dispatch(valueChange(STATIC_KEYS.REF_REC_CONSENT, ''));
    dispatch(valueChange(STATIC_KEYS.UI_WORKFLOW, ''));
    dispatch(valueChange('refreshStatusValues', {}));
    dispatch(valueChange(STATIC_KEYS.UI_REFRESH_STATUS_VMS, []));
    switch (refreshData) {
      case REF_REC_REFRESH_CONSTANT.GLOBAL:
        dispatch(refresh());
        break;
      case REF_REC_REFRESH_CONSTANT.REF_REC_VM_DATA:
        dispatch(fetchRefreshRecoveryData(id, false));
        // dispatch(getRefreshRecStatusVMs(id));
        break;
      default:
        break;
    }
  };
}

export function onResetSelectedWorkload(planID) {
  return (dispatch) => {
    dispatch(closeModal());
    dispatch(resetRefreshSelectionData({ id: planID, refreshData: REF_REC_REFRESH_CONSTANT.REF_REC_VM_DATA }));
  };
}

export function startValidation() {
  return (dispatch, getState) => {
    const { user } = getState();
    let payload = {};
    payload = createPayload(API_TYPES.POST, { ...createRefreshStatusPayload(user) });
    dispatch(showApplicationLoader('refresh-validate', 'Initiating recovery status validation...'));
    return callAPI(`${API_REFRESH_RECOVERY_OPS}?op=validate`, payload)
      .then((json) => {
        dispatch(hideApplicationLoader('refresh-validate'));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        }
        dispatch(setRefreshOperationData(json));
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
        dispatch(hideApplicationLoader('refresh-validate'));
      });
  };
}

export function pollStatus() {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const op = getValue(STATIC_KEYS.UI_REFRESH_VALIDATION_OBJ, values);
    const payload = createPayload(API_TYPES.POST, op);
    return callAPI(`${API_REFRESH_RECOVERY_OPS}?op=poll`, payload)
      .then((json) => {
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
          return;
        }
        dispatch(setRefreshOperationData(json));
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function setRefreshOperationData(json) {
  return (dispatch) => {
    dispatch(valueChange(STATIC_KEYS.UI_REFRESH_OP_STATE, json.validationOpStatus));
    const refreshStats = {};
    json.recoveryPPlans.forEach((plan) => {
      plan.recoveryVMCSPResp.forEach((v) => {
        refreshStats[v.vmMoref] = v;
      });
    });
    dispatch(valueChange('refreshStatusValues', { ...refreshStats }));
    dispatch(valueChange(STATIC_KEYS.UI_REFRESH_VALIDATION_OBJ, json));
  };
}

export function updateStatus(planID, refreshData) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const op = getValue(STATIC_KEYS.UI_REFRESH_VALIDATION_OBJ, values);
    dispatch(showApplicationLoader('refresh-update', 'Refreshing the recovery status on selected workloads...'));
    const vms = [];
    const payload = createPayload(API_TYPES.POST, op);
    return callAPI(`${API_REFRESH_RECOVERY_OPS}?op=update`, payload)
      .then((json) => {
        dispatch(hideApplicationLoader('refresh-update'));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
          return;
        }
        const selectedWorkloads = getValue(STATIC_KEYS.UI_REFRESH_SELECTED_VMS, values);
        Object.keys(selectedWorkloads).forEach((key) => {
          vms.push(selectedWorkloads[key].vmName);
        });
        dispatch(addMessage(`Recovery status updated successfully for following workloads - ${vms.join(', ')}`, MESSAGE_TYPES.SUCCESS));
        dispatch(valueChange(STATIC_KEYS.UI_REFRESH_VALIDATION_OBJ, []));
        dispatch(valueChange(STATIC_KEYS.UI_REFRESH_OP_STATE, ''));
        dispatch(resetRefreshSelectionData({ id: planID, refreshData: refreshData || REF_REC_REFRESH_CONSTANT.REF_REC_VM_DATA }));
      },
      (err) => {
        dispatch(hideApplicationLoader('refresh-update'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function fetchRefreshRecoveryData(planID, modalOpen) {
  return (dispatch) => {
    dispatch(getRefreshRecStatusVMs(planID, REFRESH_RECOVERY_TYPE_FILTER.RECOVERY)).then(() => {
      dispatch(getRefreshRecStatusVMs(planID, REFRESH_RECOVERY_TYPE_FILTER.TEST_RECOVERY)).then(() => {
        if (modalOpen) {
          dispatch(valueChange(STATIC_KEYS.UI_WORKFLOW, UI_WORKFLOW.REFRESH_RECOVERY));
          const options = { title: 'Refresh Recovery Status', planID, css: 'refresh-modal', modalActions: true, onModalClose: resetRefreshSelectionData, onCloseParams: { id: 0, refreshData: REF_REC_REFRESH_CONSTANT.GLOBAL } };
          dispatch(openModal(MODAL_REFRESH_RECOVERY_STATUS, options));
        }
      });
    });
  };
}
