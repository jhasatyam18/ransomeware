import { APP_TYPE, RECOVERY_JOB_TYPE, REPLICATION_JOB_TYPE } from './InputConstants';

const INITIAL_STATE = {
  global: {
    loaderKeys: {},
  },
  messages: {},
  user: { id: 1,
    passwordChangeReq: false,
    allowCancel: false,
    isAuthenticated: false,
    token: '',
    userName: '',
    isValidating: false,
    values: {},
    errors: {},
    appType: APP_TYPE.CLIENT,
    platformType: '',
    license: { licenseType: '-', isLicenseExpired: false, licenseExpiredTime: null, version: '-' },
  },
  sites: { sites: [], selectedSites: [] },
  drPlans: { plans: [], selectedPlans: [], recoveryPlan: {} },
  modal: { content: null, options: {}, show: false },
  wizard: { steps: [], show: false, options: { title: '' } },
  jobs: { replication: [], recovery: [], replicationType: REPLICATION_JOB_TYPE.PLAN, recoveryType: RECOVERY_JOB_TYPE.PLAN },
  dashboard: {
    titles: { sites: 0, protectionPlans: 0, vms: 0, storage: 0 },
    replicationStats: { completed: 0, running: 0, failures: 0, copies: 0, changeRate: 0, dataReduction: 0, rpo: 0, inSync: 0, notInsync: 0, changedRate: 0 },
    recoveryStats: { testExecutions: 0, fullRecovery: 0, migrations: 0, rto: 0 },
    protectedVMStats: { protectedVMs: 0, unprotectedVMs: 0 },
    nodes: [],
  },
  events: { data: [], selected: {}, filteredData: [] },
  alerts: { data: [], selected: {}, associatedEvent: {}, unread: [], filteredData: [] },
  settings: { bundles: [], nodes: [], selectedNodes: [], emailConfig: null, emailRecipients: [] },
  reports: { criteria: {}, result: {} },
};

export default INITIAL_STATE;
