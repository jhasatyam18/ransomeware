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
  jobs: { replication: [], recovery: [] },
};

export default INITIAL_STATE;
