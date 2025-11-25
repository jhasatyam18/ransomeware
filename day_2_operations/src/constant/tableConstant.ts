import { deleteSupportBundle } from '../store/actions/SupportActions';
import { openModal } from '../store/reducers/ModalReducer';
import { hasPriviledges } from '../utils/apiUtils';
import { onRecoveRecoveryIconClick } from '../utils/rendererUtils';

export const TABLE_NODE = [
    { label: 'Name', field: 'name', allowFilter: true, checked: true, allowSort: true },
    { label: 'Site', field: 'siteName', itemRenderer: 'SITE_LINK_RENDERER', allowSort: true },
    { label: 'Hostname', field: 'hostName', allowFilter: true, checked: true, allowSort: true },
    { label: 'Type', field: 'nodeType', allowFilter: true, checked: true, allowSort: true },
    { label: 'Platform Type', field: 'platformType', allowFilter: true, checked: true, allowSort: true },
    { label: 'Alerts', field: 'alerts', itemRenderer: 'ALERT_COLUMN_ITEM_RENDERER', width: 2, options: { objectUrnFileds: ['Node', 'name', 'nodeID'], nestedField: 'site.hostName' } },
    // { label: 'Ports', field: 'managementPort', itemRenderer: 'SERVER_PORT_ITEM_RENDERER' },
    { label: 'Version', field: 'version', allowFilter: true, checked: true, allowSort: true },
    { label: 'Status', field: 'status', itemRenderer: 'STATUS_ITEM_RENDERER', allowFilter: true, checked: true, allowSort: true },
];
export const RECOVERY_JOBS = [
    { label: 'Virtual Machine', field: 'vmName', allowFilter: true, checked: true, allowSort: true },
    { label: 'Protection Plan', field: 'protectionPlanName', allowFilter: true, checked: true, allowSort: true },
    { label: 'Duration', field: 'duration', itemRenderer: 'TIME_DURATION_RENDERER', width: 1, allowSort: true },
    { label: 'Recovery Type', field: 'recoveryType', itemRenderer: 'RECOVERY_TYPE_ITEM_RENDERER', allowFilter: true, checked: true, allowSort: true },
    { label: 'Recovery Point Time', field: 'recoveryPointTime', itemRenderer: 'DATE_ITEM_RENDERER', width: '2.3', allowSort: true },
    { label: 'Job Status', field: 'status', itemRenderer: 'RECOVERY_STATUS_RENDERER', options: { onIconClick: onRecoveRecoveryIconClick }, allowFilter: true, checked: true, allowSort: true },
    { label: 'IP Address', field: 'privateIP', itemRenderer: 'SSH_RDP_ITEM_RENDERER', allowSort: true },
];

export const NODE_ALERT_TABLE = [
    { label: 'Site Name', field: 'name' },
    { label: 'Protection Plan', field: 'planName' },
    { label: 'Impacted Object', field: 'obj' },
    { label: 'Type', field: 'type' },
    { label: 'Severity', field: 'severity', itemRenderer: 'STATUS_ITEM_RENDERER' },
    { label: 'Created At', field: 'time' },
    { label: 'Description', field: 'description', width: 2.5 },
    { label: 'Resolution', field: 'resolution', width: 2.5 },
    { label: 'Action', field: 'action', itemRenderer: 'ALERT_ACTION_RENDERER' },
];

export const SITE_TABLE = [
    { label: 'Name', field: 'name', allowFilter: true, checked: true, itemRenderer: 'SITE_LINK_RENDERER', allowSort: true },
    { label: 'Platform Type', field: 'platformType', allowFilter: true, checked: true, allowSort: true },
    { label: 'Alerts', field: 'alerts', itemRenderer: 'ALERT_COLUMN_ITEM_RENDERER', width: 2, options: { objectUrnFileds: ['Site', 'name', 'id'], nestedField: 'hostName' } },
    { label: 'Location', field: 'location', allowFilter: true, checked: true, allowSort: true, itemRenderer: 'SITE_LOCATION_ITEM_RENDERER' },
    { label: 'Protection Plans', field: 'totalProtectionPlans', itemRenderer: 'COUNT_ITEM_RENDERER', allowSort: true },
];
// { name: 'Svann', replication: {protection: 'VMware', recovery: 'AWS'}, testRecovery: '2 days ago', cleanupRequired: true, alerts: {major: 3, minor: 1}, pointInTimeCopies: '12', status: 'Stopped' },
export const PLAN_TABLE = [
    { label: 'Name', field: 'name', allowFilter: true, checked: true, allowSort: true, itemRenderer: 'PROTECTION_PLAN_NAME_RENDERER' },
    { label: 'DR Ready', field: 'isDRReady', itemRenderer: 'PLAN_DR_READY_RENDERER', width: 0.8, allowSort: true },
    { label: 'Replication', field: 'replicationInterval', itemRenderer: 'PLAN_REPLICATION_RENDERER', width: 2, allowSort: true, defaultSort: 1 },
    { label: 'Test Recovery (Days Ago)', field: 'lastTestRecoveryTime', itemRenderer: 'TEST_RECOVERY_TIME_ITEM_RENDERER', allowSort: true },
    { label: 'Cleanup Required', field: 'isCleanupRequired', itemRenderer: 'CLEANUP_ITEM_RENDERER', allowSort: true, width: 1 },
    { label: 'Alerts', field: 'alerts', itemRenderer: 'ALERT_COLUMN_ITEM_RENDERER', width: 2, options: { objectUrnFileds: ['ProtectionPlan', 'name', 'sourcePlanID'], nestedField: 'sourceSite.hostName' } },
    { label: 'Point-in-time Copies', field: 'totalPITCopies', itemRenderer: 'COUNT_ITEM_RENDERER', allowSort: true, width: 1 },
    { label: 'Status', field: 'status', itemRenderer: 'STATUS_ITEM_RENDERER', allowFilter: true, checked: true, allowSort: true },
];
export const INSTANCES = [
    { label: 'Virtual Machines', field: 'name', allowSort: true, allowFilter: true, checked: true, itemRenderer: 'PROTECTION_PLAN_NAME_RENDERER', width: 1.8 },
    { label: 'Replication', field: 'replicationInterval', itemRenderer: 'PLAN_REPLICATION_RENDERER', width: 1.8, allowSort: true, defaultSort: 1 },
    { label: 'Storage', field: 'totalStorage', itemRenderer: 'VM_SIZE_ITEM_RENDERER', allowSort: true, width: 0.6 },
    { label: 'Change Rate', field: 'averageChangeRate', itemRenderer: 'STORAGE_ITEM_RENDERER', allowSort: true, width: 1 },
    { label: 'Data Reduction (%)', field: 'dataReduction', allowSort: true, width: 1 },
    { label: 'Alerts', field: 'alerts', itemRenderer: 'ALERT_COLUMN_ITEM_RENDERER', width: 2, options: { objectUrnFileds: ['', 'moref'], nestedField: 'protectionPlan.sourceSite.hostName' } },
    { label: 'Recovery Status', field: 'recoveryStatus', itemRenderer: 'STATUS_ITEM_RENDERER', allowSort: true, allowFilter: true, checked: true, width: 1 },
    { label: 'Replication Status', field: 'replicationStatus', itemRenderer: 'STATUS_ITEM_RENDERER', allowSort: true, allowFilter: true, checked: true, width: 1.5 },
];

export const GLOBAL_ALERTS = [
    { label: 'Title', field: 'title', itemRenderer: 'ALERTS_TITLE_ITEM_RENDERER', allowFilter: true, checked: true, width: 2, allowSort: true },
    { label: 'Description', field: 'description', width: 3, allowSort: true },
    { label: 'Severity', field: 'severity', itemRenderer: 'ALERTS_SEVERITY_ITEM_RENDERER', allowFilter: true, checked: true, allowSort: true },
    { label: 'Created', field: 'createdTime', itemRenderer: 'DATE_ITEM_RENDERER', allowSort: true },
    { label: 'Last Updated', field: 'updatedTime', itemRenderer: 'DATE_ITEM_RENDERER', allowSort: true },
    { label: 'Acknowledged', field: 'isAcknowledge', itemRenderer: 'ALERT_ACK_ITEM_RENDERER', allowSort: true },
];

export const VMS_TABLE = [
    { label: 'Virtual Machine', field: 'name' },
    { label: 'Replication', field: 'replication', itemRenderer: 'PLAN_REPLICATION_RENDERER' },
    { label: 'Change Rate', field: 'changeRate' },
    { label: 'Test Recovery', field: 'testRecovery' },
    { label: 'Alerts', field: 'alerts', itemRenderer: 'PLAN_ALERT_RENDERER' },
    { label: 'Status', field: 'status' },
];

export const REPLICATION_TABLE = [
    { label: 'Virtual Machine', field: 'vmName', allowFilter: true, checked: true, allowSort: true },
    { label: 'Protection Plan', field: 'protectionPlanName', allowFilter: true, checked: true, allowSort: true },
    { label: 'Iteration', field: 'iterationNumber', allowSort: true },
    { label: 'Changed', field: 'changedSize', itemRenderer: 'STORAGE_ITEM_RENDERER', allowSort: true },
    { label: 'Transferred', field: 'transferredSize', itemRenderer: 'STORAGE_ITEM_RENDERER', allowSort: true },
    { label: 'Replication Duration', field: 'duration', itemRenderer: 'TIME_DURATION_RENDERER', allowSort: true },
    { label: 'Job Status', field: 'status', itemRenderer: 'STATUS_ITEM_RENDERER', allowFilter: true, checked: true, allowSort: true },
    { label: 'Sync Status', field: 'syncStatus', itemRenderer: 'STATUS_ITEM_RENDERER', allowFilter: true, checked: true, allowSort: true },
    { label: 'Sync Time', field: 'currentSnapshotTime', itemRenderer: 'DATE_ITEM_RENDERER', allowSort: true },
];

export const DASHBOARD_REPLICATION_DURATION = [
    { label: 'Current Week', value: 'week' },
    { label: 'Current Month', value: 'month' },
    { label: 'Current Year', value: 'year' },
    { label: 'Custom', value: '0' },
];

export const HealthTable = [
    { label: 'Site', field: 'name' },
    { label: 'RPO', field: 'rpoStatus', itemRenderer: 'NODE_HEALTH_COLUMN_RENDERER' },
    { label: 'Last Test Drill', field: 'lastTestDrillTime', itemRenderer: 'DATE_ITEM_RENDERER' },
    { label: 'DR Ready', field: 'drReady', itemRenderer: 'NODE_HEALTH_COLUMN_RENDERER' },
];

export const TABLE_LICENSES = [
    { label: 'Site', field: 'siteName' },
    { label: 'Type', field: 'licenseType' },
    { label: 'Registered On', field: 'createTime', itemRenderer: 'DATE_ITEM_RENDERER' },
    { label: 'Status', field: 'isActive', itemRenderer: 'LICENSE_STATUS_ITEM_RENDERER' },
    { label: 'Recoveries', field: 'completedRecoveries', itemRenderer: 'LICENSE_USAGE_ITEM_RENDERER' },
    { label: 'Migrations', field: 'completedMigrations', itemRenderer: 'LICENSE_USAGE_ITEM_RENDERER' },
    { label: 'Valid Till', field: 'expiredTime', itemRenderer: 'DATE_ITEM_RENDERER' },
];

export const SUPPORT_BUNDLES = [
    { label: 'Bundle Name', field: 'name', width: 2.3, allowFilter: true, checked: true },
    { label: 'Description', field: 'description', width: 2 },
    { label: 'Date', field: 'generatedAt', itemRenderer: 'DATE_ITEM_RENDERER', width: 1.7, allowSort: true },
    { label: 'User', field: 'generatedBy', width: 1, allowFilter: true, checked: true },
    { label: 'Size', field: 'bundleSize', itemRenderer: 'SIZE_ITEM_RENDERER', width: 1 },
    { label: 'Status', field: 'status', itemRenderer: 'STATUS_ITEM_RENDERER', width: 1, allowFilter: true, checked: true },
    { label: 'Actions ', field: 'status', itemRenderer: 'SUPPORT_BUNDLE_ACTION_ITEM_RENDERER', width: 1, options: { deleteSupportBundle, openModal, priviledges: hasPriviledges } },
];

export const ALERT_FILTERS = [
    { label: 'Acknowledged', field: 'isAcknowledge', query: 'ack', value: '1', checked: false },
    { label: 'Unacknowledged', field: 'isAcknowledge', query: 'ack', value: '0', checked: false },
];
