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
          return (`${hour}h ${min}m ${sec}s`);
        }
        return (`${hour}h ${min}`);
      }
      return (`${hour}h`);
    }
    return (`${day}d`);
  }
  if (hour > 0) {
    if (min > 0) {
      if (sec > 0) {
        return (`${hour}h ${min}m ${sec}s`);
      }
      return (`${hour}h ${min}`);
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
