import { INITIAL_STATE_INTERFACE } from '../interfaces/interface';
import { APP_TYPE } from './userConstant';

export const INITIAL_STATE: INITIAL_STATE_INTERFACE = {
    global: {
        loaderKeys: {},
        context: { refresh: 0 },
        expandedPage: '',
        lastSyncTime: 0,
    },
    layout: {
        leftSideBarType: '',
    },
    messages: {},
    user: {
        id: 0,
        isAuthenticated: false,
        token: '',
        userName: '',
        isSystemDefault: false,
        privileges: [],
        activeTab: 1,
        values: {},
        errors: {},
        passwordChangeReq: false,
        passwordReset: false,
        allowCancel: false,
        userDetails: {
            id: 0,
            username: '',
            fullName: '',
            password: '',
            email: '',
            description: '',
            isSystemDefault: false,
            isForcePasswordChange: false,
            role: {
                id: 0,
                name: '',
                description: '',
                isSystemDefault: false,
                privileges: null, // Replace `any` with a more specific type if known
            },
        },
        userPreferences: {
            userType: '',
            themePreference: 'dark',
            username: '',
        },
        appType: APP_TYPE.CLIENT,
        platformType: '',
        localVMIP: '',
        zone: '',
        license: {},
    },
    dashboard: {
        titles: {},
    },
    nodes: { nodes: [], selectedNode: [] },
    sites: { sites: [], selectedSites: [] },
    jobs: { replications: [], recovery: [] },
    plan: { plan: [], vm: [] },
    site: { sites: [] },
    modal: [],
    alerts: { data: [], unread: [] },
    license: [],
    settings: { bundles: [] },
};
