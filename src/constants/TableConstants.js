import { hideStatusForReplPlan } from '../utils/AppUtils';
import { drPlanStatus } from '../store/actions/DrPlanActions';
import VMInstanceItemRenderer from '../components/Table/ItemRenderers/VMInstanceItemRenderer';
import { getRecoveryVMName } from '../utils/TableUtils';
import { REPORT_DURATION, STATIC_KEYS } from './InputConstants';

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
export const EMAIL_SUBSCRIBED_EVENT_ITEM_RENDER = 'EMAIL_SUBSCRIBED_EVENT_ITEM_RENDER';
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
export const VM_PLACEMENT_INFO_ITEM_RENDERER = 'VM_PLACEMENT_INFO_ITEM_RENDERER';
export const SITE_LOCATION_ITEM_RENDERER = 'SITE_LOCATION_ITEM_RENDERER';
export const SITE_NAME_LINK_RENDERER = 'SITE_NAME_LINK_RENDERER';
export const RECOVERY_STATUS_RENDERER = 'RECOVERY_STATUS_RENDERER';
export const PLAYBOOK_FILENAME_RENDERER = 'PLAYBOOK_FILENAME_RENDERER';
export const SINGLE_PLAYBOOK_STATUS_RENDERER = 'SINGLE_PLAYBOOK_STATUS_RENDERER';
export const PLAYBOOK_ACTION_RENDERER = 'PLAYBOOK_ACTION_RENDERER';
export const PLAYBOOK_CONFIGURE_RENDERER = 'TEMPLATE_CONFIGURE_RENDERE';
export const PLAYBOOK_CHANGES_RENDERER = 'PLAYBOOK_CHANGES_RENDERER';
export const PLAYBOOK_RENDER_ISSUES_COLUMN = 'PLAYBOOK_RENDER_ISSUES_COLUMN';
export const PLAYBOOK_PLAN_NAME_LINK_RENDERER = 'PLAYBOOK_PLAN_NAME_LINK_RENDERER';
export const PLAYBOOK_PLAN_STATUS_RENDERER = 'PLAYBOOK_PLAN_STATUS_RENDERER';
export const REPLICATION_PRIORITY_RENDERER = 'REPLICATION_PRIORITY_RENDERER';
export const RECOVERY_CHECKPOINT_OPTION_RENDERER = 'RECOVERY_CHECKPOIN_OPTION_RENDERER';
export const JOB_TYPE_RENDERER = 'JOB_TYPE_RENDERER';
export const PRESERVE_CHECKPOINT = 'RECOVERY_CHECKPOINT_PRESERVE';
export const CHECKPOINTS_LINK_RENDERER = 'CHECKPOINT_LINK_RENDERER';
export const JOB_TYPE_ITEM_RENDERER = 'JOB_TYPE_ITEM_RENDERER';
export const CHECKPOINT_RECOVERY_JOB_ITEM_RENDERER = 'CHECKPOINT_JOB_ITEM_RENDERER';
export const PLAYBOOK_ITEM_RENDERER = 'PLAYBOOK_ITEM_RENDERER';
export const QUIESCE_SOURCE_SNAPSHOT_RENDERER = 'QUIESCE_SOURCE_SNAPSHOT_RENDERER';
export const QUIESCE_VMNAME_RENDERER = 'QUIESCE_VMNAME_RENDERER';
export const DISK_REPLICATION_TYPE_ITEM_RENDERER = 'DISK_REPLICATION_TYPE_ITEM_RENDERER';
export const PLATFORM_TYPE_ITEM_RENDERER = 'PREP_NODE_ITEM_RENDERER';
export const NODE_HOSTNAME_ITEM_RENDERER = 'NODE_HOSTNAME_ITEM_RENDERER';
export const EVENT_DESCRIPTION_RENDERER = 'EVENT_DESCRIPTION_RENDERER';
export const JOBS_VM_NAME_RENDERER = 'JOBS_VM_NAME_RENDERER';
export const NODE_STATUS_RENDERER = 'NODE_STATUS_RENDERER';
export const REVERSE_SUMMARY_ENTITY_TYPE_RENDERER = 'REVERSE_SUMMARY_ENTITY_TYPE_RENDERER';
export const REPLICATION_TYPE_OPTION_RENDERER = 'REPLICATION_TYPE_OPTION_RENDERER';
export const ENTITY_TYPE_OPTION_RENDERER = 'ENTITY_TYPE_OPTION_RENDERER';
export const REVERSE_VM_DESCRIPTION_RENDERER = 'REVERSE_VM_DESCRIPTION_RENDERER';
export const DR_PLAN_RECOVERY_STATUS_RENDERER = 'DR_PLAN_RECOVERY_STATUS_RENDERER';
export const LATEST_REFRESH_RECOVERY_STATUS = 'LATEST_REFRESH_RECOVERY_STATUS';
export const CLEANUP_SUMMARY_ROW_RENDERER = 'CLEANUP_SUMMARY_ROW_RENDERER';
export const REPORT_AVG_RPO_RENDERER = 'REPORT_AVG_RPO_RENDERER';
export const REPORT_VMS_ITERATION = 'REPORT_VMS_ITERATION';
export const REPORT_DATA_REDUCTION_RATIO = 'REPORT_DATA_REDUCTION_RATIO';
export const WRAP_TEXT_ITEM_RENDERER = 'WRAP_TEXT_ITEM_RENDERER';
export const SYSTEM_UPGRADE_SCHEDULE_ITEM_RENDERER = 'SYSTEM_UPGRADE_SCHEDULE_ITEM_RENDERER';
export const SCHEDULE_NODE_LOCATION_ITEM_RENDERER = 'SCHEDULE_NODE_LOCATION_ITEM_RENDERER';
export const AWS_TARGET_STORAGE_OPTION_RENDERER = 'AWS_TARGET_STORAGE_OPTION_RENDERER';
export const REPORT_SCHEDULE_ITEM_RENDERER = 'REPORT_SCHEDULE_ITEM_RENDERER';
export const GENERATED_REPORTS_ITEM_RENDERER = 'GENERATED_REPORTS_ITEM_RENDERER';
export const REPORT_JOB_NAME_ITEM_RENDERER = 'REPORT_JOB_NAME_ITEM_RENDERER';
export const END_TIME_REPORT_SHEDULE_JOB = 'END_TIME_REPORT_SHEDULE_JOB';
export const REPORT_SCHEDULE_EMAIL_ITEM_RENDERER = 'REPORT_SCHEDULE_EMAIL_ITEM_RENDERER';
export const SCHEDULE_STATUS_RENDERER = 'SCHEDULE_STATUS_RENDERER';
export const VM_REPL_STATUS_ICON = 'VM_REPL_STATUS_ICON';
export const VM_NAME_LINK = 'VM_NAME_LINK';
export const PLAN_LIST_WORKLOAD = 'PLAN_LIST_WORKLOAD';
export const VM_REPL_STATUS = 'VM_REPL_STATUS';
// show time taken by any job
export const TIME_DURATION_RENDERER = 'TIME_RENDERER';
export const VM_TENANCY_ITEM_RENDERER = 'VM_TENANCY_ITEM_RENDERER';

export const REVERSE_SHOW_DISABLED_VM_REPL_WARNING = 'REVERSE_SHOW_DISABLED_VM_REPL_WARNING';

export const TABLE_HEADER_SITES = [
  { label: 'site.name', field: 'name', itemRenderer: SITE_NAME_LINK_RENDERER },
  { label: 'site.type', field: 'siteType', itemRenderer: RECOVERY_TYPE_ITEM_RENDERER },
  { label: 'description', field: 'description' },
  { label: 'platform', field: 'platformDetails.platformType' },
  { label: 'Location', itemRenderer: SITE_LOCATION_ITEM_RENDERER },
  { label: 'Node', field: 'node.name', itemRenderer: NODE_NAME_ITEM_RENDERER },
];

export const TABLE_HEADER_DR_PLANS = [
  { label: 'name', field: 'name', itemRenderer: DR_PLAN_NAME_ITEM_RENDERER },
  { label: 'protected.name', field: 'protectedSite.name', itemRenderer: PROTECTION_SITE_LINK_ITEM_RENDERER },
  { label: 'recovery.site', field: 'recoverySite.name', itemRenderer: RECOVERY_SITE_LINK_ITEM_RENDERER },
  { label: 'replication.interval', field: 'replicationInterval', itemRenderer: REPLICATION_INTERVAL_ITEM_RENDERER },
  { label: 'Workload', itemRenderer: PLAN_LIST_WORKLOAD, field: 'status' },
  { label: 'status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER, options: { getValueFromFunc: drPlanStatus } },
  { label: 'Recovery Status', field: 'recoveryStatus', itemRenderer: DR_PLAN_RECOVERY_STATUS_RENDERER },
  { label: 'Playbook', field: '', itemRenderer: PLAYBOOK_ITEM_RENDERER },
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
  { label: 'Replication Enabled', field: 'name', itemRenderer: VM_REPL_STATUS },
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
  { label: 'Placement Info', field: '', itemRenderer: VM_PLACEMENT_INFO_ITEM_RENDERER },
  { label: 'Network', field: 'instanceDetails', itemRenderer: VM_NETWORK_INFO_ITEM_RENDERER },
  { label: 'Boot Order', field: 'bootPriority' },
];

export const TABLE_AWS_PROTECTION_PLAN_VMS_RECOVERY_CONFIG = [
  { label: 'name', field: 'instanceName' },
  { label: 'Instance Type', field: 'instanceType', itemRenderer: VMInstanceItemRenderer },
  { label: 'Volume Type', field: 'volumeType' },
  { label: 'Placement Info', field: '', itemRenderer: VM_TENANCY_ITEM_RENDERER },
  { label: 'Network', field: 'instanceDetails', itemRenderer: VM_NETWORK_INFO_ITEM_RENDERER },
  { label: 'Boot Order', field: 'bootPriority' },
];

export const REPLICATION_JOBS = [
  { label: 'Virtual Machine', field: 'vmName', allowFilter: true, checked: true },
  { label: 'Disk Id', field: 'diskId' },
  { label: 'Iteration', field: 'iterationNumber' },
  { label: 'Type', field: 'replicationType', allowFilter: true, itemRenderer: DISK_REPLICATION_TYPE_ITEM_RENDERER, width: '2' },
  { label: 'Data Changed', field: 'changedSize', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'Data Transferred', field: 'transferSize', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'Replication Duration', field: 'startTime', itemRenderer: TIME_DURATION_RENDERER },
  { label: 'Job Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER, allowFilter: true, checked: true },
];

export const RECOVERY_JOBS = [
  { label: 'Virtual Machine', field: 'vmName', itemRenderer: JOBS_VM_NAME_RENDERER, allowFilter: true, checked: true },
  { label: 'Duration', field: 'startTime', itemRenderer: TIME_DURATION_RENDERER },
  { label: 'Recovery Type', field: 'recoveryType', itemRenderer: RECOVERY_TYPE_ITEM_RENDERER, allowFilter: true, checked: true },
  { label: 'Recovery Point Time', field: 'recoveryPointTime', itemRenderer: DATE_ITEM_RENDERER, width: '2.3' },
  { label: 'Job Status', field: 'status', itemRenderer: RECOVERY_STATUS_RENDERER, allowFilter: true, checked: true, width: '2.5' },
  { label: 'IP Address', field: 'publicIP', itemRenderer: SSH_RDP_ITEM_RENDERER },
];

export const PROTECTION_PLAN_RECOVERY_JOBS = [
  { label: 'Virtual Machine', field: 'vmName', allowFilter: true, checked: true },
  { label: 'Recovery Type', field: 'recoveryType', itemRenderer: RECOVERY_TYPE_ITEM_RENDERER, allowFilter: true, checked: true },
  { label: 'Recovery Point Time', field: 'recoveryPointTime', itemRenderer: DATE_ITEM_RENDERER, width: '2.3' },
  { label: 'Duration', field: 'startTime', itemRenderer: TIME_DURATION_RENDERER },
  { label: 'Job Status', field: 'status', itemRenderer: RECOVERY_STATUS_RENDERER, allowFilter: true, checked: true, width: '2.6' },
  { label: 'IP Address', field: 'publicIP', itemRenderer: SSH_RDP_ITEM_RENDERER },
];

export const REPLICATION_VM_JOBS = [
  { label: 'Virtual Machine', field: 'vmName', itemRenderer: JOBS_VM_NAME_RENDERER, allowFilter: true, checked: true },
  { label: 'Iteration', field: 'iterationNumber' },
  { label: 'Changed', field: 'changedSize', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'Transferred', field: 'transferredSize', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'Replication Duration', field: 'startTime', itemRenderer: TIME_DURATION_RENDERER },
  { label: 'Job Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER, allowFilter: true, checked: true },
  { label: 'Sync Status', field: 'syncStatus', itemRenderer: STATUS_ITEM_RENDERER, allowFilter: true, checked: true },
  { label: 'Sync Time', field: 'currentSnapshotTime', itemRenderer: DATE_ITEM_RENDERER },
];

// Table fields for recovery virtual machines
export const TABLE_RECOVERY_VMS = [
  { label: 'name', field: 'name' },
  { label: 'Username', field: 'virtualDisks', itemRenderer: VM_USERNAME_ITEM_RENDERER, info: 'info.recovery.username' },
  { label: 'Password', field: 'guestOS', itemRenderer: VM_UPASSWORD_ITEM_RENDERER, info: 'info.recovery.password' },
  { label: 'Point In Time', field: 'currentSnapshotTime', itemRenderer: RECOVERY_CHECKPOINT_OPTION_RENDERER, width: 3 },
  { label: 'status', field: 'recoveryStatus', width: 1.1 },
];

// Table fields for protection plan vise replication
export const TABLE_PROTECTION_PLAN_REPLICATIONS = [
  { label: 'name', field: 'name', itemRenderer: VM_NAME_LINK, width: '2' },
  { label: 'Replication Enabled', field: 'name', itemRenderer: VM_REPL_STATUS, width: '1' },
  { label: 'Total Changed', field: 'totalChangedSize', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'Total Transferred', field: 'totalTransferredSize', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'Data Reduction (%)', field: 'dataReductionRatio', width: '1' },
  { label: 'Latest Job Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER, options: { shouldShowFnc: (data) => hideStatusForReplPlan(data) } },
  { label: 'Latest Sync Status', field: 'syncStatus', itemRenderer: STATUS_ITEM_RENDERER, options: { shouldShowFnc: (data) => hideStatusForReplPlan(data) } },
  { label: 'Last Sync Time', field: 'lastSyncTime', itemRenderer: DATE_ITEM_RENDERER, options: { ItemRenderer: VM_REPL_STATUS_ICON } },
];

// Table fields for protection plan
export const TABLE_PROTECTION_PLAN_RECOVERY = [
  { label: 'Virtual Machines', field: 'entities', filterText: (text) => getRecoveryVMName(text) },
  { label: 'Duration', field: 'startTime', itemRenderer: TIME_DURATION_RENDERER },
  { label: 'Recovery Type', field: 'recoveryType', itemRenderer: RECOVERY_TYPE_ITEM_RENDERER },
  { label: 'Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER },
];

// Table fields for EVENTS
export const TABLE_EVENTS = [
  { label: 'Date', field: 'timeStamp', itemRenderer: DATE_ITEM_RENDERER, width: 2 },
  { label: 'Topic', field: 'topic', allowFilter: true, checked: true, width: 1 },
  { label: 'Level', field: 'severity', itemRenderer: EVENT_LEVEL_ITEM_RENDERER, allowFilter: true, checked: true, width: 1 },
  { label: 'Event Type', field: 'type', allowFilter: true, checked: true, width: 1, itemRenderer: WRAP_TEXT_ITEM_RENDERER },
  { label: 'Description', field: 'description', itemRenderer: EVENT_DESCRIPTION_RENDERER, allowFilter: true, checked: true, width: 3 },
  { label: 'User', field: 'generator', allowFilter: true, checked: true, width: 1 },
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
  { label: 'Hostname', field: 'hostname', itemRenderer: NODE_HOSTNAME_ITEM_RENDERER },
  { label: 'Type', field: 'nodeType' },
  { label: 'Platform Type ', field: 'platformType', itemRenderer: PLATFORM_TYPE_ITEM_RENDERER },
  { label: 'Version', field: 'version', ifEmptyShow: '-' },
  { label: 'Ports', field: 'managementPort', itemRenderer: SERVER_PORT_ITEM_RENDERER },
  { label: 'Status', field: 'status', itemRenderer: NODE_STATUS_RENDERER, width: 2 },
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
  { label: 'Email', field: 'emailAddress', width: 2 },
  { label: 'Subscribed Events', field: 'subscribedEvents', width: 5, itemRenderer: EMAIL_SUBSCRIBED_EVENT_ITEM_RENDER },
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
  { label: 'Iteration', field: 'totalIteration', itemRenderer: REPORT_VMS_ITERATION },
  { label: 'Changed', field: 'totalChangedSize', itemRenderer: REPORT_DATA_REDUCTION_RATIO },
  { label: 'Transferred', field: 'totalTransferredSize', itemRenderer: REPORT_DATA_REDUCTION_RATIO },
  { label: 'Reduction (%)', field: 'dataReductionRatio', itemRenderer: REPORT_DATA_REDUCTION_RATIO },
  // { label: 'Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER },
  { label: 'Recovery Status', field: 'recoveryStatus', itemRenderer: REPORT_DATA_REDUCTION_RATIO },
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
  { label: 'Full Name', field: 'fullName' },
  { label: 'Email', field: 'email' },
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
  TABLE_ALERTS: 'Data can be filtered on following fields title, severity, eventType example:  warning or severity=warning:eventType=replication',
  TABLE_EVENTS: 'Data can be filtered on following fields topic, severity, type and description example: warning or topic=recovery:severity=warning',
  REPLICATION_JOBS: 'Data can be filtered on following fields vmName, diskId and status example: windows or vmName=windows-10:diskId=2001',
  REPLICATION_VM_JOBS: 'Data can be filtered on following fields vmName, iterationNumber, status and syncStatus example: Windows or vmName=windows',
  TABLE_PROTECT_VM_VMWARE: 'Data can be filtered on following fields name and guestOS example: Windows or name=DBServer:guestOS=windows',
  TABLE_HEADER_DR_PLANS: 'Data can be filtered on following fields :- Name, Status, Recovery Status, Protection Site, Recovery Site',
  TABLE_PROTECTION_PLAN_VMS: 'Data can be filtered on following fields :- Name, OS, Disk, Status',
  TABLE_PROTECTION_PLAN_VMS_RECOVERY_CONFIG: 'Data can be filtered on following fields :- Name, Instance Type',
  TABLE_SELECTIVE_VM_REPLICATION: 'Data can be filtered on following fields :- Name, Sync Status and Replication Status',
};

export const PLAYBOOKS = [
  { label: 'File', field: 'name', itemRenderer: PLAYBOOK_FILENAME_RENDERER, width: 3 },
  { label: 'Configure', itemRenderer: PLAYBOOK_CONFIGURE_RENDERER, width: 2 },
  { label: 'Status', field: 'status', itemRenderer: SINGLE_PLAYBOOK_STATUS_RENDERER, width: 4 },
  { label: 'Actions', field: 'status', itemRenderer: PLAYBOOK_ACTION_RENDERER, width: 2 },
];

export const PLAYBOOK_DETAILS = [
  { label: 'Protection Plan', field: 'name', itemRenderer: PLAYBOOK_PLAN_NAME_LINK_RENDERER },
  { label: 'RPO', field: 'rpo', itemRenderer: REPLICATION_INTERVAL_ITEM_RENDERER },
  { label: 'Protected Site', field: 'protectedSiteName' },
  { label: 'Recovery Site', field: 'recoverySiteName' },
  { label: 'Virtual Machines', field: 'protectedEntities' },
  { label: 'Status', field: 'status', itemRenderer: PLAYBOOK_PLAN_STATUS_RENDERER },
];

export const PLAYBOOK_ISSUES = [
  { label: 'Virtual Machine (s)', field: 'name', width: 4 },
  { label: 'Issue (s)', field: 'errorMessages', itemRenderer: PLAYBOOK_RENDER_ISSUES_COLUMN },
];

export const REPLICATION_PRIOPITY = [
  { label: 'Virtual Machine', field: 'name' },
  { label: 'Replication Priority', itemRenderer: REPLICATION_PRIORITY_RENDERER },
];

export const CHECKPOINTS_JOBS = [
  { label: 'Workload Name', field: 'workloadName', allowFilter: true, checked: true },
  { label: 'Job Type', field: 'jobType', allowFilter: true, checked: true },
  { label: 'Duration', field: 'startTime', itemRenderer: TIME_DURATION_RENDERER },
  { label: 'Sync Time', field: 'syncTime', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER, allowFilter: true, checked: true },
  { label: 'Checkpoint', field: 'recoveryCheckpointID', itemRenderer: CHECKPOINTS_LINK_RENDERER },
];

export const RECOVERY_CHECKPOINTS = [
  { label: 'Size', field: 'size', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'Created At', field: 'creationTime', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'Expires On', field: 'expirationTime', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'Checkpoint Status', field: 'checkpointStatus', allowFilter: true, checked: true, itemRenderer: CHECKPOINT_RECOVERY_JOB_ITEM_RENDERER },
  { label: 'Recovery Status', field: 'recoveryStatus', allowFilter: true, checked: true, itemRenderer: CHECKPOINT_RECOVERY_JOB_ITEM_RENDERER },
  { label: 'Preserve', field: 'isPreserved', itemRenderer: PRESERVE_CHECKPOINT },
];

export const VM_RECOVERY_CHECKPOINTS = [
  { label: 'Name', field: 'workloadName', allowFilter: true, checked: true, width: 2 },
  { label: 'Created At', field: 'creationTime', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'Expires On', field: 'expirationTime', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'Checkpoint Status', field: 'checkpointStatus', allowFilter: true, checked: true, itemRenderer: CHECKPOINT_RECOVERY_JOB_ITEM_RENDERER },
  { label: 'Recovery Status', field: 'recoveryStatus', allowFilter: true, checked: true, itemRenderer: CHECKPOINT_RECOVERY_JOB_ITEM_RENDERER },
  { label: 'Preserve', field: 'isPreserved', itemRenderer: PRESERVE_CHECKPOINT },
];
export const VMWARE_QUIESCE_SNAPSHOT = [
  { label: 'Virtual Machine', field: 'name', itemRenderer: QUIESCE_VMNAME_RENDERER },
  { label: 'Enable', itemRenderer: QUIESCE_SOURCE_SNAPSHOT_RENDERER },
];

export const PROTECTION_PLAN_COLUMNS = [
  { header: 'Name', field: 'name' },
  { header: 'Protection Site', field: 'protectedSite.name' },
  { header: 'Recovery Site', field: 'recoverySite.name' },
  { header: 'Replication Interval', field: 'replicationInterval', type: REPORT_DURATION.TIME },
  { header: 'Status', field: 'replStatus', type: REPORT_DURATION.REPLICATION_STATUS, options: { getValueFromFunc: drPlanStatus } },
  { header: 'Recovery Status', field: 'rStatus', type: STATIC_KEYS.RECOVER_STATUS },
  { header: 'Average RPO', field: 'achievedAvgRPO', type: 'rpo-renderer' },
  { header: 'Average RTO', field: 'achievedAvgRTO', type: 'rpo-renderer' },
];

export const SITE_COLUMNS = [
  { header: 'Name', field: 'name' },
  { header: 'Site Type', field: 'siteType' },
  { header: 'Description', field: 'description' },
  { header: 'Platform', field: 'platformDetails.platformType' },
  { header: 'Location', field: 'platformDetails', type: REPORT_DURATION.LOCATION },
  { header: 'Node', field: 'node.name' },
];

export const NODE_COLUMNS = [
  { header: 'Name', field: 'name' },
  { header: 'Hostname', field: 'hostname' },
  { header: 'Type', field: 'nodeType' },
  { header: 'Platform Type', field: 'nodePlatformType', type: REPORT_DURATION.NODE_TYPE_RENDERER },
  { header: 'Version', field: 'version' },
  { header: 'Ports', field: 'managementPort', type: STATIC_KEYS.PORTS_RENDERER },
  { header: 'Status', field: 'status' },
];

export const EVENTS_COLUMNS = [
  { header: 'Date', field: 'timeStamp', type: REPORT_DURATION.DATE },
  { header: 'Topic', field: 'topic' },
  { header: 'Lavel', field: 'severity' },
  { header: 'Event Type', field: 'type' },
  { header: 'Description', field: 'description' },
  { header: 'User', field: 'generator' },
];

export const ALERTS_COLUMNS = [
  { header: 'Title', field: 'alertTitle', type: STATIC_KEYS.ALERT_TITLE },
  { header: 'Severity', field: 'severity' },
  { header: 'Created', field: 'createdTime', type: REPORT_DURATION.DATE },
  { header: 'Last Updated', field: 'updatedTime', type: REPORT_DURATION.DATE },
  { header: 'Status', field: 'isAcknowledge', type: STATIC_KEYS.REPORT_STATUS_TYPE },
];

export const PROTECTED_VMS_COLUMNS = [
  { header: 'Names', field: 'name' },
  { header: 'Plan', field: 'planName' },
  { header: 'Iteration', field: 'totalIteration', type: REPORT_DURATION.REPORT_VMS_ITERATION },
  { header: 'Changed', field: 'totalChangedSize', type: REPORT_DURATION.REPORT_VMS_SIZE },
  { header: 'Transferred', field: 'totalTransferredSize', type: REPORT_DURATION.REPORT_VMS_SIZE },
  { header: 'Reduction(%)', field: 'dataReductionRatio', type: REPORT_DURATION.REPORT_VMS_ITERATION },
  { header: 'Recovery Status', field: 'recoveryStatus' },
];

export const REPLICATION_JOB_COLUMNS = [
  { header: 'Virtual Machine', field: 'vmName' },
  { header: 'Iteration', field: 'iterationNumber' },
  { header: 'Changed', field: 'changedSize', type: REPORT_DURATION.SIZE },
  { header: 'Transferred', field: 'transferredSize', type: REPORT_DURATION.SIZE },
  { header: 'Job Status', field: 'status' },
  { header: 'Sync Status', field: 'syncStatus' },
  { header: 'Replication Duration', field: 'duration', type: REPORT_DURATION.DURATION },
  { header: 'Sync Time', field: 'currentSnapshotTime', type: REPORT_DURATION.DATE },
  { header: 'Failure Message', field: 'failureMessage' },
];

export const RECOVERY_JOB_COLUMNS = [
  { header: 'Virtual Machine', field: 'vmName' },
  { header: 'Timings and Duration', field: 'date_duration', type: STATIC_KEYS.RECOVERY_DATE_DURATION },
  { header: 'Recovery Type', field: 'recoveryType', type: REPORT_DURATION.REPORT_RECOVERY_TYPE },
  { header: 'Recovery Point Time', field: 'recoveryPointTime', type: REPORT_DURATION.DATE },
  { header: 'Job Status', field: 'statusRecovery', type: REPORT_DURATION.RECOVERY_JOB_STEPS },
  { header: 'IP Address', field: 'publicIP', secondaryField: 'privateIP' },
];

export const TABLE_REVERSE_VM = [
  { label: 'Workload', field: 'name' },
  { label: 'os', field: 'guestOS', itemRenderer: OS_TYPE_ITEM_RENDERER },
  { label: 'Storage', field: 'virtualDisks', itemRenderer: VM_SIZE_ITEM_RENDERER },
  { label: 'Entity Type', field: '', itemRenderer: ENTITY_TYPE_OPTION_RENDERER },
  { label: 'Replication Type', itemRenderer: REPLICATION_TYPE_OPTION_RENDERER },
  { label: 'description', field: 'description', width: 3, itemRenderer: REVERSE_VM_DESCRIPTION_RENDERER },
];

export const TABLE_REFRESH_RECOVERY_STATUS = [
  { label: 'Workload', field: 'vmName', width: '2' },
  { label: 'Protection Plan', field: 'protectionPlanName' },
  { label: 'Boot Order', field: 'bootOrder' },
  { label: 'Recovery Time', field: 'startTime', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'Last Known Recovery Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER },
  { label: 'Latest Recovery Status', field: 'refreshedRecoveryStatus', itemRenderer: LATEST_REFRESH_RECOVERY_STATUS, width: '2.9' },
];

export const TABLE_REPORTS_CARD_CHECKPOINT = [
  { label: 'Plan Name', field: 'protectionPlanName' },
  { label: 'VM Name', field: 'workloadName' },
  { label: 'Created At', field: 'creationTime', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'Expires On', field: 'expirationTime', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'Checkpoint Status', field: 'checkpointStatus' },
  { label: 'Preserved', field: 'isPreserved', itemRenderer: PRESERVE_CHECKPOINT },
];
export const TABLE_REPORTS_CHECKPOINTS = [
  { header: 'Plan Name', field: 'protectionPlanName' },
  { header: 'VM Name', field: 'workloadName' },
  { header: 'Created At', field: 'creationTime', type: 'date' },
  { header: 'Expires On', field: 'expirationTime', type: REPORT_DURATION.CHECKPOINT_EXPIRATION_TIME },
  { header: 'Checkpoint Status', field: 'checkpointStatus' },
  { header: 'Preserved', field: 'isPreserved' },
];

export const TABLE_REPORT_PROTECTION_PLAN = [
  { label: 'name', field: 'name', itemRenderer: DR_PLAN_NAME_ITEM_RENDERER },
  { label: 'protected.name', field: 'protectedSite.name', itemRenderer: PROTECTION_SITE_LINK_ITEM_RENDERER },
  { label: 'recovery.site', field: 'recoverySite.name', itemRenderer: RECOVERY_SITE_LINK_ITEM_RENDERER },
  { label: 'replication.interval', field: 'replicationInterval', itemRenderer: REPLICATION_INTERVAL_ITEM_RENDERER },
  { label: 'status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER, options: { getValueFromFunc: drPlanStatus } },
  { label: 'Recovery Status', field: 'recoveryStatus', itemRenderer: DR_PLAN_RECOVERY_STATUS_RENDERER },
  { label: 'Average RPO', field: 'achievedAvgRPO', itemRenderer: REPORT_AVG_RPO_RENDERER },
  { label: 'Average RTO', field: 'achievedAvgRTO', itemRenderer: REPORT_AVG_RPO_RENDERER },
];

export const ALERT_FILTERS = [
  { label: 'Acknowledged', field: 'isAcknowledge', query: 'ack', value: '1', checked: false },
  { label: 'Unacknowledged', field: 'isAcknowledge', query: 'ack', value: '0', checked: false },
];

export const TABLE_CLEANUP_DR_COPIES = [
  { label: 'workload.name', field: 'workloadName', width: 2 },
  { label: 'resources.for.deletion', field: 'resourceName', width: 2 },
  { label: 'created.at', field: 'createdAt', itemRenderer: DATE_ITEM_RENDERER, width: 2 },
  { label: 'description', field: 'description', width: 4 },
];

export const TABLE_NODE_UPDATE_SCHEDULER = [
  { label: 'Name', field: 'node.name' },
  { label: 'System Upgrade Schedule', field: 'schedule', itemRenderer: SYSTEM_UPGRADE_SCHEDULE_ITEM_RENDERER },
  { label: 'Previous Run', field: 'lastRun', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'Next Run', field: 'nextRun', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'System Update Status', field: 'systemUpdateStatus' },
  { label: 'Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER },
];
export const TABLE_NODE_SCHEDULER = [
  { label: 'Name', field: 'name' },
  { label: 'Hostname', field: 'hostname', itemRenderer: SCHEDULE_NODE_LOCATION_ITEM_RENDERER },
];

export const AWS_TARGET_STORAGE = [
  { label: 'Virtual Machine', field: 'name', itemRenderer: QUIESCE_VMNAME_RENDERER },
  { label: 'Target Storage', itemRenderer: AWS_TARGET_STORAGE_OPTION_RENDERER },
];
export const TABLE_SCHEDULE = [
  { label: 'Name', field: 'name' },
  { label: 'Schedule', field: 'cron_string', width: 3, itemRenderer: REPORT_SCHEDULE_ITEM_RENDERER },
  { label: 'Email Recipients', field: 'emailIDs', width: 3, itemRenderer: REPORT_SCHEDULE_EMAIL_ITEM_RENDERER },
  { label: 'Generated Reports', field: 'savedReports', itemRenderer: GENERATED_REPORTS_ITEM_RENDERER, width: 1.5 },
  { label: 'Status', field: 'disabled', itemRenderer: SCHEDULE_STATUS_RENDERER, width: 1 },
];
export const TABLE_SCHEDULE_JOB = [
  { label: 'Schedule', field: 'scheduleName', allowFilter: true, checked: true },
  { label: 'Start Time', field: 'createdAt', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'End Time', field: 'updatedAt', itemRenderer: END_TIME_REPORT_SHEDULE_JOB },
  { label: 'Size', field: 'fileSize', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'File Name', field: 'name', itemRenderer: REPORT_JOB_NAME_ITEM_RENDERER },
  { label: 'Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER, allowFilter: true, checked: true },
];
export const TABLE_SCHEDULE_GENERATE = [
  { label: 'Name', field: 'filePath', itemRenderer: REPORT_JOB_NAME_ITEM_RENDERER },
  { label: 'Size', field: 'fileSize', itemRenderer: TRANSFER_SIZE_ITEM_RENDERER },
  { label: 'Time', field: 'createdAt', itemRenderer: DATE_ITEM_RENDERER },
  { label: 'Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER },
];

export const SELECTIVE_REPLICATION_VM_LIST = [
  { label: 'Name', field: 'name', allowFilter: true, checked: true },
  { label: 'Replication Enabled', field: 'replicationStatus', itemRenderer: VM_REPL_STATUS, allowFilter: true, checked: true },
  { label: 'Sync Status', field: 'syncStatus', itemRenderer: STATUS_ITEM_RENDERER, allowFilter: true, checked: true, options: { ItemRenderer: DATE_ITEM_RENDERER, field: 'currentSnapshotTime' } },
  { label: 'Replication Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER, allowFilter: true, checked: true, options: { ItemRenderer: TRANSFER_SIZE_ITEM_RENDERER, field: 'changedSize' } },
];
