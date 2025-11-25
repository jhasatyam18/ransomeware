export const routeStart = 'mgmt/';
const authRouter = 'auth/';
export const API_AUTHENTICATE = `${authRouter}api/v1/login`;
export const API_LOGOUT = `${authRouter}api/v1/logout`;
// export const API_CHANGE_PASSWORD = `${routeStart}api/v1/users/<name>';v1/credentials/res`t
export const API_CHANGE_PASSWORD = `${authRouter}api/v1/credentials/reset`;
export const API_CHANGE_NODE_PASSWORD = `${authRouter}api/v1/credentials/reset?nodeID=<nodeid>`;
export const API_INFO = `${routeStart}api/v1/info`;
export const API_FETCH_SITES = `${routeStart}api/v1/sites`;
export const API_FETCH_SITE_VMS = `${routeStart}api/v1/sites/<id>/vms`;
export const API_FETCH_VMWARE_INVENTORY = `${routeStart}api/v1/sites/<id>/resources?type=Datacenter`;
export const API_FETCH_VMWARE_LOCATION = `${routeStart}api/v1/sites/<id>/resources`;
export const API_FETCH_VMWARE_ADAPTER_TYPE = `${routeStart}api/v1/sites/<id>/networks`;
export const API_CREATE_SITES = `${routeStart}api/v1/sites`;
export const API_DELETE_SITES = `${routeStart}api/v1/sites/<id>`;
// dr plan
export const API_FETCH_DR_PLANS = `${routeStart}api/v1/protection/plans`;
export const API_FETCH_DR_PLAN_BY_ID = `${routeStart}api/v1/protection/plans/<id>`;
export const API_START_DR_PLAN = `${routeStart}api/v1/protection/plans/<id>/start`;
export const API_STOP_DR_PLAN = `${routeStart}api/v1/protection/plans/<id>/stop`;
export const API_DELETE_DR_PLAN = `${routeStart}api/v1/protection/plans/<id>`;
export const API_SCRIPTS = `${routeStart}api/v1/scripts`;
export const API_SITE_NETWORKS = `${routeStart}api/v1/sites/<id>/networks`;
export const API_SITE_NETWORKS_ZONE = '?zone=<zone>';
export const API_PROTECTION_PLAN_VMS = `${routeStart}api/v1/sites/<sid>/vms?protectionplan=<pid>`;
export const API_PROTECTION_PLAN_UPDATE = `${routeStart}api/v1/protection/plans/<id>`;
export const API_PROTECTION_PLAN_PROTECTED_VMS = `${routeStart}api/v1/protection/plans/<pid>?vmmoref=<moref>`;
export const API_EDIT_PROTECTED_VM = `${routeStart}api/v1/protection/plans/<pid>/vm`;
export const API_LATEST_TEST_RECOVERY_PPLAN = `${routeStart}api/v1/protection/plans/<id>?testconfig=true`;

// jobs
export const API_REPLICATION_JOBS = `${routeStart}api/v1/jobs/replication/disks`;
export const API_REPLICATION_VM_JOBS = `${routeStart}api/v1/jobs/replication/vms`;
export const API_PROTECTTION_PLAN_REPLICATION_VM_JOBS = `${routeStart}api/v1/jobs/replication/vms?protectionplanid=<id>`;
export const API_PROTECTOIN_PLAN_REPLICATION_JOBS = `${routeStart}api/v1/jobs/replication/disks?protectionplanid=<id>`;
export const API_RECOVERY_JOBS = `${routeStart}api/v1/jobs/recover/vms`;
export const API_RECOVERY_PLAN_RECOVERY_JOBS = `${routeStart}api/v1/jobs/recover/vms?protectionplanid=<id>`;
export const API_PROTECTION_PLAN_REPLICATION_JOBS_STATUS = `${routeStart}api/v1/jobs/replication/protectionplans`;
export const API_PROTECTION_PLAN_RECOVERY_JOBS_STATUS = `${routeStart}api/v1/jobs/recover/protectionplans`;
export const API_DASHBOARD_TITLE = `${routeStart}api/v1/dashboard/titles`;
export const API_DASHBOARD_RECOVERY_STATS = `${routeStart}api/v1/dashboard/recoverystats`;
export const API_DASHBOARD_REPLICATION_STATS = `${routeStart}api/v1/dashboard/replicationstats`;
export const API_DASHBOARD_BANDWIDTH_USAGE = `${routeStart}api/v1/bandwidth/usage`;
export const API_DASHBOARD_VIRTUAL_MACHINE_PROTECTION_ANALYSIS_PROTECTED_VMS = `${routeStart}api/v1/dashboard/protectedvms`;
export const API_DASHBOARD_NODE_STATS = `${routeStart}api/v1/dashboard/nodestats`;
export const API_DASHBOARD_UNACK_ALERTS = `${routeStart}api/v1/dashboard/unackalerts`;
export const API_RESCOVERY_JOB_STATUS_STEPS = `${routeStart}api/v1/jobs/recover/vms/<id>`;
export const API_UPDAT_RECOVERY_CHECKPOINT_BY_ID = `${routeStart}api/v1/checkpoints`;
export const API_RECOVERY_CHECKPOINT_BY_VM_ID_COMPRESSED = `${routeStart}api/v1/checkpoints?planID=<id>&compressed=true&workloadID=<moref>`;
export const API_RECOVERY_CHECKPOINT_BY_VM = `${routeStart}api/v1/checkpoints?planID=<id>&workloadID=<moref>`;
export const API_RECOVERY_CHECKPOINT = `${routeStart}api/v1/checkpoints?planID=<id>`;
export const API_RECOVERY_CHECKPOINT_JOBS = `${routeStart}api/v1/jobs/checkpoints?planID=<id>`;
export const API_GET_SELECTED_CHECKPOINTS = `${routeStart}api/v1/checkpoints?checkpointIDs=<id>`;
export const API_GET_PRESERVED_CHECKPOINTS = `${routeStart}api/v1/checkpoints?planID=<id>&preserveOnly=1`;

// recovery
export const API_RECOVER = `${routeStart}api/v1/recover`;
export const API_TEST_RECOVERY_CLEANUP = `${routeStart}api/v1/recover/cleanup`;
export const API_VALIDATE_RECOVERY = `${routeStart}api/v1/recover/validate`;
export const API_AUTO_MIGRATE_WORKFLOW = `${routeStart}api/v1/migrate/auto`;

// migration
export const API_VALIDATE_MIGRATION = `${routeStart}api/v1/migrate/validate`;
export const API_MIGRATE = `${routeStart}api/v1/migrate`;

// instance type json
export const API_AWS_INSTANCES = `${routeStart}aws_instances.json`;
export const API_GCP_INSTANCES = `${routeStart}gcp_instances.json`;
export const API_AWS_REGIONS = `${routeStart}aws_regions.json`;
export const API_GCP_REGIONS = `${routeStart}gcp_regions.json`;
export const API_AZURE_REGIONS = `${routeStart}azure_regions.json`;
export const API_AWS_AVAILABILITY_ZONES = `${routeStart}aws_availability_zones.json`;
export const API_GCP_AVAILABILITY_ZONES = `${routeStart}gcp_zones.json`;
export const API_AZURE_AVAILIBITY_ZONES = `${routeStart}azure_availibility_zones.json`;

export const API_TIME_ZONE = `${routeStart}time_zone.json`;
export const API_DAYS_LATER = `${routeStart}schedule_after_day.json`;
// events
export const API_FETCH_EVENTS = `${routeStart}api/v1/events`;
export const API_FETCH_EVENT_BY_ID = `${routeStart}api/v1/events/<id>`;

// alerts
export const API_FETCH_ALERTS = `${routeStart}api/v1/alerts`;
export const API_MARK_READ_ALL = `${routeStart}api/v1/alerts/read`;
export const API_FETCH_UNREAD_ALERTS = `${routeStart}api/v1/alerts/unread`;
export const API_ACKNOWLEDGE_ALERT = `${routeStart}api/v1/alerts/acknowledge/<id>`;
export const API_ACKNOWLEDGE_NODE_ALERT = `${routeStart}api/v1/alerts/acknowledge?id=<alertid>`;
export const API_ALERT_TAKE_VM_ACTION = `${routeStart}api/v1/alerts/action/<id>/vm`;
export const API_VM_ALERTS = `${routeStart}api/v1/alerts?vmmoref=<moref>&ack=0`;
export const API_NODE_ALERTS = `${routeStart}api/v1/alerts?nodeID=<id>&ack=0&alertID=<alertid>`;
export const API_CHECKPOINT_TAKE_ACTION = `${routeStart}api/v1/alerts/action/<id>/checkpoint`;

// sb
export const API_DELETE_SUPPORT_BUNDLE = `${routeStart}api/v1/support/bundle/<id>`;
export const API_SUPPORT_BUNDLE = `${routeStart}api/v1/support/bundle`;
export const API_SUPPORT_BUNDLE_BY_ID = `${routeStart}api/v1/support/bundle/<id>`;

// nodes
export const API_NODES = `${routeStart}api/v1/nodes`;
export const NODE_GET_ENCRYPTION_KEY = `${routeStart}api/v1/nodes/<id>/encryption`;

// email
export const API_EMAIL_CONFIGURATION = `${routeStart}api/v1/email/configuration`;
export const API_EMAIL_CONFIGURE = `${routeStart}api/v1/email/configure`;
export const API_EMAIL_RECIPIENTS = `${routeStart}api/v1/email/recipient`;

// reverse
export const API_REVERSE = `${routeStart}api/v1/protection/plans/<id>/reverse`;
export const API_FETCH_REVERSE_DR_PLAN_BY_ID = `${routeStart}api/v1/protection/plans/<id>/reverse`;
export const API_VALIDATE_REVERSE_PLAN = `${routeStart}api/v1/protection/plans/<id>/reverse/validate`;

// License
export const API_LICENSE = `${routeStart}api/v1/license`;
export const API_LICENSE_ACTIVATE_DEACTIVATE = `${routeStart}api/v1/license/<type>/<id>`;
export const API_LICENSE_UPLOAD = `${routeStart}api/v1/license/upload`;
export const API_LICENSE_UPLOAD_VALIDATE = `${routeStart}api/v1/license/validate/<file>`;
export const API_LICENSE_INSTALL = `${routeStart}api/v1/license/install/<file>`;
// throttling
export const API_THROTTLING_CONFIGURATION = `${routeStart}api/v1/bandwidth/config`;
export const API_UPDATE_THROTTLING_CONFIGURATION = `${routeStart}api/v1/bandwidth/config/replNode/<id>`;
export const API_THROTTLING_REPLNODES = `${routeStart}api/v1/bandwidth/replnodes`;
export const API_THROTTLING_USAGE = `${routeStart}api/v1/bandwidth/usage`;

// users
export const API_USERS = `${authRouter}api/v1/users`;
export const API_ADD_USER = `${authRouter}api/v1/users`;
export const API_ROLES = `${authRouter}api/v1/roles`;
export const API_USER_PRIVILEGES = `${authRouter}api/v1/users/<id>/privileges`;
export const API_USER_RESET = `${authRouter}api/v1/users/<id>/reset`;

export const API_USER_PREFERENCE = `${authRouter}api/v1/users/preferences`;
// scripts
export const API_USER_SCRIPT = `${routeStart}api/v1/script`;

// Bulk Upload
export const API_BULK_GENERATE = `${routeStart}api/v1/protection/playbooks/generate`;
export const API_GET_BULK_PLANS = `${routeStart}api/v1/protection/playbooks`;
export const API_UPLOAD_TEMPLATED = `${routeStart}api/v1/protection/playbooks/config`;
export const API_GET_CONFIG_TEMPLATE_BY_ID = `${routeStart}api/v1/protection/playbooks/config/<id>`;
export const API_GET_PLAN_DIFF = `${routeStart}api/v1/protection/playbooks/config/<id>/diff`;
export const CREATE_PLAN_FROM_PLAYBOOK = `${routeStart}api/v1/protection/playbooks/config/<id>/configure`;
export const API_VALIDATE_TEMPLATE = `${routeStart}api/v1/protection/playbooks/config/<id>/validate`;
export const API_UPLOAD_RECOVERY_CRED = `${routeStart}api/v1/protection/playbooks/recover`;
export const API_UPDATE_ISPLAYBOOK_DOWNLOAD_STATUS = `${routeStart}api/v1/protection/playbooks/config/<playbookid>?playbookStatus=In-sync`;

// SAML
export const API_SAML = 'saml/login';
export const API_SAML_LOGOUT = 'saml/logout';
export const API_SAML_METADATA = 'saml/metadata';
export const API_IDP = `${authRouter}api/v1/idp`;
export const API_UPLOAD_IDP_CONFIG = `${authRouter}api/v1/idp/upload`;

// CBT
export const API_GET_VMWARE_VMS = `${routeStart}api/v1/sites/<id>/vms?details=true&vms=vmstring`;

// Refresh Recovery Status
export const API_REFRESH_RECOVERY_VMS = `${routeStart}api/v1/jobs/recover/vms?refreshrequired=true&recoverytype=<recoveryType>`;
export const API_REFRESH_RECOVERY_OPS = `${routeStart}api/v1/jobs/recover/refresh`;

export const REFRESH_OPS = {
  validate: 'validate',
  poll: 'poll',
  update: 'update',
};

export const API_CLEANUP_RECOVERIES_FETCH = `${routeStart}api/v1/recover/cleanup?planids=<id>&cleanuptype=<type>`;
export const API_CLEANUP_RECOVERIES = `${routeStart}api/v1/recover/cleanup?planid=<id>&cleanuptype=<type>`;

export const API_FETCH_SCHEDULED_NODE = `${routeStart}api/v1/node/systemupdate/schedule`;
export const API_SCHEDULED_NODE = `${routeStart}api/v1/node/systemupdate/schedule`;
export const API_SCHEDULE = `${routeStart}api/v1/reports/schedules`;
export const API_SCHEDULED_JOBS = `${routeStart}api/v1/reports/jobs`;
