import { DASHBOARD_PATH } from '../constants/RouterConstants';

export function onInit(history) {
  const { location } = history;
  const { pathname } = location;
  if (!pathname || pathname === '/') {
    history.push(DASHBOARD_PATH);
  }
}
