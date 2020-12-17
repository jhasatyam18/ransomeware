const KEY_NAME = 'datamotive';
let startValue = 1;
export function getAppKey() {
  startValue += 1;
  if (startValue > 100000) {
    startValue = 1;
  }
  return `${KEY_NAME}-${startValue}`;
}
