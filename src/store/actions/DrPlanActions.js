import { fetchByDelay } from '../../utils/SlowFetch';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import * as Types from '../../constants/actionTypes';
import {
  API_FETCH_DR_PLANS, API_START_DR_PLAN, API_STOP_DR_PLAN, API_DELETE_DR_PLAN, API_FETCH_DR_PLAN_BY_ID, API_FETCH_REVERSE_DR_PLAN_BY_ID, API_RECOVER, API_MIGRATE, API_REVERSE, API_PROTECTION_PLAN_VMS, API_PROTECTION_PLAN_UPDATE, API_PROTECTION_PLAN_PROTECTED_VMS,
} from '../../constants/ApiConstants';
import { addMessage } from './MessageActions';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { fetchNetworks, fetchSites, onRecoverSiteChange } from './SiteActions';
import { getCreateDRPlanPayload, getEditProtectionPlanPayload, getRecoveryPayload, getReversePlanPayload } from '../../utils/PayloadUtil';
import { clearValues, fetchScript, hideApplicationLoader, showApplicationLoader, valueChange } from './UserActions';
import { closeWizard, openWizard } from './WizardActions';
import { closeModal, openModal } from './ModalActions';
import { MIGRATION_WIZARDS, RECOVERY_WIZARDS, TEST_RECOVERY_WIZARDS, REVERSE_WIZARDS, UPDATE_PROTECTION_PLAN_WIZARDS } from '../../constants/WizardConstants';
import { getValue } from '../../utils/InputUtils';
import { PLATFORM_TYPES } from '../../constants/InputConstants';
import { PROTECTION_PLANS_PATH } from '../../constants/RouterConstants';
import { MODAL_CONFIRMATION_WARNING } from '../../constants/Modalconstant';

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

export function deletePlan(id, history) {
  return (dispatch, getState) => {
    const { drPlans } = getState();
    const { selectedPlans } = drPlans;
    const ids = Object.keys(selectedPlans);
    const planID = (typeof id === 'undefined' ? ids[0] : id);
    const url = API_DELETE_DR_PLAN.replace('<id>', planID);
    const obj = createPayload(API_TYPES.DELETE, {});
    dispatch(showApplicationLoader(url, 'Removing protection plan...'));
    return callAPI(url, obj).then((json) => {
      dispatch(hideApplicationLoader(url));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(addMessage(json.message, MESSAGE_TYPES.SUCCESS));
        dispatch(closeModal());
        fetchByDelay(dispatch, fetchDrPlans, 1000);
        dispatch(updateSelectedPlans({}));
        dispatch(refreshPostActon(true));
        if (typeof history !== 'undefined') {
          history.push(PROTECTION_PLANS_PATH);
        }
      }
    },
    (err) => {
      dispatch(hideApplicationLoader(url));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

export function deletePlanConfirmation(id) {
  return (dispatch) => {
    const options = { title: 'Confirmation', confirmAction: deletePlan, message: 'Are you sure want to delete  ?', id };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
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
          const data = [];
          const info = json.protectedEntities.virtualMachines || [];
          info.forEach((vm) => {
            if (typeof vm.recoveryStatus !== 'undefined' && (vm.recoveryStatus === 'Migrated' || vm.recoveryStatus === 'Recovered' || vm.isRemovedFromPlan === true)) {
              const v = vm;
              v.isDisabled = true;
              data.push(v);
            } else {
              data.push(vm);
            }
          });
          dispatch(valueChange('ui.recovery.vms', json.protectedEntities.virtualMachines));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function onReverseProtectionPlanChange(id) {
  return (dispatch) => {
    const url = API_FETCH_REVERSE_DR_PLAN_BY_ID.replace('<id>', id);
    dispatch(showApplicationLoader(url, 'Loading reverse protection plan'));
    return callAPI(url)
      .then((json) => {
        dispatch(hideApplicationLoader(url));
        if (json && json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          if (json === null) {
            dispatch(addMessage('Fetch reverse protection plan failed.', MESSAGE_TYPES.ERROR));
            return;
          }
          dispatch(valueChange('ui.reverse.drPlan', json));
          dispatch(openWizard(REVERSE_WIZARDS.options, REVERSE_WIZARDS.steps));
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(url));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
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

export function startReversePlan() {
  return (dispatch, getState) => {
    const { user } = getState();
    const values = user;
    const drplan = getReversePlanPayload(values);
    const url = API_REVERSE.replace('<id>', drplan.id);
    const obj = createPayload(API_TYPES.POST, { ...drplan });
    dispatch(showApplicationLoader('REVERSE-API-EXECUTION', 'Initiating Reverse Protection Plan'));
    return callAPI(url, obj).then((json) => {
      dispatch(hideApplicationLoader('REVERSE-API-EXECUTION'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(closeWizard());
        dispatch(clearValues());
        dispatch(addMessage('Reverse Protection Plan Configured Successfully.', MESSAGE_TYPES.SUCCESS));
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('REVERSE-API-EXECUTION'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

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
export function refreshPostActon(isDelete = false) {
  return (dispatch) => {
    const { location } = window;
    const { pathname } = location;
    const parts = pathname.split('/');
    if (pathname && pathname.indexOf('protection/plan/details') !== -1) {
      if (isDelete) {
        return;
      }
      dispatch(fetchDRPlanById(parts[parts.length - 1]));
    } else {
      dispatch(fetchDrPlans());
    }
  };
}

export function openReverseWizard() {
  return (dispatch, getState) => {
    const { drPlans } = getState();
    const { protectionPlan } = drPlans;
    const { id } = protectionPlan;
    dispatch(clearValues());
    dispatch(fetchDrPlans('ui.values.drplan'));
    dispatch(fetchSites('ui.values.sites'));
    dispatch(onReverseProtectionPlanChange(id));
  };
}

function getSelectedPlanID(drPlans) {
  const { selectedPlans } = drPlans;
  const ids = Object.values(selectedPlans);
  if (ids && ids.length > 0) {
    return ids[0];
  }
  return null;
}

export function openEditProtectionPlanWizard(plan, isEventAction = false) {
  return (dispatch, getState) => {
    const { drPlans } = getState();
    dispatch(clearValues());
    const selectedPlan = (typeof plan === 'undefined' ? getSelectedPlanID(drPlans) : plan);
    const apis = [dispatch(fetchSites('ui.values.sites')), dispatch(fetchNetworks(selectedPlan.recoverySite.id)), dispatch(fetchScript())];
    return Promise.all(apis).then(
      () => {
        dispatch(valueChange('ui.selected.protection.planID', selectedPlan.id));
        dispatch(valueChange('drplan.recoverySite', selectedPlan.recoverySite.id));
        dispatch(valueChange('ui.values.recoveryPlatform', selectedPlan.recoverySite.platformDetails.platformType));
        dispatch(setProtectionPlanDataForUpdate(selectedPlan, isEventAction));
        return new Promise((resolve) => resolve());
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
        return new Promise((resolve) => resolve());
      },
    );
  };
}

export function setProtectionPlanDataForUpdate(selectedPlan, isEventAction = false) {
  return (dispatch) => {
    dispatch(showApplicationLoader('UPDATE_PROTECTION_PLAN', 'Loading protection plan data...'));
    const wiz = UPDATE_PROTECTION_PLAN_WIZARDS;
    wiz.options.title = `Edit Plan - ${selectedPlan.name}`;
    wiz.options.onFinish = onEditProtectionPlan;
    const apis = [dispatch(setProtectionPlanVMsForUpdate(selectedPlan, isEventAction))];
    return Promise.all(apis)
      .then(
        () => {
          dispatch(hideApplicationLoader('UPDATE_PROTECTION_PLAN'));
          dispatch(onRecoverSiteChange({ value: selectedPlan.recoverySite.id }));
          dispatch(openWizard(wiz.options, UPDATE_PROTECTION_PLAN_WIZARDS.steps));
          return new Promise((resolve) => resolve());
        },
        (err) => {
          dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
          dispatch(hideApplicationLoader('UPDATE_PROTECTION_PLAN'));
          return new Promise((resolve) => resolve());
        },
      );
  };
}

export function onEditProtectionPlan() {
  return (dispatch, getState) => {
    const { user, sites } = getState();
    const { values } = user;
    const payload = getEditProtectionPlanPayload(user, sites.sites);
    const obj = createPayload(API_TYPES.PUT, { ...payload.drplan });
    const id = getValue('ui.selected.protection.planID', values);
    const url = API_PROTECTION_PLAN_UPDATE.replace('<id>', id);
    dispatch(showApplicationLoader('update-dr-plan', 'Updating protection plan...'));
    return callAPI(url, obj).then((json) => {
      dispatch(hideApplicationLoader('update-dr-plan'));
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
      dispatch(hideApplicationLoader('update-dr-plan'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

export function setProtectionPlanVMsForUpdate(protectionPlan, isEventAction = false) {
  return (dispatch) => {
    const { protectedSite, protectedEntities, id } = protectionPlan;
    const { virtualMachines } = protectedEntities;
    let url = (isEventAction ? API_PROTECTION_PLAN_PROTECTED_VMS.replace('<id>', id) : API_PROTECTION_PLAN_VMS.replace('<sid>', protectedSite.id));
    url = url.replace('<pid>', id);
    return callAPI(url)
      .then((json) => {
        if (json && json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          let data = json;
          let selectedVMS = {};
          if (data === null) {
            data = [];
          }
          dispatch(valueChange('ui.site.vms', data));
          if (isEventAction) {
            data.forEach((vm) => {
              selectedVMS = { ...selectedVMS, [vm.moref]: { id: vm.id, ...vm } };
            });
          } else {
            // set selected vms for plan update
            data.forEach((vm) => {
              virtualMachines.forEach((pvm) => {
                if (pvm.moref === vm.moref) {
                  // for update vm id is required
                  selectedVMS = { ...selectedVMS, [vm.moref]: { id: pvm.id, ...vm } };
                }
              });
            });
          }
          dispatch(valueChange('ui.site.seletedVMs', selectedVMS));
          dispatch(setProtectionPlanVMConfig(selectedVMS, protectionPlan));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function setProtectionPlanVMConfig(selectedVMS, protectionPlan) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const { protectedEntities, recoveryEntities } = protectionPlan;
    dispatch(valueChange('drplan.id', protectionPlan.id));
    dispatch(valueChange('ui.edit.plan.remoteProtectionPlanId', protectionPlan.remoteProtectionPlanId));
    dispatch(valueChange('drplan.name', protectionPlan.name));
    dispatch(valueChange('drplan.bootDelay', protectionPlan.bootDelay));
    dispatch(valueChange('drplan.preScript', protectionPlan.preScript));
    dispatch(valueChange('drplan.postScript', protectionPlan.postScript));
    dispatch(valueChange('drplan.protectedSite', protectionPlan.protectedSite.id));
    dispatch(valueChange('drplan.recoverySite', protectionPlan.recoverySite.id));
    dispatch(valueChange('drplan.replicationInterval', protectionPlan.replicationInterval));
    dispatch(valueChange('drplan.scriptTimeout', protectionPlan.scriptTimeout));
    dispatch(valueChange('ui.edit.plan.protectedEntities.id', protectedEntities.id));
    dispatch(valueChange('ui.edit.plan.recoveryEntities.id', recoveryEntities.id));
    dispatch(valueChange('ui.edit.plan.status', protectionPlan.status));
    dispatch(valueChange('ui.edit.plan.id', protectionPlan.id));
    const time = protectionPlan.startTime * 1000;
    const d = new Date(time);
    dispatch(valueChange('drplan.startTime', d));
    dispatch(valueChange('drplan.isEncryptionOnWire', protectionPlan.isEncryptionOnWire));
    dispatch(valueChange('drplan.isEncryptionOnRest', protectionPlan.isEncryptionOnRest));
    dispatch(valueChange('drplan.isCompression', protectionPlan.isCompression));
    dispatch(valueChange('drplan.isDeDupe', protectionPlan.isDeDupe));
    dispatch(valueChange('drplan.enableReverse', protectionPlan.enableReverse));
    dispatch(valueChange('drplan.postScript', protectionPlan.postScript));
    dispatch(valueChange('drplan.preScript', protectionPlan.preScript));
    const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
    switch (recoveryPlatform) {
      case PLATFORM_TYPES.AWS:
        return setAWSVMDetails(selectedVMS, protectionPlan, dispatch);
      case PLATFORM_TYPES.GCP:
        return setGCPVMDetails(selectedVMS, protectionPlan, dispatch);
      default:
        dispatch(addMessage('Unknown platform type', MESSAGE_TYPES.ERROR));
        dispatch(clearValues());
        dispatch(closeModal());
        dispatch(closeWizard());
    }
  };
}

function setAWSVMDetails(selectedVMS, protectionPlan, dispatch) {
  const vms = Object.values(selectedVMS);
  const { recoveryEntities } = protectionPlan;
  const { instanceDetails } = recoveryEntities;
  vms.forEach((vm) => {
    const key = vm.moref;
    instanceDetails.forEach((ins) => {
      if (ins.instanceName === vm.name) {
        dispatch(valueChange(`${key}-vmConfig.general.id`, ins.id));
        dispatch(valueChange(`${key}-vmConfig.general.instanceType`, ins.instanceType));
        dispatch(valueChange(`${key}-vmConfig.general.volumeType`, ins.volumeType));
        dispatch(valueChange(`${key}-vmConfig.general.volumeIOPS`, ins.volumeIOPS));
        dispatch(valueChange(`${key}-vmConfig.general.bootOrder`, ins.bootPriority));
        dispatch(valueChange(`${key}-vmConfig.scripts.preScript`, ins.preScript));
        dispatch(valueChange(`${key}-vmConfig.scripts.postScript`, ins.postScript));
        if (ins.tags && ins.tags.length > 0) {
          const tagsData = [];
          ins.tags.forEach((tag) => {
            tagsData.push({ id: tag.id, key: tag.key, value: tag.value });
          });
          dispatch(valueChange(`${key}-vmConfig.general.tags`, tagsData));
        }
        // network config "vm-1442-vmConfig.network.net1"
        const networkKey = `${key}-vmConfig.network.net1`;
        const eths = [];
        if (ins.networks && ins.networks.length > 0) {
          ins.networks.forEach((net, index) => {
            dispatch(valueChange(`${networkKey}-eth-${index}-id`, net.id));
            dispatch(valueChange(`${networkKey}-eth-${index}-subnet`, net.Subnet));
            dispatch(valueChange(`${networkKey}-eth-${index}-isPublic`, net.isPublicIP));
            dispatch(valueChange(`${networkKey}-eth-${index}-network`, net.network));
            dispatch(valueChange(`${networkKey}-eth-${index}-publicIP`, net.publicIP));
            dispatch(valueChange(`${networkKey}-eth-${index}-privateIP`, net.privateIP));
            const sgs = (net.securityGroups ? net.securityGroups.split(',') : []);
            dispatch(valueChange(`${networkKey}-eth-${index}-securityGroups`, sgs));
            eths.push({ key: `${networkKey}-eth-${index}`, isPublicIP: net.isPublicIP, publicIP: '', privateIP: net.privateIP, subnet: net.Subnet, securityGroup: sgs, network: net.network });
          });
          dispatch(valueChange(`${networkKey}`, eths));
        }
      }
    });
  });
}

function setGCPVMDetails(selectedVMS, protectionPlan, dispatch) {
  const vms = Object.values(selectedVMS);
  const { recoveryEntities } = protectionPlan;
  const { instanceDetails } = recoveryEntities;
  vms.forEach((vm) => {
    const key = vm.moref;
    instanceDetails.forEach((ins) => {
      if (ins.instanceName === vm.name) {
        dispatch(valueChange(`${key}-vmConfig.general.id`, ins.id));
        dispatch(valueChange(`${key}-vmConfig.general.instanceType`, ins.instanceType));
        dispatch(valueChange(`${key}-vmConfig.general.volumeType`, ins.volumeType));
        dispatch(valueChange(`${key}-vmConfig.general.bootOrder`, ins.bootPriority));
        dispatch(valueChange(`${key}-vmConfig.scripts.preScript`, ins.preScript));
        dispatch(valueChange(`${key}-vmConfig.scripts.postScript`, ins.postScript));
        if (ins.securityGroups && ins.securityGroups.length > 0) {
          const selSgs = ins.securityGroups.split(',') || '';
          dispatch(valueChange(`${key}-vmConfig.network.securityGroup`, selSgs));
        }
        if (ins.tags && ins.tags.length > 0) {
          const tagsData = [];
          ins.tags.forEach((tag) => {
            tagsData.push({ id: tag.id, key: tag.key, value: tag.value });
          });
          dispatch(valueChange(`${key}-vmConfig.general.tags`, tagsData));
        }
        // network config "vm-1442-vmConfig.network.net1"
        const networkKey = `${key}-vmConfig.network.net1`;
        const eths = [];
        if (ins.networks && ins.networks.length > 0) {
          ins.networks.forEach((net, index) => {
            dispatch(valueChange(`${networkKey}-eth-${index}-id`, net.id));
            dispatch(valueChange(`${networkKey}-eth-${index}-subnet`, net.Subnet));
            dispatch(valueChange(`${networkKey}-eth-${index}-privateIP`, net.privateIP));
            dispatch(valueChange(`${networkKey}-eth-${index}-publicIP`, net.publicIP));
            dispatch(valueChange(`${networkKey}-eth-${index}-networkTier`, net.networkTier));
            dispatch(valueChange(`${networkKey}-eth-${index}-isPublic`, false));
            eths.push({ key: `${networkKey}-eth-${index}`, isPublicIP: false, publicIP: '', privateIP: '', subnet: '', securityGroup: '' });
          });
          dispatch(valueChange(`${networkKey}`, eths));
        }
      }
    });
  });
}
