import { configureStore } from '@reduxjs/toolkit';
import userRecucer from './reducers/userReducer';
import globalReducer from './reducers/globalReducer';
import messageReducer from './reducers/messageReducer';
import nodeReducer from './reducers/nodeReducer';
import layout from './reducers/Layout';
import ModalReducer from './reducers/ModalReducer';
import SiteReducer from './reducers/siteReducers';
import JobReducer from './reducers/jobReducer';
import PlanReducer from './reducers/planReducer';
import AlertReducer from './reducers/alertReducer';
import DashboardReducer from './reducers/DashboardReducer';
import licenseReducer from './reducers/licenseReducer';
import SettingsReducer from './reducers/SettingsReducer';
const store = configureStore({
    reducer: {
        user: userRecucer,
        global: globalReducer,
        messages: messageReducer,
        nodes: nodeReducer,
        layout: layout,
        modal: ModalReducer,
        sites: SiteReducer,
        jobs: JobReducer,
        plan: PlanReducer,
        alerts: AlertReducer,
        dashboard: DashboardReducer,
        license: licenseReducer,
        settings: SettingsReducer,
    },
});

export default store;

// Define RootState and AppDispatch types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
