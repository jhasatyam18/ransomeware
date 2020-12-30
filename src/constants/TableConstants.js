export const OS_TYPE_ITEM_RENDARER = 'OS_TYPE_ITEM_RENDARER';
export const VM_SIZE_ITEM_RENDERER = 'VM_SIZE_ITEM_RENDERER';
export const DR_PLAN_NAME_ITEM_RENDERER = 'DR_PLAN_NAME_ITEM_RENDERER';

export const TABLE_HEADER_SITES = [
  { label: 'Site Type', field: 'siteType' },
  { label: 'Description', field: 'Description' },
  { label: 'Platform', field: 'platformDetails.platformType' },
];

export const TABLE_HEADER_DR_PLANS = [
  { label: 'Name', field: 'Name', itemRenderer: DR_PLAN_NAME_ITEM_RENDERER },
  { label: 'Protected Site', field: 'protectedSite.platformDetails.platformName' },
  { label: 'Recovery Site', field: 'recoverySite.platformDetails.platformName' },
  { label: 'Replication Interval', field: 'replicationInterval' },
  { label: 'Status', field: '' },
];

export const TABLE_PROTECT_VM_VMWARE = [
  { label: 'Name', field: 'Name' },
  { label: 'Size', field: 'virtualDisks', itemRenderer: VM_SIZE_ITEM_RENDERER },
  { label: 'OS', field: 'guestOS', itemRenderer: OS_TYPE_ITEM_RENDARER },
];

export const REPLICATION_JOB_STATUS = [
  { label: 'Virtual Machine', field: 'VMName' },
  { label: 'Disk', field: 'DiskID' },
  { label: 'Size', field: 'TransferSize' },
  { label: 'Start Time', field: 'StartTime' },
  { label: 'End Time', field: 'EndTime' },
  { label: 'Status', field: 'Status' },
  { label: 'Message', field: 'FailureMessage' },
];
