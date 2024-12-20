import { CHANGE_SIDEBAR_TYPE } from '../../Constants/actionTypes';
import { MESSAGE_TYPES } from '../../Constants/MessageConstants';
import { addMessage } from './MessageActions';
export * from '../actions/UserActions';

export function updateSitebarType(sidebarType: string, isMobile: boolean) {
    return {
        type: CHANGE_SIDEBAR_TYPE,
        sidebarType,
        isMobile,
    };
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

export function changeLeftSidebarType(sidebarType: string, isMobile: boolean) {
    return (dispatch: any) => {
        try {
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
        } catch (err) {
            let errorMessage: string;
            if (err instanceof Error) {
                errorMessage = err.message;
            } else {
                errorMessage = String(err);
            }
            dispatch(addMessage(errorMessage, MESSAGE_TYPES.ERROR));
        }
    };
}

function changeBodyAttribute(attribute: string, value: string) {
    if (document.body) document.body.setAttribute(attribute, value);
    return true;
}
