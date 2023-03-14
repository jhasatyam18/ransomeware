import { STATIC_KEYS } from '../constants/InputConstants';
import * as RPATH from '../constants/RouterConstants';
import { getAzureNetworkOptions, getValue } from './InputUtils';

const KEY_NAME = 'datamotive';
let startValue = 1;
export function getAppKey() {
  startValue += 1;
  if (startValue > 100000) {
    startValue = 1;
  }
  return `${KEY_NAME}-${startValue}`;
}

export function formatTime(seconds) {
  const day = Math.floor(seconds / (3600 * 24));
  const hour = Math.floor(seconds % (3600 * 24) / 3600);
  const min = Math.floor(seconds % 3600 / 60);
  const sec = Math.floor(seconds % 60);

  if (day > 0) {
    if (hour > 0) {
      if (min > 0) {
        if (sec > 0) {
          return (`${day}d ${hour}h ${min}m ${sec}s`);
        }
        return (`${day}d ${hour}h ${min}m`);
      }
      return (`${day}d ${hour}h`);
    }
    return (`${day}d`);
  }
  if (hour > 0) {
    if (min > 0) {
      if (sec > 0) {
        return (`${hour}h ${min}m ${sec}s`);
      }
      return (`${hour}h ${min}m`);
    }
    return (`${hour}h`);
  }
  if (min > 0) {
    if (sec > 0) {
      return (`${min}m ${sec}s`);
    }
    return (`${min}m`);
  }
  if (sec > 0) {
    return ` ${sec}s`;
  }
  return '-';
}

export function getInterval(duration) {
  if (duration >= 1440) {
    return `${duration / 1440} Days`;
  }
  if (duration > 59 && duration < 1440) {
    return `${duration / 60} Hours`;
  }
  return `${duration} Minutes`;
}

/**
 * Return fieldKey value from an object.
 * @param {*} object
 * @param {*} fieldKey
 * @returns
 */
function getValueByKey(object, fieldKey) {
  const keys = fieldKey.split('.');
  if (keys.length === 1) {
    return object[fieldKey];
  }
  let val = object;
  keys.forEach((key) => {
    val = val[key];
  });
  return val;
}
/**
 * Filter data on text search based on column name search.
 * user can enter multiple ':' separated clauses
 * example : vmName=test:os=win
 * example : status=com:vmName=prod
 * @param {*} columns
 * @param {*} criteria
 * @param {*} data
 */
export function filterData(data, criteria, columns) {
  let response = [];
  if (!data) {
    return response;
  }
  const isPlainSearch = criteria.split('=').length === 1;
  if (isPlainSearch) {
    response = data.filter((row) => searchOnColumn(row, columns, criteria));
    return response;
  }
  const clauses = criteria.split(':');
  clauses.forEach((clause) => {
    // filter field and value
    const query = clause.split('=');
    if (query.length > 1) {
      if (response.length === 0) {
        response = data.filter((row) => hasSearchData(row, query[0], query[1]));
      } else {
        response = response.filter((row) => hasSearchData(row, query[0], query[1]));
      }
    }
  });
  return response;
}

/**
 * Search data is present in given object
 * @param {*} row
 * @param {*} field
 * @param {*} value
 * @returns bool
 */
function hasSearchData(row, field, value = '') {
  if (row && typeof row[field] !== 'undefined') {
    const text = `${row[field]}`.toLowerCase();
    if (text.indexOf(value.toLowerCase()) !== -1) {
      return true;
    }
  }
  return false;
}

/**
 * Search value on object for specified table columns
 * @param {*} row
 * @param {*} column
 * @param {*} value
 * @returns bool
 */
function searchOnColumn(row, columns, value) {
  let hasMatch = false;
  for (let index = 0; index < columns.length; index += 1) {
    const colVal = `${getValueByKey(row, columns[index].field)}`;
    if (colVal.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
      hasMatch = true;
      break;
    }
  }
  return hasMatch;
}
// Extract minutes from the timestamp
export function getMinutes(timestamp) {
  const date = new Date(timestamp * 1000);
  const mins = date.getMinutes();
  return mins;
}

export function getAppDateFormat(date, includeTime = false) {
  if (Date) {
    const y = date.getFullYear();
    const m = date.getMonth() + 1;
    const d = date.getDate();
    if (includeTime) {
      const h = date.getHours();
      const mm = date.getMinutes();
      const s = date.getSeconds();
      return `${m}-${d}-${y}_${h}-${mm}-${s}`;
    }
    return `${m}-${d}-${y}`;
  }
  return '';
}

export function calculateChangedData(val) {
  try {
    if (val === 0) {
      return '-';
    }
    try {
      if (val > 0 && val < 1) {
        // show 2 decimal value only
        return `${(val).toFixed(2)} MB`;
      }
    } catch (error) {
      return '-';
    }
    const units = ['MB', 'GB', 'TB', 'PB'];
    const factor = 1024;
    let index = parseInt(Math.floor(Math.log(val) / Math.log(factor)), 10);
    const result = Math.round(val / (factor ** index), 2);
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

export function getSideBarContents() {
  const menu = [
    { label: 'dashboard', to: RPATH.DASHBOARD_PATH, icon: 'fa fa-desktop fa-s-lg', isActivePath: [RPATH.DASHBOARD_PATH], hasChildren: false },
    { label: 'configure',
      to: '#',
      icon: 'fa fa-cog fa-s-lg',
      isActivePath: [RPATH.SITES_PATH, RPATH.PROTECTION_PLANS_PATH, RPATH.NODES_PATH],
      hasSubMenu: true,
      subMenu: [
        { label: 'nodes', to: RPATH.NODES_PATH, icon: 'fas fa-network-wired', isActivePath: [RPATH.NODES_PATH], hasChildren: false },
        { label: 'sites', to: RPATH.SITES_PATH, icon: 'fa fa-cloud', isActivePath: [RPATH.SITES_PATH], hasChildren: false },
        { label: 'protection.plans', to: RPATH.PROTECTION_PLANS_PATH, icon: 'fas fa-layer-group', isActivePath: [RPATH.PROTECTION_PLANS_PATH], hasChildren: false },
      ],
    },
    { label: 'jobs',
      to: '#',
      icon: 'fa fa-tasks',
      isActivePath: [RPATH.JOBS_PATH, RPATH.JOBS_REPLICATION_PATH, RPATH.JOBS_RECOVERY_PATH],
      hasSubMenu: true,
      subMenu: [
        { label: 'replication', to: RPATH.JOBS_REPLICATION_PATH, icon: 'far fa-clone', isActivePath: [RPATH.JOBS_REPLICATION_PATH], hasChildren: false },
        { label: 'recovery', to: RPATH.JOBS_RECOVERY_PATH, icon: 'fas fa-undo', isActivePath: [RPATH.JOBS_RECOVERY_PATH], hasChildren: false },
      ],
    },
    { label: 'monitor',
      to: '#',
      icon: 'fa fa-chart-bar fa-s-lg',
      isActivePath: [RPATH.EVENTS_PATH, RPATH.ALERTS_PATH, RPATH.REPORTS_PATH],
      hasSubMenu: true,
      subMenu: [
        { label: 'events', to: RPATH.EVENTS_PATH, icon: 'bx bxs-calendar-event', isActivePath: [RPATH.EVENTS_PATH], hasChildren: false },
        { label: 'alerts', to: RPATH.ALERTS_PATH, icon: 'bx bx-alarm', isActivePath: [RPATH.ALERTS_PATH], hasChildren: false },
        { label: 'report', to: RPATH.REPORTS_PATH, icon: 'bx bxs-report', isActivePath: [RPATH.REPORTS_PATH], hasChildren: false },
      ],
    },
    { label: 'settings',
      to: '#',
      icon: 'fas fa-sliders-h',
      isActivePath: [RPATH.LICENSE_SETTINGS_PATH, RPATH.SUPPORT_BUNDLE_PATH, RPATH.EMAIL_SETTINGS_PATH],
      hasSubMenu: true,
      subMenu: [
        { label: 'license', to: RPATH.LICENSE_SETTINGS_PATH, icon: 'fas fa-id-card', isActivePath: [RPATH.LICENSE_SETTINGS_PATH], hasChildren: false },
        { label: 'email', to: RPATH.EMAIL_SETTINGS_PATH, icon: 'far fa-envelope', isActivePath: [RPATH.EMAIL_SETTINGS_PATH], hasChildren: false },
        { label: 'scripts', to: RPATH.SCRIPTS_PATH, icon: 'fa fa-scroll', isActivePath: [RPATH.SCRIPTS_PATH], hasChildren: false },
        { label: 'throttling', to: RPATH.THROTTLING_SETTINGS_PATH, icon: 'fas fa-tachometer-alt', isActivePath: [RPATH.THROTTLING_SETTINGS_PATH], hasChildren: false },
        { label: 'roles', to: RPATH.ROLES_SETTINGS_PATH, icon: 'fas fa-user-shield', isActivePath: [RPATH.ROLES_SETTINGS_PATH], hasChildren: false },
        { label: 'users', to: RPATH.USER_SETTINGS_PATH, icon: 'fas fa-users', isActivePath: [RPATH.USER_SETTINGS_PATH], hasChildren: false },
        { label: 'tech.support', to: RPATH.SUPPORT_BUNDLE_PATH, icon: 'fas fa-headset', isActivePath: [RPATH.SUPPORT_BUNDLE_PATH], hasChildren: false },
      ],
    },
  ];
  return menu;
}

export function convertMinutesToDaysHourFormat(value = 0) {
  let result = '';
  let interval = value;
  if (interval >= 1440) {
    const d = Math.floor((interval / 1440));
    result = (d > 1 ? `${d} Days` : `${d} Day`);
    while (interval >= 1440) {
      interval -= 1440;
    }
  }
  if (interval >= 60) {
    const h = Math.floor(interval / 60);
    result = (h > 1 ? `${result} ${h} Hours` : `${result} ${h} Hour`);
    while (interval >= 60) {
      interval -= 60;
    }
  }
  if (interval < 60 && interval > 0) {
    result = (interval > 1 ? `${result} ${interval} Minutes` : `${result} ${interval} Minute`);
  }
  return result;
}

/**
 * Convert storage value in its respective unit
 * example: 550 -> 550 GB, 10158 -> 9.92 TB
 * @param {*} value in gb
 * @returns string with converted value and unit
 */
export function getStorageWithUnit(value) {
  if (typeof value === 'undefined' || value === 0) {
    return '0 KB';
  }
  const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
  const unitIndex = Math.floor(Math.log(value) / Math.log(1024));
  return `${Number.parseFloat((value / (1024 ** unitIndex)).toFixed(2))} ${units[unitIndex]}`;
}

export function getAllObjectKeys(obj, prefix = '') {
  return Object.keys(obj).reduce((res, o) => {
    if (Array.isArray(obj[o])) {
      return res;
    }
    if (typeof obj[o] === 'object' && obj[o] !== null) {
      return [...res, ...getAllObjectKeys(obj[o], `${prefix}${o}.`)];
    }
    return [...res, `${prefix}${o}`];
  }, []);
}

/**
 * @param t : requried t is function of react18-next,
 * @returns document title
 */

export const changePageTitle = (t) => {
  const location = window.location.pathname.slice(1).replaceAll('/', '.');
  let path = t(`title.${location}`);
  path = path.split('.');
  if (path.length === 1) {
    path = path[path.length - 1];
    document.title = `${path} | Datamotive`;
    return;
  }
  path = path.join(' ');
  if (path.indexOf('protection plan details') !== -1) {
    document.title = 'Protection Plans | Datamotive';
    return;
  }

  document.title = 'Datamotive';
};

export function getMemoryInfo(value) {
  let val = 0;
  let unit = 'MB';
  if (typeof value === 'undefined' || value === 0) {
    return [val, unit];
  }
  const units = ['MB', 'GB', 'TB'];
  const unitIndex = Math.floor(Math.log(value) / Math.log(1024));
  val = Number.parseFloat((value / (1024 ** unitIndex)).toFixed(2)) || 0;
  unit = units[unitIndex] || 'MB';

  return [val, unit];
}

export function getMatchingNetwork(val, user) {
  let res = '';
  const azureNetOpt = getAzureNetworkOptions(user);
  azureNetOpt.forEach((opt) => {
    if (opt.name === val) {
      res = opt.value;
    }
  });
  return res;
}

export function getNetworkIDFromName(val, values) {
  let res = '';
  const netArray = getValue(STATIC_KEYS.UI_NETWORK, values);
  netArray.forEach((net) => {
    if (net.name === val) {
      res = net.id;
    }
  });
  return res;
}

export function getSubnetIDFromName(val, values, netID) {
  let res = '';
  const netArray = getValue(STATIC_KEYS.UI_SUBNETS, values);
  netArray.forEach((op) => {
    if (netID === op.vpcID && op.name === val) {
      res = op.id;
    }
  });
  return res;
}

/**
 * @param data :required data is an array for comparison
 * @param selectedObjects : is an object
 * @returns array
 */

export function moveSelectedItemsOnTop(data, selectedObjects) {
  const response = [];
  if (selectedObjects === '' || typeof selectedObjects !== 'object' && typeof data !== 'undefined') {
    return data;
  }
  data.forEach((el) => {
    if (typeof selectedObjects[el.moref] !== 'undefined') {
      response.unshift(el);
    } else {
      response.push(el);
    }
  });
  return response;
}
