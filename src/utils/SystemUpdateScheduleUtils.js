import cronstrue from 'cronstrue';
import { STATIC_KEYS } from '../constants/InputConstants';
import { getValue } from './InputUtils';
import { STORE_KEYS } from '../constants/StoreKeyConstants';
import { valueChange } from '../store/actions';

const dayNameToIndex = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

// this func make key of dayNameToIndex as value and value of dayNameToIndex as key {5: 'Friday', 0: 'Sunday', ...}
export const indexToDayName = Object.entries(dayNameToIndex).reduce((acc, [dayName, index]) => {
  acc[index] = dayName;
  return acc;
}, {});

export function convertScheduleToCron(schedule) {
  const [hourStr, minutePart] = schedule.time.split(':');
  const minute = minutePart.slice(0, 2);
  const isPM = minutePart.toLowerCase().includes('pm');
  const hour24 = isPM ? (parseInt(hourStr, 10) % 12) + 12 : parseInt(hourStr, 10) % 12;

  const getDayIndex = (day) => (typeof day === 'string' ? dayNameToIndex[day] : day);

  switch (schedule.type) {
    case 'Week':
      const days = Array.isArray(schedule.dayOfWeek)
        ? schedule.dayOfWeek.map(getDayIndex).join(',')
        : getDayIndex(schedule.dayOfWeek);
      return `${minute} ${hour24} * * ${days}`;
    case 'Days':
      return `${minute} ${hour24} */${schedule.repeat} * *`;
    case 'Month':
      return `${minute} ${hour24} ${schedule.dayOfMonth} */${schedule.repeat} *`;
    default:
      throw new Error('Unsupported schedule type');
  }
}

export const formatTime = (date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 === 0 ? 12 : hours % 12;
  return `${hour12}:${String(minutes).padStart(2, '0')} ${ampm}`;
};

export function getScheduleSummary({ occurrenceOptions, repeat, dayOfWeek, dayOfMonth, powerOnTime, powerOffTime, powerOffByDay }) {
  let type;
  if (occurrenceOptions === 'day') type = 'Days';
  else if (occurrenceOptions === 'week') type = 'Week';
  else type = 'Month';
  const cronExp = convertScheduleToCron({ type, repeat, dayOfWeek, dayOfMonth, time: formatTime(powerOnTime) });
  const powerOnText = `Power on ${cronstrue.toString(cronExp, {
    locale: 'en',
    use24HourTimeFormat: false,
    throwExceptionOnParseError: false,
  })} ${occurrenceOptions === 'day' && repeat === 1 ? 'every day' : ''}`;
  let powerOffText = '';
  if (occurrenceOptions === 'day') {
    const offset = parseInt(powerOffByDay, 10);
    const offTimeStr = formatTime(powerOffTime);
    if (powerOffByDay === 'sameDay' || Number.isNaN(offset)) {
      powerOffText = `Power off at same day ${offTimeStr}`;
    } else {
      powerOffText = `Power off on ${offset} day${offset > 1 ? 's' : ''} later at ${offTimeStr}`;
    }
  } else {
    const { powerOffDayOfWeek, powerOffDayOfMonth } = getPowerOffDayInterval({ type, dayOfWeek, dayOfMonth, powerOffByDay });
    const powerOffCron = convertScheduleToCron({ type, repeat, dayOfWeek: powerOffDayOfWeek, dayOfMonth: powerOffDayOfMonth, time: formatTime(powerOffTime) });
    powerOffText = `Power off ${cronstrue.toString(powerOffCron, { locale: 'en', use24HourTimeFormat: false, throwExceptionOnParseError: false })}`;
  }
  return {
    powerOnText,
    powerOffText,
  };
}

export function parseCronToTime(cron) {
  const parts = cron.trim().split(' ');
  if (parts.length < 6) throw new Error('Invalid cron format');
  const [rawSeconds, minutes, hours] = parts;
  const seconds = rawSeconds === '*' ? '0' : rawSeconds;
  const date = new Date();
  date.setHours(parseInt(hours, 10));
  date.setMinutes(parseInt(minutes, 10));
  date.setSeconds(parseInt(seconds, 10));
  date.setMilliseconds(0);

  return date;
}

export function parseCronToScheduleFields(cron) {
  const parts = cron.trim().split(' ');
  if (parts.length < 6) throw new Error('Invalid cron format');
  // Destructure only needed fields (ignore sec, min, hour here)
  const [, , , dom, month, dow] = parts;
  // WEEKLY: dayOfMonth is *, dayOfWeek is numeric
  if (dow !== '*' && dom === '*') {
    const dayOfWeek = dow.split(',').map((d) => {
      const index = parseInt(d, 10);
      return indexToDayName[index] || 'Unknown';
    });
    return {
      type: 'week',
      repeat: 1,
      dayOfWeek,
    };
  }
  // MONTHLY: has dayOfMonth and month like */3
  if (dow === '*' && dom !== '*' && month !== '*') {
    let repeat = 1;
    if (month.startsWith('*/')) {
      const parsed = parseInt(month.slice(2), 10);
      repeat = Number.isNaN(parsed) ? 1 : parsed;
    } else if (/^\d+$/.test(month)) {
      repeat = parseInt(month, 10);
    }
    return {
      type: 'month',
      repeat,
      dayOfMonth: dom,
    };
  }
  // DAILY: repeat days like */2 or 1
  if (dow === '*' && month === '*' && dom !== '*') {
    let repeat = 1;
    if (dom.startsWith('*/')) {
      const parsed = parseInt(dom.slice(2), 10);
      repeat = Number.isNaN(parsed) ? 1 : parsed;
    } else if (/^\d+$/.test(dom)) {
      repeat = parseInt(dom, 10);
    }
    return {
      type: 'day',
      repeat,
    };
  }
  // Fallback default
  return {
    type: 'day',
    repeat: 1,
  };
}

export function getPowerOffDayInterval({ type, repeat, dayOfWeek, dayOfMonth, powerOffByDay }) {
  let powerOffDayOfWeek = dayOfWeek;
  let powerOffDayOfMonth = dayOfMonth;
  let powerOffRepeat = repeat;
  let errStr = '';
  if (powerOffByDay && powerOffByDay !== 'sameDay') {
    const offset = parseInt(powerOffByDay, 10);
    if (type === 'Days') {
      const por = repeat + offset;
      if (por > 30) {
        errStr = 'Since day computation crossing month, please select a monthly schedule.';
      }
      powerOffRepeat = por;
    }
    if (type === 'Week') {
      const indexOfDay = Object.entries(dayNameToIndex).reduce((acc, [k, v]) => {
        acc[v] = k;
        return acc;
      }, {});
      powerOffDayOfWeek = (Array.isArray(dayOfWeek) ? dayOfWeek : [dayOfWeek]).map((d) => {
        const shifted = (dayNameToIndex[d] + offset) % 7;
        return indexOfDay[shifted];
      });
    }
    if (type === 'Month' || type === 'Days') {
      const baseDay = parseInt(dayOfMonth || '1', 10);
      let newDay = baseDay + offset;
      if (newDay > 30) {
        newDay -= 30; // or: newDay %= 30
      }
      powerOffDayOfMonth = `${newDay}`;
    }
  }
  return {
    powerOffDayOfWeek,
    powerOffDayOfMonth,
    powerOffRepeat,
    errStr,
  };
}

export const defaultTimeZone = ({ dispatch }) => {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
  const defaultZone = { label: timeZone, value: timeZone };
  dispatch(valueChange(STORE_KEYS.UI_SCHEDULE_TIME_ZONE, defaultZone));
  return defaultZone;
};

export const showDayOfMonthField = (user) => {
  const occurrenceOption = getValue(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_OCCURRENCE_OPTION, user.values) || '';
  if (occurrenceOption === 'week' || occurrenceOption === 'day') {
    return false;
  }
  return true;
};

export const onOccurenceOptionChange = () => (dispatch) => {
  dispatch(valueChange(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_OCCURRENCE, 1));
};

export const getMinMaxForSchedulerOccurence = (user) => {
  const { values } = user;
  const occurenceOptionValue = getValue(STORE_KEYS.UI_NODE_UPDATE_SCHEDULER_OCCURRENCE_OPTION, values);
  switch (occurenceOptionValue) {
    case STATIC_KEYS.WEEK:
      return { min: 1, max: 4 };
    case STATIC_KEYS.MONTH:
      return { min: 1, max: 12 };
    case STATIC_KEYS.DAY:
      return { min: 1, max: 30 };
    default:
      break;
  }
};

export const toOrdinal = (n) => {
  const suffixes = ['st', 'nd', 'rd'];
  const v = n % 100;
  if (v >= 11 && v <= 13) return `${n}th`;
  return `${n}${suffixes[(v - 1) % 10] || 'th'}`;
};

export const formatTimeFromCron = (cron) => {
  const parts = cron.trim().split(' ');
  const minuteStr = parts[1];
  const hourStr = parts[2];

  const minute = parseInt(minuteStr, 10);
  const hour = parseInt(hourStr, 10);

  // If hour or minute is invalid (e.g., '*'), return 'Invalid time'
  if (Number.isNaN(hour) || Number.isNaN(minute)) return 'Invalid time';

  const date = new Date();
  date.setHours(hour);
  date.setMinutes(minute);
  date.setSeconds(0);

  return formatTime(date);
};
