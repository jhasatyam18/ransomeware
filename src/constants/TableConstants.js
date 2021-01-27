export const OS_TYPE_ITEM_RENDARER = 'OS_TYPE_ITEM_RENDARER';
export const VM_SIZE_ITEM_RENDERER = 'VM_SIZE_ITEM_RENDERER';
export const DR_PLAN_NAME_ITEM_RENDERER = 'DR_PLAN_NAME_ITEM_RENDERER';
export const DATE_ITEM_RENDERER = 'DateItemRenderer';
export const STATUS_ITEM_RENDERER = 'STATUS_ITEM_RENDERER';
export const TRANSFER_SIZE_ITEM_RENDERER = 'TRANSFER_SIZE_ITEM_RENDERER';

export const TABLE_HEADER_SITES = [
  { label: 'Site Type', field: 'siteType' },
  { label: 'Description', field: 'description' },
  { label: 'Platform', field: 'platformDetails.platformType' },
];

export const TABLE_HEADER_DR_PLANS = [
  { label: 'Name', field: 'name', itemRenderer: DR_PLAN_NAME_ITEM_RENDERER },
  { label: 'Protected Site', field: 'protectedSite.platformDetails.platformName' },
  { label: 'Recovery Site', field: 'recoverySite.platformDetails.platformName' },
  { label: 'Replication Interval', field: 'replicationInterval' },
  { label: 'Status', field: 'status' },
];

export const TABLE_PROTECT_VM_VMWARE = [
  { label: 'Name', field: 'name' },
  { label: 'Size', field: 'virtualDisks', itemRenderer: VM_SIZE_ITEM_RENDERER },
  { label: 'OS', field: 'guestOS', itemRenderer: OS_TYPE_ITEM_RENDARER },
];

export const REPLICATION_JOBS = [
  { label: 'Virtual Machine', field: 'vmName' },
  { label: 'Disk', field: 'diskId' },
  { label: 'Size', field: 'transferSize', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'Start Time', field: 'startTime', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'End Time', field: 'endTime', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER },
];

export const RECOVERY_JOBS = [
  { label: 'Virtual Machine', field: 'vmName' },
  // { label: 'Disk', field: 'DiskID' },
  // { label: 'Size', field: 'TransferSize', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'Start Time', field: 'startTime', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'End Time', field: 'endTime', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'Recovery Type', field: 'testRecovery' },
  { label: 'Status', field: 'status' },
  { label: 'Message', field: 'failureMessage' },
];

export const REPLICATION_VM_JOBS = [
  { label: 'Virtual Machine', field: 'vmName' },
  { label: 'Start Time', field: 'startTime', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'End Time', field: 'endTime', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'Iteration Number', field: 'iterationNumber' },
  { label: 'State', field: 'status' },
  { label: 'Sync Status', field: 'syncStatus' },
  { label: 'Message', field: 'failureMessage' },
];
