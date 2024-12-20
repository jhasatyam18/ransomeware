import Cookies from 'js-cookie';
import store from '../store';
import { clearValues, logOutUser, removeCookies } from '../store/actions';
import { clearMessages } from '../store/actions/MessageActions';
import { addUpgradeStep, setCurrentUpgradeStep } from '../store/actions/upgradeAction';

export const API_TYPES = { POST: 'POST', PUT: 'PUT', DELETE: 'DELETE', PATCH: 'PATCH' };

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

export function getUrlPath(URL: string) {
    return `${window.location.origin}/${URL}`;
}

export function callAPI(URL: string, obj = {}) {
    const opts = { headers: { 'Content-Type': 'application/json', token: Cookies.get('token') }, ...obj };
    return fetch(getUrlPath(URL), opts).then((response) => {
        if (response.status === 401) {
            store.dispatch(clearValues());
            store.dispatch(logOutUser());
            store.dispatch(removeCookies());
            store.dispatch(clearMessages());
            store.dispatch(addUpgradeStep([]));
            store.dispatch(setCurrentUpgradeStep(0));
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
    return { code: 0, message: err };
}
