export const systemRouter = 'system/';
const authRouter = 'auth/';
export const API_AUTHENTICATE = `${authRouter}api/v1/login`;
export const API_LOGOUT = `${authRouter}api/v1/logout`;
// export const API_CHANGE_PASSWORD = `${systemRouter}api/v1/users/<name>';v1/credentials/res`t
export const API_CHANGE_PASSWORD = `${systemRouter}api/v1/credentials/reset`;
export const API_INFO = `${systemRouter}api/v1/info`;

export const API_USERS = `${authRouter}api/v1/users`;
export const API_ADD_USER = `${authRouter}api/v1/users`;
export const API_ROLES = `${authRouter}api/v1/roles`;
export const API_USER_PRIVILEGES = `${authRouter}api/v1/users/<id>/privileges`;
export const API_USER_PREFERENCE = `${authRouter}api/v1/users/preferences`;

export const NODE_API = `${systemRouter}api/v1/nodes`;
export const SITE_API = `${systemRouter}api/v1/sites`;
export const GET_SYSTEM_INFO = `${systemRouter}api/v1/dashboard/system/resource`;
export const GET_SERVICE_INFO = `${systemRouter}api/v1/dashboard/service/status`;
export const GET_DASHBORAD_TITLE = `${systemRouter}api/v1/dashboard/titles`;

// Upgrade
export const API_UPGRADE_UPLOAD = `${systemRouter}api/v1/upgrade/upload`;
export const API_UPGRADE_DOWNLOAD = `${systemRouter}api/v1/upgrade/download`;
export const API_GET_UPGRADE_DOWNLOAD = `${systemRouter}api/v1/upgrade/upload/status`;
export const API_GET_UPGRADE_PROCESS = `${systemRouter}api/v1/upgrade/status`;
export const API_GET_NODE_VERSION_INFO = `${systemRouter}api/v1/upgrade/info`;
export const API_GET_NODE_INSTALLATION_STATUS = `${systemRouter}api/v1/upgrade/status`;
export const API_GET_NODE_INSTALLATION_STATUS_REVERT = `${systemRouter}api/v1/upgrade/status?action=init-revert`;
export const API_UPGRADE = `${systemRouter}api/v1/upgrade`;
export const API_CLEAR_UPGRADE = `${systemRouter}api/v1/upgrade/filename`;
export const API_GET_UPGRADE_HISTORY = `${systemRouter}api/v1/upgrade/history`;

// node

export const API_NODES = `${systemRouter}api/v1/nodes`;
export const API_FETCH_SITES = `${systemRouter}api/v1/sites`;
export const API_UPGRADE_NODE_INFO = `${systemRouter}/api/v1/upgrade/nodes?type=init-upgrade`;

// History

export const API_GET_HISTORY = `${systemRouter}api/v1/upgrade/history`;
export const API_GET_UPGRADE_JOB_STATUS_BY_ID = `${systemRouter}api/v1/upgrade/history/<id>`;
export const API_NODE_UPGRADE_INFO = `${systemRouter}api/v1/upgrade/nodes?type=<type>`;
