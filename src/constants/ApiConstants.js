export const API_AUTHENTICATE = 'api/v1/login';
export const API_INFO = 'api/v1/info';
export const API_FETCH_SITES = 'api/v1/sites';
export const API_FETCH_SITE_VMS = 'api/v1/sites/<id>/vms';
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

// jobs
export const API_REPLICATION_JOBS = 'api/v1/jobs/replication/disks';
export const API_REPLICATION_VM_JOBS = 'api/v1/jobs/replication/vms';
export const API_PROTECTTION_PLAN_REPLICATION_VM_JOBS = 'api/v1/jobs/replication/vms?protectionplanid=<id>';
export const API_PROTECTOIN_PLAN_REPLICATION_JOBS = 'api/v1/jobs/replication/disks?protectionplanid=<id>';
export const API_RECOVERY_JOBS = 'api/v1/jobs/recover/vms';
export const API_RECOVERY_PLAN_RECOVERY_JOBS = 'api/v1/jobs/recover/protectionplans/<id>';
export const API_PROTECTION_PLAN_REPLICATION_JOBS_STATUS = 'api/v1/jobs/replication/protectionplans';
// recovery
export const API_RECOVER = 'api/v1/recover';
export const API_VALIDATE_RECOVERY = 'api/v1/recover/validate';

// migration
export const API_VALIDATE_MIGRATION = 'api/v1/migrate/validate';
export const API_MIGRATE = 'api/v1/migrate';

// instance type json
export const API_AWS_INSTANCES = 'aws_instances.json';
export const API_GCP_INSTANCES = 'gcp_instances.json';
export const API_AWS_RGIONS = 'aws_regions.json';
export const API_GCP_RGIONS = 'gcp_regions.json';
export const API_AWS_AVAILABILLITY_ZONES = 'aws_availability_zones.json';
export const API_GCP_AVAILABILLITY_ZONES = 'gcp_zones.json';
