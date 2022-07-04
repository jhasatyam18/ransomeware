import VMInstanceItemRenderer from '../components/Table/ItemRenderers/VMInstanceItemRenderer';
import VMVolumeTypeItemRenderer from '../components/Table/ItemRenderers/VMVmwarePlacementInfoItemRenderer';
import { getRecoveryVMName } from '../utils/TableUtils';

export const OS_TYPE_ITEM_RENDERER = 'OS_TYPE_ITEM_RENDERER';
export const VM_SIZE_ITEM_RENDERER = 'VM_SIZE_ITEM_RENDERER';
export const VM_DISK_ITEM_RENDERER = 'VM_DISK_ITEM_RENDERER';
export const DR_PLAN_NAME_ITEM_RENDERER = 'DR_PLAN_NAME_ITEM_RENDERER';
export const DATE_ITEM_RENDERER = 'DateItemRenderer';
export const STATUS_ITEM_RENDERER = 'STATUS_ITEM_RENDERER';
export const TRANSFER_SIZE_ITEM_RENDERER = 'TRANSFER_SIZE_ITEM_RENDERER';
export const RECOVERY_TYPE_ITEM_RENDERER = 'RECOVERY_TYPE_ITEM_RENDERER';
export const RECOVERY_SITE_LINK_ITEM_RENDERER = 'RECOVERY_SITE_LINK_ITEM_RENDERER';
export const PROTECTION_SITE_LINK_ITEM_RENDERER = 'PROTECTION_SITE_LINK_ITEM_RENDERER';
export const SSH_RDP_ITEM_RENDERER = 'SSH_RDP_ITEM_RENDERER';
export const VM_USERNAME_ITEM_RENDERER = 'VM_USERNAME_ITEM_RENDERER';
export const VM_UPASSWORD_ITEM_RENDERER = 'VM_UPASSWORD_ITEM_RENDERER';
export const REPLICATION_INTERVAL_ITEM_RENDERER = 'REPLICATION_INTERVAL_ITEM_RENDERER';
export const EVENT_LEVEL_ITEM_RENDERER = 'EVENT_LEVEL_ITEM_RENDERER';
export const ALERT_ACK_ITEM_RENDERER = 'ALERT_ACK_ITEM_RENDERER';
export const VIEW_ALERT_INFO_RENDERER = 'VIEW_ALERT_INFO_RENDERER';
export const SIZE_ITEM_RENDERER = 'SIZE_ITEM_RENDERER';
export const SUPPORT_BUNDLE_ACTION_ITEM_RENDERER = 'SUPPORT_BUNDLE_ACTION_ITEM_RENDERER';
export const SERVER_PORT_ITEM_RENDERER = 'SERVER_PORT_ITEM_RENDERER';
export const NODE_NAME_ITEM_RENDERER = 'NODE_NAME_ITEM_RENDERER';
export const NODE_ACTION_RENDERER = 'NODE_ACTION_RENDERER';
export const EMAIL_RECIPIENT_ACTION_ITEM_RENDER = 'EMAIL_RECIPIENT_ACTION_ITEM_RENDER';
export const VM_BOOT_ORDER_ITEM_RENDER = 'VM_BOOT_ORDER_ITEM_RENDER';
export const LICENSE_USAGE_ITEM_RENDERER = 'LICENSE_USAGE_ITEM_RENDERER';
export const LICENSE_ACTION_ITEM_RENDERER = 'LICENSE_ACTION_ITEM_RENDERER';
export const LICENSE_STATUS_ITEM_RENDER = 'LICENSE_STATUS_ITEM_RENDER';
export const THROTTLING_ACTION_ITEM_RENDER = 'THROTTLING_ACTION_ITEM_RENDER';
export const THROTTLING_TIME_ITEM_RENDER = 'THROTTLING_TIME_ITEM_RENDER';
export const RECOVERY_STATUS_ITEM_RENDERER = 'RECOVERY_STATUS_ITEM_RENDERER';
export const ROLE_ITEM_RENDERER = 'ROLE_ITEM_RENDERER';
export const VM_NETWORK_INFO_ITEM_RENDERER = 'VM_NETWORK_INFO_ITEM_RENDERER';
export const SCRIPT_ITEM_RENDERER = 'SCRIPT_ITEM_RENDERER';
export const PROTECTED_VM_ACTIONS_ITEM_ITEM_RENDERER = 'PROTECTED_VM_ACTIONS_ITEM_ITEM_RENDERER';

// show time taken by any job
export const TIME_DURATION_RENDERER = 'TIME_RENDERER';

export const TABLE_HEADER_SITES = [
  { label: 'site.name', field: 'name' },
  { label: 'site.type', field: 'siteType', itemRenderer: RECOVERY_TYPE_ITEM_RENDERER },
  { label: 'description', field: 'description' },
  { label: 'platform', field: 'platformDetails.platformType' },
  { label: 'Node', field: 'node.name', itemRenderer: NODE_NAME_ITEM_RENDERER },
];

export const TABLE_HEADER_DR_PLANS = [
  { label: 'name', field: 'name', itemRenderer: DR_PLAN_NAME_ITEM_RENDERER },
  { label: 'protected.name', field: 'protectedSite.name', itemRenderer: PROTECTION_SITE_LINK_ITEM_RENDERER },
  { label: 'recovery.site', field: 'recoverySite.name', itemRenderer: RECOVERY_SITE_LINK_ITEM_RENDERER },
  { label: 'replication.interval', field: 'replicationInterval', itemRenderer: REPLICATION_INTERVAL_ITEM_RENDERER },
  { label: 'status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER },
  { label: 'Recovery Status', field: 'recoveryStatus', itemRenderer: STATUS_ITEM_RENDERER },
];
export const TABLE_PROTECT_VM_VMWARE = [
  { label: 'name', field: 'name' },
  { label: 'size', field: 'virtualDisks', itemRenderer: VM_SIZE_ITEM_RENDERER },
  { label: 'os', field: 'guestOS', itemRenderer: OS_TYPE_ITEM_RENDERER },
];

export const TABLE_BOOT_VM_VMWARE = [
  { label: 'name', field: 'name' },
  { label: 'bootOrder', field: 'guestOS', itemRenderer: VM_BOOT_ORDER_ITEM_RENDER },
];

export const TABLE_PROTECTION_PLAN_VMS = [
  { label: 'name', field: 'name' },
  { label: 'size', field: 'virtualDisks', itemRenderer: VM_SIZE_ITEM_RENDERER },
  { label: 'disks', field: 'virtualDisks', itemRenderer: VM_DISK_ITEM_RENDERER },
  { label: 'os', field: 'guestOS', itemRenderer: OS_TYPE_ITEM_RENDERER },
  { label: 'Last Run Time', field: 'lastRunTime', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'Status', field: 'recoveryStatus', itemRenderer: RECOVERY_STATUS_ITEM_RENDERER },
  { label: 'Actions', field: 'name', itemRenderer: PROTECTED_VM_ACTIONS_ITEM_ITEM_RENDERER },
];

export const TABLE_PROTECTION_PLAN_VMS_RECOVERY_CONFIG = [
  { label: 'name', field: 'instanceName' },
  { label: 'Instance Type', field: 'instanceType', itemRenderer: VMInstanceItemRenderer },
  { label: 'Volume Type', field: 'volumeType' },
  { label: 'Placement Info', field: '', itemRenderer: VMVolumeTypeItemRenderer },
  { label: 'Network', field: 'instanceDetails', itemRenderer: VM_NETWORK_INFO_ITEM_RENDERER },
  { label: 'Boot Order', field: 'bootPriority' },
];

export const REPLICATION_JOBS = [
  { label: 'Virtual Machine', field: 'vmName', allowFilter: true, checked: true },
  { label: 'Disk Id', field: 'diskId' },
  { label: 'Data Changed', field: 'changedSize', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'Data Transferred', field: 'transferSize', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'Replication Duration', field: 'startTime', itemRenderer: TIME_DURATION_RENDERER },
  { label: 'Job Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER, allowFilter: true, checked: true },
];

export const RECOVERY_JOBS = [
  { label: 'Virtual Machine', field: 'vmName', allowFilter: true, checked: true },
  { label: 'Duration', field: 'startTime', itemRenderer: TIME_DURATION_RENDERER },
  { label: 'Recovery Type', field: 'recoveryType', itemRenderer: RECOVERY_TYPE_ITEM_RENDERER, allowFilter: true, checked: true },
  { label: 'Job Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER, allowFilter: true, checked: true },
  { label: 'IP Address', field: 'publicIP', itemRenderer: SSH_RDP_ITEM_RENDERER },
];

export const PROTECTION_PLAN_RECOVERY_JOBS = [
  { label: 'Virtual Machine', field: 'vmName', allowFilter: true, checked: true },
  { label: 'Duration', field: 'startTime', itemRenderer: TIME_DURATION_RENDERER },
  { label: 'Recovery Type', field: 'recoveryType', itemRenderer: RECOVERY_TYPE_ITEM_RENDERER, allowFilter: true, checked: true },
  { label: 'Job Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER, allowFilter: true, checked: true },
  { label: 'IP Address', field: 'publicIP', itemRenderer: SSH_RDP_ITEM_RENDERER },
];

export const REPLICATION_VM_JOBS = [
  { label: 'Virtual Machine', field: 'vmName', allowFilter: true, checked: true },
  { label: 'Iterations', field: 'iterationNumber' },
  { label: 'Changed', field: 'changedSize', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'Transferred', field: 'transferredSize', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'Replication Duration', field: 'startTime', itemRenderer: TIME_DURATION_RENDERER },
  { label: 'Job Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER, allowFilter: true, checked: true },
  { label: 'Sync Status', field: 'syncStatus', itemRenderer: STATUS_ITEM_RENDERER, allowFilter: true, checked: true },
];

// Table fields for recovery virtual machines
export const TABLE_RECOVERY_VMS = [
  { label: 'name', field: 'name' },
  { label: 'Username', field: 'virtualDisks', itemRenderer: VM_USERNAME_ITEM_RENDERER },
  { label: 'Password', field: 'guestOS', itemRenderer: VM_UPASSWORD_ITEM_RENDERER },
  { label: 'status', field: 'recoveryStatus' },
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
  { label: 'Virtual Machines', field: 'vms', filterText: (text) => getRecoveryVMName(text) },
  { label: 'Duration', field: 'startTime', itemRenderer: TIME_DURATION_RENDERER },
  { label: 'Recovery Type', field: 'recoveryType', itemRenderer: RECOVERY_TYPE_ITEM_RENDERER },
  { label: 'Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER },
];

// Table fields for EVENTS
export const TABLE_EVENTS = [
  { label: 'Date', field: 'timeStamp', itemRenderer: DATE_ITEM_RENDERER, width: 2 },
  { label: 'Topic', field: 'topic', width: 2, allowFilter: true, checked: true },
  { label: 'Level', field: 'severity', itemRenderer: EVENT_LEVEL_ITEM_RENDERER, width: 1, allowFilter: true, checked: true },
  { label: 'Event Type', field: 'type', width: 1, allowFilter: true, checked: true },
  { label: 'Description', field: 'description', width: 4, allowFilter: true, checked: true },
  { label: 'User', field: 'generator', allowFilter: true, checked: true },
];

// Table fields for ALERTS
export const TABLE_ALERTS = [
  { label: 'Title', field: 'title', itemRenderer: VIEW_ALERT_INFO_RENDERER, allowFilter: true, checked: true },
  { label: 'Severity', field: 'severity', itemRenderer: EVENT_LEVEL_ITEM_RENDERER, allowFilter: true, checked: true },
  { label: 'Created', field: 'createdTime', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'Last Updated', field: 'updatedTime', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'Status', field: 'isAcknowledge', itemRenderer: ALERT_ACK_ITEM_RENDERER },
];

// Table fields for nodes
export const TABLE_NODES = [
  { label: 'Name', field: 'name' },
  { label: 'Hostname', field: 'hostname' },
  { label: 'Type', field: 'nodeType' },
  { label: 'Platform Type ', field: 'platformType' },
  { label: 'Ports', field: 'managementPort', itemRenderer: SERVER_PORT_ITEM_RENDERER },
  { label: 'Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER },
  { label: 'Key', field: 'status', itemRenderer: NODE_ACTION_RENDERER },
];

// Table fields for support bundle
export const SUPPORT_BUNDLES = [
  { label: 'Bundle Name', field: 'name', width: 3 },
  { label: 'Description', field: 'description', width: 2 },
  { label: 'Date', field: 'generatedAt', itemRenderer: DATE_ITEM_RENDERER, width: 1 },
  { label: 'User', field: 'generatedBy', width: 1 },
  { label: 'Size', field: 'bundleSize', itemRenderer: SIZE_ITEM_RENDERER, width: 1 },
  { label: 'Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER, width: 1 },
  { label: 'Actions ', field: 'status', itemRenderer: SUPPORT_BUNDLE_ACTION_ITEM_RENDERER, width: 1 },
];

// Table fields for email recipients
export const TABLE_EMAIL_RECIPIENTS = [
  { label: 'Email', field: 'emailAddress', width: 3 },
  { label: 'Subscribed Events', field: 'subscribedEvents', width: 5 },
  { label: 'Actions', field: 'emailAddress', itemRenderer: EMAIL_RECIPIENT_ACTION_ITEM_RENDER, width: 2 },
];

// Table fields for email recipients
export const TABLE_THROTTLING_NODES = [
  { label: 'Name', field: 'name' },
  { label: 'Hostname', field: 'hostname' },
  { label: 'Bandwidth Limit (Mbps)', field: 'bandwidthLimit' },
  { label: 'Time Limit (Mbps)', field: 'timeLimit' },
  { label: 'Time Period', field: 'startTime', itemRenderer: THROTTLING_TIME_ITEM_RENDER },
  { label: 'Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER },
  { label: 'Actions', field: 'throttling', itemRenderer: THROTTLING_ACTION_ITEM_RENDER, width: 2 },
];

// Table fields for protected virtual machines report
export const TABLE_REPORT_PROTECTED_VMS = [
  { label: 'Name', field: 'name' },
  { label: 'Plan', field: 'planName' },
  { label: 'Iteration', field: 'totalIteration' },
  { label: 'Changed', field: 'totalChangedSize', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'Transferred', field: 'totalTransferredSize', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'Reduction (%)', field: 'dataReductionRatio' },
  // { label: 'Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER },
  { label: 'Recovery Status', field: 'recoveryStatus' },
];

export const TABLE_LICENSES = [
  { label: 'Type', field: 'licenseType' },
  { label: 'Registered On', field: 'createTime', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'Status', field: 'isActive', itemRenderer: LICENSE_STATUS_ITEM_RENDER },
  { label: 'Recoveries', field: 'completedRecoveries', itemRenderer: LICENSE_USAGE_ITEM_RENDERER },
  { label: 'Migrations', field: 'completedMigrations', itemRenderer: LICENSE_USAGE_ITEM_RENDERER },
  { label: 'Valid Till', field: 'expiredTime', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'Actions', field: 'isActive', itemRenderer: LICENSE_ACTION_ITEM_RENDERER },
];

export const TABLE_USERS = [
  { label: 'Username', field: 'username' },
  { label: 'Description', field: 'description' },
  { label: 'Role', field: 'role', itemRenderer: ROLE_ITEM_RENDERER },
];

export const TABLE_UPLOAD_SCRIPTS = [
  { label: 'name', field: 'name' },
  { label: 'description', field: 'description' },
  { label: 'type', field: 'scriptType' },
  { label: 'actions', field: 'name', itemRenderer: SCRIPT_ITEM_RENDERER },
];

// table filter help text
export const TABLE_FILTER_TEXT = {
  TABLE_ALERTS: 'Data can be filtered on following fields <br/> title, severity, eventType <br /> example:  warning or <br /> severity=warning:eventType=replication',
  TABLE_EVENTS: 'Data can be filtered on following fields <br/> topic, severity, type and description <br /> example: warning or topic=recovery:severity=warning',
  REPLICATION_JOBS: 'Data can be filtered on following fields <br/> vmName, diskId and status <br /> example: windows or vmName=windows-10:diskId=2001',
  REPLICATION_VM_JOBS: 'Data can be filtered on following fields <br/> vmName, iterationNumber, status and syncStatus <br /> example: Windows or vmName=windows',
  TABLE_PROTECT_VM_VMWARE: 'Data can be filtered on following fields <br/> name and guestOS <br /> example: Windows or name=DBServer:guestOS=windows',
  TABLE_RECOVERY_VMS: 'Data can be filtered on following fields <br/> name <br /> example: Windows or name=DBServer',
};
