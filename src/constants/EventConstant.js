export const EVENT_LEVELS = {
  ALL: 'ALL', INFO: 'INFO', WARNING: 'WARNING', ERROR: 'ERROR', CRITICAL: 'CRITICAL',
};

export const VM_DISK_ACTION_EVENT = ['monitor.vmnotfound', 'monitor.vmrenamed', 'monitor.vmdiskadded', 'monitor.vmdiskremoved', 'monitor.vmdisksizemodified'];
export const VM_CONFIG_ACTION_EVENT = ['monitor.vmconfmodified', 'protectionplan.updatefailed', 'monitor.vmdisktypemodified', 'monitor.vmdiskiopsmodified'];
export const MONITORING_DISK_CHANGES = {
  DISK_TYPES: 'monitor.vmdisktypemodified',
  DISK_IOPS: 'monitor.vmdiskiopsmodified',
};

export const PPLAN_EVENTS = ['protectionplan.initfailed'];

export const MILI_SECONDS_TIME = {
  TWO_THOUSAND: 2000,
  TEN_THOUSAND: 10000,
  ONE_THOUSAND: 1000,
};
