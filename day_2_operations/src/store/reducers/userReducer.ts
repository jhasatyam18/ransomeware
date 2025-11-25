import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_STATE } from '../../constants/initState';
import { STATIC_KEYS } from '../../constants/StoreKey';
import { UserDetails, UserPreferences } from '../../interfaces/interface';

type ValueChangeprops = [string, any];
interface AppTypePayload {
    appType: string;
    platformType: string;
    localVMIP: string;
    zone: string;
}
interface LicensePayload {
    nodeKey: string;
    version: string;
    serviceType: string;
    activeLicenses: string;
}

const userSlice = createSlice({
    name: 'user',
    initialState: INITIAL_STATE.user,
    reducers: {
        logOutUser: (state) => {
            state.isAuthenticated = false;
            state.token = '';
        },
        setPrivileges: (state, action: PayloadAction<string[]>) => {
            state.privileges = action.payload;
        },
        loginSuccess: (state, action: PayloadAction<string>) => {
            state.isAuthenticated = true;
            state.token = action.payload;
        },
        setUserDetails: (state, action: PayloadAction<number>) => {
            state.id = action.payload;
        },
        setActiveTab: (state, action: PayloadAction<number>) => {
            state.activeTab = action.payload;
        },
        valueChange: (state, action: PayloadAction<ValueChangeprops>) => {
            const [key, value] = action.payload;
            state.values[key] = value;
        },
        clearValues: (state) => {
            const existingValue = state.values?.[STATIC_KEYS.GLOBAL_OPT_SITE_DATA];
            state.values = {};
            // Retain the global options if it existed
            if (existingValue !== undefined) {
                state.values[STATIC_KEYS.GLOBAL_OPT_SITE_DATA] = existingValue;
            }
            state.errors = {};
        },
        addErrorMessage: (state, action: PayloadAction<any>) => {
            const [key, message] = action.payload;
            state.errors[key] = message;
        },
        removeErrorMessage: (state, action: PayloadAction<string>) => {
            const key = action.payload;
            if (state.errors[key]) {
                delete state.errors[key];
            }
        },
        changePassword: (state, action: PayloadAction<boolean>) => {
            state.passwordChangeReq = action.payload;
            state.isAuthenticated = false;
            state.allowCancel = true;
        },
        resetPassword: (state, action: PayloadAction<boolean>) => {
            state.passwordReset = action.payload;
        },
        addUserDetails: (state, action: PayloadAction<UserDetails>) => {
            state.userDetails = action.payload;
        },
        addUserPreferences: (state, action: PayloadAction<UserPreferences>) => {
            state.userPreferences = action.payload;
        },
        updateLicenseInfo: (state, action: PayloadAction<LicensePayload>) => {
            state.license = action.payload;
        },
        changeAppType: (state, action: PayloadAction<AppTypePayload>) => {
            const { appType, platformType, localVMIP, zone } = action.payload;
            state.appType = appType;
            state.platformType = platformType;
            state.localVMIP = localVMIP;
            state.zone = zone;
        },
    },
});

export const { logOutUser, setPrivileges, loginSuccess, setUserDetails, setActiveTab, valueChange, clearValues, addErrorMessage, changePassword, removeErrorMessage, resetPassword, addUserDetails, addUserPreferences, changeAppType, updateLicenseInfo } = userSlice.actions;
export default userSlice.reducer;
