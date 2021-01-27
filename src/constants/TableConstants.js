export const OS_TYPE_ITEM_RENDARER = 'OS_TYPE_ITEM_RENDARER';
export const VM_SIZE_ITEM_RENDERER = 'VM_SIZE_ITEM_RENDERER';
export const DR_PLAN_NAME_ITEM_RENDERER = 'DR_PLAN_NAME_ITEM_RENDERER';
export const DATE_ITEM_RENDERER = 'DateItemRenderer';
export const STATUS_ITEM_RENDERER = 'STATUS_ITEM_RENDERER';
export const TRANSFER_SIZE_ITEM_RENDERER = 'TRANSFER_SIZE_ITEM_RENDERER';
export const RECOVERY_TYPE_ITEM_RENDERER = 'RECOVERY_TYPE_ITEM_RENDERER';

export const TABLE_HEADER_SITES = [
  { label: 'site.type', field: 'siteType' },
  { label: 'description', field: 'description' },
  { label: 'platform', field: 'platformDetails.platformType' },
];

export const TABLE_HEADER_DR_PLANS = [
  { label: 'name', field: 'name', itemRenderer: DR_PLAN_NAME_ITEM_RENDERER },
  { label: 'protected.site', field: 'protectedSite.platformDetails.platformName' },
  { label: 'recovery.site', field: 'recoverySite.platformDetails.platformName' },
  { label: 'replication.interval', field: 'replicationInterval' },
  { label: 'status', field: 'status' },
];

export const TABLE_PROTECT_VM_VMWARE = [
  { label: 'name', field: 'name' },
  { label: 'size', field: 'virtualDisks', itemRenderer: VM_SIZE_ITEM_RENDERER },
  { label: 'os', field: 'guestOS', itemRenderer: OS_TYPE_ITEM_RENDARER },
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
  { label: 'Recovery Type', field: 'recoveryType', itemRenderer: RECOVERY_TYPE_ITEM_RENDERER },
  { label: 'Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER },
  { label: 'Message', field: 'failureMessage' },
];
