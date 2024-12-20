import { APP_TYPE } from './InputConstants';

const INITIAL_STATE = {
    global: {
        loaderKeys: {},
    },
    messages: {},
    user: {
        id: 1,
        context: { refresh: 0, updateID: 0 },
        isAuthenticated: false,
        token: '',
        userName: '',
        isSystemDefault: false,
        isValidating: false,
        values: {},
        errors: {},
        appType: APP_TYPE.CLIENT,
        platformType: '',
        localVMIP: '',
        privileges: [],
        roles: [],
        users: [],
        // Added tab in redux
        upgradeSummaryTab: '1',
    },
    dashboard: {
        titles: {},
    },
    upgrade: {
        steps: [],
        currentStep: 0,
    },
    modal: [],
};

export default INITIAL_STATE;
