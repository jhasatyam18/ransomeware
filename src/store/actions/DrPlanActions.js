import i18n from 'i18next';
import { STORE_KEYS } from '../../constants/StoreKeyConstants';
import { getMemoryInfo, getNetworkIDFromName, getSubnetIDFromName, getLabelWithResourceGrp } from '../../utils/AppUtils';
import { DRPLAN_CONFIG_STEP } from '../../constants/DrplanConstants';
import { changedVMRecoveryConfigurations, validateRecoveryVMs } from '../../utils/validationUtils';
import { MILI_SECONDS_TIME, MONITORING_DISK_CHANGES } from '../../constants/EventConstant';
import { fetchByDelay } from '../../utils/SlowFetch';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import * as Types from '../../constants/actionTypes';
import {
  API_FETCH_DR_PLANS, API_START_DR_PLAN, API_STOP_DR_PLAN, API_DELETE_DR_PLAN, API_FETCH_DR_PLAN_BY_ID, API_FETCH_REVERSE_DR_PLAN_BY_ID, API_RECOVER, API_MIGRATE, API_REVERSE, API_PROTECTION_PLAN_VMS, API_PROTECTION_PLAN_UPDATE, API_PROTECTION_PLAN_PROTECTED_VMS, API_VM_ALERTS, API_EDIT_PROTECTED_VM, API_FETCH_VMWARE_INVENTORY, API_TEST_RECOVERY_CLEANUP, API_AUTO_MIGRATE_WORKFLOW, API_BULK_GENERATE,
} from '../../constants/ApiConstants';
import { addMessage } from './MessageActions';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { fetchNetworks, fetchSites, onRecoverSiteChange } from './SiteActions';
import { getCreateDRPlanPayload, getEditProtectionPlanPayload, getRecoveryPayload, getReversePlanPayload, getVMConfigPayload } from '../../utils/PayloadUtil';
import { clearValues, fetchScript, hideApplicationLoader, loadRecoveryLocationData, refresh, setInstanceDetails, setProtectionPlanScript, setTags, showApplicationLoader, valueChange } from './UserActions';
import { closeWizard, openWizard } from './WizardActions';
import { closeModal, openModal } from './ModalActions';
import { addAssociatedIPForAzure, addAssociatedReverseIP } from './AwsActions';
import { MIGRATION_WIZARDS, RECOVERY_WIZARDS, TEST_RECOVERY_WIZARDS, REVERSE_WIZARDS, UPDATE_PROTECTION_PLAN_WIZARDS, PROTECTED_VM_RECONFIGURATION_WIZARD, CLEANUP_TEST_RECOVERY_WIZARDS, STEPS } from '../../constants/WizardConstants';
import { getMatchingInsType, getValue, getVMMorefFromEvent, isSamePlatformPlan, getVMInstanceFromEvent, getMatchingOSType, getMatchingFirmwareType } from '../../utils/InputUtils';
import { PLATFORM_TYPES, STATIC_KEYS, UI_WORKFLOW } from '../../constants/InputConstants';
import { PROTECTION_PLANS_PATH } from '../../constants/RouterConstants';
import { MODAL_CONFIRMATION_WARNING, PPLAN_REMOVE_CHECKPOINT_RENDERER } from '../../constants/Modalconstant';
import { setVmwareInitialData, setVMwareTargetData } from './VMwareActions';
import { setCookie } from '../../utils/CookieUtils';
import { APPLICATION_GETTING_STARTED_COMPLETED } from '../../constants/UserConstant';
import { fetchCheckpointsByPlanId, getVmCheckpoints, setPplanRecoveryCheckpointData } from './checkpointActions';
import { fetchReplicationJobsByPplanId } from './JobActions';
import { onPlanPlaybookExport } from './DrPlaybooksActions';

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
    const { drPlans, user } = getState();
    const { selectedPlans } = drPlans;
    const { values } = user;
    const ids = Object.keys(selectedPlans);
    const planID = (typeof id === 'undefined' ? ids[0] : id);
    let url = API_DELETE_DR_PLAN.replace('<id>', planID);
    // To remove associated checkpoint while removing protection plan
    const removeAssosiatedCheckpoints = getValue(`${planID}-delete-checkpoints`, values) || false;
    url = `${url}?deleteRecoveryCheckpoint=${removeAssosiatedCheckpoints}`;
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
    const options = { title: 'Confirmation', confirmAction: deletePlan, message: 'Are you sure want to delete  ?', render: PPLAN_REMOVE_CHECKPOINT_RENDERER, id };
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
        // push getting started flag to local cache
        setCookie(APPLICATION_GETTING_STARTED_COMPLETED, true);
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

export function onProtectionPlanChange({ value, allowDeleted }) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const url = API_FETCH_DR_PLAN_BY_ID.replace('<id>', value);
    return callAPI(url)
      .then((json) => {
        if (json && json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          const data = [];
          const info = json.protectedEntities.virtualMachines || [];
          const rEntities = json.recoveryEntities.instanceDetails || [];
          const allVmMorefs = [];
          const planHasCheckpoints = getValue(STATIC_KEYS.UI_RECOVERY_CHECKPOINTS_BY_PLAN_ID, values) || [];
          const workflow = getValue(STATIC_KEYS.UI_WORKFLOW, values) || '';
          const isRecoveryFlow = (workflow === UI_WORKFLOW.RECOVERY || UI_WORKFLOW.TEST_RECOVERY || UI_WORKFLOW.MIGRATION) || false;
          if (planHasCheckpoints.length === 0 && !isRecoveryFlow) {
            // for clean up test recvery flow and for plan has no checkpoints
            info.forEach((vm) => {
              rEntities.forEach((rE) => {
                if (vm.moref === rE.sourceMoref) {
                  const machine = vm;
                  machine.name = rE.instanceName;
                  if (typeof vm.recoveryStatus !== 'undefined' && (vm.recoveryStatus === 'Migrated' || vm.recoveryStatus === 'Recovered' || vm.isRemovedFromPlan === true)) {
                    if (typeof allowDeleted === 'undefined' || !allowDeleted) {
                      machine.isDisabled = true;
                    }
                  }
                  dispatch(valueChange(`${vm.moref}-vmConfig.general.guestOS`, vm.guestOS));
                  dispatch(valueChange(`${vm.moref}-vmConfig.general.encryptionKey`, vm.encryptionKey));
                  dispatch(valueChange(`${vm.moref}-vmConfig.general.firmwareType`, getMatchingFirmwareType(vm.firmwareType)));
                  data.push(vm);
                }
              });
            });
          } else {
            const allVmCheckpoints = getValue(STATIC_KEYS.UI_RECOVERY_CHECKPOINTS_BY_PLAN_ID, values);
            info.forEach((vm) => {
              rEntities.forEach((rE) => {
                if (vm.moref === rE.sourceMoref) {
                  const machine = vm;
                  machine.name = rE.instanceName;
                  const vmHasCheckpoints = allVmCheckpoints[vm.moref] || [];
                  if (vm.isRemovedFromPlan === true) {
                    machine.isDisabled = true;
                  } else if ((typeof vm.recoveryStatus !== 'undefined' && (vm.recoveryStatus === 'Migrated' || vm.recoveryStatus === 'Recovered'))) {
                    if (vmHasCheckpoints.length === 0) {
                      machine.isDisabled = true;
                    } else {
                      machine.isDisabled = false;
                    }
                  }
                  dispatch(valueChange(`${vm.moref}-vmConfig.general.guestOS`, vm.guestOS));
                  dispatch(valueChange(`${vm.moref}-vmConfig.general.firmwareType`, vm.firmwareType));
                  dispatch(valueChange(`${vm.moref}-vmConfig.general.encryptionKey`, allVmMorefs.join(',')));
                  dispatch(valueChange(`${vm.moref}-vmConfig.general.encryptionKey`, vm.encryptionKey));
                  data.push(vm);
                }
              });
            });
          }
          dispatch(valueChange('ui.recovery.vms', data));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function onReverseProtectionPlanChange(ID) {
  return (dispatch) => {
    const url = API_FETCH_REVERSE_DR_PLAN_BY_ID.replace('<id>', ID);
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
          dispatch(setReverseData(json));
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
    const { values } = user;
    const payload = getRecoveryPayload(user);
    const workflow = getValue(STATIC_KEYS.UI_WORKFLOW, values);
    const obj = createPayload(API_TYPES.POST, { ...payload.recovery });
    dispatch(showApplicationLoader('RECOVERY-API-EXECUTION', 'Initiating Recovery'));
    return callAPI(API_RECOVER, obj).then((json) => {
      dispatch(hideApplicationLoader('RECOVERY-API-EXECUTION'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(closeWizard());
        dispatch(clearValues());
        let msg = '';
        if (workflow === UI_WORKFLOW.TEST_RECOVERY) {
          msg = i18n.t('test.recovery.loader.msg');
        } else {
          msg = i18n.t('recovery.loader.msg');
        }
        dispatch(addMessage(msg, MESSAGE_TYPES.SUCCESS));
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
    const { values } = user;
    const isAutoMigration = getValue('ui.automate.migration', values);
    const payload = getRecoveryPayload(user, true);
    const obj = createPayload(API_TYPES.POST, { ...payload.recovery });
    dispatch(showApplicationLoader('RECOVERY-API-EXECUTION', 'Initiating Migration'));
    const url = (isAutoMigration ? API_AUTO_MIGRATE_WORKFLOW : API_MIGRATE);
    return callAPI(url, obj).then((json) => {
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
        dispatch(refresh());
        dispatch(valueChange(STORE_KEYS.DRPLAN_DETAILS_ACTIVE_TAB, '3'));
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
    const { id, recoverySite, protectedSite, recoveryPointConfiguration } = protectionPlan;
    const { platformDetails } = recoverySite;
    const { isRecoveryCheckpointEnabled } = recoveryPointConfiguration;
    dispatch(clearValues());
    setTimeout(() => {
      dispatch(valueChange(STATIC_KEYS.UI_WORKFLOW, UI_WORKFLOW.MIGRATION));
      dispatch(valueChange('ui.values.recoveryPlatform', platformDetails.platformType));
      dispatch(fetchDrPlans('ui.values.drplan'));
      dispatch(valueChange('ui.isMigration.workflow', true));
      // set recovery plan id
      dispatch(valueChange('recovery.protectionplanID', id));
      dispatch(valueChange('ui.recovery.plan', protectionPlan));
      // fetch VMs for drPlan

      dispatch(onProtectionPlanChange({ value: id }));
      // set is test recovery flag to false
      if (platformDetails.platformType === PLATFORM_TYPES.Azure) {
        dispatch(fetchNetworks(recoverySite.id, undefined));
      }
      dispatch(valueChange(STORE_KEYS.RECOVERY_CHECKPOINTING_ENABLED, isRecoveryCheckpointEnabled));
      dispatch(valueChange('recovery.dryrun', false));
      let { steps } = MIGRATION_WIZARDS;
      if (protectedSite.platformDetails.platformType === PLATFORM_TYPES.VMware && platformDetails.platformType === PLATFORM_TYPES.VMware) {
        steps = removeStepsFromWizard(steps, STEPS.RECOVERY_CONFIG);
      }

      dispatch(openWizard(MIGRATION_WIZARDS.options, steps));
    }, 1000);
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
    const { id, recoverySite, protectedSite, recoveryPointConfiguration, recoveryEntities } = protectionPlan;
    const { isRecoveryCheckpointEnabled } = recoveryPointConfiguration;
    const { platformDetails } = recoverySite;
    const allVmMorefs = [];
    recoveryEntities.instanceDetails.forEach((el) => allVmMorefs.push(el.sourceMoref));
    dispatch(clearValues());
    const apis = [dispatch(getVmCheckpoints(id, allVmMorefs.join(',')))];
    if (platformDetails.platformType === PLATFORM_TYPES.Azure) {
      apis.push(dispatch(fetchNetworks(recoverySite.id, undefined)));
    }
    return Promise.all(apis).then(
      () => {
        const { jobs } = getState();
        const { vmCheckpoint } = jobs;
        dispatch(valueChange('ui.values.recoveryPlatform', platformDetails.platformType));
        dispatch(valueChange(STATIC_KEYS.UI_WORKFLOW, UI_WORKFLOW.RECOVERY));
        dispatch(fetchDrPlans('ui.values.drplan'));
        // set recovery plan id
        dispatch(valueChange('recovery.protectionplanID', id));
        dispatch(valueChange('ui.recovery.plan', protectionPlan));
        dispatch(valueChange('ui.values.recoveryPlatform', platformDetails.platformType));
        dispatch(valueChange('ui.values.protectionPlatform', protectedSite.platformDetails.platformType));
        // fetch VMs for drPlan
        dispatch(onProtectionPlanChange({ value: id }));
        // set is migration flag to false
        dispatch(valueChange('ui.isMigration.workflow', false));
        // set is test recovery flag to false
        dispatch(valueChange('recovery.dryrun', false));
        dispatch(valueChange('recovery.discardPartialChanges', false));
        dispatch(valueChange(STORE_KEYS.RECOVERY_CHECKPOINTING_ENABLED, isRecoveryCheckpointEnabled));
        let { steps } = RECOVERY_WIZARDS;
        if (vmCheckpoint.length === 0) {
          steps = [steps[0], ...steps.slice(2, steps.length)];
          steps[0].validate = (u, disp) => validateRecoveryVMs({ user: u, dispatch: disp });
          steps[0].isAsync = true;
        }
        dispatch(openWizard(RECOVERY_WIZARDS.options, steps));
        return new Promise((resolve) => resolve());
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
        return new Promise((resolve) => resolve());
      },
    );
  };
}

function removeStepsFromWizard(steps, stepName) {
  const res = [];
  for (let i = 0; i < steps.length; i += 1) {
    if (!steps[i].name || steps[i].name !== stepName) {
      res.push(steps[i]);
    }
  }
  return res;
}

export function openCleanupTestRecoveryWizard() {
  return (dispatch) => {
    dispatch(openTestRecoveryWizard(true));
  };
}
export function openTestRecoveryWizard(cleanUpTestRecoveries) {
  return (dispatch, getState) => {
    const { drPlans } = getState();
    const { protectionPlan } = drPlans;
    const { id, protectedSite, recoverySite, recoveryPointConfiguration, recoveryEntities } = protectionPlan;
    const { isRecoveryCheckpointEnabled } = recoveryPointConfiguration;
    const { platformDetails } = recoverySite;
    const protectedSitePlatform = protectedSite.platformDetails.platformType;
    dispatch(clearValues());
    setTimeout(() => {
      dispatch(valueChange('recovery.protectionplanID', id));
      dispatch(valueChange('ui.recovery.plan', protectionPlan));
      dispatch(valueChange('ui.isMigration.workflow', false));
      dispatch(valueChange('ui.values.protectionPlatform', protectedSitePlatform));
      dispatch(valueChange('ui.values.recoveryPlatform', platformDetails.platformType));
      dispatch(valueChange('ui.values.recoverySiteID', recoverySite.id));
      dispatch(valueChange('recovery.dryrun', true));
      dispatch(valueChange(STATIC_KEYS.UI_WORKFLOW, UI_WORKFLOW.TEST_RECOVERY));
      dispatch(valueChange('ui.recovery.option', 'current'));
      dispatch(valueChange(STORE_KEYS.RECOVERY_CHECKPOINTING_ENABLED, isRecoveryCheckpointEnabled));
      const allVmMorefs = [];
      recoveryEntities.instanceDetails.forEach((el) => allVmMorefs.push(el.sourceMoref));
      const apis = [dispatch(fetchSites('ui.values.sites')), dispatch(fetchNetworks(recoverySite.id, undefined)), dispatch(fetchScript()), dispatch(fetchDrPlans('ui.values.drplan')), dispatch(getVmCheckpoints(id, allVmMorefs.join(',')))];
      return Promise.all(apis).then(
        () => {
          const { jobs } = getState();
          const { vmCheckpoint } = jobs;
          const isCleanUpFlow = (typeof cleanUpTestRecoveries !== 'undefined' && cleanUpTestRecoveries === true);
          dispatch(fetchPlatformSpecificData(protectionPlan));
          if (isCleanUpFlow) {
            dispatch(valueChange(STATIC_KEYS.UI_WORKFLOW, UI_WORKFLOW.CLEANUP_TEST_RECOVERY));
            dispatch(openWizard(CLEANUP_TEST_RECOVERY_WIZARDS.options, CLEANUP_TEST_RECOVERY_WIZARDS.steps));
          } else {
            let { steps } = TEST_RECOVERY_WIZARDS;
            if (vmCheckpoint.length === 0) {
              steps = [...steps.slice(0, 2), ...steps.slice(3, steps.length)];
              steps[1].validate = (user) => validateRecoveryVMs({ user, dispatch });
              steps[1].isAsync = true;
            }
            dispatch(openWizard(TEST_RECOVERY_WIZARDS.options, steps));
          }
          dispatch(onProtectionPlanChange({ value: protectionPlan.id, allowDeleted: isCleanUpFlow }));
          dispatch(valueChange(STATIC_KEYS.UI_WORKFLOW_TEST_RECOVERY, true));
          return new Promise((resolve) => resolve());
        },
        (err) => {
          dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
          return new Promise((resolve) => resolve());
        },
      );
    }, 1000);
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

export function openEditProtectionPlanWizard(plan, isEventAction = false, alert = null, event = null) {
  return (dispatch, getState) => {
    const { drPlans } = getState();
    dispatch(clearValues());
    const selectedPlan = (typeof plan === 'undefined' ? getSelectedPlanID(drPlans) : plan);
    const { recoverySite, id, protectedSite } = selectedPlan;
    dispatch(valueChange('ui.values.recoveryPlatform', recoverySite.platformDetails.platformType));
    const apis = [dispatch(fetchSites('ui.values.sites')), dispatch(fetchNetworks(recoverySite.id, undefined)), dispatch(fetchScript())];
    return Promise.all(apis).then(
      () => {
        dispatch(valueChange('ui.editplan.alert.id', (alert !== null ? alert.id : alert)));
        dispatch(valueChange('ui.alert.invoking.action', alert));
        dispatch(valueChange('ui.selected.protection.planID', id));
        dispatch(valueChange('ui.selected.protection.plan', selectedPlan));
        dispatch(valueChange('drplan.recoverySite', selectedPlan.recoverySite.id));
        dispatch(valueChange(STATIC_KEYS.UI_WORKFLOW, UI_WORKFLOW.EDIT_PLAN));
        // fetch replication job by protection plan id and store it's value to enable encryption option while doing edit based on vm's last sync status
        if (recoverySite.platformDetails.platformType === PLATFORM_TYPES.AWS && protectedSite.platformDetails.platformType === PLATFORM_TYPES.AWS) {
          dispatch(fetchReplicationJobsByPplanId(id));
        }
        dispatch(setProtectionPlanDataForUpdate(selectedPlan, isEventAction, event));
        return new Promise((resolve) => resolve());
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
        return new Promise((resolve) => resolve());
      },
    );
  };
}

export function playbookExport(plan, planID = undefined) {
  return (dispatch) => {
    let { id } = plan;
    if (planID) {
      id = planID;
    }
    let url = API_BULK_GENERATE;
    url = `${url}`;
    const payload = {
      planID: `${id}`,
      playbookType: 'protectionPlan',
    };
    const obj = createPayload(API_TYPES.POST, payload);
    dispatch(showApplicationLoader('export-excel', 'Exporting configured excel'));
    return callAPI(url, obj).then((json) => {
      dispatch(hideApplicationLoader('export-excel'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        const { name } = json;
        if (typeof name !== 'undefined') {
          const result = `/playbooks/download/${json.name}`;
          const link = document.createElement('a');
          link.href = result;
          link.click();
        }
        dispatch(addMessage('Excel exported successfully', MESSAGE_TYPES.SUCCESS));
        dispatch(closeModal());
        dispatch(clearValues());
        dispatch(refresh());
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('export-excel'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

export function setProtectionPlanDataForUpdate(selectedPlan, isEventAction = false, event = null) {
  return (dispatch) => {
    dispatch(showApplicationLoader('UPDATE_PROTECTION_PLAN', 'Loading protection plan data...'));
    const wiz = UPDATE_PROTECTION_PLAN_WIZARDS;
    wiz.options.title = `Edit Plan - ${selectedPlan.name}`;
    wiz.options.onFinish = onEditProtectionPlan;
    const apis = [dispatch(setProtectionPlanVMsForUpdate(selectedPlan, isEventAction, event))];
    return Promise.all(apis)
      .then(
        () => {
          dispatch(hideApplicationLoader('UPDATE_PROTECTION_PLAN'));
          dispatch(onRecoverSiteChange({ value: selectedPlan.recoverySite.id }));
          dispatch(openWizard(wiz.options, UPDATE_PROTECTION_PLAN_WIZARDS.steps));
          dispatch(valueChange(STATIC_KEYS.UI_WORKFLOW, UI_WORKFLOW.EDIT_PLAN));
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
    let url = API_PROTECTION_PLAN_UPDATE.replace('<id>', id);
    const alerts = getValue('ui.vm.alerts', values);
    if (alerts && alerts.length > 0) {
      const alertIDs = alerts.map((a) => a.id).join(',');
      url = `${url}?alert=${alertIDs}`;
    }
    dispatch(showApplicationLoader('update-dr-plan', 'Updating protection plan...'));
    return callAPI(url, obj).then((json) => {
      dispatch(hideApplicationLoader('update-dr-plan'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(addMessage('Protection plan configured successfully.', MESSAGE_TYPES.SUCCESS));
        dispatch(closeWizard());
        dispatch(clearValues());
        fetchByDelay(dispatch, refresh, 2000);
      }
      changedVMRecoveryConfigurations(payload, user, dispatch);
    },
    (err) => {
      dispatch(hideApplicationLoader('update-dr-plan'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

export function setProtectionPlanVMsForUpdate(protectionPlan, isEventAction = false, event = null) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const { protectedSite, protectedEntities, id, recoveryEntities } = protectionPlan;
    const { virtualMachines } = protectedEntities;
    const { instanceDetails } = recoveryEntities;
    dispatch(valueChange('ui.site.recoveryEntities', instanceDetails));
    // extract the event impacted objects
    let vmMoref = '';
    if (event !== null && event.impactedObjectURNs !== '') {
      const parts = event.impactedObjectURNs.split(',');
      if (parts.length > 1) {
        const urn = parts[parts.length - 1].split(':');
        if (urn.length >= 2) {
          vmMoref = `${urn[urn.length - 2]}:${urn[urn.length - 1]}`;
        }
      }
    }
    // platformDetails.platformType
    if (PLATFORM_TYPES.VMware === protectedSite.platformDetails.platformType) {
      dispatch(valueChange('ui.values.protectionSiteID', protectedSite.id));
      const url = API_FETCH_VMWARE_INVENTORY.replace('<id>', protectedSite.id);
      dispatch(setVmwareInitialData(url, virtualMachines));
    }
    let url = (isEventAction ? API_PROTECTION_PLAN_PROTECTED_VMS.replace('<moref>', vmMoref) : API_PROTECTION_PLAN_VMS.replace('<sid>', protectedSite.id));
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
          if (isEventAction) {
            const alertID = getValue('ui.alertID', values);
            dispatch(valueChange('ui.site.vms', data.protectedEntities.virtualMachines));
            // if alert base edit then fetch all the alerts associated with the vmMoref
            dispatch(getVirtualMachineAlerts(vmMoref, alertID));
            data.protectedEntities.virtualMachines.forEach((vm) => {
              selectedVMS = { ...selectedVMS, [vm.moref]: { id: vm.id, ...vm } };
            });
          } else {
            dispatch(valueChange('ui.site.vms', data));
            // set selected vms for plan update
            virtualMachines.forEach((pvm) => {
              let isPvmFound = false;
              data.forEach((vm) => {
                if (pvm.moref === vm.moref) {
                  isPvmFound = true;
                  selectedVMS = { ...selectedVMS, [vm.moref]: setVMDetails(vm, pvm) };
                }
              });
              // If the vm is deleted from the source and we haven't acknowledge the alert
              // and goes to edit vm then we would not get the deleted vms info while fetching vm details from source and in recovery config we won't get the values so UI throws error
              // so to carry forward deleted vms details we take that vms details from pplan and fill it
              if (!isPvmFound) {
                selectedVMS = { ...selectedVMS, [pvm.moref]: setVMDetails(pvm, pvm) };
              }
            });
          }
          dispatch(valueChange(STATIC_KEYS.UI_SITE_SELECTED_VMS, selectedVMS));
          dispatch(setProtectionPlanVMConfig(selectedVMS, protectionPlan));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function setVMGuestOSInfo(selectedVMs) {
  return (dispatch) => {
    Object.keys(selectedVMs).forEach((key) => {
      if (selectedVMs[key]) {
        dispatch(valueChange(`${selectedVMs[key].moref}-vmConfig.general.guestOS`, getMatchingOSType(selectedVMs[key].guestOS)));
        dispatch(valueChange(`${selectedVMs[key].moref}-vmConfig.general.firmwareType`, getMatchingFirmwareType(selectedVMs[key].firmwareType)));
      }
    });
  };
}

export function setProtectionPlanVMConfig(selectedVMS, protectionPlan) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const { protectedEntities, recoveryEntities, protectedSite, recoverySite } = protectionPlan;
    const protectedSitePlatform = protectedSite.platformDetails.platformType;
    const recoverySitePlatform = recoverySite.platformDetails.platformType;
    if (protectedSitePlatform === PLATFORM_TYPES.AWS && PLATFORM_TYPES.AWS === recoverySitePlatform) {
      dispatch(fetchNetworks(protectedSite.id, 'source_network'));
    }
    dispatch(valueChange('ui.values.protectionPlatform', protectedSitePlatform));
    dispatch(valueChange('ui.values.recoveryPlatform', recoverySitePlatform));
    dispatch(valueChange('drplan.id', protectionPlan.id));
    dispatch(valueChange('ui.edit.plan.remoteProtectionPlanId', protectionPlan.remoteProtectionPlanId));
    dispatch(valueChange('drplan.name', protectionPlan.name));
    dispatch(valueChange('drplan.bootDelay', protectionPlan.bootDelay));
    dispatch(valueChange('drplan.preScript', protectionPlan.preScript));
    dispatch(valueChange('drplan.postScript', protectionPlan.postScript));
    dispatch(valueChange('drplan.preInputs', protectionPlan.preInputs));
    dispatch(valueChange('drplan.postInputs', protectionPlan.postInputs));
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
    dispatch(valueChange('drplan.isDedupe', protectionPlan.isDeDupe));
    dispatch(valueChange('drplan.enableDifferentialReverse', protectionPlan.enableDifferentialReverse));
    dispatch(valueChange('drplan.enablePPlanLevelScheduling', protectionPlan.enablePPlanLevelScheduling));
    dispatch(valueChange('drplan.replPostScript', protectionPlan.replPostScript));
    dispatch(valueChange('drplan.replPreScript', protectionPlan.replPreScript));
    dispatch(setPplanRecoveryCheckpointData(protectionPlan.recoveryPointConfiguration));
    const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
    switch (recoveryPlatform) {
      case PLATFORM_TYPES.AWS:
        return setAWSVMDetails(selectedVMS, protectionPlan, dispatch, user);
      case PLATFORM_TYPES.GCP:
        return setGCPVMDetails(selectedVMS, protectionPlan, dispatch, user);
      case PLATFORM_TYPES.VMware:
        return setVMWAREVMDetails(selectedVMS, protectionPlan, dispatch);
      case PLATFORM_TYPES.Azure:
        return setAZUREVMDetails(selectedVMS, protectionPlan, dispatch, user);
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
  const { recoveryEntities, protectedEntities } = protectionPlan;
  const { instanceDetails } = recoveryEntities;
  const { virtualMachines = [] } = protectedEntities;
  vms.forEach((vm) => {
    const key = vm.moref;
    virtualMachines.forEach((pvm) => {
      if (vm.moref === pvm.moref) {
        dispatch(setProtectionPlanScript(key, pvm));
        // setreplication priority while editing protection plan
        dispatch(valueChange(`${key}-vmConfig.general.replicationPriority`, pvm.replicationPriority));
      }
    });
    instanceDetails.forEach((ins) => {
      if (ins.sourceMoref === vm.moref) {
        dispatch(setInstanceDetails(key, ins));
        dispatch(setTags(key, ins));
        // network config "vm-1442-vmConfig.network.net1"
        const networkKey = `${key}-vmConfig.network.net1`;
        const eths = [];
        if (ins.networks && ins.networks.length > 0) {
          ins.networks.forEach((net, index) => {
            dispatch(valueChange(`${networkKey}-eth-${index}-id`, net.id));
            dispatch(valueChange(`${networkKey}-eth-${index}-vpcId`, net.vpcId));
            dispatch(valueChange(`${networkKey}-eth-${index}-subnet`, net.Subnet));
            dispatch(valueChange(`${networkKey}-eth-${index}-availZone`, ins.availZone));
            dispatch(valueChange(`${networkKey}-eth-${index}-isPublic`, net.isPublicIP));
            dispatch(valueChange(`${networkKey}-eth-${index}-network`, net.network));
            dispatch(valueChange(`${networkKey}-eth-${index}-publicIP`, net.publicIP));
            dispatch(valueChange(`${networkKey}-eth-${index}-privateIP`, net.privateIP));
            dispatch(addAssociatedReverseIP({ ip: net.publicIP, id: net.network, fieldKey: `${networkKey}-eth-${index}` }));
            const sgs = (net.securityGroups ? net.securityGroups.split(',') : []);
            dispatch(valueChange(`${networkKey}-eth-${index}-securityGroups`, sgs));
            eths.push({ key: `${networkKey}-eth-${index}`, isPublicIP: net.isPublicIP, publicIP: '', privateIP: net.privateIP, subnet: net.Subnet, securityGroup: sgs, network: net.network });
          });
          // check for additional nics
          if (vm.virtualNics.length > ins.networks.length) {
            // add missing additional nics for configuration
            for (let startIndex = ins.networks.length; startIndex < vm.virtualNics.length; startIndex += 1) {
              dispatch(valueChange(`${networkKey}-eth-${startIndex}-subnet`, ''));
              dispatch(valueChange(`${networkKey}-eth-${startIndex}-isPublic`, false));
              dispatch(valueChange(`${networkKey}-eth-${startIndex}-privateIP`, ''));
              dispatch(valueChange(`${networkKey}-eth-${startIndex}-securityGroup`, ''));
              dispatch(valueChange(`${networkKey}-eth-${startIndex}-network`, ''));
              eths.push({ key: `${networkKey}-eth-${startIndex}`, isPublicIP: false, publicIP: '', privateIP: '', subnet: '', securityGroup: '' });
            }
          }
          dispatch(valueChange(`${networkKey}`, eths));
        }
      }
    });
  });
}

function setGCPVMDetails(selectedVMS, protectionPlan, dispatch) {
  const vms = Object.values(selectedVMS);
  const { recoveryEntities, protectedEntities } = protectionPlan;
  const { instanceDetails } = recoveryEntities;
  const { virtualMachines = [] } = protectedEntities;
  vms.forEach((vm) => {
    const key = vm.moref;
    virtualMachines.forEach((pvm) => {
      if (vm.moref === pvm.moref) {
        dispatch(setProtectionPlanScript(key, pvm));
      }
    });
    instanceDetails.forEach((ins) => {
      if (ins.sourceMoref === vm.moref) {
        dispatch(setInstanceDetails(key, ins));
        if (ins.securityGroups && ins.securityGroups.length > 0) {
          const selSgs = ins.securityGroups.split(',') || '';
          dispatch(valueChange(`${key}-vmConfig.network.securityGroup`, selSgs));
        }
        dispatch(setTags(key, ins));
        // network config "vm-1442-vmConfig.network.net1"
        const networkKey = `${key}-vmConfig.network.net1`;
        const eths = [];
        if (ins.networks && ins.networks.length > 0) {
          ins.networks.forEach((net, index) => {
            dispatch(valueChange(`${networkKey}-eth-${index}-id`, net.id));
            dispatch(valueChange(`${networkKey}-eth-${index}-network`, net.network));
            dispatch(valueChange(`${networkKey}-eth-${index}-subnet`, net.Subnet));
            dispatch(valueChange(`${networkKey}-eth-${index}-privateIP`, net.privateIP));
            // dispatch(valueChange(`${networkKey}-eth-${index}-availZone`, ins.availZone));
            dispatch(valueChange(`${networkKey}-eth-${index}-publicIP`, net.publicIP));
            dispatch(valueChange(`${networkKey}-eth-${index}-networkTier`, net.networkTier));
            dispatch(valueChange(`${networkKey}-eth-${index}-isPublic`, false));
            eths.push({ key: `${networkKey}-eth-${index}`, isPublicIP: false, publicIP: '', privateIP: '', subnet: '', securityGroup: '' });
          });
          // check for additional nics
          if (vm.virtualNics.length > ins.networks.length) {
            // add missing additional nics for configuration
            for (let startIndex = ins.networks.length; startIndex < vm.virtualNics.length; startIndex += 1) {
              dispatch(valueChange(`${networkKey}-eth-${startIndex}-subnet`, ''));
              dispatch(valueChange(`${networkKey}-eth-${startIndex}-privateIP`, ''));
              dispatch(valueChange(`${networkKey}-eth-${startIndex}-publicIP`, ''));
              dispatch(valueChange(`${networkKey}-eth-${startIndex}-networkTier`, ''));
              dispatch(valueChange(`${networkKey}-eth-${startIndex}-isPublic`, false));
              eths.push({ key: `${networkKey}-eth-${startIndex}`, isPublicIP: false, publicIP: '', privateIP: '', subnet: '', securityGroup: '' });
            }
          }
          dispatch(valueChange(`${networkKey}`, eths));
        }
      }
    });
  });
}

function setVMWAREVMDetails(selectedVMS, protectionPlan, dispatch) {
  const vms = Object.values(selectedVMS);
  const { recoveryEntities, protectedEntities } = protectionPlan;
  const { instanceDetails } = recoveryEntities;
  const { virtualMachines = [] } = protectedEntities;
  vms.forEach((vm) => {
    const key = vm.moref;
    virtualMachines.forEach((pvm) => {
      if (vm.moref === pvm.moref) {
        dispatch(setProtectionPlanScript(key, pvm));
      }
    });
    instanceDetails.forEach((ins) => {
      if (ins.sourceMoref === vm.moref) {
        dispatch(setInstanceDetails(key, ins));
        dispatch(valueChange(`${key}-vmConfig.general.hostMoref`, { value: ins.hostMoref, label: ins.hostMoref }));
        dispatch(valueChange(`${key}-vmConfig.general.dataStoreMoref`, { value: ins.datastoreMoref, label: ins.datastoreMoref }));
        dispatch(valueChange(`${key}-vmConfig.general.numcpu`, ins.numCPU));
        const memory = getMemoryInfo(ins.memoryMB);
        dispatch(valueChange(`${key}-vmConfig.general-memory`, parseInt(memory[0], 10)));
        dispatch(valueChange(`${key}-vmConfig.general-unit`, memory[1]));
        dispatch(valueChange(`${key}-vmConfig.general.folderPath`, [ins.folderPath]));
        fetchByDelay(dispatch, setVMwareTargetData, 2000, [`${key}-vmConfig.general`, ins.datacenterMoref, ins.hostMoref]);
        if (ins.securityGroups && ins.securityGroups.length > 0) {
          dispatch(valueChange(`${key}-vmConfig.network.securityGroup`, ''));
        }
        dispatch(setTags(key, ins));
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
            dispatch(valueChange(`${networkKey}-eth-${index}-isPublic`, net.isPublicIP));
            dispatch(valueChange(`${networkKey}-eth-${index}-network`, { label: net.network, value: net.networkPlatformID }));
            dispatch(valueChange(`${networkKey}-eth-${index}-macAddress`, net.macAddress));
            dispatch(valueChange(`${networkKey}-eth-${index}-adapterType`, net.adapterType));
            dispatch(valueChange(`${networkKey}-eth-${index}-networkPlatformID`, net.networkPlatformID));
            dispatch(valueChange(`${networkKey}-eth-${index}-netmask`, net.netmask));
            dispatch(valueChange(`${networkKey}-eth-${index}-gateway`, net.gateway));
            dispatch(valueChange(`${networkKey}-eth-${index}-dnsserver`, net.dns));
            eths.push({ key: `${networkKey}-eth-${index}`, netmask: '', gateway: '', subnet: '', dns: '', publicIP: '' });
          });
          // check for additional nics
          if (vm.virtualNics.length > ins.networks.length) {
            // add missing additional nics for configuration
            for (let startIndex = ins.networks.length; startIndex < vm.virtualNics.length; startIndex += 1) {
              dispatch(valueChange(`${networkKey}-eth-${startIndex}-subnet`, ''));
              dispatch(valueChange(`${networkKey}-eth-${startIndex}-privateIP`, ''));
              dispatch(valueChange(`${networkKey}-eth-${startIndex}-publicIP`, ''));
              dispatch(valueChange(`${networkKey}-eth-${startIndex}-networkTier`, ''));
              dispatch(valueChange(`${networkKey}-eth-${startIndex}-isPublic`, false));
              eths.push({ key: `${networkKey}-eth-${startIndex}`, isPublicIP: false, publicIP: '', networkTier: '', subnet: '' });
            }
          }
          dispatch(valueChange(`${networkKey}`, eths));
        }
      }
    });
  });
}

function setAZUREVMDetails(selectedVMS, protectionPlan, dispatch, user) {
  const { values } = user;
  const vms = Object.values(selectedVMS);
  const { recoveryEntities, protectedEntities } = protectionPlan;
  const { instanceDetails } = recoveryEntities;
  const { virtualMachines = [] } = protectedEntities;
  vms.forEach((vm) => {
    const key = vm.moref;
    virtualMachines.forEach((pvm) => {
      if (vm.moref === pvm.moref) {
        dispatch(setProtectionPlanScript(key, pvm));
      }
    });
    instanceDetails.forEach((ins) => {
      if (ins.sourceMoref === vm.moref) {
        dispatch(setInstanceDetails(key, ins));
        dispatch(valueChange(`${key}-vmConfig.general.folderPath`, { label: ins.folderPath, value: ins.folderPath }));
        dispatch(valueChange(`${key}-vmConfig.general.availibility.zone`, ins.availZone));
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
            const { publicIp } = setPublicIPWhileEdit(net.isPublicIP, net.publicIP, networkKey, index, values, dispatch);
            const network = getNetworkIDFromName(net.network, values);
            dispatch(valueChange(`${networkKey}-eth-${index}-network`, network));
            const subnet = getSubnetIDFromName(net.Subnet, values, network);
            dispatch(valueChange(`${networkKey}-eth-${index}-subnet`, subnet));
            dispatch(valueChange(`${networkKey}-eth-${index}-privateIP`, net.privateIP));
            dispatch(valueChange(`${networkKey}-eth-${index}-publicIP`, publicIp));
            dispatch(valueChange(`${networkKey}-eth-${index}-networkTier`, net.networkTier));
            dispatch(valueChange(`${networkKey}-eth-${index}-isPublic`, false));
            let sgs = '';
            if (net.securityGroups && net.securityGroups !== '') {
              const securityLabel = getLabelWithResourceGrp(net.securityGroups);
              sgs = { label: securityLabel, value: net.securityGroups };
            }
            dispatch(valueChange(`${networkKey}-eth-${index}-securityGroups`, sgs));
            eths.push({ key: `${networkKey}-eth-${index}`, isPublicIP: false, publicIP: '', privateIP: '', subnet: '', securityGroup: sgs });
          });
          // check for additional nics
          if (vm.virtualNics.length > ins.networks.length) {
            // add missing additional nics for configuration
            for (let startIndex = ins.networks.length; startIndex < vm.virtualNics.length; startIndex += 1) {
              dispatch(valueChange(`${networkKey}-eth-${startIndex}-subnet`, ''));
              dispatch(valueChange(`${networkKey}-eth-${startIndex}-privateIP`, ''));
              dispatch(valueChange(`${networkKey}-eth-${startIndex}-publicIP`, ''));
              dispatch(valueChange(`${networkKey}-eth-${startIndex}-networkTier`, ''));
              dispatch(valueChange(`${networkKey}-eth-${startIndex}-isPublic`, false));
              eths.push({ key: `${networkKey}-eth-${startIndex}`, isPublicIP: false, publicIP: '', privateIP: '', subnet: '', securityGroup: '' });
            }
          }
          dispatch(valueChange(`${networkKey}`, eths));
        }
      }
    });
  });
}

export function setPublicIPWhileEdit(isPublicIP, publicip, networkKey, index, values, dispatch) {
  let publicIp = '';
  if (isPublicIP) {
    publicIp = 'true';
  } else if (publicip !== '') {
    publicIp = publicip;
  } else {
    publicIp = 'false';
  }
  if (publicIp !== '' && publicIp !== 'false' && publicIp !== 'true') {
    dispatch(addAssociatedIPForAzure({ ip: publicIp, id: publicIp, fieldKey: `${networkKey}-eth-${index}`, values }));
  }
  return { publicIp };
}

export function getVirtualMachineAlerts(moref, alertID) {
  return (dispatch, getState) => {
    if (moref === '') {
      const { user } = getState();
      const isAlertAvailable = getValue('ui.alert.invoking.action', user.values);
      if (typeof isAlertAvailable !== 'undefined' && isAlertAvailable !== '') {
        dispatch(valueChange('ui.isEventAction', true));
        dispatch(valueChange('ui.vm.alerts', [isAlertAvailable]));
        return;
      }
    }
    let url = API_VM_ALERTS.replace('<moref>', moref);
    if (typeof alertID !== 'undefined' && alertID !== '') {
      url = `${url}&alertID=${alertID}`;
    }
    return callAPI(url)
      .then((json) => {
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(valueChange('ui.isEventAction', true));
          dispatch(valueChange('ui.vm.alerts', json));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function initReconfigureProtectedVM(protectionPlanID, vmMoref = null, event = null, alert) {
  return async (dispatch) => {
    dispatch(showApplicationLoader('RECONFIGURE_VM', 'Loading...'));
    // get protection plan details
    function fetchProtection(id) {
      return callAPI(API_FETCH_DR_PLAN_BY_ID.replace('<id>', id)).then((json) => {
        dispatch(drPlanDetailsFetched(json));
        return json;
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
        return false;
      });
    }
    // get virtual machine details
    function getVMDetails(moref, plan, eve) {
      let url = (eve !== null ? API_PROTECTION_PLAN_PROTECTED_VMS.replace('<moref>', moref) : API_PROTECTION_PLAN_VMS.replace('<sid>', plan.protectedSite.id));
      url = url.replace('<pid>', plan.id);
      if (eve) {
        if (eve.type === MONITORING_DISK_CHANGES.DISK_TYPES || eve.type === MONITORING_DISK_CHANGES.DISK_IOPS) {
          url = `${url}&diskchange=true`;
        }
      }
      return callAPI(url).then((json) => {
        let selectedVMS = {};
        const vms = (eve !== null ? json.protectedEntities.virtualMachines : json);
        selectedVMS = {};
        vms.forEach((vm) => {
          if (vm.moref === moref) {
            selectedVMS = { ...selectedVMS, [vm.moref]: { ...vm } };
          }
        });
        return selectedVMS;
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
        return false;
      });
    }
    // get associated alerts for vm
    function getAssociatedAlerts(moref, alertID) {
      let url = API_VM_ALERTS.replace('<moref>', moref);
      if (typeof alertID !== 'undefined') {
        url = `${url}&alertID=${alertID}`;
      }
      return callAPI(url).then((json) => {
        dispatch(valueChange('ui.vm.alerts', json));
        return json;
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
        return false;
      });
    }
    // if event is passed then extract the protectionPlan ID
    let moref = vmMoref;
    let pPlan = '';
    if (protectionPlanID !== null) {
      pPlan = await fetchProtection(protectionPlanID);
      // while doing single vm edit if source and target both are AWS then need to fetch replication job to enable encryption option based on latest job status
      const { recoverySite, id, protectedSite } = pPlan;
      if (recoverySite.platformDetails.platformType === PLATFORM_TYPES.AWS && protectedSite.platformDetails.platformType === PLATFORM_TYPES.AWS) {
        dispatch(fetchReplicationJobsByPplanId(id));
      }
    } else if (event !== null) {
      const parts = event.impactedObjectURNs.split(',');
      const urn = parts[0].split(':');
      if (urn.length > 1) {
        const pid = urn[2];
        pPlan = await fetchProtection(pid);
      } else {
        dispatch(addMessage('Protection plan details not identified in the event.', MESSAGE_TYPES.ERROR));
        dispatch(hideApplicationLoader('RECONFIGURE_VM'));
        return;
      }
      // get protectection Plan details
      if (pPlan === false) {
        dispatch(hideApplicationLoader('RECONFIGURE_VM'));
        return;
      }
      if (vmMoref === null) {
        const { protectedSite } = pPlan;
        if (protectedSite.platformDetails.platformType === PLATFORM_TYPES.AWS) {
          moref = getVMInstanceFromEvent(event);
        } else {
          moref = getVMMorefFromEvent(event);
        }
        if (moref === '') {
          dispatch(addMessage('Virtual Machine info not available in the event.', MESSAGE_TYPES.ERROR));
          dispatch(hideApplicationLoader('RECONFIGURE_VM'));
          return;
        }
      }
    }
    const vms = await getVMDetails(moref, pPlan, event);
    let alerts = null;
    if (event !== null) {
      alerts = await getAssociatedAlerts(moref, alert.id);
    }
    if (pPlan === false || vms === false || alerts === false) {
      dispatch(addMessage('Failed to retrieve associate data for alert', MESSAGE_TYPES.ERROR));
      dispatch(hideApplicationLoader('RECONFIGURE_VM'));
      return;
    }
    dispatch(hideApplicationLoader('RECONFIGURE_VM'));
    if (vms) {
      dispatch(setVMGuestOSInfo(vms));
    }
    dispatch(openVMReconfigWizard(moref, pPlan, vms, alerts));
  };
}

export function openVMReconfigWizard(vmMoref, pPlan, selectedVMS, alerts) {
  return (dispatch) => {
    // set vm alerts for view
    dispatch(valueChange('ui.vm.alerts', alerts));
    dispatch(valueChange('ui.vm.reconfigure.vm.plan.id', pPlan.id));
    dispatch(valueChange('ui.vm.reconfigure.vm.moref', vmMoref));
    dispatch(valueChange(STATIC_KEYS.UI_SITE_SELECTED_VMS, selectedVMS));
    dispatch(valueChange('ui.values.recoveryPlatform', pPlan.recoverySite.platformDetails.platformType));
    let { steps } = PROTECTED_VM_RECONFIGURATION_WIZARD;
    if (typeof alerts === 'undefined' || alerts === null || alerts.length === 0) {
      steps = [steps[1]];
    } else {
      dispatch(valueChange('ui.vm.isVMAlertAction', true));
    }
    const apis = [dispatch(fetchSites('ui.values.sites')), dispatch(fetchScript()), dispatch(fetchNetworks(pPlan.recoverySite.id, undefined, pPlan.recoverySite.platformDetails.availZone))];
    return Promise.all(apis).then(
      () => {
        dispatch(valueChange('ui.editplan.alert.id', (alert !== null ? alert.id : alert)));
        dispatch(valueChange('ui.selected.protection.planID', pPlan.id));
        dispatch(valueChange('ui.selected.protection.plan', pPlan));
        dispatch(valueChange('drplan.recoverySite', pPlan.recoverySite.id));
        dispatch(setProtectionPlanVMConfig(selectedVMS, pPlan));
        if (isSamePlatformPlan(pPlan)) {
          dispatch(onRecoverSiteChange({ value: pPlan.recoverySite.id }));
        } else {
          dispatch(onRecoverSiteChange({ value: pPlan.recoverySite.id }));
        }
        const ops = PROTECTED_VM_RECONFIGURATION_WIZARD.options;
        ops.title = `Reconfigure ${selectedVMS[vmMoref].name}`;
        dispatch(openWizard(ops, steps));
        return new Promise((resolve) => resolve());
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
        return new Promise((resolve) => resolve());
      },
    );
  };
}

export function updateVMConfig() {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const id = getValue('ui.vm.reconfigure.vm.plan.id', values);
    const moref = getValue('ui.vm.reconfigure.vm.moref', values);
    const vmData = getVMConfigPayload(user);
    const payload = createPayload(API_TYPES.PATCH, { ...vmData[0] });
    let url = API_EDIT_PROTECTED_VM.replace('<pid>', id);
    url = `${url}?vmmoref=${moref}`;
    const alerts = getValue('ui.vm.alerts', values);
    if (alerts && alerts.length > 0) {
      const alertIDs = alerts.map((a) => a.id).join(',');
      url = `${url}&alert=${alertIDs}`;
    }
    dispatch(showApplicationLoader('RECONFIGURE_VM', 'Reconfiguring instance details...'));
    return callAPI(url, payload)
      .then((json) => {
        dispatch(hideApplicationLoader('RECONFIGURE_VM'));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(closeWizard());
          dispatch(addMessage('Virtual machine reconfigured', MESSAGE_TYPES.SUCCESS));
          dispatch(clearValues());
          dispatch(refresh());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('RECONFIGURE_VM'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function setRecoveryVMDetails(vmMoref) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
    switch (recoveryPlatform) {
      case PLATFORM_TYPES.AWS:
        dispatch(setAWSVMRecoveryData(vmMoref));
        return;
      case PLATFORM_TYPES.GCP:
        dispatch(setGCPVMRecoveryData(vmMoref));
        return;
      case PLATFORM_TYPES.VMware:
        dispatch(setVMwareVMRecoveryData(vmMoref));
        return;
      case PLATFORM_TYPES.Azure:
        dispatch(setAzureVMRecoveryData(vmMoref));
        return;
      default:
        dispatch(addMessage('Invalid recovery platform', MESSAGE_TYPES.ERROR));
    }
  };
}

export function setAWSVMRecoveryData(vmMoref) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const plan = getValue('ui.recovery.plan', values);
    // const workflow = getValue(STATIC_KEYS.UI_WORKFLOW, values);
    if (typeof plan === 'undefined' || plan === '' || !plan) {
      return;
    }
    const { recoveryEntities } = plan;
    const { instanceDetails } = recoveryEntities;
    instanceDetails.forEach((ins) => {
      const key = ins.sourceMoref;
      if (key === vmMoref) {
        dispatch(valueChange(`${key}-vmConfig.general.id`, ins.id));
        dispatch(valueChange(`${key}-vmConfig.general.sourceMoref`, ins.sourceMoref));
        dispatch(valueChange(`${key}-vmConfig.general.instanceType`, { label: ins.instanceType, value: ins.instanceType }));
        dispatch(valueChange(`${key}-vmConfig.general.volumeType`, ins.volumeType));
        dispatch(valueChange(`${key}-vmConfig.general.volumeIOPS`, ins.volumeIOPS));
        dispatch(valueChange(`${key}-vmConfig.general.encryptionKey`, ins.encryptionKey));
        dispatch(valueChange(`${key}-vmConfig.general.bootOrder`, ins.bootPriority));
        dispatch(valueChange(`${key}-vmConfig.general.instanceID`, ins.instanceID));
        dispatch(valueChange(`${key}-vmConfig.scripts.preScript`, ins.preScript));
        dispatch(valueChange(`${key}-vmConfig.scripts.postScript`, ins.postScript));
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
            dispatch(valueChange(`${networkKey}-eth-${index}-vpcId`, net.vpcId));
            dispatch(valueChange(`${networkKey}-eth-${index}-subnet`, net.Subnet));
            dispatch(valueChange(`${networkKey}-eth-${index}-availZone`, ins.availZone));
            dispatch(valueChange(`${networkKey}-eth-${index}-isPublic`, net.isPublicIP));
            dispatch(valueChange(`${networkKey}-eth-${index}-network`, net.network));
            dispatch(valueChange(`${networkKey}-eth-${index}-publicIP`, net.publicIP));
            dispatch(valueChange(`${networkKey}-eth-${index}-privateIP`, net.privateIP));
            dispatch(valueChange(`${networkKey}-eth-${index}-networkTier`, net.networkTier));
            dispatch(addAssociatedReverseIP({ ip: net.publicIP, id: net.network, fieldKey: `${networkKey}-eth-${index}` }));
            const sgs = (net.securityGroups ? net.securityGroups.split(',') : []);
            dispatch(valueChange(`${networkKey}-eth-${index}-securityGroups`, sgs));
            eths.push({ key: `${networkKey}-eth-${index}`, isPublicIP: net.isPublicIP, publicIP: '', privateIP: net.privateIP, subnet: net.Subnet, securityGroup: sgs, network: net.network });
          });
          dispatch(valueChange(networkKey, eths));
        }
      }
    });
  };
}

export function setVMwareVMRecoveryData(vmMoref) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const plan = getValue('ui.recovery.plan', values);
    const workflow = getValue(STATIC_KEYS.UI_WORKFLOW, values);
    if (typeof plan === 'undefined' || plan === '' || !plan) {
      return;
    }
    const { recoveryEntities } = plan;
    const { instanceDetails } = recoveryEntities;
    instanceDetails.forEach((ins) => {
      const key = ins.sourceMoref;
      if (key === vmMoref) {
        dispatch(valueChange(`${key}-vmConfig.general.id`, ins.id));
        dispatch(valueChange(`${key}-vmConfig.general.sourceMoref`, ins.moref));
        dispatch(valueChange(`${key}-vmConfig.general.instanceType`, ins.instanceType));
        dispatch(valueChange(`${key}-vmConfig.general.volumeType`, ins.volumeType));
        dispatch(valueChange(`${key}-vmConfig.general.bootOrder`, ins.bootPriority));
        dispatch(valueChange(`${key}-vmConfig.general.instanceID`, ins.instanceID));
        dispatch(valueChange(`${key}-vmConfig.scripts.preScript`, ins.preScript));
        dispatch(valueChange(`${key}-vmConfig.scripts.postScript`, ins.postScript));
        dispatch(valueChange(`${key}-vmConfig.general.hostMoref`, { value: ins.hostMoref, label: ins.hostMoref }));
        dispatch(valueChange(`${key}-vmConfig.general.dataStoreMoref`, { value: ins.datastoreMoref, label: ins.datastoreMoref }));
        dispatch(valueChange(`${key}-vmConfig.general.numcpu`, ins.numCPU));
        dispatch(valueChange(`${key}-vmConfig.general.folderPath`, [ins.folderPath]));
        if (workflow === UI_WORKFLOW.REVERSE_PLAN || workflow === UI_WORKFLOW.TEST_RECOVERY) {
          const memory = getMemoryInfo(ins.memoryMB);
          dispatch(valueChange(`${key}-vmConfig.general-memory`, parseInt(memory[0], 10)));
          dispatch(valueChange(`${key}-vmConfig.general-unit`, memory[1]));
          // Only for edit test recovery flow to get the options for folder path,compute resources
          fetchByDelay(dispatch, setVMwareTargetData, MILI_SECONDS_TIME.ONE_HUNDRED_MS, [`${key}-vmConfig.general`, ins.datacenterMoref, ins.hostMoref]);
        } else {
        // For full Recovery Flow
          dispatch(valueChange(`${key}-vmConfig.general-memory`, ins.memoryMB));
          dispatch(valueChange(`${key}-vmConfig.general-unit`, 'MB'));
        }
        const networkKey = `${key}-vmConfig.network.net1`;
        const eths = [];
        if (ins.networks && ins.networks.length > 0) {
          ins.networks.forEach((net, index) => {
            dispatch(valueChange(`${networkKey}-eth-${index}-id`, net.id));
            dispatch(valueChange(`${networkKey}-eth-${index}-subnet`, net.Subnet));
            dispatch(valueChange(`${networkKey}-eth-${index}-privateIP`, net.privateIP));
            dispatch(valueChange(`${networkKey}-eth-${index}-publicIP`, net.publicIP));
            dispatch(valueChange(`${networkKey}-eth-${index}-networkTier`, net.networkTier));
            dispatch(valueChange(`${networkKey}-eth-${index}-isPublic`, net.isPublicIP));
            dispatch(valueChange(`${networkKey}-eth-${index}-network`, { label: net.network, value: net.networkPlatformID }));
            dispatch(valueChange(`${networkKey}-eth-${index}-macAddress`, net.macAddress));
            dispatch(valueChange(`${networkKey}-eth-${index}-adapterType`, net.adapterType));
            dispatch(valueChange(`${networkKey}-eth-${index}-networkPlatformID`, net.networkPlatformID));
            dispatch(valueChange(`${networkKey}-eth-${index}-publicIP`, net.publicIP));
            dispatch(valueChange(`${networkKey}-eth-${index}-netmask`, net.netmask));
            dispatch(valueChange(`${networkKey}-eth-${index}-gateway`, net.gateway));
            dispatch(valueChange(`${networkKey}-eth-${index}-dnsserver`, net.dns));
            eths.push({ key: `${networkKey}-eth-${index}`, isPublicIP: net.isPublicIP, publicIP: '', privateIP: '', subnet: '', securityGroup: '' });
          });
          dispatch(valueChange(`${networkKey}`, eths));
        }
      }
    });
  };
}

export function setGCPVMRecoveryData(vmMoref) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const plan = getValue('ui.recovery.plan', values);
    if (typeof plan === 'undefined' || plan === '' || !plan) {
      return;
    }
    const { recoveryEntities } = plan;
    const { instanceDetails } = recoveryEntities;
    instanceDetails.forEach((ins) => {
      const key = ins.sourceMoref;
      if (key === vmMoref) {
        dispatch(valueChange(`${key}-vmConfig.general.id`, ins.id));
        dispatch(valueChange(`${key}-vmConfig.general.sourceMoref`, vmMoref));
        dispatch(valueChange(`${key}-vmConfig.general.instanceType`, { label: ins.instanceType, value: ins.instanceType }));
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
            dispatch(valueChange(`${networkKey}-eth-${index}-network`, net.network));
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
  };
}

export function setAzureVMRecoveryData(vmMoref) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const plan = getValue('ui.recovery.plan', values);
    if (typeof plan === 'undefined' || plan === '' || !plan) {
      return;
    }
    const { recoveryEntities } = plan;
    const { instanceDetails } = recoveryEntities;
    instanceDetails.forEach((ins) => {
      const key = ins.sourceMoref;
      if (key === vmMoref) {
        dispatch(valueChange(`${key}-vmConfig.general.id`, ins.id));
        dispatch(valueChange(`${key}-vmConfig.general.sourceMoref`, vmMoref));
        const insType = getMatchingInsType(values, ins);
        dispatch(valueChange(`${key}-vmConfig.general.instanceType`, insType));
        dispatch(valueChange(`${key}-vmConfig.general.volumeType`, ins.volumeType));
        dispatch(valueChange(`${key}-vmConfig.general.bootOrder`, ins.bootPriority));
        dispatch(valueChange(`${key}-vmConfig.general.instanceID`, ins.instanceID));
        dispatch(valueChange(`${key}-vmConfig.scripts.preScript`, ins.preScript));
        dispatch(valueChange(`${key}-vmConfig.scripts.postScript`, ins.postScript));
        dispatch(valueChange(`${key}-vmConfig.general.folderPath`, { label: ins.folderPath, value: ins.folderPath }));
        dispatch(valueChange(`${key}-vmConfig.general.availibility.zone`, ins.availZone));
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
            // TODO: Code refactor required, all vm level data setting must happen through one function only.
            const { publicIp } = setPublicIPWhileEdit(net.isPublicIP, net.publicIP, networkKey, index, values, dispatch);
            const network = getNetworkIDFromName(net.network, values);
            dispatch(valueChange(`${networkKey}-eth-${index}-network`, network));
            const subnet = getSubnetIDFromName(net.Subnet, values, network);
            dispatch(valueChange(`${networkKey}-eth-${index}-subnet`, subnet));
            dispatch(valueChange(`${networkKey}-eth-${index}-privateIP`, net.privateIP));
            dispatch(valueChange(`${networkKey}-eth-${index}-publicIP`, publicIp));
            dispatch(valueChange(`${networkKey}-eth-${index}-networkTier`, net.networkTier));
            dispatch(valueChange(`${networkKey}-eth-${index}-isPublic`, false));
            let sgs = '';
            let securityLabel = '';
            if (net.securityGroups && net.securityGroups !== '') {
              securityLabel = getLabelWithResourceGrp(net.securityGroups);
              sgs = { label: securityLabel, value: net.securityGroups };
            }
            dispatch(valueChange(`${networkKey}-eth-${index}-securityGroups`, sgs));
            eths.push({ key: `${networkKey}-eth-${index}`, isPublicIP: false, publicIP: '', privateIP: '', subnet: '', securityGroup: sgs });
          });
          dispatch(valueChange(`${networkKey}`, eths));
        }
      }
    });
  };
}
/**
 * fetch required data for perticular platform
 * @param {*} pplan : Protection plan
 */

function fetchPlatformSpecificData(pPlan) {
  return (dispatch) => {
    const { recoverySite } = pPlan;
    const { platformDetails } = recoverySite;
    let availZone = '';
    if (!isSamePlatformPlan(pPlan)) {
      availZone = recoverySite.platformDetails.availZone;
    }
    if (platformDetails.platformType === PLATFORM_TYPES.VMware) {
      dispatch(loadRecoveryLocationData(recoverySite.id));
    }
    dispatch(fetchNetworks(recoverySite.id, undefined, availZone));
  };
}

export function cleanupTestRecoveries() {
  return (dispatch, getState) => {
    const { user } = getState();
    const values = user;
    const payload = getRecoveryPayload(values);
    const obj = createPayload(API_TYPES.DELETE, { ...payload.recovery });
    dispatch(showApplicationLoader('RECOVERY-API-EXECUTION', 'Initiating Test recovery cleanup'));
    return callAPI(API_TEST_RECOVERY_CLEANUP, obj).then((json) => {
      dispatch(hideApplicationLoader('RECOVERY-API-EXECUTION'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(closeWizard());
        dispatch(clearValues());
        dispatch(addMessage('Test Recovery cleanup initiated successfully.', MESSAGE_TYPES.SUCCESS));
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('RECOVERY-API-EXECUTION'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

/**
 * setVMDetails
 * @param {*} vmDetails vm details retrieve from the API response
 * @param {*} protectedVMInfo protected vm details from the plan
 * @returns required vm details for the protection plan edit.
 */
function setVMDetails(vmDetails, protectedVMInfo) {
  if (protectedVMInfo.isDelete || protectedVMInfo.isRemovedFromPlan) {
    return { id: protectedVMInfo.id, ...protectedVMInfo };
  }
  return { id: protectedVMInfo.id, ...vmDetails };
}

function setReverseData(json) {
  return (dispatch) => {
    const { id, protectedSite, recoverySite } = json;
    const { platformDetails } = recoverySite;
    const protectedSitePlatform = protectedSite.platformDetails.platformType;
    setTimeout(() => {
      dispatch(valueChange('recovery.protectionplanID', id));
      dispatch(valueChange('ui.isMigration.workflow', false));
      dispatch(valueChange('ui.values.protectionPlatform', protectedSitePlatform));
      dispatch(valueChange('ui.values.recoveryPlatform', platformDetails.platformType));
      dispatch(valueChange('ui.values.recoverySiteID', recoverySite.id));
      dispatch(valueChange('ui.recovery.plan', json));
      dispatch(setPplanRecoveryCheckpointData(json.recoveryPointConfiguration));
      dispatch(valueChange(STATIC_KEYS.UI_WORKFLOW, UI_WORKFLOW.REVERSE_PLAN));
      if (!json.enableDifferentialReverse) {
        dispatch(valueChange('reverse.replType', STATIC_KEYS.FULL_INCREMENTAL));
      } else {
        dispatch(valueChange('reverse.replType', STATIC_KEYS.DIFFERENTIAL));
      }
      const apis = [dispatch(fetchSites('ui.values.sites')), dispatch(fetchNetworks(recoverySite.id, undefined)), dispatch(fetchScript()), dispatch(fetchDrPlans('ui.values.drplan')), dispatch(fetchCheckpointsByPlanId(id, `${id}-has-checkpoints`))];
      return Promise.all(apis).then(
        () => {
          dispatch(fetchPlatformSpecificData(json));
          // for setting recovery data of all vm
          // vm selection is their in reverse edit then remove this
          // const data = [];
          dispatch(setReverseConfig(json));
          const info = json.protectedEntities.virtualMachines || [];
          const rEntities = json.recoveryEntities.instanceDetails || [];
          let selectedVMs = {};
          info.forEach((vm) => {
            rEntities.forEach((rE) => {
              if (vm.moref === rE.sourceMoref) {
                // data.push(vm);
                selectedVMs = { ...selectedVMs, [vm.moref]: vm };
                // set replication priority of vms
                if (platformDetails.platformType === PLATFORM_TYPES.AWS) {
                  dispatch(valueChange(`${vm.moref}-vmConfig.general.replicationPriority`, vm.replicationPriority));
                }
                dispatch(setRecoveryVMDetails(vm.moref));
              }
            });
          });
          dispatch(valueChange(STATIC_KEYS.UI_SITE_SELECTED_VMS, selectedVMs));
          dispatch(setVMGuestOSInfo(selectedVMs));
          // for giving selection of vm in wizard if vm selection is not their then remove this
          // dispatch(valueChange('ui.site.vms', data));
          dispatch(openWizard(REVERSE_WIZARDS.options, REVERSE_WIZARDS.steps));
          return new Promise((resolve) => resolve());
        },
        (err) => {
          dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
          return new Promise((resolve) => resolve());
        },
      );
    }, 1000);
  };
}

/**
 * For setting replication interval,boot priority and script of the reverse vm
 * @param {*} protectionPlan
 */

export function setReverseConfig(protectionPlan) {
  return (dispatch) => {
    const { protectedEntities, recoveryEntities, protectedSite, recoverySite } = protectionPlan;
    const protectedSitePlatform = protectedSite.platformDetails.platformType;
    const recoverySitePlatform = recoverySite.platformDetails.platformType;
    dispatch(valueChange(DRPLAN_CONFIG_STEP.PROTECTION_PLATFORM, protectedSitePlatform));
    dispatch(valueChange(DRPLAN_CONFIG_STEP.RECOVERY_PLATFORM, recoverySitePlatform));
    if (isSamePlatformPlan(protectionPlan)) {
      dispatch(fetchNetworks(protectedSite.id, 'source_network'));
    } else {
      dispatch(fetchNetworks(recoverySite.id, undefined));
    }
    dispatch(valueChange('drplan.id', protectionPlan.id));
    dispatch(valueChange(DRPLAN_CONFIG_STEP.REMOTEPPLAN_ID, protectionPlan.remoteProtectionPlanId));
    dispatch(valueChange('drplan.name', protectionPlan.name));
    dispatch(valueChange('drplan.bootDelay', protectionPlan.bootDelay));
    dispatch(valueChange('drplan.preScript', protectionPlan.preScript));
    dispatch(valueChange('drplan.postScript', protectionPlan.postScript));
    dispatch(valueChange('drplan.preInputs', protectionPlan.preInputs));
    dispatch(valueChange('drplan.postInputs', protectionPlan.postInputs));
    dispatch(valueChange('drplan.protectedSite', protectionPlan.protectedSite.id));
    dispatch(valueChange('drplan.recoverySite', protectionPlan.recoverySite.id));
    dispatch(valueChange('drplan.replicationInterval', protectionPlan.replicationInterval));
    dispatch(valueChange('drplan.scriptTimeout', protectionPlan.scriptTimeout));
    dispatch(valueChange(DRPLAN_CONFIG_STEP.PROTECTED_ENTITIES_ID, protectedEntities.id));
    dispatch(valueChange(DRPLAN_CONFIG_STEP.RECOVERY_ENTITIES_ID, recoveryEntities.id));
    dispatch(valueChange(DRPLAN_CONFIG_STEP.STATUS, protectionPlan.status));
    dispatch(valueChange(DRPLAN_CONFIG_STEP.PLAN_ID, protectionPlan.id));
    const time = protectionPlan.startTime * 1000;
    const d = new Date(time);
    dispatch(valueChange('drplan.startTime', d));
    dispatch(valueChange('drplan.isEncryptionOnWire', protectionPlan.isEncryptionOnWire));
    dispatch(valueChange('drplan.isEncryptionOnWireOnRest', protectionPlan.isEncryptionOnRest));
    dispatch(valueChange('drplan.isCompression', protectionPlan.isCompression));
    dispatch(valueChange('drplan.isDeDupe', protectionPlan.isDeDupe));
    dispatch(valueChange('drplan.enableDifferentialReverse', protectionPlan.enableDifferentialReverse));
    dispatch(valueChange('drplan.enablePPlanLevelScheduling', protectionPlan.enablePPlanLevelScheduling));
    dispatch(valueChange('drplan.replPostScript', protectionPlan.replPostScript));
    dispatch(valueChange('drplan.replPreScript', protectionPlan.replPreScript));
  };
}
export function onPlaybookExportClick(plan) {
  return (dispatch) => {
    const { id } = plan;
    dispatch(onPlanPlaybookExport(id));
  };
}
