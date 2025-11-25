export const APPLICATION_API_USER = 'APPLICATION_API_USER';
export const APPLICATION_UID = 'APPLICATION_UID';
export const APPLICATION_AUTHORIZATION = 'Authorization';
export const APPLICATION_THEME = 'APPLICATION_THEME';
// export const APPLICATION_API_USER_ID = 'APPLICATION_API_USER_ID';
export const APPLICATION_GETTING_STARTED_COMPLETED = 'APPLICATION_GETTING_STARTED_COMPLETED';
export const API_MAX_RECORD_LIMIT = 2000;
export const APP_SET_TIMEOUT = 20;
export const DATA_GRID_SHORT_TEXT_LENGTH = 30;
export const API_LIMIT_HUNDRED = 100;

export const TIME_CONSTANTS = {
  HOUR: 'hour',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

export const GENERAL_PLATFORM_KEYS = {
  AWS: {
    GENERAL: ['guestOS', 'firmwareType', 'instanceType', 'volumeType', 'volumeIOPS', 'encryptionKey', 'tags', 'targetStorageType'],
    NETWORK: ['vpcId', 'Subnet', 'availZone', 'isPublicIP', 'publicIP', 'privateIP', 'securityGroups'],
  },
  VMWARE: {
    GENERAL: ['guestOS', 'firmwareType', 'folderPath', 'hostMoref', 'dataStoreMoref', 'numCPU', 'memoryMB'],
    NETWORK: ['network', 'adapterType', 'macAddress', 'isPublicIP', 'publicIP', 'netmask', 'gateway', 'dns', 'privateIP'],
  },
  GCP: {
    GENERAL: ['guestOS', 'firmwareType', 'instanceType', 'volumeType'],
    NETWORK: ['network', 'Subnet', 'networkTier', 'isPublicIP', 'publicIP'],
  },
  AZURE: {
    GENERAL: ['guestOS', 'firmwareType', 'folderPath', 'instanceType', 'volumeType', 'tags', 'availZone'],
    NETWORK: ['network', 'Subnet', 'privateIP', 'publicIP', 'securityGroups', 'isPublicIP'],
  },
};
export const REC_SCRIPTS = ['postScript', 'preScript'];
export const REP_SCRIPTS = ['replPostScript', 'replPreScript'];

export const PLAN_KEYS = [
  'bootDelay',
  'enableDifferentialReverse',
  'isCompression',
  'isDedupe',
  'isEncryptionOnWire',
  'name',
  'preScript',
  'preInputs',
  'postScript',
  'postInputs',
  'replPreScript',
  'replPostScript',
  'scriptTimeout',
  'replicationInterval',
  'enablePPlanLevelScheduling',
];

export const PLAN_DETAIL_TABS = {
  ONE: '1',
  TWO: '2',
  THREE: '3',
  FOUR: '4',
  FIVE: '5',
  SIX: '6',
};

export const KEY_CONSTANTS = {
  PPLAN_DETAILS: 'PPLAN_DETAILS',
  PLAYBOOK_ERROR_SYSTEM_VALIDATIONS: 'System Validation',
  PLAYBOOK_GENERAL_CONFIGURATION: 'General Configuration',
  PLAYBOOK_PLAN_COFIGURE: 'configPlanCreated',
  PLAYBOOK_PLAN_RECONFIGURED: 'configPlanReconfigured',
  CHECKPOINT_EXPIRY_TIME: 'expirationTime',
  CHECKPOINT_RECOVERY_POINT_TIME: 'recoveryPointTime',
  CHECKPOINT_DELETED_FROM_PLATFORM: 'Deleted from Platform',
  ROUTE_EMAIL: 'email',
  ROUTE_SUPPORT: 'support',
  ROUTE_LICENSE: 'license',
  ROUTE_THROTTLING: 'throttling',
  ROUTE_USERS: 'users',
  ROUTE_ROLES: 'roles',
  ROUTE_SCRIPT: 'scripts',
  ROUTE_IDP: 'identityProvider',
  ROUTE_NODE_UPGRADE_SCHEDULER: 'nodeUpdateScheduler',
  ROUTE_NODE_UPGRADE_SCHEDULER_CREATE: 'nodeUpdateScheduler/schedule',
  ROUTE_RECOVERY: 'recovery',
  ROUTE_REPLICATION: 'replication',
  START: 'start',
  STOP: 'stop',
  DISABLED: 'disabled',
  ENABLED: 'enabled',
  DISABLING: 'disabling',
  REPL_DISABLED_RECOVERY_WARNING_MODAL_TEXT: 'REPL_DISABLED_RECOVERY_WARNING_MODAL_TEXT',
  INCREASE: 'increase',
  DESCREASE: 'decrease',
};

export const THEME_CONSTANT = {
  LIGHT: 'light',
  DARK: 'dark',
  SIDEBAR_MENU_ACTIVE: {
    dark: '#fff',
    light: '#000', // ',
  },
  BANDWIDTH: {
    XAXIX: {
      dark: 'white',
      light: 'black',
    },
  },
};
export const PLAN_REPL_RPO = {
  meets: 'success',
  breached: 'danger',
  partial: 'warning',
};
