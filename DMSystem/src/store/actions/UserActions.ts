import { Dispatch } from 'redux';
import * as Types from '../../Constants/actionTypes';
import { API_AUTHENTICATE, API_CHANGE_PASSWORD, API_FETCH_SITES, API_INFO, API_USERS, API_USER_PREFERENCE } from '../../Constants/apiConstants';
import { APP_TYPE } from '../../Constants/InputConstants';
import { MESSAGE_TYPES } from '../../Constants/MessageConstants';
import { DASHBOARD_PATH, UPGRADE } from '../../Constants/routeConstants';
import { APPLICATION_API_USER, APPLICATION_AUTHORIZATION, APPLICATION_THEME, APPLICATION_UID, STATIC_KEYS, THEME_CONSTANT } from '../../Constants/userConstants';
import { UserDtails, UserPreferences } from '../../interfaces/interfaces';
import { API_TYPES, callAPI, createPayload } from '../../utils/apiUtils';
import { getCookie, removeCookie, setCookie } from '../../utils/cookieUtils';
import { onInit } from '../../utils/historyUtils';
import { addMessage } from './MessageActions';
import { fetchNodes, getDownloadUpgradeProgress, getUpgradeHistory } from './upgradeAction';

export function refreshApplication() {
    return {
        type: Types.APP_REFRESH,
    };
}

interface Login {
    username: string;
    password: string;
    history?: any;
}

export function login({ username, password, history }: Login) {
    return (dispatch: any) => {
        dispatch(loginRequest());
        // dispatch(clearMessages());
        const obj = createPayload(API_TYPES.POST, { username, password });
        return callAPI(API_AUTHENTICATE, obj).then(
            (json) => {
                if (json.hasError) {
                    dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
                } else {
                    // check password change is required
                    if (json.status && json.status === 403) {
                        setSessionInfo(username);
                        return;
                    }
                    setSessionInfo(username);
                    dispatch(getUserInfo(null));
                    dispatch(loginSuccess('', username));
                    dispatch(getInfo(null));
                    if (history) {
                        onInit(history);
                    }
                }
            },
            (err) => {
                dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
            },
        );
    };
}
export function loginRequest() {
    return {
        type: Types.AUTHENTICATE_USER_REQUEST,
    };
}

export function loginSuccess(token: string, username: string) {
    return {
        type: Types.AUTHENTICATE_USER_SUCCESS,
        token,
        username,
    };
}

export function loginFailed() {
    return {
        type: Types.AUTHENTICATE_USER_FAILED,
    };
}

export function logOutUser() {
    return {
        type: Types.AUTHENTICATE_USER_FAILED,
    };
}

export function removeCookies() {
    return () => {
        setCookie(APPLICATION_API_USER, '');
        setCookie(APPLICATION_UID, '');
        setCookie(APPLICATION_AUTHORIZATION, '');
        removeCookie(APPLICATION_API_USER);
        removeCookie(APPLICATION_UID);
        removeCookie(APPLICATION_AUTHORIZATION);
    };
}

export function valueChange(key: string, value: any) {
    return {
        type: Types.VALUE_CHANGE,
        key,
        value,
    };
}

export function valueChanges(values: string | boolean) {
    return {
        type: Types.VALUE_CHANGES,
        values,
    };
}

export function addErrorMessage(key: string, message: string) {
    return {
        type: Types.ADD_ERROR_MESSAGE,
        key,
        message,
    };
}

export function removeErrorMessage(key: string) {
    return {
        type: Types.DELETE_ERROR_MESSAGE,
        key,
    };
}
export function changeAppType(appType: string, platformType = '', localVMIP = '', zone = '', nodeType = '', version = '') {
    return {
        type: Types.APP_TYPE,
        appType,
        platformType,
        localVMIP,
        zone,
        nodeType,
        version,
    };
}
export function getInfo(history: any) {
    return (dispatch: any) => {
        // dispatch(clearMessages());
        return callAPI(API_INFO).then(
            (json) => {
                if (json.hasError) {
                    dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
                } else {
                    dispatch(loginSuccess(json.token, getCookie(APPLICATION_API_USER)));
                    const appType = json.serviceType === 'Client' ? APP_TYPE.CLIENT : APP_TYPE.SERVER;
                    const { nodeKey, nodeType, version } = json;
                    dispatch(changeAppType(appType, json.platformType, json.localVMIP, json.zone, nodeType, version));
                    // fetchByDelay(dispatch, updateLicenseInfo, 2000, { nodeKey, version, serviceType, activeLicenses: licenses });
                    // dispatch(validateLicense(licenseExpiredTime));

                    dispatch(getUserInfo(nodeKey));
                    if (history) {
                        onInit(history);
                    }
                }
            },
            (err) => {
                if (err.message !== 'Unauthorized: session expired') {
                    dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
                }
            },
        );
    };
}
export function clearValues() {
    return {
        type: Types.CLEAR_VALUES,
    };
}

export function showApplicationLoader(key: string, value: string) {
    return {
        type: Types.ADD_KEY_TO_APPLICATION_LOADER,
        key,
        value,
    };
}
export function hideApplicationLoader(key: string) {
    return {
        type: Types.REMOVE_KEY_FROM_APPLICATION_LOADER,
        key,
    };
}

export function fetchUsersData(data: any) {
    return {
        type: Types.FETCH_USERS,
        data,
    };
}

export function setSelectedUsers(selectedUsers: any) {
    return {
        type: Types.SET_SELECTED_USERS,
        selectedUsers,
    };
}

export function fetchUsers() {
    return (dispatch: any) => {
        dispatch(showApplicationLoader(API_USERS, 'loading users'));
        return callAPI(API_USERS).then(
            (json) => {
                dispatch(hideApplicationLoader(API_USERS));
                if (json.hasError) {
                    dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
                } else {
                    dispatch(fetchUsersData(json));
                }
            },
            (err) => {
                dispatch(hideApplicationLoader(API_USERS));
                dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
            },
        );
    };
}

export function refresh() {
    return (dispatch: Dispatch<any>) => {
        const { location } = window;
        const { pathname } = location;
        // dispatch refreshAction to notify selector component
        dispatch(refreshApplication());
        switch (pathname) {
            case DASHBOARD_PATH:
                dispatch(refreshApplication());
                break;
            case UPGRADE:
                dispatch(refreshApplication());
                dispatch(fetchNodes(STATIC_KEYS.UI_FTECH_NODE_INFO));
                dispatch(getDownloadUpgradeProgress());
                dispatch(getUpgradeHistory());
                break;
            default:
                dispatch(refreshApplication());
        }
    };
}

export function saveApplicationToken(token: string | number) {
    return {
        type: Types.AUTHENTICATE_USER_SUCCESS_PARTIAL,
        token,
    };
}

/**
 * updateValues : use to update batch object values in store
 * Use this when a object can be form and need to append in the user -> values
 * For single value change use valueChange
 * @param {*} object
 * @returns
 */
export function updateValues(valueObject: any) {
    return {
        type: Types.UPDATE_VALUES,
        valueObject,
    };
}

/**
 * forceComponentUpdate : use for HOC to trigger required action
 */
export function forceComponentUpdate() {
    return {
        type: Types.DM_FORCE_UPDATE,
    };
}

export function setSessionInfo(username: string) {
    setCookie(APPLICATION_API_USER, username);
}

export function changeUserPassword(oldPass: any, newPass: any) {
    return (dispatch: Dispatch<any>) => {
        dispatch(showApplicationLoader('CHANGE_PASSWORD', 'Changing password...'));
        // const name = getCookie(APPLICATION_API_USER) || '';
        const obj = createPayload(API_TYPES.POST, {
            username: getCookie(APPLICATION_API_USER),
            oldPassword: oldPass,
            newPassword: newPass,
        });
        return callAPI(API_CHANGE_PASSWORD, obj).then(
            (json) => {
                dispatch(hideApplicationLoader('CHANGE_PASSWORD'));
                if (json.hasError) {
                    dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
                } else {
                    dispatch(removeCookies());
                    dispatch(logOutUser());
                    window.location.reload();
                }
            },
            (err) => {
                dispatch(hideApplicationLoader('CHANGE_PASSWORD'));
                dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
            },
        );
    };
}

export function setPrivileges(privileges: string[]) {
    return {
        type: Types.APP_USER_PRIVILEGES,
        privileges,
    };
}

export function setUserDetails(data: any) {
    return {
        type: Types.SET_USER_DETAILS,
        data,
    };
}

export function getUserInfo(nodeKey: any) {
    return (dispatch: any) => {
        const username = getCookie(APPLICATION_API_USER);
        const url = `${API_USERS}?username=${username}`;
        dispatch(showApplicationLoader(url, 'Loading...'));
        return callAPI(url).then(
            (json) => {
                dispatch(hideApplicationLoader(url));
                if (json.hasError) {
                    dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
                } else {
                    if (json && json.length >= 1) {
                        setCookie(APPLICATION_API_USER, json[0].username);
                        setCookie(APPLICATION_UID, json[0].id);
                        dispatch(setUserDetails(json[0]));
                        dispatch(getUserPreference(json[0]));
                        return;
                    }
                    dispatch(setPrivileges([]));
                    dispatch(addMessage('Failed to fetch user details', MESSAGE_TYPES.ERROR));
                    dispatch(removeCookies());
                    dispatch(logOutUser());
                }
            },
            (err) => {
                dispatch(hideApplicationLoader(url));
                dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
            },
        );
    };
}

export function fetchSites(key: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch(showApplicationLoader('Fetching', 'Loading configured sites'));
        return callAPI(API_FETCH_SITES).then(
            (json) => {
                dispatch(hideApplicationLoader('Fetching'));
                if (json.hasError) {
                    dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
                } else {
                    if (key) {
                        dispatch(valueChange(key, json));
                    }
                }
            },
            (err) => {
                dispatch(hideApplicationLoader('Fetching'));
                dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
            },
        );
    };
}

export function setActiveTab(value: string) {
    return {
        type: Types.SET_UPGRADE_SUMMARY_ACTIVE_TAB,
        value,
    };
}

/**
 * Fetch the user prefences for UI eg. theme
 *
 * @param {UserDetails} userDetails - An object containing user data
 * @returns
 */
export function getUserPreference(userDetails: UserDtails) {
    return (dispatch: any) => {
        const url = `${API_USER_PREFERENCE}/${userDetails.username}`;
        return callAPI(url).then(
            (json) => {
                if (!json.hasError) {
                    dispatch(setUserPreferences(json));
                    localStorage.setItem(APPLICATION_THEME, json.themePreference);
                }
            },
            () => {
                localStorage.setItem(APPLICATION_THEME, THEME_CONSTANT.DARK);
            },
        );
    };
}

/**
 * Action for setting user preferences
 *
 * @param {userPreferences} Object containing user preferences data
 * @returns
 */
export function setUserPreferences(userPreferences: UserPreferences) {
    return {
        type: Types.SET_USER_PREFERENCES,
        userPreferences,
    };
}
