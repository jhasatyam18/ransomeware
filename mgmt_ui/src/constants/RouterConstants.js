/**
 * Router constant for application
 */
const routeConst = '/mgmt';
export const systemConst = '/system';
export const DASHBOARD_PATH = `${routeConst}/dashboard`;
export const SITES_PATH = `${routeConst}/sites`;
export const PROTECTION_PLANS = `${routeConst}/protection/*`;
export const PROTECTION_PLANS_PATH = `${routeConst}/protection/plans`;
export const PROTECTION_PLAN_STOP_REPLICATION = `${routeConst}/protection/plan/details/:id`;
export const PROTECTION_PLAN_FLOW = `${routeConst}/protection/plan/details/:id/:flow`;
export const PLAYBOOK_LIST = `${routeConst}/protection/plan/playbooks`;
export const DOP = `${routeConst}/dop`;
export const PLAYBOOK_DETAILS_PAGE = `${routeConst}/protection/plan/playbook/:name`;
export const PROTECTION_PLAN_DETAILS_PATH = `${routeConst}/protection/plan/details/:id`;
export const PROTECTION_PLAN_CLEANUP_PATH = `${routeConst}/protection/plan/:id/cleanup`;
export const LOGOUT_PATH = `${routeConst}/logout`;
export const LOGIN_PATH = `${routeConst}/login`;
export const NODES_PATH = `${routeConst}/nodes`;
export const ACTIVITY_PATH = `${routeConst}/Activity`;
export const LOGS_PAT = `${routeConst}/Logs`;
export const REPORTS_PATH = `${routeConst}/monitor/reports`;
export const ANALYTICS_PATH = `${routeConst}/Analytics`;
export const MONITOR_PATH = `${routeConst}/monitor/*`;
export const EVENTS_PATH = `${routeConst}/monitor/events`;
export const ALERTS_PATH = `${routeConst}/monitor/alerts`;
export const ALERTS_PATHS = `${routeConst}/monitor/alerts/*`;
export const SETTINGS_PATH = `${routeConst}/settings/*`;
export const LICENSE_SETTINGS_PATH = `${routeConst}/settings/license`;
export const EMAIL_SETTINGS_PATH = `${routeConst}/settings/email`;
export const THROTTLING_SETTINGS_PATH = `${routeConst}/settings/throttling`;
export const USER_SETTINGS_PATH = `${routeConst}/settings/users`;
export const ROLES_SETTINGS_PATH = `${routeConst}/settings/roles`;
export const SUPPORT_BUNDLE_PATH = `${routeConst}/settings/support`;
export const SCRIPTS_PATH = `${routeConst}/settings/scripts`;
export const JOBS_PATH = `${routeConst}/jobs/*`;
export const JOBS_REPLICATION_PATH = `${routeConst}/jobs/replication`;
export const JOBS_RECOVERY_PATH = `${routeConst}/jobs/recovery`;
export const IDENTITY_PROVIDER = `${routeConst}/settings/identityProvider`;

export const NODE_UPDATE_SCHEDULER = `${routeConst}/settings/nodeUpdateScheduler`;
export const NODE_UPDATE_SCHEDULER_CREATE = `${routeConst}/settings/nodeUpdateScheduler/schedule`;
export const REPORT_SCHEDULE_CREATE = `${routeConst}/monitor/reports/reportSchedule/:id`;
