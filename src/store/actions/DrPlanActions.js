import { fetchByDelay } from '../../utils/SlowFetch';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import * as Types from '../../constants/actionTypes';
import {
  API_FETCH_DR_PLANS, API_START_DR_PLAN, API_STOP_DR_PLAN, API_DELETE_DR_PLAN, API_FETCH_DR_PLAN_BY_ID, API_RECOVER,
} from '../../constants/ApiConstants';
import { addMessage, clearMessages } from './MessageActions';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { fetchSites } from './SiteActions';
import { getCreateDRPlanPayload, getRecoveryPayload } from '../../utils/PayloadUtil';
import { clearValues, hideApplicationLoader, showApplicationLoader, valueChange } from './UserActions';
import { closeWizard } from './WizardActions';
import { closeModal } from './ModalActions';

export function fetchDrPlans(key) {
  return (dispatch) => {
    dispatch(clearMessages());
    return callAPI(API_FETCH_DR_PLANS)
      .then((json) => {
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(drPlansFetched(json));
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
export function drPlansFetched(plans) {
  return {
    type: Types.FETCH_DR_PALNS,
    plans,
  };
}

export function handleDrPlanTableSelection(data, isSelected, primaryKey) {
  return (dispatch, getState) => {
    const { drPlans } = getState();
    const { selectedPlans } = drPlans;
    if (isSelected) {
      if (!selectedPlans || selectedPlans.length === 0 || !selectedPlans[data[primaryKey]]) {
        const newPlans = { ...selectedPlans, [data[primaryKey]]: data };
        dispatch(updateSelectedPlans(newPlans));
      }
    } else if (selectedPlans[data[primaryKey]]) {
      const newplans = selectedPlans;
      delete newplans[data[primaryKey]];
      dispatch(updateSelectedPlans(newplans));
    }
  };
}

export function updateSelectedPlans(selectedPlans) {
  return {
    type: Types.UPDATE_SELECTED_DR_PLAN,
    selectedPlans,
  };
}

export function drPlanStopStart(action) {
  return (dispatch, getState) => {
    const { drPlans } = getState();
    const { selectedPlans } = drPlans;
    const ids = Object.keys(selectedPlans);
    const calls = [];
    ids.forEach((id) => {
      calls.push(dispatch(action(id)));
    });
  };
}

export function startPlan(id) {
  return (dispatch) => {
    const url = API_START_DR_PLAN.replace('<id>', id);
    const obj = createPayload(API_TYPES.POST, {});
    return callAPI(url, obj).then((json) => {
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(addMessage(json.message, MESSAGE_TYPES.SUCCESS));
      }
    },
    (err) => {
      dispatch(addMessage(err, MESSAGE_TYPES.ERROR));
    });
  };
}

export function stopPlan(id) {
  return (dispatch) => {
    const url = API_STOP_DR_PLAN.replace('<id>', id);
    const obj = createPayload(API_TYPES.POST, {});
    return callAPI(url, obj).then((json) => {
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(addMessage(json.message, MESSAGE_TYPES.SUCCESS));
      }
    },
    (err) => {
      dispatch(addMessage(err, MESSAGE_TYPES.ERROR));
    });
  };
}

export function deletePlan() {
  return (dispatch, getState) => {
    const { drPlans } = getState();
    const { selectedPlans } = drPlans;
    const ids = Object.keys(selectedPlans);
    const url = API_DELETE_DR_PLAN.replace('<id>', ids[0]);
    const obj = createPayload(API_TYPES.DELETE, {});
    return callAPI(url, obj).then((json) => {
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(addMessage(json.message, MESSAGE_TYPES.SUCCESS));
        dispatch(closeModal());
        fetchByDelay(dispatch, fetchDrPlans, 1000);
      }
    },
    (err) => {
      dispatch(addMessage(err, MESSAGE_TYPES.ERROR));
    });
  };
}

export function onDRPlanMount() {
  return (dispatch) => {
    dispatch(fetchSites('ui.values.sites'));
  };
}

export function onConfigureDRPlan() {
  return (dispatch, getState) => {
    const { user, sites } = getState();
    const payload = getCreateDRPlanPayload(user, sites.sites);
    const obj = createPayload(API_TYPES.POST, { ...payload.drplan });
    dispatch(showApplicationLoader('configuring-new-dr-plan', 'Configuring new Protection plan'));
    return callAPI(API_FETCH_DR_PLANS, obj).then((json) => {
      dispatch(hideApplicationLoader('configuring-new-dr-plan'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(addMessage('Protection plan configuration successfully', MESSAGE_TYPES.SUCCESS));
        dispatch(closeWizard());
        dispatch(clearValues());
        fetchByDelay(dispatch, fetchDrPlans, 2000);
      }
    },
    (err) => {
      alert(err);
    });
  };
}

export function fetchDRPlanById(id) {
  return (dispatch) => {
    const url = API_FETCH_DR_PLAN_BY_ID.replace('<id>', id);
    const obj = createPayload();
    dispatch(showApplicationLoader('FETCHING_PROTECTION_PLAN_DETAILS', 'Loading protection plan details'));
    return callAPI(url, obj).then((json) => {
      dispatch(hideApplicationLoader('FETCHING_PROTECTION_PLAN_DETAILS'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(drPlanDetailsFetched(json));
        dispatch(closeModal());
      }
    },
    (err) => {
      dispatch(addMessage(err, MESSAGE_TYPES.ERROR));
    });
  };
}

export function drPlanDetailsFetched(details) {
  return {
    type: Types.FETCH_DR_PALN_DETAILS,
    details,
  };
}

export function onProtectionPlanChange({ value }) {
  return (dispatch) => {
    const url = API_FETCH_DR_PLAN_BY_ID.replace('<id>', value);
    return callAPI(url)
      .then((json) => {
        if (json && json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(valueChange('ui.recovery.vms', json.protectedEntities.VirtualMachines));
        }
      },
      (err) => {
        alert(err);
      });
  };
}

export function startRecovery() {
  return (dispatch, getState) => {
    const { user } = getState();
    const values = user;
    const payload = getRecoveryPayload(values);
    const obj = createPayload(API_TYPES.POST, { ...payload.recovery });
    dispatch(showApplicationLoader('RECOVERY-API-EXECUTION', 'Initiating Recovery'));
    return callAPI(API_RECOVER, obj).then((json) => {
      dispatch(hideApplicationLoader('RECOVERY-API-EXECUTION'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(closeWizard());
        dispatch(clearValues());
        dispatch(addMessage('Recovery Started Successfully', MESSAGE_TYPES.SUCCESS));
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('RECOVERY-API-EXECUTION'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}
