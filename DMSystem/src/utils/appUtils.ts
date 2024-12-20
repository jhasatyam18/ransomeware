/* eslint-disable no-undef */
import { faCircleArrowUp, faDesktop } from '@fortawesome/free-solid-svg-icons';
import * as RPATH from '../Constants/routeConstants';
import { NodeVersionData, UserInterface } from '../interfaces/interfaces';
export function getSideBarContents() {
    const menu = [
        {
            label: 'Dashboard',
            to: RPATH.DASHBOARD_PATH,
            icon: faDesktop,
            isActivePath: [RPATH.DASHBOARD_PATH],
            hasChildren: false,
        },
        {
            label: 'Upgrade',
            to: RPATH.UPGRADE,
            icon: faCircleArrowUp,
            isActivePath: [RPATH.UPGRADE],
            hasChildren: false,
        },
    ];
    return menu;
}

export function getAppKey(): string {
    const KEY_NAME: string = 'datamotive';
    let startValue: number = 1;
    startValue += 1;
    if (startValue > 100000) {
        startValue = 1;
    }
    return `${KEY_NAME}-${startValue}`;
}

export const changePageTitle = (user: any) => {
    const { platformType } = user;

    if (typeof platformType !== 'undefined' && platformType !== '') {
        document.title = `${platformType} | Datamotive`;
    } else {
        document.title = 'Datamotive';
    }
};

/**
 * Convert storage value in its respective unit
 * example: 550 -> 550 GB, 10158 -> 9.92 TB
 * @param {*} value in gb
 * @returns string with converted value and unit
 */
export function getStorageWithUnit(value: number) {
    if (typeof value === 'undefined' || value === 0) {
        return '0 KB';
    }
    const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
    const unitIndex = Math.floor(Math.log(value) / Math.log(1024));
    return `${Number.parseFloat((value / 1024 ** unitIndex).toFixed(2))} ${units[unitIndex]}`;
}

export const calculateDifferenceInPercentage = (usedGB: number, totalGB: number): number => {
    return (usedGB / totalGB) * 100;
};

export const convertBytes = (totalBytes: number, usedBytes: number): { used: string; total: string } => {
    const KB_DIVISOR = 1024;
    const MB_DIVISOR = 1024 ** 2;
    const GB_DIVISOR = 1024 ** 3;
    const TB_DIVISOR = 1024 ** 4;
    const PB_DIVISOR = 1024 ** 5;
    const EB_DIVISOR = 1024 ** 6;

    const formatBytes = (bytes: number): string => {
        if (bytes >= EB_DIVISOR) return (bytes / EB_DIVISOR).toFixed(2) + ' EB';
        if (bytes >= PB_DIVISOR) return (bytes / PB_DIVISOR).toFixed(2) + ' PB';
        if (bytes >= TB_DIVISOR) return (bytes / TB_DIVISOR).toFixed(2) + ' TB';
        if (bytes >= GB_DIVISOR) return (bytes / GB_DIVISOR).toFixed(2) + ' GB';
        if (bytes >= MB_DIVISOR) return (bytes / MB_DIVISOR).toFixed(2) + ' MB';
        if (bytes >= KB_DIVISOR) return (bytes / KB_DIVISOR).toFixed(2) + ' KB';
        return bytes + ' B';
    };
    const total = formatBytes(totalBytes);
    const used = formatBytes(usedBytes);
    return { used, total };
};

export function deepCopy(obj: any, hash = new WeakMap()) {
    // Handle primitive types and null
    if (Object(obj) !== obj || obj === null) {
        return obj;
    }

    // If the object has already been processed, return the existing copy
    if (hash.has(obj)) {
        return hash.get(obj);
    }

    // Create a new object or array
    const newObj: any = Array.isArray(obj) ? [] : {};

    // Remember the new object to avoid infinite recursion
    hash.set(obj, newObj);

    // Copy all properties, including functions, recursively
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (typeof obj[key] === 'function') {
                // If property is a function, directly assign it
                newObj[key] = obj[key];
            } else {
                // Otherwise, recursively deep copy the property
                newObj[key] = deepCopy(obj[key], hash);
            }
        }
    }

    return newObj;
}

export const compareVersions = (prevVersion: string, currVersion: string) => {
    const parseVersion = (version: string) => {
        const [main, build] = version.split('-');
        const [major, minor, patch] = main.split('.').map(Number);
        const buildNumber = Number(build);
        return { major, minor, patch, build: buildNumber };
    };

    const prev = parseVersion(prevVersion);
    const curr = parseVersion(currVersion);

    if (curr.major !== prev.major) {
        return curr.major < prev.major;
    }
    if (curr.minor !== prev.minor) {
        return curr.minor < prev.minor;
    }
    if (curr.patch !== prev.patch) {
        return curr.patch < prev.patch;
    }
    return curr.build < prev.build;
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

export function areAllNodeVersionsSame(data: NodeVersionData[]): boolean {
    if (data.length === 0) return true;
    const firstVersion = data[0].version;
    return data.every((node) => node.version === firstVersion);
}

export function hasRequestedPrivileges(user: UserInterface, reqPrivileges: string[]) {
    if (typeof user === 'undefined') {
        return false;
    }
    const { privileges = [] } = user;
    return reqPrivileges.every((privilege) => privileges.includes(privilege));
}
