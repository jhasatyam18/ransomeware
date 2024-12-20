import { DASHBOARD_PATH } from '../Constants/routeConstants';

export function onInit(history: any) {
    const { location } = history;
    const { pathname } = location;
    if (!pathname || pathname === '/') {
        history.push(DASHBOARD_PATH);
    }
}
