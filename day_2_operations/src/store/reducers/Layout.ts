// @flow
// import {
//     CHANGE_SIDEBAR_TYPE,
//   } from '../../constants/actionTypes';

const INIT_STATE = {
    layoutType: 'vertical',
    layoutWidth: 'fluid',
    leftSideBarTheme: 'dark',
    leftSideBarType: 'default',
    topbarTheme: 'light',
    isPreloader: false,
    showRightSidebar: false,
    isMobile: false,
};

const layout = (state = INIT_STATE, action: any) => {
    switch (action.type) {
        case 'CHANGE_SIDEBAR_TYPE':
            return {
                ...state,
                leftSideBarType: action.sidebarType,
            };
        default:
            return state;
    }
};

export default layout;
