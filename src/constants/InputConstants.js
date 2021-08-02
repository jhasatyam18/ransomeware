export const PLATFORM_TYPES = {
  VMware: 'VMware', GCP: 'GCP', AWS: 'AWS',
};

export const REPLICATION_STATUS = {
  STOPPED: 'Stopped', STARTED: 'STARTED',
};

export const RECOVERY_STATUS = {
  RECOVERED: 'Recovered', MIGRATED: 'Migrated',
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
  UI_SITES: 'ui.values.sites',
  UI_PROTECTION_PLANS: 'ui.values.drplan',
  UI_INSTANCES: 'ui.values.instances',
  UI_AVAILABILITY_ZONES: 'ui.values.availabilityZones',
  UI_REGIONS: 'ui.values.regions',
  UI_SCRIPT_PRE: 'ui.values.scripts.pre',
  UI_SCRIPT_POST: 'ui.values.scripts.post',
  UI_SECURITY_GROUPS: 'ui.values.securityGroups',
  UI_SUBNETS: 'ui.values.subnets',
  UI_SITE_NODES: 'ui.values.nodes',
};

// Recovery time in minutes
export const MAX_RECOVERY_TIME = 30;

export const TAB_TYPE = {
  RECOVERY: 'recovery', REPLICATION: 'replication',
};
export const SETTINGS_TABS = [
  { title: 'Nodes', activeTab: 1 },
  { title: 'Tech Support', activeTab: 2 },
  { title: 'Email', activeTab: 3 },
];
