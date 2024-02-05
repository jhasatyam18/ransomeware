import { cleanupTestRecoveries, onConfigureDRPlan, startMigration, startRecovery, startReversePlan, updateVMConfig } from '../store/actions/DrPlanActions';
import { noValidate, validateDRPlanProtectData, validateSteps, validateMigrationVMs, validateVMConfiguration, validateRecoveryVMs, validateReversePlan, validateRecoveryCheckpointData, validateVMSelection } from '../utils/validationUtils';
import { postPlanSitesSelected } from '../store/actions/SiteActions';
import { UI_WORKFLOW } from './InputConstants';
import { STORE_KEYS } from './StoreKeyConstants';

export const WIZARD_STEP = 'WIZARD_STEP';
export const DRPLAN_GENERAL_SETTINGS_STEP = 'DRPLAN_GENERAL_SETTINGS_STEP';
export const DRPLAN_PROTECTION_CONFIG_STEP = 'DRPLAN_PROTECTION_CONFIG_STEP';
export const DRPLAN_RECOVERY_STEP = 'DRPLAN_RECOVERY_STEP';
export const DRPLAN_PROTECT_STEP = 'DRPLAN_PROTECT_STEP';
export const DRPLAN_BOOT_ORDER_STEP = 'DRPLAN_BOOT_ORDER_STEP';
export const DRPLAN_SCRIPT_STEP = 'DRPLAN_SCRIPT_STEP';
export const DRPLAN_VM_CONFIG_STEP = 'DRPLAN_VM_CONFIG_STEP';
export const DRPLAN_GENERAL_SETTINGS_STEP_FIELDS = ['drplan.name', 'drplan.protectedSite', 'drplan.recoverySite'];
export const DRPLAN_PROTECTION_CONFIG_STEP_FIELDS = ['drplan.startTime', 'drplan.replicationInterval', 'reverse.replType', 'reverse.suffix', 'drplan.removeCheckpoint', 'drplan.isEncryptionOnWire', 'drplan.isCompression', 'drplan.isDedupe', 'drplan.enableDifferentialReverse', 'drplan.enablePPlanLevelScheduling', 'drplan.reverseWarningText'];
export const DRPLAN_SCRIPTS_CONFIG_STEP_FIELDS = ['drplan.replPreScript', 'drplan.replPostScript', 'drplan.preScript', 'drplan.postScript', 'drplan.scriptTimeout'];
export const RECOVERY_CHECKPOINTS_FIELDS = [STORE_KEYS.RECOVERY_CHECKPOINTING_ENABLED, STORE_KEYS.RECOVERY_CHECKPOINT_DURATION_UNIT, STORE_KEYS.RECOVERY_CHECKPOINT_RETAIN_NUMEBER_UNIT, STORE_KEYS.RECOVERY_CHECKPOINT_COUNT, STORE_KEYS.RECOVERY_CHECKPOINT_RETAIN_NUMEBER, STORE_KEYS.RECOVERY_CHECKPOINT_DURATION_NUM];
// export const DRPLAN_RECOVERY_CONFIG_AWS_STEP_FIELDS = ['drplan.recoveryEntities.instanceDetails.amiID', 'drplan.recoveryEntities.instanceDetails.instanceType', 'drplan.recoveryEntities.instanceDetails.availabilityZone', 'drplan.recoveryEntities.instanceDetails.volumeType'];
export const RECOVERY_SUMMARY = 'RECOVERY_SUMMARY';
export const TEST_RECOVERY_CLEANUP_SUMMARY = 'TEST_RECOVERY_CLEANUP_SUMMARY';
export const PROTECTION_PLAN_SUMMARY_STEP = 'PROTECTION_PLAN_SUMMARY_STEP';
export const RECOVERY_GENERAL_STEP = 'RECOVERY_GENERAL_STEP';
export const RECOVERY_PROTECT_VM_STEP = 'RECOVERY_PROTECT_VM_STEP';
export const MIGRATION_GENERAL_STEP = 'MIGRATION_GENERAL_STEP';
export const RECOVERY_CONFIG = 'RECOEVRY_CONFIG';
export const TEST_RECOVERY_CONFIG_STEP = 'TEST_RECOVERY_CONFIG_STEP';
export const TEST_RECOVERY_CONFIG_SCRIPTS = 'TEST_RECOVERY_CONFIG_SCRIPTS';
export const REVERSE_CONFIG_STEP = 'REVERSE_CONFIG_STEP';
export const REVERSE_SUMMARY = 'REVERSE_SUMMARY';
export const VM_ALERTS_STEP = 'VM_ALERTS_STEP';
export const VM_CONFIGURATION_STEP = 'VM_CONFIGURATION_STEP';
export const REPLICATION_CONFIGURATION_STEP = 'REPLICATION_CONFIGURATION_STEP';
export const DRPLAN_RECOVERY_CHECKPOINT_CONFIG = 'RECOVERY_CHECKPOINT_CONFIG';

export const RECOVERY_GENERAL_STEP_FIELDS = ['recovery.protectionplanID', 'recovery.dryrun'];
export const MIGRATION_GENERAL_STEP_FIELDS = ['recovery.protectionplanID'];
export const REVERSE_RECOVERY_CONFIGURATION_STEP = ['reverse.recoverySite'];

export const STEPS = {
  VIRTUAL_MACHINE: 'VIRTUAL_MACHINE',
  RECOVERY_CONFIG: 'RECOVERY_CONFIG',
  SUMMARY: 'SUMMARY',
};

// Protection Plan
export const CREATE_DR_PLAN_WIZARDS = {
  options: { title: 'Create Protection Plan', onFinish: onConfigureDRPlan, workflow: UI_WORKFLOW.CREATE_PLAN },
  steps: [{ label: 'General', title: '', component: WIZARD_STEP, validate: (user, dispatch, fields) => validateSteps(user, dispatch, fields), fields: DRPLAN_GENERAL_SETTINGS_STEP_FIELDS, postAction: () => postPlanSitesSelected() },
    { label: 'Virtual Machines', title: '', component: DRPLAN_PROTECT_STEP, validate: (user, dispatch) => validateDRPlanProtectData({ user, dispatch }) },
    { label: 'Recovery Configuration', title: '', component: DRPLAN_VM_CONFIG_STEP, validate: (user, dispatch) => validateVMConfiguration({ user, dispatch }) },
    { label: 'Boot Order', title: '', component: DRPLAN_BOOT_ORDER_STEP, validate: (user, dispatch) => noValidate(user, dispatch) },
    { label: 'Replication Configuration', title: '', component: REPLICATION_CONFIGURATION_STEP, validate: (user, dispatch, fields) => validateSteps(user, dispatch, fields), fields: DRPLAN_PROTECTION_CONFIG_STEP_FIELDS },
    { label: 'Scripts', title: '', component: DRPLAN_SCRIPT_STEP, validate: (user, dispatch) => noValidate(user, dispatch) },
    { label: 'Recovery Checkpoints', component: DRPLAN_RECOVERY_CHECKPOINT_CONFIG, validate: (user, dispatch, fields) => validateRecoveryCheckpointData(user, dispatch, fields), fields: RECOVERY_CHECKPOINTS_FIELDS },
    { label: 'Summary', title: '', component: PROTECTION_PLAN_SUMMARY_STEP, validate: (user, dispatch) => noValidate(user, dispatch) }],
};

// Recovery
export const RECOVERY_WIZARDS = {
  options: { title: 'Recovery', onFinish: startRecovery },
  steps: [
    { label: 'Virtual Machines', title: '', component: RECOVERY_PROTECT_VM_STEP, validate: (user, dispatch) => validateVMSelection(user, dispatch), name: STEPS.VIRTUAL_MACHINE },
    { label: 'Recovery Checkpoint', title: '', component: DRPLAN_RECOVERY_CHECKPOINT_CONFIG, validate: (user, dispatch) => validateRecoveryVMs({ user, dispatch }), name: STEPS.RECOVERY_CONFIG, isAsync: true },
    { label: 'Tools and Scripts', title: '', component: RECOVERY_CONFIG, validate: (user, dispatch) => noValidate({ user, dispatch }), name: STEPS.RECOVERY_CONFIG },
    { label: 'Summary', title: '', component: RECOVERY_SUMMARY, validate: (user, dispatch) => noValidate(user, dispatch), name: STEPS.SUMMARY }],
};

// Migration Wizard
export const MIGRATION_WIZARDS = {
  options: { title: 'Migrate', onFinish: startMigration },
  steps: [
    { label: 'Virtual Machines', title: '', component: RECOVERY_PROTECT_VM_STEP, validate: (user, dispatch) => validateVMSelection(user, dispatch), name: STEPS.VIRTUAL_MACHINE },
    { label: 'Tools and Scripts', title: '', component: RECOVERY_CONFIG, validate: (user, dispatch) => validateMigrationVMs({ user, dispatch }), isAsync: true, name: STEPS.RECOVERY_CONFIG },
    { label: 'Summary', title: '', component: RECOVERY_SUMMARY, validate: (user, dispatch) => noValidate(user, dispatch), name: STEPS.SUMMARY }],
};

// Test Recovery Wizard
export const TEST_RECOVERY_WIZARDS = {
  options: { title: 'Test Recovery', onFinish: startRecovery },
  steps: [
    { label: 'Virtual Machines', title: '', component: RECOVERY_PROTECT_VM_STEP, validate: (user, dispatch) => validateDRPlanProtectData({ user, dispatch }) },
    { label: 'Test Recovery Configuration', title: '', component: TEST_RECOVERY_CONFIG_STEP, validate: (user, dispatch) => validateVMConfiguration({ user, dispatch }) },
    { label: 'Recovery Checkpoint', title: '', component: DRPLAN_RECOVERY_CHECKPOINT_CONFIG, validate: (user, dispatch) => validateRecoveryVMs({ user, dispatch }), isAsync: true },
    { label: 'Tools and Scripts', title: '', component: TEST_RECOVERY_CONFIG_SCRIPTS, validate: (user, dispatch) => noValidate(user, dispatch) },
    { label: 'Summary', title: '', component: RECOVERY_SUMMARY, validate: (user, dispatch) => noValidate(user, dispatch) }],
};

// Reverse Wizard
export const REVERSE_WIZARDS = {
  options: { title: 'Reverse Protection Plan', onFinish: startReversePlan },
  steps: [
    { label: 'Reverse Plan', title: '', component: REVERSE_CONFIG_STEP, validate: (user, dispatch, fields) => validateSteps(user, dispatch, fields), fields: REVERSE_RECOVERY_CONFIGURATION_STEP },
    { label: 'Recovery Configuration', title: '', component: TEST_RECOVERY_CONFIG_STEP, validate: (user, dispatch) => validateVMConfiguration({ user, dispatch }) },
    { label: 'Boot Order', title: '', component: DRPLAN_BOOT_ORDER_STEP, validate: (user, dispatch) => noValidate(user, dispatch) },
    { label: 'Replication Configuration', title: '', component: REPLICATION_CONFIGURATION_STEP, validate: (user, dispatch, fields) => validateSteps(user, dispatch, fields), fields: DRPLAN_PROTECTION_CONFIG_STEP_FIELDS },
    { label: 'Scripts', title: '', component: DRPLAN_SCRIPT_STEP, validate: (user, dispatch) => noValidate(user, dispatch) },
    { label: 'Recovery Checkpoints', component: DRPLAN_RECOVERY_CHECKPOINT_CONFIG, validate: (user, dispatch, fields) => validateRecoveryCheckpointData(user, dispatch, fields), fields: RECOVERY_CHECKPOINTS_FIELDS },
    { label: 'Summary', title: '', component: REVERSE_SUMMARY, validate: (user, dispatch) => validateReversePlan({ user, dispatch }), isAsync: true }],
};

// Protection Plan update
export const UPDATE_PROTECTION_PLAN_WIZARDS = {
  options: { title: 'Update Protection Plan', onFinish: onConfigureDRPlan },
  steps: [{ label: 'General', title: '', component: WIZARD_STEP, validate: (user, dispatch, fields) => validateSteps(user, dispatch, fields), fields: DRPLAN_GENERAL_SETTINGS_STEP_FIELDS, postAction: () => postPlanSitesSelected() },
    { label: 'Virtual Machines', title: '', component: DRPLAN_PROTECT_STEP, validate: (user, dispatch) => validateDRPlanProtectData({ user, dispatch }) },
    { label: 'Recovery Configuration', title: '', component: DRPLAN_VM_CONFIG_STEP, validate: (user, dispatch) => validateVMConfiguration({ user, dispatch }) },
    { label: 'Boot Order', title: '', component: DRPLAN_BOOT_ORDER_STEP, validate: (user, dispatch) => noValidate(user, dispatch) },
    { label: 'Replication Configuration', title: '', component: REPLICATION_CONFIGURATION_STEP, validate: (user, dispatch, fields) => validateSteps(user, dispatch, fields), fields: DRPLAN_PROTECTION_CONFIG_STEP_FIELDS },
    { label: 'Scripts', title: '', component: DRPLAN_SCRIPT_STEP, validate: (user, dispatch) => noValidate(user, dispatch) },
    { label: 'Recovery Checkpoints', component: DRPLAN_RECOVERY_CHECKPOINT_CONFIG, validate: (user, dispatch, fields) => validateRecoveryCheckpointData(user, dispatch, fields), fields: RECOVERY_CHECKPOINTS_FIELDS },
    { label: 'Summary', title: '', component: PROTECTION_PLAN_SUMMARY_STEP, validate: (user, dispatch) => noValidate(user, dispatch) }],
};

// Wizard edit protected VM and take action on vm
export const PROTECTED_VM_RECONFIGURATION_WIZARD = {
  options: { title: 'Configure', onFinish: updateVMConfig },
  steps: [
    { label: 'Alerts', title: '', component: VM_ALERTS_STEP, validate: (user, dispatch) => noValidate(user, dispatch) },
    { label: 'Recovery Configuration', title: '', component: VM_CONFIGURATION_STEP, validate: (user, dispatch) => validateVMConfiguration({ user, dispatch }) }],
};

export const CLEANUP_TEST_RECOVERY_WIZARDS = {
  options: { title: 'Cleanup Test Recovery', onFinish: cleanupTestRecoveries },
  steps: [
    { label: 'Virtual Machines', title: '', component: RECOVERY_PROTECT_VM_STEP, validate: (user, dispatch) => validateDRPlanProtectData({ user, dispatch }) },
    { label: 'Summary', title: '', component: TEST_RECOVERY_CLEANUP_SUMMARY, validate: (user, dispatch) => noValidate(user, dispatch) }],
};
