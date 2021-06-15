export const OS_TYPE_ITEM_RENDERER = 'OS_TYPE_ITEM_RENDERER';
export const VM_SIZE_ITEM_RENDERER = 'VM_SIZE_ITEM_RENDERER';
export const DR_PLAN_NAME_ITEM_RENDERER = 'DR_PLAN_NAME_ITEM_RENDERER';
export const DATE_ITEM_RENDERER = 'DateItemRenderer';
export const STATUS_ITEM_RENDERER = 'STATUS_ITEM_RENDERER';
export const TRANSFER_SIZE_ITEM_RENDERER = 'TRANSFER_SIZE_ITEM_RENDERER';
export const RECOVERY_TYPE_ITEM_RENDERER = 'RECOVERY_TYPE_ITEM_RENDERER';
export const RECOVERY_SITE_LINK_ITEM_RENDERER = 'RECOVERY_SITE_LINK_ITEM_RENDERER';
export const SSH_RDP_ITEM_RENDERER = 'SSH_RDP_ITEM_RENDERER';
export const VM_USERNAME_ITEM_RENDERER = 'VM_USERNAME_ITEM_RENDERER';
export const VM_UPASSWORD_ITEM_RENDERER = 'VM_UPASSWORD_ITEM_RENDERER';
export const REPLICATION_INTERVAL_ITEM_RENDERER = 'REPLICATION_INTERVAL_ITEM_RENDERER';
export const EVENT_LEVEL_ITEM_RENDERER = 'EVENT_LEVEL_ITEM_RENDERER';
export const ALERT_ACK_ITEM_RENDERER = 'ALERT_ACK_ITEM_RENDERER';
export const VIEW_ALERT_INFO_RENDERER = 'VIEW_ALERT_INFO_RENDERER';
// show time taken by any job
export const TIME_DURATION_RENDERER = 'TIME_RENDERER';

export const TABLE_HEADER_SITES = [
  { label: 'site.type', field: 'siteType', itemRenderer: RECOVERY_TYPE_ITEM_RENDERER },
  { label: 'description', field: 'description' },
  { label: 'platform', field: 'platformDetails.platformType' },
  { label: 'IP Address', field: 'platformDetails.serverIp' },
];

export const TABLE_HEADER_DR_PLANS = [
  { label: 'name', field: 'name', itemRenderer: DR_PLAN_NAME_ITEM_RENDERER },
  { label: 'protected.site', field: 'protectedSite.platformDetails.platformName' },
  { label: 'recovery.site', field: 'recoverySite.platformDetails.platformName', itemRenderer: RECOVERY_SITE_LINK_ITEM_RENDERER },
  { label: 'replication.interval', field: 'replicationInterval', itemRenderer: REPLICATION_INTERVAL_ITEM_RENDERER },
  { label: 'status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER },
  { label: 'Recovery Status', field: 'recoveryStatus', itemRenderer: STATUS_ITEM_RENDERER },
];
export const TABLE_PROTECT_VM_VMWARE = [
  { label: 'name', field: 'name' },
  { label: 'size', field: 'virtualDisks', itemRenderer: VM_SIZE_ITEM_RENDERER },
  { label: 'os', field: 'guestOS', itemRenderer: OS_TYPE_ITEM_RENDERER },
];
export const TABLE_PROTECTION_PLAN_VMS = [
  { label: 'name', field: 'name' },
  { label: 'size', field: 'virtualDisks', itemRenderer: VM_SIZE_ITEM_RENDERER },
  { label: 'os', field: 'guestOS', itemRenderer: OS_TYPE_ITEM_RENDERER },
  { label: 'Last Run Time', field: 'lastRunTime', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'Recovery Status', field: 'recoveryStatus' },
];

export const REPLICATION_JOBS = [
  { label: 'Virtual Machine', field: 'vmName' },
  { label: 'Disk Id', field: 'diskId' },
  { label: 'Data Changed', field: 'changedSize', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'Data Transferred', field: 'transferSize', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'Replication Duration', field: 'startTime', itemRenderer: TIME_DURATION_RENDERER },
  { label: 'Job Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER },
];

export const RECOVERY_JOBS = [
  { label: 'Virtual Machine', field: 'vmName' },
  { label: 'Duration', field: 'startTime', itemRenderer: TIME_DURATION_RENDERER },
  { label: 'Recovery Type', field: 'recoveryType', itemRenderer: RECOVERY_TYPE_ITEM_RENDERER },
  { label: 'Job Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER },
  { label: 'IP Address', field: 'failureMessage', itemRenderer: SSH_RDP_ITEM_RENDERER },
];

export const PROTECTION_PLAN_RECOVERY_JOBS = [
  { label: 'Virtual Machine', field: 'vmNames' },
  { label: 'Duration', field: 'startTime', itemRenderer: TIME_DURATION_RENDERER },
  { label: 'Recovery Type', field: 'recoveryType', itemRenderer: RECOVERY_TYPE_ITEM_RENDERER },
  { label: 'Job Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER },
];

export const REPLICATION_VM_JOBS = [
  { label: 'Virtual Machine', field: 'vmName' },
  { label: 'Iterations', field: 'iterationNumber' },
  { label: 'Changed', field: 'changedSize', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'Transferred', field: 'transferredSize', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'Replication Duration', field: 'startTime', itemRenderer: TIME_DURATION_RENDERER },
  { label: 'Job Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER },
  { label: 'Sync Status', field: 'syncStatus', itemRenderer: STATUS_ITEM_RENDERER },
];

// Table fields for recovery virtual machines
export const TABLE_RECOVERY_VMS = [
  { label: 'name', field: 'name' },
  { label: 'Username', field: 'virtualDisks', itemRenderer: VM_USERNAME_ITEM_RENDERER },
  { label: 'Password', field: 'guestOS', itemRenderer: VM_UPASSWORD_ITEM_RENDERER },
];

// Table fields for protection plan vise replication
export const TABLE_PROTECTION_PLAN_REPLICATIONS = [
  { label: 'name', field: 'name' },
  { label: 'Iteration', field: 'totalIteration' },
  { label: 'Total Changed', field: 'totalChangedSize', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'Total Transferred', field: 'totalTransferredSize', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'Data Reduction (%)', field: 'dataReductionRatio' },
  { label: 'Job Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER },
  { label: 'Sync Status', field: 'syncStatus', itemRenderer: STATUS_ITEM_RENDERER },
];

// Table fields for protection plan
export const TABLE_PROTECTION_PLAN_RECOVERY = [
  { label: 'Virtual Machines', field: 'vmNames' },
  { label: 'Duration', field: 'startTime', itemRenderer: TIME_DURATION_RENDERER },
  { label: 'Recovery Type', field: 'recoveryType', itemRenderer: RECOVERY_TYPE_ITEM_RENDERER },
  { label: 'Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER },
];

// Table fields for EVENTS
export const TABLE_EVENTS = [
  { label: 'Date', field: 'timeStamp', itemRenderer: DATE_ITEM_RENDERER, width: 2 },
  { label: 'Topic', field: 'topic', width: 2 },
  { label: 'Level', field: 'severity', itemRenderer: EVENT_LEVEL_ITEM_RENDERER, width: 1 },
  { label: 'Event Type', field: 'type', width: 1 },
  { label: 'Description', field: 'description', width: 4 },
];

// Table fields for ALERTS
export const TABLE_ALERTS = [
  { label: 'Title', field: 'title', itemRenderer: VIEW_ALERT_INFO_RENDERER },
  { label: 'Severity', field: 'severity', itemRenderer: EVENT_LEVEL_ITEM_RENDERER },
  { label: 'Event Type', field: 'eventType' },
  { label: 'Date', field: 'timeStamp', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'Acknowledged', field: 'isAcknowledge', itemRenderer: ALERT_ACK_ITEM_RENDERER },
];
