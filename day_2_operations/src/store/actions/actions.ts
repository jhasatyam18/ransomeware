// import { useNavigate } from "react-router-dom";
import { API_LICENSE } from '../../constants/ApiUrlConstant';
import { STATIC_KEYS } from '../../constants/StoreKey';
import { MESSAGE_TYPES } from '../../constants/userConstant';
import { callAPI } from '../../utils/apiUtils';
import { setLicenses } from '../reducers/licenseReducer';
import { addMessage } from '../reducers/messageReducer';
import { valueChange } from '../reducers/userReducer';

export function updateSitebarType(sidebarType: string, isMobile: boolean) {
    return {
        type: 'CHANGE_SIDEBAR_TYPE',
        sidebarType,
        isMobile,
    };
}
export function changeLeftSidebarType(sidebarType: string, isMobile: boolean) {
    return (dispatch: any) => {
        switch (sidebarType) {
            case 'compact':
                changeBodyAttribute('data-sidebar-size', 'small');
                manageBodyClass('sidebar-enable', 'remove');
                manageBodyClass('vertical-collpsed', 'remove');
                break;
            case 'icon':
                changeBodyAttribute('data-keep-enlarged', 'true');
                manageBodyClass('vertical-collpsed', 'add');
                break;
            case 'condensed':
                manageBodyClass('sidebar-enable', 'add');
                if (!isMobile) manageBodyClass('vertical-collpsed', 'add');
                break;
            default:
                changeBodyAttribute('data-sidebar-size', '');
                manageBodyClass('sidebar-enable', 'remove');
                if (!isMobile) manageBodyClass('vertical-collpsed', 'remove');
        }
        dispatch(updateSitebarType(sidebarType, isMobile));
    };
}
function changeBodyAttribute(attribute: string, value: string) {
    if (document.body) document.body.setAttribute(attribute, value);
    return true;
}
function manageBodyClass(cssClass: string, action = 'toggle') {
    switch (action) {
        case 'add':
            if (document.body) document.body.classList.add(cssClass);
            break;
        case 'remove':
            if (document.body) document.body.classList.remove(cssClass);
            break;
        default:
            if (document.body) document.body.classList.toggle(cssClass);
            break;
    }

    return true;
}

export const onReplicationBarChartClick = (dispatch: any, siteName: string) => {
    dispatch(valueChange([STATIC_KEYS.GLOBAL_SITE_KEY, siteName]));
};

export const fetchLicenses = (siteId: string) => {
    return async (dispatch: any) => {
        const url = siteId && siteId.length > 1 ? `${API_LICENSE}?siteID=${siteId}` : API_LICENSE;
        try {
            const json = await callAPI(url);
            if (!json) {
                dispatch(setLicenses([]));
            } else if (json.hasError) {
                dispatch(addMessage({ message: json.message, messageType: MESSAGE_TYPES.ERROR }));
            } else {
                dispatch(setLicenses(json || []));
                const messages: string[] = [];
                json.forEach((item: any) => {
                    if (item.warningMsg && item.warningMsg.trim() !== '') {
                        messages.push(`${item.siteName}: ${item.warningMsg}`);
                    }
                });
                if (messages.length > 0) {
                    dispatch(addMessage({ message: messages.join('\n'), messageType: MESSAGE_TYPES.WARNING }));
                }
            }
        } catch (err: any) {
            dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
        }
    };
};

export function filterNodeHealthData(data: any[] = []) {
    if (!Array.isArray(data)) return [];
    return data.filter((r) => {
        const { entitiesBreached = 0, entitiesMeets = 0, entitiesPartial = 0 } = r || {};
        return !(entitiesBreached === 0 && entitiesMeets === 0 && entitiesPartial === 0);
    });
}
