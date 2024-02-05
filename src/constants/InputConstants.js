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
  RECOVERED: 'Recovered', MIGRATED: 'Migrated', MIGRATION_INIT: 'migration_init',
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
  UI_RECOVERY_CHECKPOINTS_BY_PLAN_ID: 'recovery.checkpoint.by.plan.id',
  UI_PLAYBOOK_DIFF: 'ui.playbook.diff',
  UI_PLAYBOOK_DIFF_RESPONSE: 'ui.playbook.diff.response',
  UI_PLAYBOOK_CURRENT_PLAN_CONFIG: 'ui.playbook.current.plan.config',
  UI_PLAYBOOK_UPDATED_PLAN_CONFIG: 'ui.playbook.updated.plan.config',
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

export const SAML = {
  DEFAULT_USERNAME: 'SAML',
  DEFAULT_USER_ID: 0,
};
