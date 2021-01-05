import { onConfigureDRPlan, startRecovery } from '../store/actions/DrPlanActions';
import { noValidate, validateDRPlanProtectData, validateSteps } from '../utils/validationUtils';

export const DRPLAN_GENERAL_SETTINGS_STEP = 'DRPLAN_GENERAL_SETTINGS_STEP';
export const DRPLAN_RECOVERY_STEP = 'DRPLAN_RECOVERY_STEP';
export const DRPLAN_PROTECT_STEP = 'DRPLAN_PROTECT_STEP';
export const DRPLAN_GENERAL_SETTINGS_STEP_FIELDS = ['drplan.name', 'drplan.replicationInterval', 'drplan.protectedSite', 'drplan.recoverySite'];
export const DRPLAN_RECOVERY_CONFIG_AWS_STEP_FIELDS = ['drplan.recoveryEntities.instanceDetails.amiID', 'drplan.recoveryEntities.instanceDetails.instanceType', 'drplan.recoveryEntities.instanceDetails.availabilityZone', 'drplan.recoveryEntities.instanceDetails.volumeType'];

export const RECOVERY_GENERAL_STEP = 'RECOVERY_GENERAL_STEP';
export const RECOVERY_PROTECT_VM_STEP = 'RECOVERY_PROTECT_VM_STEP';
export const RECOVERY_SUMMARY = 'RECOVERY_SUMMARY';
export const RECOVERY_GENERAL_STEP_FIELDS = ['recovery.drplanID', 'recovery.dryrun', 'recovery.winUser', 'recovery.winPassword'];

// Protection Plan
export const CREATE_DR_PLAN_WIZARDS = {
  options: { title: 'Create Protection Plan', onFinish: onConfigureDRPlan },
  steps: [{ label: 'General', title: '', component: DRPLAN_GENERAL_SETTINGS_STEP, validate: (user, dispatch, fields) => validateSteps(user, dispatch, fields), fields: DRPLAN_GENERAL_SETTINGS_STEP_FIELDS },
    { label: 'Machines', title: '', component: DRPLAN_PROTECT_STEP, validate: (user, dispatch) => validateDRPlanProtectData({ user, dispatch }) },
    { label: 'Recovery Configuration', title: '', component: DRPLAN_RECOVERY_STEP, validate: (user, dispatch, fields) => validateSteps(user, dispatch, fields), fields: DRPLAN_RECOVERY_CONFIG_AWS_STEP_FIELDS }],
};

// Recovery
export const RECOVERY_WIZARDS = {
  options: { title: 'Recovery', onFinish: startRecovery },
  steps: [{ label: 'General', title: '', component: RECOVERY_GENERAL_STEP, validate: (user, dispatch, fields) => validateSteps(user, dispatch, fields), fields: RECOVERY_GENERAL_STEP_FIELDS },
    { label: 'Machines', title: '', component: RECOVERY_PROTECT_VM_STEP, validate: (user, dispatch) => validateDRPlanProtectData({ user, dispatch }) },
    { label: 'Summary', title: '', component: RECOVERY_SUMMARY, validate: (user, dispatch) => noValidate(user, dispatch) }],
};
