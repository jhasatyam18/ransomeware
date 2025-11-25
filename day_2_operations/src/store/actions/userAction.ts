import { API_AUTHENTICATE, API_INFO, API_USERS, API_USER_PRIVILEGES } from '../../constants/ApiUrlConstant';
import { API_TYPES, callAPI, createPayload, removeCookies, setCookie, setSessionInfo } from '../../utils/apiUtils';
import { logOutUser, setPrivileges, loginSuccess, setUserDetails, addUserDetails, changeAppType, changePassword, updateLicenseInfo } from '../reducers/userReducer';
import { getCookie } from '../../utils/apiUtils';
import { APP_TYPE, APPLICATION_API_USER, APPLICATION_UID, MESSAGE_TYPES } from '../../constants/userConstant';
import { DASHBOARD_PATH } from '../../constants/routeConstant';
import { hideApplicationLoader, setLastSyncTime, showApplicationLoader } from '../reducers/globalReducer';
import { addMessage } from '../reducers/messageReducer';
import { getUserPreference } from './UserPreferenceAction';
import { fetchSites } from './siteAction';
import { fetchByDelay } from '../../utils/SlowFetch';
export function login({ username, password, history }: { username: string; password: string; history: any }) {
    return (dispatch: any) => {
        const obj = createPayload(API_TYPES.POST, { username, password });
        return callAPI(API_AUTHENTICATE, obj).then(
            (json) => {
                if (json.hasError) {
                    dispatch(addMessage({ message: json.message, messageType: MESSAGE_TYPES.ERROR }));
                } else {
                    // check password change is required
                    if (json.status && json.status === 403) {
                        setSessionInfo(username);
                        dispatch(changePassword(true));
                        return;
                    }
                    setSessionInfo(username);
                    dispatch(getUserInfo(null, history));
                    dispatch(loginSuccess(''));
                    dispatch(getInfo());
                }
            },
            (err) => {
                dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
            },
        );
    };
}

export function getUserInfo(nodeKey: any, history: any) {
    return (dispatch: any) => {
        const username = getCookie(APPLICATION_API_USER);
        const url = `${API_USERS}?username=${username}`;
        if (username === '' || typeof username === 'undefined') {
            dispatch(logOutUser());
            return;
        }
        return callAPI(url).then(
            (json) => {
                if (json.hasError) {
                    dispatch(addMessage({ message: json.message, messageType: MESSAGE_TYPES.ERROR }));
                } else {
                    if (json && json.length >= 1) {
                        setCookie(APPLICATION_API_USER, json[0].username);
                        setCookie(APPLICATION_UID, json[0].id);
                        dispatch(setUserDetails(json[0].id));
                        if (window.location?.pathname.indexOf('dop') === -1 || window.location?.pathname.endsWith('/dop/') || window.location?.pathname.indexOf('dop/logout') !== -1) {
                            history(DASHBOARD_PATH);
                        }
                        dispatch(addUserDetails(json[0]));
                        dispatch(getUserPreference(json[0]));
                        return;
                    }
                    dispatch(setPrivileges([]));
                    dispatch(addMessage({ message: 'Failed to fetch user details', messageType: MESSAGE_TYPES.ERROR }));
                    dispatch(removeCookies());
                    dispatch(logOutUser());
                }
            },
            (err) => {},
        );
    };
}

export function getUserPrivileges(id: any, nodeKey: any) {
    return (dispatch: any) => {
        if (nodeKey === '' || typeof nodeKey === 'undefined') {
            return;
        }
        const url = API_USER_PRIVILEGES.replace('<id>', id);
        return callAPI(url).then(
            (json) => {
                if (json.hasError) {
                    dispatch(addMessage({ message: json.message, messageType: MESSAGE_TYPES.ERROR }));
                } else {
                    dispatch(setPrivileges(json));
                    if (json && json.length >= 1) {
                        // dispatch(setPrivileges(json));
                        decryptAndSetPrivileges(json, nodeKey, dispatch);
                        return;
                    }
                }
            },
            (err) => {},
        );
    };
}

export async function decryptAndSetPrivileges(data: any, nodeKey: any, dispatch: any) {
    if (typeof data === 'undefined' || data.length === 0) {
        return;
    }
    let privileges: any = [];
    // decrypt the privileges using node key
    try {
        const d = await Decrypt(data, `${nodeKey}${nodeKey}`);
        privileges = d.split(',') || [];
    } catch (error) {
        // dispatch(addMessage('Failed to fetch user privileges', MESSAGE_TYPES.ERROR));
    }
    dispatch(setPrivileges(privileges));
}

/**
 * Decrypts the given ciphertext using the provided key.
 * @param {string} ciphertext - The base64 encoded ciphertext to decrypt.
 * @param {string} key - The key used for decryption.
 * @returns {Promise<string>} - The decrypted data as a string.
 * @throws {Error} - If the ciphertext or key is not provided, or if decryption fails.
 *
 */

export async function Decrypt(ciphertext: string, key: string): Promise<string> {
    try {
        if (!ciphertext || !key) {
            throw new Error('Ciphertext and key are required for decryption.');
        }

        let encryptedData: string;
        try {
            // atob is used to decode base64 encoded strings
            // https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/atob
            // In Vscode. showing as deprecated but it is not deprecated for browser
            // Deprecated for node js server apps
            encryptedData = atob(ciphertext);
        } catch (error: any) {
            throw new Error(`Failed to decode Base64: ${error.message}`);
        }

        if (encryptedData.length <= 12) {
            throw new Error('Ciphertext does not contain a nonce and data.');
        }

        const nonce = encryptedData.slice(0, 12);
        const cipherTextBytes = new Uint8Array(
            encryptedData
                .slice(12)
                .split('')
                .map((c) => c.charCodeAt(0)),
        );

        let cryptoKey: CryptoKey;
        try {
            // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/importKey
            cryptoKey = await window.crypto.subtle.importKey('raw', new TextEncoder().encode(key), { name: 'AES-GCM' }, false, ['decrypt']);
        } catch (error: any) {
            throw new Error(`Failed to import key: ${error.message}`);
        }

        // Decrypt the data
        let decryptedBytes: ArrayBuffer;
        try {
            decryptedBytes = await window.crypto.subtle.decrypt(
                {
                    name: 'AES-GCM',
                    iv: new Uint8Array(nonce.split('').map((c) => c.charCodeAt(0))),
                },
                cryptoKey,
                cipherTextBytes,
            );
        } catch (error: any) {
            throw new Error(`Failed to decrypt data: ${error.message}`);
        }

        // Convert the decrypted bytes to a string
        return new TextDecoder().decode(decryptedBytes);
    } catch (error: any) {
        throw new Error(`Failed to decrypt data: ${error.message}`);
    }
}

export function getInfo(history?: any) {
    return (dispatch: any) => {
        dispatch(showApplicationLoader({ key: 'fetching_info', value: 'Loading' }));
        // dispatch(clearMessages());
        return callAPI(API_INFO).then(
            (json) => {
                dispatch(hideApplicationLoader('fetching_info'));
                if (json.hasError) {
                    dispatch(addMessage({ message: json.message, messageType: MESSAGE_TYPES.ERROR }));
                } else {
                    dispatch(loginSuccess(json.token));
                    const { platformType, localVMIP, nodeKey, zone, version, serviceType, licenses, service, nodeType, lastSyncTime } = json;
                    dispatch(setLastSyncTime(lastSyncTime));
                    dispatch(getUserInfo(nodeKey, history));
                    dispatch(fetchSites());
                    const appType = json.serviceType === 'Client' ? APP_TYPE.CLIENT : APP_TYPE.SERVER;
                    dispatch(changeAppType({ appType, platformType, localVMIP, zone }));
                    fetchByDelay(dispatch, updateLicenseInfo, 2000, { nodeKey, version, serviceType, activeLicenses: licenses, service, nodeType });
                }
            },
            (err) => {
                dispatch(hideApplicationLoader('fetching_info'));
                if (err.message !== 'Unauthorized: session expired') {
                    dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
                }
            },
        );
    };
}

export function getInfoInInterval(history?: any) {
    return (dispatch: any) => {
        return callAPI(API_INFO).then(
            (json) => {
                if (json.hasError) {
                    dispatch(addMessage({ message: json.message, messageType: MESSAGE_TYPES.ERROR }));
                } else {
                    const { lastSyncTime } = json;
                    dispatch(setLastSyncTime(lastSyncTime));
                }
            },
            (err) => {
                if (err.message !== 'Unauthorized: session expired') {
                    dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
                }
            },
        );
    };
}
