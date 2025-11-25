export const EVENT_LEVELS = {
  ALL: 'ALL', INFO: 'INFO', WARNING: 'WARNING', ERROR: 'ERROR', CRITICAL: 'CRITICAL',
};

export const VM_DISK_ACTION_EVENT = ['monitor.vmnotfound', 'monitor.vmrenamed', 'monitor.vmdiskadded', 'monitor.vmdiskremoved', 'monitor.vmdisksizemodified'];
export const VM_CONFIG_ACTION_EVENT = ['monitor.vmconfmodified', 'monitor.vmdisktypemodified', 'monitor.vmdiskiopsmodified'];
export const MONITORING_DISK_CHANGES = {
  DISK_TYPES: 'monitor.vmdisktypemodified',
  DISK_IOPS: 'monitor.vmdiskiopsmodified',
};

export const PPLAN_EVENTS = ['protectionplan.initfailed', 'protectionplan.updatefailed'];

export const MILI_SECONDS_TIME = {
  ONE_HUNDRED_MS: 100,
  TWENTY_THOUSAND_MS: 20000,
  ONE_THOUSAND: 1000,
  FIVE_THOUSAND: 5000,
  FIVE_THROUSAND: 5000,
};
export const MONITOR_NODE_AUTH = ['monitor.nodecredentialexpiringsoon', 'monitor.nodeauthentication'];
export const CHECKPOINT_ACTION_EVENT = ['point-in-time.checkpoint.deleted.platform'];
