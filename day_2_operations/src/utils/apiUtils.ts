import { APPLICATION_API_USER, APPLICATION_AUTHORIZATION, APPLICATION_UID } from '../constants/userConstant';
import store from '../store';
import Cookies from 'js-cookie';
import { logOutUser } from '../store/reducers/userReducer';
import { GetValueProps } from '../interfaces/interface';
import { clearMessages } from '../store/reducers/messageReducer';
import { closeModal } from '../store/reducers/ModalReducer';

export const API_TYPES = { POST: 'POST', PUT: 'PUT', DELETE: 'DELETE', PATCH: 'PATCH' };
export function getUrlPath(URL: string) {
    return `${window.location.origin}/${URL}`;
}
export function callAPI(URL: string, obj = {}) {
    const opts = { headers: { 'Content-Type': 'application/json', token: Cookies.get('token'), 'Cache-Control': 'no-cache, no-store, must-revalidate', Pragma: 'no-cache', Expires: '0' }, ...obj };
    return fetch(getUrlPath(URL), opts).then((response) => {
        if (response.status === 401) {
            store.dispatch(logOutUser());
            store.dispatch(removeCookies());
            store.dispatch(closeModal());
            store.dispatch(clearMessages());
        }
        if (response.status === 504) {
            const err = getErrorText(response.statusText);
            err.hasError = true;
            return err;
        }
        if (response.status === 403) {
            const data: any = {};
            data.hasError = false;
            data.status = response.status;
            return data;
        }
        if (response.status !== 204 && !response.ok) {
            return response.text().then((err) => Promise.reject(getErrorText(err)));
        }
        if (response.status === 204) {
            (response as any).hasError = false;
            return response;
        }
        const data: any = response.json();
        data.hasError = false;
        data.statusText = '';
        data.status = response.status;
        return data;
    });
}

export function getErrorText(err: string) {
    return { code: 0, message: err, hasError: false };
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

export function setCookie(KEY: string, VALUE: string): void {
    Cookies.set(KEY, VALUE);
}

export function removeCookie(name: string): void {
    // Setting old date so the cookie will be deleted immediately
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export function createPayload(type: string, data: any) {
    if (type === API_TYPES.POST) {
        return { method: 'POST', body: JSON.stringify(data) };
    }
    switch (type) {
        case API_TYPES.POST:
            return { method: 'POST', body: JSON.stringify(data) };
        case API_TYPES.PUT:
            return { method: 'PUT', body: JSON.stringify(data) };
        case API_TYPES.DELETE:
            return { method: 'DELETE', body: JSON.stringify(data) };
        case API_TYPES.PATCH:
            return { method: 'PATCH', body: JSON.stringify(data) };
        default:
            return { method: 'GET' };
    }
}

export function setSessionInfo(username: string) {
    setCookie(APPLICATION_API_USER, username);
}

export function getCookie(KEY: string): string | undefined | any {
    return Cookies.get(KEY);
}

export function getValue({ key, values }: GetValueProps) {
    return values[key];
}

export const removeSimilarQuery = (url: string, apiQuery: string) => {
    let queryParam = '';
    Object.keys(apiQuery).map((apiQ: any) => {
        if (apiQuery[apiQ].length === 1) {
            queryParam += `&${apiQ}=${apiQuery[apiQ][0]}`;
        }
    });

    if (queryParam.length > 0) {
        return `${url}${queryParam}`;
    }

    return url;
};

export function hasPriviledges() {
    return getCookie(APPLICATION_API_USER) === 'Administrator';
}
