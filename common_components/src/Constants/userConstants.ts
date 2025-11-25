import { Theme } from "../interfaces/interfaces";

export const APPLICATION_API_USER = 'APPLICATION_API_USER';
export const APPLICATION_UID = 'APPLICATION_UID';
export const APPLICATION_AUTHORIZATION = 'Authorization';
export const APPLICATION_GETTING_STARTED_COMPLETED = 'APPLICATION_GETTING_STARTED_COMPLETED';
export const API_MAX_RECORD_LIMIT = 2000;
export const APP_SET_TIMEOUT = 20;
export const DATA_GRID_SHORT_TEXT_LENGTH = 30;
export const API_LIMIT_HUNDRED = 100;

// upgrade cstep component constants
export const UPGRADE_DOWNLOAD_PACKAGE_STEP = 'UPGRADE_DOWNLOAD_PACKAGE_STEP';
export const UPGRADE_PREVIEW_STEP = 'UPGRADE_PREVIEW_STEP';
export const UPGRADE_INSTALLATION_STEP = 'UPGRADE_INSTALLATION_STEP';
export const UPGRADE_SUMMARY_STEP = 'UPGRADE_SUMMARY_STEP';
export const SERVICE_UP_TIME_RENDERE = 'SERVICE_UPTIME_RENDERE';

export const APPLICATION_THEME = 'APPLICATION_THEME';
export const STATIC_KEYS = {
    UI_PREVIEW_NODE_VERSION_INFO: 'ui.upgrade.preview.node.info',
    UI_NODE_UPGRADE_INSTALLATION_STATUS: 'ui.node.installation.status',
    UI_FTECH_NODE_INFO: 'ui.fetch.node.info',
    UI_FETCH_SITE_DETAILS: 'ui.site.details',
    UI_FETCH_DOWNLOAD_STATUS: 'ui.download.status',
    UI_SHOW_UPGRADE_STEP_FOOTER: 'ui.show.upgrade.footer',
    UI_UPGRADE_PAGE: 'ui.upgrade.page',
    UI_UPGRADE: 'ui.upgrade',
    UI_UPGRADE_HISTORY: 'ui.upgrade.history',
    UI_SELECTED_UPGRADE_HISTORY: 'ui.selected.upgrade.history',
    UI_REVERT_SHOW_SUMMARY: 'ui.revert.show.summary',
    UI_SELECTED_UPGRADE_HISTORY_LIST: 'ui.selected.upgrade.history.list',
    UI_UPGRADE_DETAILS_PAGE: 'ui.upgrade.details.page',
    UI_UPGRADE_CONCENT_TEXT: 'During upgrade, all the running replications will be stopped and will resume upon the completion of the upgrade',
    UI_REVERT_CONCENT_TEXT: 'During revert, all the running replications will be stopped and will resume upon the completion of the revert',
    UPGRADE_HISTORY_PREVIEW_NODE_INFO: 'ui.upgrade.history.preview.node.info',
    UPGRADE_INSTALLATION_STEP_FAILED: 'installation.step.failed',
    IS_UPGRADE: 'ui.isupgrade',
    UI_UPGRADE_CONCENT: 'upgrade.concent',
    UI_CURRENT_FLOW: 'current.flow',
    REVERT: 'revert',
    UPGRADE: 'upgrade',
    SHOW_ACTIVITIES: 'show.activities',
};

export const UPGRADE_SUMMARY_TAB = {
    ONE: '1',
    TWO: '2',
    THREE: '3',
};

export const TIMER = {
    FIFTEEN_GUNDRED: 1500,
};

export const PORTS = {
    FIVE_THOUSAND_FOUR: 5004,
};

export const COMPONENT_TYPES = ['DM-APPLICATION-UPGRADE'];

export const THEME_CONSTANTS: {
    POPOVER: Record<Theme, { color: string; bgColor: string }>;
    TABLE: Record<Theme, { sortingIcon : string} >
  } = {
    POPOVER: {
      light: {  color: '#fff', bgColor: '#000' },
      dark: { color: '#fff', bgColor: '#000' },
    },
    TABLE : {
      light: { sortingIcon : "#c3cbe4"},
      dark: { sortingIcon : "#c3cbe4"}
    }
  };
  