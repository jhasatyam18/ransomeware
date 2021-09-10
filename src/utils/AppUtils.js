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
    const m = date.getMonth();
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
      return '';
    }
    const units = ['MB', 'GB', 'TB', 'PB'];
    const factor = 1024;
    let index = parseInt(Math.floor(Math.log(val) / Math.log(factor)), 10);
    const result = Math.round(val / (factor ** index), 2);
    if (index > 3) {
      index = 3;
    }
    return `${result} ${units[index]}`;
  } catch (error) {
    return '';
  }
}
