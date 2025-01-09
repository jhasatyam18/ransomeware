export const UI_WORKFLOW = {
  TEST_RECOVERY: 'TEST_RECOVERY',
  CREATE_PLAN: 'CREATE_PLAN',
  EDIT_PLAN: 'EDIT_PLAN',
  REVERSE_PLAN: 'REVERSE_PLAN',
  MIGRATION: 'MIGRATION_WIZARD',
  FULL_RECOVERY: 'FULL_RECOVERY',
  LAST_TEST_RECOVERY_SUMMARY: 'LAST_TEST_RECOVERY_SUMMARY',
  CLEANUP_TEST_RECOVERY: 'CLEANUP_TEST_RECOVERY',
  RECOVERY: 'RECOVERY',
  RESET_DISK_REPLICATION: 'RESET_DISK_REPLICATION',
  SINGLE_VM_EDIT: 'SINGLE_VM_EDIT',
  REFRESH_RECOVERY: 'REFRESH_RECOVERY',
};

export const PLATFORM_TYPES = {
  VMware: 'VMware', GCP: 'GCP', AWS: 'AWS', Azure: 'Azure',
};

export const REPLICATION_STATUS = {
  STOPPED: 'Stopped', STARTED: 'STARTED', INIT_FAILED: 'Init-Failed',
};

export const PROTECTION_PLANS_STATUS = {
  CREATED: 'Created', STOPPED: 'Stopped', STARTED: 'Started', INIT_FAILED: 'Init-Failed', INITIALIZING: 'Initializing',
};

export const RECOVERY_STATUS = {
  RECOVERED: 'Recovered', MIGRATED: 'Migrated', MIGRATION_INIT: 'migration_init', FAILED: 'failed',
};

export const JOBS_TABS = [
  { title: 'Replication', activeTab: 1, component: 'REPLICATION' },
  { title: 'Recovery', activeTab: 2, component: 'RECOVERY' },
];

export const DROP_DOWN_ACTION_TYPES = {
  WIZARD: 'WIZARED',
  MODAL: 'MODAL',
};

export const REPLICATION_JOB_TYPE = {
  DISK: 'DISK',
  VM: 'VM',
  PLAN: 'PLAN',
};

export const RECOVERY_JOB_TYPE = {
  PLAN: 'PLAN',
  VM: 'VM',
};

export const RECOVERY_CHECKPOINT_TYPE = {
  PLAN: 'PLAN',
  VM: 'VM',
  PRESERVED_CHECKPOINTS: 'PRESERVED_CHECKPOINTS',
};

export const APP_TYPE = {
  CLIENT: 'CLIENT', SERVER: 'SERVER',
};

export const SCRIPT_TYPE = {
  PRE: 'PRE', POST: 'POST',
};

export const STATIC_KEYS = {
  REPLICATION_INTERVAL_TYPE: 'ui.values.replication.interval.type',
  REPLICATION_INTERVAL_TYPE_DAY: 'day',
  REPLICATION_INTERVAL_TYPE_HOUR: 'hour',
  REPLICATION_INTERVAL_TYPE_MIN: 'miniutes',
  FULL_INCREMENTAL: 'Full incremental',
  DIFFERENTIAL: 'Differential',
  UI_SITES: 'ui.values.sites',
  UI_PROTECTION_PLANS: 'ui.values.drplan',
  UI_INSTANCES: 'ui.values.instances',
  UI_AVAILABILITY_ZONES: 'ui.values.availabilityZones',
  UI_REGIONS: 'ui.values.regions',
  UI_SCRIPT_PRE: 'ui.values.scripts.pre',
  UI_SCRIPT_POST: 'ui.values.scripts.post',
  UI_SECURITY_GROUPS: 'ui.values.securityGroups',
  UI_ENCRYPTION_KEYS: 'ui.values.encryptionKeys',
  UI_SUBNETS: 'ui.values.subnets',
  UI_NETWORK: 'ui.values.network',
  UI_SITE_NODES: 'ui.values.nodes',
  UI_RESERVE_IPS: 'ui.values.reserveips',
  UI_ASSOCIATED_RESERVE_IPS: 'ui.values.associated.ips',
  // source site network details
  UI_SECURITY_GROUPS_SOURCE: 'ui.values.securityGroups.source',
  UI_SUBNETS__SOURCE: 'ui.values.subnets.source',
  UI_VPC_SOURCE: 'ui.values.vpc.source',
  UI_VPC_TARGET: 'ui.values.vpc.target',
  UI_WORKFLOW_TEST_RECOVERY: 'ui.workflow.test.recovery',
  UI_VMWARE_CONFIG_RESPONSES: 'ui.vmware.config.responses',
  UI_VOLUMETYPES: 'ui.values.volume.type',
  UI_SITE_SELECTED_VMS: 'ui.site.selectedVMs',
  RESOURCE_GROUP: 'ui.values.resource.type',
  UI_NETWORKS: 'ui.values.network',
  UI_EDIT_RESERVE_IPS: 'ui.values.edit.reserveips',
  UI_WORKFLOW: 'ui.workflow',
  UI_DISABLE_BULK_DOWNLOAD: 'disable.bulk.download',
  UI_BULK_FILEPATH_DATA: 'ui.bulk.filepath.data',
  UI_BULK_PPLAN: 'ui.bulk.pplan',
  UI_TEMPLATE_FILEID: 'ui.template.fileid',
  UI_TEMPLATE_BY_ID: 'ui.template.id',
  UI_REPLICATIONJOBS_BY_PPLAN_ID: 'ui.replicationjobs.by.pplanid',
  UI_RECOVERY_CHECKPOINTS_BY_VM_ID: 'recovery.checkpoint.by.vm.id',
  UI_PLAYBOOK_DIFF: 'ui.playbook.diff',
  UI_PLAYBOOK_DIFF_RESPONSE: 'ui.playbook.diff.response',
  UI_PLAYBOOK_CURRENT_PLAN_CONFIG: 'ui.playbook.current.plan.config',
  UI_PLAYBOOK_UPDATED_PLAN_CONFIG: 'ui.playbook.updated.plan.config',
  UI_UNIQUE_CHECKPONT_SELECTED_OPTION: 'ui.unique.checkpoint.selected.option',
  UI_CHECKPOINT_RECOVERY_TYPE: 'ui.checkpoint.recoveryTypes',
  UI_COMMON_CHECKPOINT_OPTIONS: 'ui.common.checkpoint_options',
  UI_DMWIZARD_MOVENEXT: 'ui.dmwizard.movenext',
  VMWARE_CBT_KB_REFERENCE: 'https://kb.vmware.com/s/article/1020128',
  IS_POINT_IN_TIME_DISABLED: 'ui.point.in.time.disable',
  DISABLE_RECOVERY_FROM_LATEST: 'ui.disable.recover.latest',
  POINT_IN_TIME_RECOVERY_CHECKPOINTS: 'ui.point.intime.checkpoint.recovery.config',
  REC_STEP_PASS: 'Pass',
  REC_STEP_FAIL: 'Fail',
  VMWARE_QUIESCE_KEY: '-vmConfig.general.IsVMwareQuiescing',
  DMTREE_SEARCH_FOLDER_KEY: 'DMTREE_SEARCH_FOLDER_KER',
  PLAYBOOK_CONFIG_VALIDATING: 'configValidating',
  REPORT_DURATION_START_DATE: 'report.duration.startDate',
  REPORT_DURATION_END_DATE: 'report.duration.endDate',
  REPORT_DURATION_TYPE: 'report.duration.type',
  UI_REVERSE_RECOVERY_ENTITY: 'ui.reverse.recovery.entity',
  REVERSE_VALIDATE_FAILED_ENTITIE: 'reverse.validate.failedEntitie',
  FULL: 'Full',
  DM_REVERSED: '-dm-reversed',
  REPORT_STATUS_TYPE: 'alert-status',
  PORTS_RENDERER: 'port-renderer',
  UI_REVERSE_RECOMMENDED_DATA: 'mapped.reverse.replication.data',
  REVERSE_VALIDATION_FAILED_MSG: 'original source entity not found',
  REPLICATION_TYPE: 'replicationType',
  ENTITY_TYPE: 'entityType',
  VM_LATEST_REPLICATION_JOBS: 'ui.latest.vm.replication.jobs',
  TEST_RECOVERY_IP_WARNING_MSG: 'test.recovery.ip.warning.msg',
  LATEST_REPLICATION_JOBS: 'latest=true',
  LATEST_COMPLETED_REPL_JOBS: 'status=completed&latest=true',
  RECOVERY_CREDENTIAL_EXCEL_FILE: 'ui.recovery.credentials.fileName',
  UI_RESYNC_DISK_WORKLOAD: 'resyncDisk.workload',
  UI_RESYNC_DISK_DISKTYPE: 'resyncDisk.diskType',
  UI_RESYNC_SUMMARY_DATA: 'resyncSummary',
  // refresh recovery
  UI_REFRESH_STATUS_VMS: 'ui.refresh.status.vms',
  UI_REFRESH_SELECTED_VMS: 'ui.refresh.selected.vms',
  UI_REFRESH_VALIDATION_OBJ: 'ui.refresh.validation.obj',
  UI_REFRESH_OP_STATE: 'refresh.status.operation.state',
  PENDING_STATUS_CLEANUP_RECOVERY: 'pending.status.cleanup.recovary',
  RECOVER_STATUS: 'recoveryStatus',
  ALERT_TITLE: 'alertTitle',
  UI_LIST_DELETED_VMS: 'ui.list.deleted.vms',
  REPLICATION_JOB_VM_NAME: 'repliction_vm',
  RECOVERY_DATE_DURATION: 'recovery_date_duration',
  STARTED: 'Started',
  RUNNING: 'Running',
  PREVIOUS: 'previous',
};

// Recovery time in minutes
export const MAX_RECOVERY_TIME = 30;

export const TAB_TYPE = {
  RECOVERY: 'recovery', REPLICATION: 'replication',
};
export const SETTINGS_TABS = [
  { title: 'Nodes', activeTab: 1 },
  { title: 'Throttling', activeTab: 2 },
  { title: 'Tech Support', activeTab: 3 },
  { title: 'Email', activeTab: 4 },
];

export const EXCLUDE_KEYS_RECOVERY_CONFIGURATION = {
  DELETE_INSTANCE: 'deleteInstance',
  IS_REQUIRED: 'isResetRequired',
  NETWORK_KEY: 'networkKey',
  BOOT_PRIORITY: 'bootPriority',
  INSTANCE_ID: 'instanceID',
  DELETED_CHECKPOINT: 'deleteCheckpoint',
};

export const EXCLUDE_KEYS_CONSTANTS = {
  AVAILABILITY_ZONES: 'availZone',
  NUM_CPU: 'numCPU',
};

export const VMWARE_OBJECT = {
  Datacenter: 'Datacenter',
  Folder: 'Folder',
  Network: 'Network',
  Datastore: 'Datastore',
  ComputeResource: 'ComputeResource',
  VirtualMachine: 'VirtualMachine',
  DistributedVirtualPortgroup: 'DistributedVirtualPortgroup',
};

export const RECOVERY_ENTITY_TYPES = {
  VIRTUALMACHINE: 'VIRTUALMACHINE',
  DISK: 'DISK',
};

export const COPY_CONFIG = {
  GENERAL_CONFIG: 'copy_gen_config',
  NETWORK_CONFIG: 'copy_net_config',
  REP_SCRIPT_CONFIG: 'copy_rep_script_config',
  REC_SCRIPT_CONFIG: 'copy_rec_script_config',
  ALL: 'ALL',
};
export const NODE_TYPES = {
  DEDUPE_SERVER: 'DedupeServer',
  Replication: 'Replication',
  PrepNode: 'PrepNode',
  DedupeServer: 'DedupeServer',
};

export const SUPPORTED_GUEST_OS = {
  Windows: 'Windows',
  Ubuntu: 'Ubuntu',
  Centos: 'Centos',
  Rhel: 'Rhel',
  Suse: 'Suse',
  Oracle: 'Oracle',
};

export const SUPPORTED_FIRMWARE = {
  BIOS: 'bios',
  UEFI: 'uefi',
  UEFISecure: 'uefi_secure',
  UEFIvTPM: 'uefi_vTPM',
  UEFISecurevTPM: 'uefi_secure_vTPM',
};

export const NODE_STATUS = {
  Online: 'online',
  Offline: 'offline',
};

export const MINUTES_CONVERSION = {
  HOUR: 60,
  DAY: 1440,
  WEEK: 10080,
  MONTH: 43800,
  YEAR: 525600,
};

export const PLAYBOOK_TYPE = {
  RECOVERY: 'recovery',
  PLAN: 'protectionPlan',
};

export const PLAYBOOK_NAMES = {
  ISSUES: 'DM-Playbook-Issues-',
};

export const SAML = {
  DEFAULT_USERNAME: 'SAML',
  DEFAULT_USER_ID: 0,
};

export const EMAIL = {
  RECIPIENT_ISVALIDATE: 'emailConfiguration.isValidate',
  RECIPIENT_EMAIL: 'emailConfiguration.recipientEmail',
};

export const CHECKPOINT_TYPE = {
  LATEST: 'latest',
  POINT_IN_TIME: 'pointInTime',
};
export const RECOVERY_TYPE = {
  TEST_RECOVERY: 'test recovery',
  FULL_RECOVERY: 'full recovery',
  MIGRATION: 'migration',
};

export const COPY_TEXT = {
  TEXT_CHANGE_TIMEOUT: 3000,
};

export const RECOVERY_GUEST_OS = {
  WINDOWS: 'Windows',
};
export const VMWARE_OS_DISK_DEVICE_KEYS = [2000, 3000, 32000];

export const CONSTANT_NUMBERS = {
  TWENTY_FIVE: 25,
  ZERO: 0,
  ONE: '1',
  MAX_PORT_VALUE: 65355,
  MIN_VALUE: 1,
};
export const REPORT_DURATION = {
  CUSTOM: 'custom',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
  SIZE: 'size',
  TIME: 'time',
  DATE: 'date',
  DURATION: 'duration',
  LOCATION: 'location',
  REPLICATION_STATUS: 'replicationStatus',
};

export const NUMBER = {
  TWO_HUNDRED: 200,
  FIVE_THOUSAND: 5000,
  ONE_HUNDRED: 100,
};

export const REVERSE_ENTITY_TYPE = {
  MAINTAIN_ORIGINAL: 'maintain-original',
  CREATE_NEW_COPY: 'create-new',
};

export const RECOVERY_ENTITY_OPTIONS = [{ label: 'Maintain Original Copy', value: 'maintain-original' }, { label: 'Create New Copy', value: 'create-new' }];

export const REVERSE_REPLICATION_TYPE = {
  DIFFERENTIAL: 'differential',
  FULL: 'full',
};

export const MAPPING_REVERSE_RECOMMENDED_DATA = {
  differential: 'Differential',
  full: 'Full',
  'maintain-original': 'Maintain Original',
  'create-new': 'Create New Copy',
};

export const AWS_TENANCY_TYPES = {
  Shared: 'default',
  // dedicated: 'dedicated',
  Dedicated_Host: 'host',
};

export const AWS_TARGET_HOST_TYPES = {
  Host_ID: 'Standalone',
  Host_Resource_Group: 'Cluster',
};
export const RESYNC_DISKS_TYPES = {
  all: 'All', os: 'OS', data: 'Data',
};

export const REF_REC_REFRESH_CONSTANT = {
  GLOBAL: 'global',
  REF_REC_VM_DATA: 'ref_rec_vm_data',
};

export const REFRESH_RECOVERY_TYPE_FILTER = {
  TEST_RECOVERY: 'test recovery',
  RECOVERY: 'full recovery,migration',
};

export const RECOVERY_STEPS = {
  VALIDATION_INSTANCE_FOR_RECOVERY: 'Validating Instance for recovery',
};
