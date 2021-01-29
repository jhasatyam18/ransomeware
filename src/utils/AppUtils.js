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
  const min = Math.ceil(seconds % 3600 / 60);
  const sec = Math.ceil(seconds % 60);
  if (day > 0) {
    return (day > 1 ? `${day} Days` : `${day} Day`);
  }
  if (hour > 0) {
    return (hour > 1 ? ` ${hour} Hours` : `${hour} Hour`);
  }
  if (min > 0) {
    return (min > 1 ? ` ${min} Minutes` : `${min} Minute`);
  }
  if (sec > 0) {
    return ` ${sec} Seconds`;
  }
  return '-';
}
