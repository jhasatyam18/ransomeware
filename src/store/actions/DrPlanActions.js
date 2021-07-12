import { fetchByDelay } from '../../utils/SlowFetch';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import * as Types from '../../constants/actionTypes';
import {
  API_FETCH_DR_PLANS, API_START_DR_PLAN, API_STOP_DR_PLAN, API_DELETE_DR_PLAN, API_FETCH_DR_PLAN_BY_ID, API_RECOVER, API_MIGRATE,
} from '../../constants/ApiConstants';
import { addMessage } from './MessageActions';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { fetchSites } from './SiteActions';
import { getCreateDRPlanPayload, getRecoveryPayload } from '../../utils/PayloadUtil';
import { clearValues, hideApplicationLoader, showApplicationLoader, valueChange } from './UserActions';
import { closeWizard, openWizard } from './WizardActions';
import { closeModal } from './ModalActions';
import { MIGRATION_WIZARDS, RECOVERY_WIZARDS, TEST_RECOVERY_WIZARDS } from '../../constants/WizardConstants';

export function fetchDrPlans(key) {
  return (dispatch) => {
    dispatch(showApplicationLoader('PROTECTION_PLAN', 'Loading protection plans...'));
    return callAPI(API_FETCH_DR_PLANS)
      .then((json) => {
        dispatch(hideApplicationLoader('PROTECTION_PLAN'));
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
        dispatch(hideApplicationLoader('PROTECTION_PLAN'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}
export function drPlansFetched(plans) {
  return {
    type: Types.FETCH_DR_PLANS,
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
        fetchByDelay(dispatch, refreshPostActon, 100);
      }
    },
    (err) => {
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
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
        fetchByDelay(dispatch, refreshPostActon, 100);
      }
    },
    (err) => {
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

export function deletePlan(id) {
  return (dispatch, getState) => {
    const { drPlans } = getState();
    const { selectedPlans } = drPlans;
    const ids = Object.keys(selectedPlans);
    const planID = (typeof id === 'undefined' ? ids[0] : id);
    const url = API_DELETE_DR_PLAN.replace('<id>', planID);
    const obj = createPayload(API_TYPES.DELETE, {});
    return callAPI(url, obj).then((json) => {
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(addMessage(json.message, MESSAGE_TYPES.SUCCESS));
        dispatch(closeModal());
        fetchByDelay(dispatch, fetchDrPlans, 1000);
        dispatch(refreshPostActon(true));
      }
    },
    (err) => {
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
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
    dispatch(showApplicationLoader('configuring-new-dr-plan', 'Configuring new protection plan.'));
    return callAPI(API_FETCH_DR_PLANS, obj).then((json) => {
      dispatch(hideApplicationLoader('configuring-new-dr-plan'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(addMessage('Protection plan configured successfully.', MESSAGE_TYPES.SUCCESS));
        dispatch(closeWizard());
        dispatch(clearValues());
        fetchByDelay(dispatch, fetchDrPlans, 2000);
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('configuring-new-dr-plan'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
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
      dispatch(hideApplicationLoader('FETCHING_PROTECTION_PLAN_DETAILS'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

export function drPlanDetailsFetched(protectionPlan) {
  return {
    type: Types.FETCH_DR_PLAN_DETAILS,
    protectionPlan,
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
          dispatch(valueChange('ui.recovery.vms', json.protectedEntities.virtualMachines));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}
/**
 * Start Recovery
 * @returns
 */
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
        dispatch(addMessage('Recovery Initiated Successfully.', MESSAGE_TYPES.SUCCESS));
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('RECOVERY-API-EXECUTION'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

/**
 * Start Migration
 * @returns
 */
export function startMigration() {
  return (dispatch, getState) => {
    const { user } = getState();
    const values = user;
    const payload = getRecoveryPayload(values, true);
    const obj = createPayload(API_TYPES.POST, { ...payload.recovery });
    dispatch(showApplicationLoader('RECOVERY-API-EXECUTION', 'Initiating Migration'));
    return callAPI(API_MIGRATE, obj).then((json) => {
      dispatch(hideApplicationLoader('RECOVERY-API-EXECUTION'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(closeWizard());
        dispatch(clearValues());
        dispatch(addMessage('Migration Initiated Successfully.', MESSAGE_TYPES.SUCCESS));
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('RECOVERY-API-EXECUTION'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

/**
 * Initiate migration wizard
 * @returns
 */
export function openMigrationWizard() {
  return (dispatch, getState) => {
    const { drPlans } = getState();
    const { protectionPlan } = drPlans;
    const { id } = protectionPlan;
    dispatch(clearValues());
    dispatch(fetchDrPlans('ui.values.drplan'));
    dispatch(valueChange('ui.isMigration.workflow', true));
    // set recovery plan id
    dispatch(valueChange('recovery.protectionplanID', id));
    // fetch VMs for drPlan
    dispatch(onProtectionPlanChange({ value: id }));
    // set is migration flag to false
    dispatch(valueChange('ui.isMigration.workflow', false));
    // set is test recovery flag to false
    dispatch(valueChange('recovery.dryrun', false));
    dispatch(openWizard(MIGRATION_WIZARDS.options, MIGRATION_WIZARDS.steps));
  };
}

/**
 * Initiate recovery wizard
 * @returns
 */
export function openRecoveryWizard() {
  return (dispatch, getState) => {
    const { drPlans } = getState();
    const { protectionPlan } = drPlans;
    const { id } = protectionPlan;
    dispatch(clearValues());
    dispatch(fetchDrPlans('ui.values.drplan'));
    // set recovery plan id
    dispatch(valueChange('recovery.protectionplanID', id));
    // fetch VMs for drPlan
    dispatch(onProtectionPlanChange({ value: id }));
    // set is migration flag to false
    dispatch(valueChange('ui.isMigration.workflow', false));
    // set is test recovery flag to false
    dispatch(valueChange('recovery.dryrun', false));
    dispatch(openWizard(RECOVERY_WIZARDS.options, RECOVERY_WIZARDS.steps));
  };
}

/**
 * Initiate test recovery wizard
 * @returns
 */
export function openTestRecoveryWizard() {
  return (dispatch, getState) => {
    const { drPlans } = getState();
    const { protectionPlan } = drPlans;
    const { id } = protectionPlan;
    dispatch(clearValues());
    dispatch(fetchDrPlans('ui.values.drplan'));
    // set recovery plan id
    dispatch(valueChange('recovery.protectionplanID', id));
    // fetch VMs for drPlan
    dispatch(onProtectionPlanChange({ value: id }));
    // set is migration flag to false
    dispatch(valueChange('ui.isMigration.workflow', false));
    // set is test recovery flag to false
    dispatch(valueChange('recovery.dryrun', true));
    dispatch(openWizard(TEST_RECOVERY_WIZARDS.options, RECOVERY_WIZARDS.steps));
  };
}

/**
 * reload data post any action
 */
export function refreshPostActon() {
  return (dispatch) => {
    const { location } = window;
    const { pathname } = location;
    const parts = pathname.split('/');
    if (pathname && pathname.indexOf('protection/plan/details') !== -1) {
      dispatch(fetchDRPlanById(parts[parts.length - 1]));
    } else {
      dispatch(fetchDrPlans());
    }
  };
}
