import { APP_TYPE, REPLICATION_JOB_TYPE } from './InputConstants';

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
  jobs: { replication: [], recovery: [], replicationType: REPLICATION_JOB_TYPE.PLAN },
};

export default INITIAL_STATE;
