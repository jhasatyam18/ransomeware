export const PLATFORM_TYPES = {
  VMware: 'VMware', GCP: 'GCP', AWS: 'AWS',
};

export const REPLICATION_STATUS = {
  STOPPED: 'Stopped', STARTED: 'STARTED',
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
};

export const APP_TYPE = {
  CLIENT: 'CLIENT', SERVER: 'SERVER',
};
