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
  modal: {
    content: null,
    options: {},
    show: false,
  },
};

export default INITIAL_STATE;
