import { APP_TYPE, RECOVERY_JOB_TYPE, REPLICATION_JOB_TYPE } from './InputConstants';

const INITIAL_STATE = {
  global: {
    loaderKeys: {},
  },
  messages: {},
  user: {
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
  drPlans: { plans: [], selectedPlans: [], details: {} },
  modal: {
    content: null,
    options: {},
    show: false,
  },
  wizard: {
    steps: [],
    show: false,
    options: { title: '' },
  },
  jobs: { replication: [], recovery: [], replicationType: REPLICATION_JOB_TYPE.PLAN, recoveryType: RECOVERY_JOB_TYPE.PLAN },
  dashboard: {
    titles: { sites: 0, protectionPlans: 0, vms: 0, storage: 0 },
    replicationStats: { completed: 0, running: 0, failures: 0, copies: 0, changeRate: 0, dataReduction: 0, testExecutions: 0, fullRecovery: 0, migrations: 0 },
  },
};

export default INITIAL_STATE;
