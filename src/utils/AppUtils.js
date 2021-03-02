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
  const sec = (seconds % 60);
  if (day > 0) {
    return (day > 1 ? `${day}d ${hour}h ${min}m` : `${day}d`);
  }
  if (hour > 0) {
    return (hour > 1 ? `${hour}h ${min}m ${sec}s` : `${hour}h`);
  }
  if (min > 0) {
    return (min > 1 ? `${min}m ${sec}s` : `${min}m`);
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
