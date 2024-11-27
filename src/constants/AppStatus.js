export const JOB_COMPLETION_STATUS = 'completed';
export const JOB_RUNNING_STATUS = 'started';
export const JOB_IN_PROGRESS = 'running';
export const JOB_FAILED = 'failed';
export const MIGRATION_INIT_FAILED = 'migration_init_failed';
export const AUTO_MIGRATION_FAILED = 'auto_migration_failed';
export const JOB_STOPPED = 'stopped';
export const JOB_IN_SYNC = 'in-sync';
export const JOB_EXCEEDED_INTERVAL = 'exceeded-interval';
export const JOB_RECOVERED = 'recovered';
export const JOB_COMPLETED_WITH_ERRORS = 'completed with errors';
export const JOB_INIT_FAILED = 'init-failed';
export const JOB_INIT_SUCCESS = 'init-success';
export const JOB_INIT_PROGRESS = 'init-in-progress';
export const JOB_INIT_SYNC_PROGRESS = 'init-sync-in-progress';
export const JOB_RESYNC_IN_PROGRESS = 'resync-in-progress';
export const JOB_RESYNC_FAILED = 'resync-failed';
export const JOB_RESYNC_SUCCESS = 'resync-success';
export const JOB_SYNC_IN_PROGRESS = 'sync-in-progress';
export const JOB_SYNC_FAILED = 'sync-failed';
export const NODE_STATUS_ONLINE = 'online';
export const NODE_STATUS_OFFLINE = 'offline';
export const JOB_INIT_SYNC_FAILED = 'init-sync-failed';
export const JOB_MIGRATED = 'migrated';
export const STATUS_STARTED = 'Started';
export const PARTIALLY_COMPLETED = 'partially-completed';
export const JOB_QUEUED = 'queued';
export const PENDING_STATUS_STEP = 'Validating Instance Status from CSP';
export const PENDING_STATUS = 'pending-csp-verification';
export const VALIDATING = 'fetching latest status';
export const PASS = 'Pass';

export const DELETED_FROM_PLAN = 'isRemovedFromPlan';
export const IS_DELETED = 'isDeleted';
export const RECOVERY_CHECKPOINT_JOB_CREATE = 'Create';
export const RECOVERY_CHECKPOINT_JOB_PURGED = 'Purge';

export const CHECKPOINT_STATUS_AVAILABLE = 'Available';
export const CHECKPOINT_STATUS_DELETED_FROM_INFRA = 'Deleted from Platform';

export const PLAYBOOK_IN_VALIDATED = 'Not-in-sync';

export const RECOVERY_STATUS = {
  MIGRATED: 'Migrated',
  RECOVERED: 'Recovered',
};

export const TEMPLATE_STATUS = [
  'configUploaded',
  'configValidating',
  'configValidated',
  'configValidationFailed',
  'configPlanCreated',
  'configPlanReconfigured',
];

export const PLAYBOOKS_STATUS = {
  PLAYBOOK_VALIDATION_FAILED: 'configValidationFailed',
  PLAYBOOK_UPLOADED: 'configUploaded',
  PLAYBOOK_VALIDATING: 'configValidating',
  PLAYBOOK_VALIDATED: 'configValidated',
  PLAYBOOK_PLAN_CREATED: 'configPlanCreated',
  PLAYBOOK_PLAN_RECONFIGURED: 'configPlanReconfigured',
};

export const DETAILED_STEP_COMPONENTS = {
  PENDING_STATUS_STEPS: 'Validating Instance Status from CSP',
};
