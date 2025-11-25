import { AnyAction, Dispatch } from 'redux';
import { API_DELETE_SITE, API_SET_SITE_PREFERENCE, API_SITES } from '../../constants/ApiUrlConstant';
import { MESSAGE_TYPES } from '../../constants/userConstant';
import { API_TYPES, callAPI, createPayload } from '../../utils/apiUtils';
import { hideApplicationLoader, showApplicationLoader } from '../reducers/globalReducer';
import { addMessage } from '../reducers/messageReducer';
import { addSiteData, resetSelectedSites, updateselectedSites } from '../reducers/siteReducers';
import { closeModal } from '../reducers/ModalReducer';
import { valueChange } from '../reducers/userReducer';
import { STATIC_KEYS } from '../../constants/StoreKey';
import { refresh } from '../../utils/appUtils';

type PlatformData = {
    label: string;
    value: string;
    type: string;
};
interface Word {
    ref: string;
    name: string;
}

export function fetchSites() {
    return (dispatch: any, getState: any) => {
        const { user } = getState();
        const { activeTab } = user;
        dispatch(showApplicationLoader({ key: 'Fetching', value: 'Loading configured sites' }));
        return callAPI(`${API_SITES}?`).then(
            (json) => {
                dispatch(hideApplicationLoader('Fetching'));
                if (json.hasError) {
                    dispatch(addMessage({ message: json.message, messageType: MESSAGE_TYPES.ERROR }));
                } else {
                    const { records } = json;
                    const data: any = [...records];
                    dispatch(addSiteData({ data }));
                    const d: any = [{ value: '1', label: 'Global', type: '' }];
                    const sortedRecords = json.records.sort((a: any, b: any) => {
                        const prefA = a.priority ?? Number.MAX_SAFE_INTEGER;
                        const prefB = b.priority ?? Number.MAX_SAFE_INTEGER;
                        return prefA - prefB;
                    });
                    sortedRecords.forEach((s: any) => {
                        d.push({ value: s.id, label: s.name, type: s.platformType, hostName: s.hostName });
                    });
                    dispatch(valueChange([STATIC_KEYS.GLOBAL_OPT_SITE_DATA, d]));
                    const isOnRestrictedPage = window?.location?.pathname.includes('/alerts') || window?.location?.pathname.includes('/replication') || window?.location?.pathname.includes('/recovery') || activeTab === 2;
                    if (isOnRestrictedPage && json?.records.length > 0) {
                        dispatch(valueChange([STATIC_KEYS.GLOBAL_SITE_KEY, json?.records[0].id]));
                    }
                }
            },
            (err) => {
                dispatch(hideApplicationLoader('Fetching'));
                dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
            },
        );
    };
}

export function configureSite(payload: any, isEdit: boolean = false) {
    return (dispatch: Dispatch) => {
        let url = API_SITES;
        if (isEdit && payload.id) {
            url = `${url}/${payload.id}`;
        }

        const obj = createPayload(isEdit ? API_TYPES.PUT : API_TYPES.POST, payload);
        dispatch(showApplicationLoader({ key: 'configuring-new-site', value: 'Configuring Site...' }));

        return callAPI(url, obj)
            .then((json) => {
                dispatch(hideApplicationLoader('configuring-new-site'));

                if (json.hasError) {
                    dispatch(addMessage({ message: json.message, messageType: MESSAGE_TYPES.ERROR }));
                } else {
                    dispatch(addMessage({ message: `${isEdit ? 'Site reconfigured successfully' : 'Site configured successfully'}`, messageType: MESSAGE_TYPES.SUCCESS }));
                    dispatch(closeModal());
                    dispatch(resetSelectedSites());
                    dispatch(refresh() as unknown as AnyAction);
                    dispatch(fetchSites() as unknown as AnyAction);
                }
            })
            .catch((err: Error) => {
                dispatch(hideApplicationLoader('configuring-new-site'));
                dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
            });
    };
}

export function deleteSites() {
    return async (dispatch: Dispatch, getState: any) => {
        const { sites } = getState();
        const { selectedSites } = sites;
        const ids = Object.keys(selectedSites);
        await Promise.all(ids.map((id) => dispatch<any>(deleteSite(id))));
    };
}

export function deleteSite(id: string) {
    return (dispatch: Dispatch) => {
        const url = API_DELETE_SITE.replace('<id>', id);
        const obj = { method: API_TYPES.DELETE, body: {} };

        dispatch(showApplicationLoader({ key: url, value: 'Deleting site...' }));

        return callAPI(url, obj).then(
            (json) => {
                dispatch(hideApplicationLoader(url));

                if (json.hasError) {
                    dispatch(addMessage({ message: json.message, messageType: MESSAGE_TYPES.ERROR }));
                } else {
                    dispatch(addMessage({ message: 'Site deleted successfully', messageType: MESSAGE_TYPES.SUCCESS }));
                    dispatch(resetSelectedSites());
                    dispatch(refresh() as unknown as AnyAction);
                    dispatch(fetchSites() as unknown as AnyAction);
                    dispatch(closeModal());
                }
            },
            (err: Error) => {
                dispatch(hideApplicationLoader(url));
                dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
            },
        );
    };
}

export function handleSiteTableSelection(data: any, isSelected: boolean, primaryKey: string) {
    return (dispatch: any, getState: any) => {
        dispatch(updateselectedSites({ data: data, isSelected, primaryKey }));
    };
}

export function selectAllSites(isSelected: boolean) {
    return (dispatch: any, getState: any) => {
        const { sites } = getState();
        if (isSelected) {
            sites.sites.forEach((site: any) => {
                dispatch(
                    updateselectedSites({
                        data: site,
                        isSelected: true,
                        primaryKey: 'id', // Assuming "id" is the unique key
                    }),
                );
            });
        } else {
            Object.keys(sites.selectedSites).forEach((key) => {
                dispatch(
                    updateselectedSites({
                        data: { id: key }, // Just passing ID to remove
                        isSelected: false,
                        primaryKey: 'id',
                    }),
                );
            });
        }
    };
}

export function getPlatformType(id: string, data: PlatformData[]): string | undefined {
    const filteredItem = data.find((item) => item.value === id);
    return filteredItem?.type; // Returns type if found, otherwise undefined
}

export function setPrioritySite(payload: any) {
    return (dispatch: Dispatch) => {
        let url = API_SET_SITE_PREFERENCE;
        const obj = createPayload(API_TYPES.PATCH, payload);
        dispatch(showApplicationLoader({ key: 'configuring-site-priority', value: 'Setting Site Priority...' }));
        return callAPI(url, obj)
            .then((json) => {
                dispatch(hideApplicationLoader('configuring-site-priority'));
                if (json.hasError) {
                    dispatch(addMessage({ message: json.message, messageType: MESSAGE_TYPES.ERROR }));
                } else {
                    dispatch(addMessage({ message: 'Site priority set successfully', messageType: MESSAGE_TYPES.SUCCESS }));
                    dispatch(refresh() as unknown as AnyAction);
                    dispatch(fetchSites() as unknown as AnyAction);
                }
            })
            .catch((err: Error) => {
                dispatch(hideApplicationLoader('configuring-site-priority'));
                dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
            });
    };
}

export const initializeSiteLists = (sitesList: any[]) => {
    const unselectedSites: Word[] = sitesList
        .filter((site: any) => site.priority === 100000)
        .map((site: any) => ({
            ref: site.id,
            name: site.name,
        }));

    const selectedSites: Word[] = sitesList
        .filter((site: any) => site.priority !== 100000)
        .sort((a: any, b: any) => a.priority - b.priority)
        .map((site: any) => ({
            ref: site.id,
            name: site.name,
        }));
    return {
        unselectedSites,
        selectedSites,
    };
};

export const areListsEqual = (list1: Word[], list2: Word[], ignoreOrder = false) => {
    if (list1.length !== list2.length) return false;
    if (ignoreOrder) {
        const refs1 = list1.map((i) => i.ref).sort();
        const refs2 = list2.map((i) => i.ref).sort();
        return refs1.every((ref, idx) => ref === refs2[idx]);
    }
    return list1.every((item, idx) => item.ref === list2[idx].ref);
};
