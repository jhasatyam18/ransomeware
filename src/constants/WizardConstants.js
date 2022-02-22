import { onConfigureDRPlan, startMigration, startRecovery, startReversePlan } from '../store/actions/DrPlanActions';
import { noValidate, validateDRPlanProtectData, validateSteps, validateMigrationVMs, validateVMConfiguration, validateRecoveryVMs, validateReversePlan } from '../utils/validationUtils';

export const WIZARD_STEP = 'WIZARD_STEP';
export const DRPLAN_GENERAL_SETTINGS_STEP = 'DRPLAN_GENERAL_SETTINGS_STEP';
export const DRPLAN_PROTECTION_CONFIG_STEP = 'DRPLAN_PROTECTION_CONFIG_STEP';
export const DRPLAN_RECOVERY_STEP = 'DRPLAN_RECOVERY_STEP';
export const DRPLAN_PROTECT_STEP = 'DRPLAN_PROTECT_STEP';
export const DRPLAN_BOOT_ORDER_STEP = 'DRPLAN_BOOT_ORDER_STEP';
export const DRPLAN_VM_CONFIG_STEP = 'DRPLAN_VM_CONFIG_STEP';
export const DRPLAN_GENERAL_SETTINGS_STEP_FIELDS = ['drplan.name', 'drplan.protectedSite', 'drplan.recoverySite'];
export const DRPLAN_PROTECTION_CONFIG_STEP_FIELDS = ['drplan.startTime', 'drplan.replicationInterval', 'drplan.isEncryptionOnWire', 'drplan.isCompression', 'drplan.isDedupe', 'drplan.enableReverse'];
export const DRPLAN_SCRIPTS_CONFIG_STEP_FIELDS = ['drplan.preScript', 'drplan.postScript', 'drplan.scriptTimeout'];
// export const DRPLAN_RECOVERY_CONFIG_AWS_STEP_FIELDS = ['drplan.recoveryEntities.instanceDetails.amiID', 'drplan.recoveryEntities.instanceDetails.instanceType', 'drplan.recoveryEntities.instanceDetails.availabilityZone', 'drplan.recoveryEntities.instanceDetails.volumeType'];
export const RECOVERY_SUMMARY = 'RECOVERY_SUMMARY';
export const PROTECTION_PLAN_SUMMARY_STEP = 'PROTECTION_PLAN_SUMMARY_STEP';
export const RECOVERY_GENERAL_STEP = 'RECOVERY_GENERAL_STEP';
export const RECOVERY_PROTECT_VM_STEP = 'RECOVERY_PROTECT_VM_STEP';
export const MIGRATION_GENERAL_STEP = 'MIGRATION_GENERAL_STEP';
export const RECOVERY_CONFIG = 'RECOEVRY_CONFIG';
export const REVERSE_CONFIG_STEP = 'REVERSE_CONFIG_STEP';
export const REVERSE_SUMMARY = 'REVERSE_SUMMARY';

export const RECOVERY_GENERAL_STEP_FIELDS = ['recovery.protectionplanID', 'recovery.dryrun'];
export const MIGRATION_GENERAL_STEP_FIELDS = ['recovery.protectionplanID'];

// Protection Plan
export const CREATE_DR_PLAN_WIZARDS = {
  options: { title: 'Create Protection Plan', onFinish: onConfigureDRPlan },
  steps: [{ label: 'General', title: '', component: WIZARD_STEP, validate: (user, dispatch, fields) => validateSteps(user, dispatch, fields), fields: DRPLAN_GENERAL_SETTINGS_STEP_FIELDS },
    { label: 'Virtual Machines', title: '', component: DRPLAN_PROTECT_STEP, validate: (user, dispatch) => validateDRPlanProtectData({ user, dispatch }) },
    { label: 'Recovery Configuration', title: '', component: DRPLAN_VM_CONFIG_STEP, validate: (user, dispatch) => validateVMConfiguration({ user, dispatch }) },
    { label: 'Boot Order', title: '', component: DRPLAN_BOOT_ORDER_STEP, validate: (user, dispatch) => noValidate(user, dispatch) },
    // { label: 'Recovery Configuration', title: '', component: DRPLAN_RECOVERY_STEP, validate: (user, dispatch, fields) => validateSteps(user, dispatch, fields), fields: DRPLAN_RECOVERY_CONFIG_AWS_STEP_FIELDS },
    { label: 'Replication Configuration', title: '', component: WIZARD_STEP, validate: (user, dispatch, fields) => validateSteps(user, dispatch, fields), fields: DRPLAN_PROTECTION_CONFIG_STEP_FIELDS },
    { label: 'Scripts', title: '', component: WIZARD_STEP, validate: (user, dispatch) => noValidate(user, dispatch), fields: DRPLAN_SCRIPTS_CONFIG_STEP_FIELDS },
    { label: 'Summary', title: '', component: PROTECTION_PLAN_SUMMARY_STEP, validate: (user, dispatch) => noValidate(user, dispatch) }],
};

// Recovery
export const RECOVERY_WIZARDS = {
  // { label: 'General', title: '', component: RECOVERY_GENERAL_STEP, validate: (user, dispatch, fields) => validateSteps(user, dispatch, fields), fields: RECOVERY_GENERAL_STEP_FIELDS },
  options: { title: 'Recovery', onFinish: startRecovery },
  steps: [
    { label: 'Virtual Machines', title: '', component: RECOVERY_PROTECT_VM_STEP, validate: (user, dispatch) => validateRecoveryVMs({ user, dispatch }), isAync: true },
    { label: 'Recovery Configuration', title: '', component: RECOVERY_CONFIG, validate: (user, dispatch) => noValidate(user, dispatch) },
    { label: 'Summary', title: '', component: RECOVERY_SUMMARY, validate: (user, dispatch) => noValidate(user, dispatch) }],
};

// Migration Wizard
export const MIGRATION_WIZARDS = {
  options: { title: 'Migrate', onFinish: startMigration },
  steps: [
    { label: 'Virtual Machines', title: '', component: RECOVERY_PROTECT_VM_STEP, validate: (user, dispatch) => validateMigrationVMs({ user, dispatch }), isAync: true },
    { label: 'Recovery Configuration', title: '', component: RECOVERY_CONFIG, validate: (user, dispatch) => noValidate(user, dispatch) },
    { label: 'Summary', title: '', component: RECOVERY_SUMMARY, validate: (user, dispatch) => noValidate(user, dispatch) }],
};

// Test Recovery Wizard
export const TEST_RECOVERY_WIZARDS = {
  options: { title: 'Test Recovery', onFinish: startRecovery },
  steps: [
    { label: 'Virtual Machines', title: '', component: RECOVERY_PROTECT_VM_STEP, validate: (user, dispatch) => validateRecoveryVMs({ user, dispatch }), isAync: true },
    { label: 'Recovery Configuration', title: '', component: RECOVERY_CONFIG, validate: (user, dispatch) => noValidate(user, dispatch) },
    { label: 'Summary', title: '', component: RECOVERY_SUMMARY, validate: (user, dispatch) => noValidate(user, dispatch) }],
};

// Reverse Wizard
export const REVERSE_WIZARDS = {
  options: { title: 'Reverse Protection Plan', onFinish: startReversePlan },
  steps: [
    { label: 'Reverse Plan', title: '', component: REVERSE_CONFIG_STEP, validate: (user, dispatch) => validateReversePlan({ user, dispatch }), isAync: true },
    { label: 'Summary', title: '', component: REVERSE_SUMMARY, validate: (user, dispatch) => noValidate(user, dispatch) }],
};

// Protection Plan update
export const UPDATE_PROTECTION_PLAN_WIZARDS = {
  options: { title: 'Update Protection Plan', onFinish: onConfigureDRPlan },
  steps: [{ label: 'Virtual Machines', title: '', component: DRPLAN_PROTECT_STEP, validate: (user, dispatch) => validateDRPlanProtectData({ user, dispatch }) },
    { label: 'Recovery Configuration', title: '', component: DRPLAN_VM_CONFIG_STEP, validate: (user, dispatch) => validateVMConfiguration({ user, dispatch }) },
    { label: 'Boot Order', title: '', component: DRPLAN_BOOT_ORDER_STEP, validate: (user, dispatch) => noValidate(user, dispatch) },
    { label: 'Replication Configuration', title: '', component: WIZARD_STEP, validate: (user, dispatch, fields) => validateSteps(user, dispatch, fields), fields: DRPLAN_PROTECTION_CONFIG_STEP_FIELDS },
    { label: 'Scripts', title: '', component: WIZARD_STEP, validate: (user, dispatch) => noValidate(user, dispatch), fields: DRPLAN_SCRIPTS_CONFIG_STEP_FIELDS },
    { label: 'Summary', title: '', component: PROTECTION_PLAN_SUMMARY_STEP, validate: (user, dispatch) => noValidate(user, dispatch) }],
};
