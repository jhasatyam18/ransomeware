export const API_AUTHENTICATE = 'api/v1/login';
export const API_LOGOUT = 'api/v1/logout';
// export const API_CHANGE_PASSWORD = 'api/v1/users/<name>';v1/credentials/reset
export const API_CHANGE_PASSWORD = 'api/v1/credentials/reset';
export const API_CHANGE_NODE_PASSWORD = 'api/v1/users/<name>?nodeID=<nodeid>';
export const API_INFO = 'api/v1/info';
export const API_FETCH_SITES = 'api/v1/sites';
export const API_FETCH_SITE_VMS = 'api/v1/sites/<id>/vms';
export const API_FETCH_VMWARE_INVENTORY = 'api/v1/sites/<id>/resources?type=Datacenter';
export const API_FETCH_VMWARE_LOCATION = 'api/v1/sites/<id>/resources';
export const API_FETCH_VMWARE_ADAPTER_TYPE = 'api/v1/sites/<id>/networks';
export const API_CREATE_SITES = 'api/v1/sites';
export const API_DELETE_SITES = 'api/v1/sites/<id>';
// dr plan
export const API_FETCH_DR_PLANS = 'api/v1/protection/plans';
export const API_FETCH_DR_PLAN_BY_ID = 'api/v1/protection/plans/<id>';
export const API_START_DR_PLAN = 'api/v1/protection/plans/<id>/start';
export const API_STOP_DR_PLAN = 'api/v1/protection/plans/<id>/stop';
export const API_DELETE_DR_PLAN = 'api/v1/protection/plans/<id>';
export const API_SCRIPTS = 'api/v1/scripts';
export const API_SITE_NETWORKS = 'api/v1/sites/<id>/networks';
export const API_SITE_NETWORKS_ZONE = '?zone=<zone>';
export const API_PROTECTION_PLAN_VMS = 'api/v1/sites/<sid>/vms?protectionplan=<pid>';
export const API_PROTECTION_PLAN_UPDATE = 'api/v1/protection/plans/<id>';
export const API_PROTECTION_PLAN_PROTECTED_VMS = 'api/v1/protection/plans/<pid>?vmmoref=<moref>';
export const API_EDIT_PROTECTED_VM = 'api/v1/protection/plans/<pid>/vm';
export const API_LATEST_TEST_RECOVERY_PPLAN = 'api/v1/protection/plans/<id>?testconfig=true';

// jobs
export const API_REPLICATION_JOBS = 'api/v1/jobs/replication/disks';
export const API_REPLICATION_VM_JOBS = 'api/v1/jobs/replication/vms';
export const API_PROTECTTION_PLAN_REPLICATION_VM_JOBS = 'api/v1/jobs/replication/vms?protectionplanid=<id>';
export const API_PROTECTOIN_PLAN_REPLICATION_JOBS = 'api/v1/jobs/replication/disks?protectionplanid=<id>';
export const API_RECOVERY_JOBS = 'api/v1/jobs/recover/vms';
export const API_RECOVERY_PLAN_RECOVERY_JOBS = 'api/v1/jobs/recover/protectionplans/<id>';
export const API_PROTECTION_PLAN_REPLICATION_JOBS_STATUS = 'api/v1/jobs/replication/protectionplans';
export const API_PROTECTION_PLAN_RECOVERY_JOBS_STATUS = 'api/v1/jobs/recover/protectionplans';
export const API_DASHBOARD_TITLE = 'api/v1/dashboard/titles';
export const API_DASHBOARD_RECOVERY_STATS = 'api/v1/dashboard/recoverystats';
export const API_DASHBOARD_REPLICATION_STATS = 'api/v1/dashboard/replicationstats';
export const API_DASHBOARD_BANDWIDTH_USAGE = 'api/v1/bandwidth/usage';
export const API_DASHBOARD_VIRTUAL_MACHINE_PROTECTION_ANALYSIS_PROTECTED_VMS = 'api/v1/dashboard/protectedvms';
export const API_DASHBOARD_NODE_STATS = 'api/v1/dashboard/nodestats';
export const API_DASHBOARD_UNACK_ALERTS = 'api/v1/dashboard/unackalerts';
export const API_RESCOVERY_JOB_STATUS_STEPS = 'api/v1/jobs/recover/vms/<id>';
// recovery
export const API_RECOVER = 'api/v1/recover';
export const API_TEST_RECOVERY_CLEANUP = 'api/v1/recover/cleanup';
export const API_VALIDATE_RECOVERY = 'api/v1/recover/validate';
export const API_AUTO_MIGRATE_WORKFLOW = 'api/v1/migrate/auto';

// migration
export const API_VALIDATE_MIGRATION = 'api/v1/migrate/validate';
export const API_MIGRATE = 'api/v1/migrate';

// instance type json
export const API_AWS_INSTANCES = 'aws_instances.json';
export const API_GCP_INSTANCES = 'gcp_instances.json';
export const API_AWS_REGIONS = 'aws_regions.json';
export const API_GCP_REGIONS = 'gcp_regions.json';
export const API_AZURE_REGIONS = 'azure_regions.json';
export const API_AWS_AVAILABILITY_ZONES = 'aws_availability_zones.json';
export const API_GCP_AVAILABILITY_ZONES = 'gcp_zones.json';
export const API_AZURE_AVAILIBITY_ZONES = 'azure_availibility_zones.json';

// events
export const API_FETCH_EVENTS = 'api/v1/events';
export const API_FETCH_EVENT_BY_ID = 'api/v1/events/<id>';

// alerts
export const API_FETCH_ALERTS = 'api/v1/alerts';
export const API_MARK_READ_ALL = 'api/v1/alerts/read';
export const API_FETCH_UNREAD_ALERTS = 'api/v1/alerts/unread';
export const API_ACKNOWLEDGE_ALERT = 'api/v1/alerts/acknowledge/<id>';
export const API_ACKNOWLEDGE_NODE_ALERT = 'api/v1/alerts/acknowledge/?id=<alertid>';
export const API_ALERT_TAKE_VM_ACTION = 'api/v1/alerts/action/<id>/vm';
export const API_VM_ALERTS = 'api/v1/alerts?vmmoref=<moref>&ack=0';
export const API_NODE_ALERTS = 'api/v1/alerts?nodeID=<id>&ack=0&alertID=<alertid>';

// sb
export const API_DELETE_SUPPORT_BUNDLE = 'api/v1/support/bundle/<id>';
export const API_SUPPORT_BUNDLE = 'api/v1/support/bundle';

// nodes
export const API_NODES = 'api/v1/nodes';
export const NODE_GET_ENCRYPTION_KEY = 'api/v1/nodes/<id>/encryption';

// email
export const API_EMAIL_CONFIGURATION = 'api/v1/email/configuration';
export const API_EMAIL_CONFIGURE = 'api/v1/email/configure';
export const API_EMAIL_RECIPIENTS = 'api/v1/email/recipient';

// reverse
export const API_REVERSE = 'api/v1/protection/plans/<id>/reverse';
export const API_FETCH_REVERSE_DR_PLAN_BY_ID = 'api/v1/protection/plans/<id>/reverse';
export const API_VALIDATE_REVERSE_PLAN = 'api/v1/protection/plans/<id>/reverse/validate';

// License
export const API_LICENSE = 'api/v1/license';
export const API_LICENSE_ACTIVATE_DEACTIVATE = 'api/v1/license/<type>/<id>';
export const API_LICENSE_UPLOAD = 'api/v1/license/upload';
export const API_LICENSE_UPLOAD_VALIDATE = 'api/v1/license/validate/<file>';
export const API_LICENSE_INSTALL = 'api/v1/license/install/<file>';
// throttling
export const API_THROTTLING_CONFIGURATION = 'api/v1/bandwidth/config';
export const API_UPDATE_THROTTLING_CONFIGURATION = 'api/v1/bandwidth/config/replNode/<id>';
export const API_THROTTLING_REPLNODES = 'api/v1/bandwidth/replnodes';
export const API_THROTTLING_USAGE = 'api/v1/bandwidth/usage';

// users
export const API_USERS = 'api/v1/users';
export const API_ADD_USER = 'api/v1/users';
export const API_ROLES = 'api/v1/roles';
export const API_USER_PRIVILEGES = 'api/v1/users/<id>/privileges';
export const API_USER_RESET = 'api/v1/users/<id>/reset';

// scripts
export const API_USER_SCRIPT = 'api/v1/script';

// Bulk Upload
export const API_BULK_GENERATE = 'api/v1/protection/playbooks/generate';
export const API_GET_BULK_PLANS = 'api/v1/protection/playbooks';
export const API_UPLOAD_TEMPLATED = 'api/v1/protection/playbooks/config';
export const API_GET_CONFIG_TEMPLATE_BY_ID = 'api/v1/protection/playbooks/config/<id>';
export const API_GET_PLAN_DIFF = 'api/v1/protection/playbooks/config/<id>/diff';
export const CREATE_PLAN_FROM_PLAYBOOK = 'api/v1/protection/playbooks/config/<id>/configure';
export const API_VALIDATE_TEMPLATE = 'api/v1/protection/playbooks/config/<id>/validate';

// SAML
export const API_SAML = 'login/saml';
export const API_SAML_LOGOUT = 'logout/saml';
export const API_SAML_METADATA = 'saml/metadata';
export const API_IDP = 'api/v1/idp';
export const API_UPLOAD_IDP_CONFIG = 'api/v1/idp/upload';
