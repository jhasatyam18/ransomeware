/**
 * Convert storage value in its respective unit
 * example: 550 -> 550 GB, 10158 -> 9.92 TB
 * @param {*} value in gb
 * @returns string with converted value and unit
 */
import { faCircleNodes, faClone, faCloud, faDesktop, faHeadset, faIdCard, faLayerGroup, faNetworkWired, faSliders, faTasks, faTriangleExclamation, faUndo } from '@fortawesome/free-solid-svg-icons';
import { API_CHANGE_PASSWORD, DASHBOARD_ALERTS_ID, DASHBOARD_DEPLOYED_ID, DASHBOARD_TITLES_ID } from '../constants/ApiUrlConstant';
import * as RPATH from '../constants/routeConstant';
import { STATIC_KEYS } from '../constants/StoreKey';
import { APPLICATION_API_USER, MESSAGE_TYPES } from '../constants/userConstant';
import { UserInterface } from '../interfaces/interface';
import { changeLeftSidebarType, fetchLicenses } from '../store/actions/actions';
import { changeExpandedPage, refreshApplication, hideApplicationLoader, showApplicationLoader } from '../store/reducers/globalReducer';
import { addMessage } from '../store/reducers/messageReducer';
import { logOutUser, valueChange } from '../store/reducers/userReducer';
import { API_TYPES, callAPI, createPayload, getCookie, removeCookies } from './apiUtils';
import { RootState } from '../store';
import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { getInfoInInterval } from '../store/actions/userAction';

export function getStorageWithUnit(value: number) {
    if (typeof value === 'undefined' || value === 0) {
        return '0 KB';
    }
    const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
    const unitIndex = Math.floor(Math.log(value) / Math.log(1024));
    return `${Number.parseFloat((value / 1024 ** unitIndex).toFixed(2))} ${units[unitIndex]}`;
}

export function getValue(key: string, values: any) {
    const ret = values[key];
    return typeof ret === 'undefined' ? '' : ret;
}
export function getSideBarContents() {
    const menu = [
        {
            label: 'Global',
            to: RPATH.DASHBOARD_PATH,
            icon: faDesktop,
            isActivePath: [RPATH.DASHBOARD_PATH],
            hasSubMenu: true,
            hasChildren: true,
            subMenu: [
                { label: 'Dashboard', to: RPATH.DASHBOARD_PATH, icon: faDesktop, isActivePath: [RPATH.DASHBOARD_PATH], hasChildren: false },
                { label: 'Nodes', to: RPATH.NODES_PATH, icon: faNetworkWired, isActivePath: [RPATH.NODES_PATH], hasChildren: false },
                { label: 'Sites', to: RPATH.SITES_PATH, icon: faCloud, isActivePath: [RPATH.SITES_PATH], hasChildren: false },
                { label: 'Protection Plans', to: RPATH.PROTECTION_PLANS_PATH, icon: faLayerGroup, isActivePath: [RPATH.PROTECTION_PLANS_PATH], hasChildren: false },
                {
                    label: 'Protected Workloads',
                    to: '#',
                    icon: faCircleNodes,
                    isActivePath: [RPATH.INSTANCES],
                    hasSubMenu: true,
                    subMenu: [{ label: 'Instances', to: RPATH.INSTANCES, icon: faLayerGroup, isActivePath: [RPATH.JOBS_REPLICATION_PATH], hasChildren: false }],
                },

                {
                    label: 'Settings',
                    to: '#',
                    icon: faSliders,
                    isActivePath: [RPATH.SITE_PRIORITY],
                    hasSubMenu: true,
                    subMenu: [
                        { label: 'Site Priority', to: RPATH.SITE_PRIORITY, icon: faDesktop, isActivePath: [RPATH.SITE_PRIORITY], hasChildren: false },
                        { label: 'License', to: RPATH.LICENSE, icon: faIdCard, isActivePath: [RPATH.LICENSE], hasChildren: false },
                        { label: 'Tech Support', to: RPATH.SUPPORT_BUNDLE_PATH, icon: faHeadset, isActivePath: [RPATH.SUPPORT_BUNDLE_PATH], hasChildren: false },
                    ],
                },
            ],
        },

        {
            label: 'Sites',
            to: RPATH.MONITOR_ALERTS,
            icon: faTriangleExclamation,
            isActivePath: [RPATH.MONITOR_ALERTS],
            hasSubMenu: true,
            hasChildren: true,
            subMenu: [
                { label: 'Alerts', to: RPATH.MONITOR_ALERTS, icon: faTriangleExclamation, isActivePath: [RPATH.MONITOR_ALERTS], hasChildren: false },
                {
                    label: 'Jobs',
                    to: '#',
                    icon: faTasks,
                    isActivePath: [RPATH.JOBS_REPLICATION_PATH],
                    hasSubMenu: true,
                    hasChildren: true,
                    subMenu: [
                        { label: 'Replication', to: RPATH.JOBS_REPLICATION_PATH, icon: faClone, isActivePath: [RPATH.JOBS_REPLICATION_PATH], hasChildren: false },
                        { label: 'Recovery', to: RPATH.JOBS_RECOVERY_PATH, icon: faUndo, isActivePath: [RPATH.JOBS_RECOVERY_PATH], hasChildren: false },
                    ],
                },
                // { label: 'Reports', to: RPATH.REPORTS, icon: faFileContract, isActivePath: [RPATH.REPORTS], hasChildren: false },
            ],
        },
    ];
    return menu;
}

export const getGlobalSelectOption = (user: UserInterface, fieldKey: string) => {
    const { values } = user;
    const op = getValue(STATIC_KEYS.GLOBAL_OPT_SITE_DATA, values) || [];
    return op;
};

export function setDashboardTitles() {
    return (dispatch: any, getState: any) => {
        const { user } = getState();
        const { values } = user;
        const value = getValue(STATIC_KEYS.GLOBAL_SITE_KEY, values);
        const url = DASHBOARD_TITLES_ID.replace('<id>', value);
        callAPI(url).then(
            (json: any) => {
                // dispatch(hideApplicationLoader(url));
                dispatch(valueChange([STATIC_KEYS.DASHBOARD_TITLES, json]));
            },
            (err: Error) => {
                dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
                // dispatch(hideApplicationLoader(url));
            },
        );
    };
}
export function setDashboardAlerts() {
    return (dispatch: any, getState: any) => {
        const { user } = getState();
        const { values } = user;
        const value = getValue(STATIC_KEYS.GLOBAL_SITE_KEY, values);
        const url = DASHBOARD_ALERTS_ID.replace('<id>', value);
        callAPI(url).then(
            (json: any) => {
                dispatch(valueChange([STATIC_KEYS.DASHBOARD_ALERTS, json]));
            },
            (err: Error) => {
                dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
            },
        );
    };
}

export function setDashboardDeployedNodes() {
    return (dispatch: any, getState: any) => {
        const { user } = getState();
        const { values } = user;
        const value = getValue(STATIC_KEYS.GLOBAL_SITE_KEY, values);
        const url = DASHBOARD_DEPLOYED_ID.replace('<id>', value);
        callAPI(url).then(
            (json: any) => {
                dispatch(valueChange([STATIC_KEYS.DASHBOARD_DEPLOYED_NODES, json]));
            },
            (err: Error) => {
                dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
            },
        );
    };
}

export function refresh() {
    return (dispatch: ThunkDispatch<RootState, undefined, UnknownAction>, getState: () => RootState) => {
        const { location } = window;
        const { pathname } = location;
        const { user } = getState();
        const { values } = user;
        const siteID = getValue(STATIC_KEYS.GLOBAL_SITE_KEY, values) || '1';
        // dispatch refreshAction to notify selector component
        dispatch(getInfoInInterval());
        dispatch(refreshApplication());
        switch (pathname) {
            case RPATH.DASHBOARD_PATH:
                dispatch(refreshApplication());
                break;
            case RPATH.LICENSE:
                dispatch(fetchLicenses(siteID));
                break;
            default:
                dispatch(refreshApplication());
        }
    };
}

export const toggleMenu = (path: string) => {
    return (dispatch: any, getState: any) => {
        const { layout } = getState();
        const { leftSideBarType } = layout;
        if (leftSideBarType === 'default') {
            dispatch(changeLeftSidebarType('condensed', false));
            dispatch(changeExpandedPage(path));
        } else if (leftSideBarType === 'condensed') {
            dispatch(changeLeftSidebarType('default', false));
            dispatch(changeExpandedPage(''));
        }
    };
};

export function getLabelWithResourceGrp(val: string) {
    const valArray = val.split(':') || [];
    let label = '';
    if (valArray.length === 2) {
        const resourceGrp = valArray[0];
        const name = valArray[1];
        label = `${name} (${resourceGrp})`;
    } else {
        [label] = valArray;
    }
    return label;
}

export const getGCPNetworkValue = (value: string) => {
    let networkParts = value.split('/');
    let networkValue = networkParts[networkParts.length - 1];
    return networkValue;
};

export function getNetworkOptions(user: UserInterface) {
    const { values } = user;
    const opts = getValue('ui.values.subnets', values) || [];
    const options: any = [];
    opts.forEach((op: any) => {
        const network = op.vpcID;
        const name = network.split(/[\s/]+/).pop();
        const exist = options.find((item: any) => item.label === name);
        if (!exist) {
            options.push({ label: name, value: op.vpcID });
        }
    });
    return options;
}

export function getMemoryInfo(value: number) {
    let val = 1;
    let unit = 'GB';
    if (typeof value === 'undefined' || value === 0) {
        return [val, unit];
    }
    const units = ['MB', 'GB', 'TB'];
    const unitIndex = Math.floor(Math.log(value) / Math.log(1024));
    val = Number.parseFloat((value / 1024 ** unitIndex).toFixed(2)) || 0;
    unit = units[unitIndex] || 'MB';

    return [val, unit];
}

export function resetCredetials(payload: any) {
    return (dispatch: any) => {
        dispatch(showApplicationLoader({ key: 'CHANGE_PASSWORD', value: 'Changing password...' }));
        const obj = createPayload(API_TYPES.POST, { ...payload });
        return callAPI(API_CHANGE_PASSWORD, obj).then(
            (json) => {
                dispatch(hideApplicationLoader('CHANGE_PASSWORD'));
                if (json.hasError) {
                    dispatch(addMessage({ message: json.message, messageType: MESSAGE_TYPES.ERROR }));
                } else {
                    window.location.reload();
                }
            },
            (err) => {
                dispatch(hideApplicationLoader('CHANGE_PASSWORD'));
                dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
            },
        );
    };
}
export function validatedNewAndCnfmPass(user: any) {
    const { values, errors } = user;
    const password = getValue('user.newPassword', values);
    const cnfPassword = getValue('user.confirmPassword', values);
    // Added Below line to check if the new password and cnfirm new password fields has any error if it has then it should not call the change password api
    const passError = errors['user.newPassword'] || '';
    const cnfmError = errors['user.confirmPassword'] || '';
    if (password !== '' && cnfPassword !== '' && passError === '' && cnfmError === '' && password === cnfPassword) return true;
    return false;
}

export function validatePassword({ value, user }: any) {
    const { values } = user;
    const password = getValue('user.newPassword', values);
    return value !== password;
}

export function changeUserPassword(oldPass: string, newPass: string) {
    return (dispatch: any, getState: any) => {
        dispatch(showApplicationLoader({ key: 'CHANGE_PASSWORD', value: 'Changing password...' }));
        // const name = getCookie(APPLICATION_API_USER) || '';
        const obj = createPayload(API_TYPES.POST, { username: getCookie(APPLICATION_API_USER), oldPassword: oldPass, newPassword: newPass });
        return callAPI(API_CHANGE_PASSWORD, obj).then(
            (json) => {
                dispatch(hideApplicationLoader('CHANGE_PASSWORD'));
                if (json.hasError) {
                    dispatch(addMessage({ message: json.message, messageType: MESSAGE_TYPES.ERROR }));
                } else {
                    dispatch(removeCookies());
                    dispatch(logOutUser());
                    window.location.reload();
                }
            },
            (err) => {
                dispatch(hideApplicationLoader('CHANGE_PASSWORD'));
                dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
            },
        );
    };
}

export function getThemeFromCSSVariables() {
    const root = getComputedStyle(document.documentElement);
    return {
        colors: {
            background: root.getPropertyValue('--select-bg').trim(),
            text: root.getPropertyValue('--select-font').trim(),
            border: root.getPropertyValue('--select-border').trim(),
            hover: root.getPropertyValue('--select-hover').trim(),
            hoverColor: root.getPropertyValue('--select-hover-color').trim(),
            primary: root.getPropertyValue('--select-primary').trim(),
            error: root.getPropertyValue('--select-error').trim(),
            selected: root.getPropertyValue('--select-select').trim(),
        },
    };
}
export function calculateChangedData(val: number): string {
    try {
        if (val === 0) {
            return '0 Bytes';
        }
        try {
            if (val > 0 && val < 1) {
                // show 2 decimal value only
                return `${val.toFixed(2)} MB`;
            }
        } catch (error) {
            return '-';
        }
        const units: string[] = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
        const factor: number = 1024;
        let index: number = parseInt(Math.floor(Math.log(val) / Math.log(factor)).toString(), 10);
        const result: number = parseFloat((val / factor ** index).toFixed(2).replace(/[.,]00$/, ''));
        if (index > 3) {
            index = 3;
        }
        if (index < 0) {
            return `${result} BYTES`;
        }
        return `${result} ${units[index]}`;
    } catch (error) {
        return '';
    }
}

export function formatTime(seconds: number): string {
    const day: number = Math.floor(seconds / (3600 * 24));
    const hour: number = Math.floor((seconds % (3600 * 24)) / 3600);
    const min: number = Math.floor((seconds % 3600) / 60);
    const sec: number = Math.floor(seconds % 60);
    if (day > 0) {
        if (hour > 0) {
            if (min > 0) {
                if (sec > 0) {
                    return `${day}d ${hour}h ${min}m ${sec}s`;
                }
                return `${day}d ${hour}h ${min}m`;
            }
            return `${day}d ${hour}h`;
        }
        return `${day}d`;
    }
    if (hour > 0) {
        if (min > 0) {
            if (sec > 0) {
                return `${hour}h ${min}m ${sec}s`;
            }
            return `${hour}h ${min}m`;
        }
        return `${hour}h`;
    }
    if (min > 0) {
        if (sec > 0) {
            return `${min}m ${sec}s`;
        }
        return `${min}m`;
    }
    if (sec > 0) {
        return `${sec}s`;
    }
    return '-';
}

export function getLastRecovery(time: number) {
    if (typeof time === 'undefined' || time === 0) {
        return '-';
    }
    const eventDate = new Date(time * 1000);
    const now = new Date();
    // Normalize both to midnight for "calendar day" comparison
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diffInMs = today.getTime() - eventDay.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    let displayText;
    if (diffInDays === 0) {
        displayText = 'Today';
    } else {
        displayText = diffInDays;
    }
    return displayText;
}

export function getLicenseData(rawData: any[]): any[] {
    const result: any[] = [];
    rawData.forEach((site) => {
        const { siteID, siteName, licenses } = site;
        if (Array.isArray(licenses) && licenses.length > 0) {
            licenses.forEach((license: any) => {
                result.push({
                    ...license,
                    siteID,
                    siteName,
                });
            });
        }
    });
    return result;
}

export function calculateSize(bytes?: number): string {
    if (bytes === undefined || bytes <= 0) return '0 Bytes';

    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    let i = 0;

    try {
        i = Math.floor(Math.log(bytes) / Math.log(1024));
        if (Number.isNaN(i)) i = 0;
        if (bytes === 0) return '-';

        return `${(bytes / 1024 ** i).toFixed(2).replace(/[.,]00$/, '')} ${sizes[i]}`;
    } catch (error) {
        return '-';
    }
}

export const getStartEndTime = (durationType: string, user: UserInterface, fieldKey: string): { start: number; end: number } => {
    const { values } = user;
    const now = new Date();
    let end = Math.floor(now.getTime() / 1000); // current time in epoch seconds
    let start = end;

    switch (durationType) {
        case 'week':
            const today = new Date(now);
            const day = today.getDay(); // 0 (Sun) to 6 (Sat)
            const diff = today.getDate() - day + (day === 0 ? -6 : 1);
            today.setDate(diff);
            today.setHours(0, 0, 0, 0);
            start = Math.floor(today.getTime() / 1000);
            break;
        case 'month':
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            start = Math.floor(firstDayOfMonth.getTime() / 1000);
            break;
        case 'year':
            const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
            start = Math.floor(firstDayOfYear.getTime() / 1000);
            break;
        case 'custom':
            let startVal = getValue(`${fieldKey}.stack.bar.duration.startDate`, values);
            let endVal = getValue(`${fieldKey}.stack.bar.duration.endDate`, values);
            const todayDate = new Date();
            if (!startVal) startVal = todayDate.toISOString();
            if (!endVal) endVal = todayDate.toISOString();
            // start time → midnight
            const s = new Date(startVal);
            s.setHours(0, 0, 0, 0);
            start = Math.floor(s.getTime() / 1000);
            // end time → current time of day
            const e = new Date(endVal);
            e.setHours(todayDate.getHours(), todayDate.getMinutes(), todayDate.getSeconds(), 0);
            end = Math.floor(e.getTime() / 1000);
            break;
    }
    return { start, end };
};

export function setMinDateForGraphFilter({ user, key }: { user: UserInterface; key: string }) {
    const { values } = user;
    const startDate = getValue(key, values);
    return startDate === '' ? new Date() : startDate;
}

export function mapErrorMessage(message: string) {
    if (message.includes(`"errorCode":"DM_ERR_INTERNAL_SERVER"`)) {
        return ['Internal server error'];
    }
    const errArray = message.split('||');
    return errArray;
}

export const getDurationText = (durationValue: string, user: UserInterface, key: string) => {
    if (!durationValue) return 'Current Month';
    if (durationValue === 'custom') {
        let startTime = getValue(`${key}.stack.bar.duration.startDate`, user.values);
        let endTime = getValue(`${key}.stack.bar.duration.endDate`, user.values);
        const todayDate = new Date();
        if (!startTime) startTime = todayDate.toISOString();
        if (!endTime) endTime = todayDate.toISOString();
        if (startTime && endTime) {
            const formatDate = (isoString: string) => {
                const date = new Date(isoString);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            };
            return `${formatDate(startTime)} - ${formatDate(endTime)}`;
        }
    } else {
        return `Current ${durationValue.charAt(0).toUpperCase() + durationValue.slice(1)}`;
    }
};

export const formatDateWithSuffix = (date: Date) => {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const suffix = ((d) => {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    })(day);
    return { day, suffix, month, year };
};

export function findDifferenceInTimeFromNow(time: number) {
    const SECONDS_IN_A_YEAR = 31536000; // 365 days
    const SECONDS_IN_A_MONTH = 2592000; // 30 days
    const SECONDS_IN_A_DAY = 86400;
    const SECONDS_IN_AN_HOUR = 3600;
    const SECONDS_IN_A_MINUTE = 60;

    const now = new Date();
    const currentEpochTimeSeconds = Math.floor(now.getTime() / 1000);
    let diffInseconds = Math.abs(currentEpochTimeSeconds - time);

    const years = Math.floor(diffInseconds / SECONDS_IN_A_YEAR);
    diffInseconds %= SECONDS_IN_A_YEAR;

    const months = Math.floor(diffInseconds / SECONDS_IN_A_MONTH);
    diffInseconds %= SECONDS_IN_A_MONTH;

    const days = Math.floor(diffInseconds / SECONDS_IN_A_DAY);
    diffInseconds %= SECONDS_IN_A_DAY;

    const hours = Math.floor(diffInseconds / SECONDS_IN_AN_HOUR);
    diffInseconds %= SECONDS_IN_AN_HOUR;

    const minutes = Math.floor(diffInseconds / SECONDS_IN_A_MINUTE);
    diffInseconds %= SECONDS_IN_A_MINUTE;

    const timeComponents = [
        { value: years, label: 'y' },
        { value: months, label: 'm' },
        { value: days, label: 'd' },
        { value: hours, label: 'h' },
        { value: minutes, label: 'm' },
        { value: diffInseconds, label: 's' },
    ];

    const formattedTime = timeComponents
        .filter((component) => component.value > 0)
        .map((component) => `${component.value}${component.label}`)
        .join(' ');

    return formattedTime;
}
