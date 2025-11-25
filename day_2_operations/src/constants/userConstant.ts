import { Theme } from '../interfaces/interface';

export const APPLICATION_API_USER = 'APPLICATION_API_USER';
export const APPLICATION_UID = 'APPLICATION_UID';
export const APPLICATION_AUTHORIZATION = 'Authorization';
export const APPLICATION_GETTING_STARTED_COMPLETED = 'APPLICATION_GETTING_STARTED_COMPLETED';
export const APPLICATION_THEME = 'APPLICATION_THEME';
export const THEME_CONSTANT: {
    LIGHT: Theme;
    DARK: Theme;
    SIDEBAR_MENU_ACTIVE: Record<Theme, string>;
    CUSTOM_DURATION: Record<Theme, string>;
    GRAPH_TOOLTIP_HR: Record<Theme, string>;
    BANDWIDTH: {
        XAXIS: Record<Theme, string>;
    };
    DASHBOARD_CHARTS: {
        XAXIS: Record<Theme, string>;
    };
} = {
    LIGHT: 'light',
    DARK: 'dark',
    SIDEBAR_MENU_ACTIVE: {
        dark: '#fff',
        light: '#000',
    },
    BANDWIDTH: {
        XAXIS: {
            dark: '#fff',
            light: '#000',
        },
    },
    DASHBOARD_CHARTS: {
        XAXIS: {
            dark: '#fff',
            light: '#454545',
        },
    },
    CUSTOM_DURATION: {
        dark: '#222736',
        light: '#fff',
    },
    GRAPH_TOOLTIP_HR: {
        dark: 'rgba(255, 255, 255, 0.2)',
        light: 'rgba(15, 14, 14, 0.2)',
    },
};

export const SAML = {
    DEFAULT_USERNAME: 'SAML',
    DEFAULT_USER_ID: 0,
};

export const API_MAX_RECORD_LIMIT = 2000;
export const THEME = {
    primaryColor: '#2a3042',
    primaryColorHover: '#2a3042',
};

export const EXPANDED_PAGES = {
    REPLICATION: 'REPLICATION',
    RECOVERY: 'RECOVERY',
};

export const MESSAGE_TYPES = {
    INFO: 'INFO',
    ERROR: 'ERROR',
    WARNING: 'WORNING',
    SUCCESS: 'SUCCESS',
};

export const EXCLUDE_MESSAGES = ['Unauthorized: session expired'];

export const MILI_SECONDS_TIME = {
    TWENTY_THOUSAND: 20000,
};

export const FIELD_TYPE = {
    CHECKBOX: 'CHECKBOX',
    TEXT: 'TEXT',
    SELECT: 'SELECT',
    SELECT_SEARCH: 'SELECT_SEARCH',
    NUMBER: 'NUMBER',
    PASSWORD: 'PASSWORD',
    CUSTOM: 'CUSTOM',
    RADIO: 'RADIO',
    RANGE: 'RANGE',
    TREE: 'TREE',
    STATICTEXT: 'STATICTEXT',
    TEXTLABEL: 'TEXTLABEL',
};

export const DETAILED_STEP_COMPONENTS = {
    PENDING_STATUS_STEPS: 'Validating Instance Status from CSP',
};

export const JOB_COMPLETION_STATUS = 'completed';
export const JOB_RUNNING_STATUS = 'started';
export const JOB_IN_PROGRESS = 'running';
export const JOB_FAILED = 'failed';
export const MIGRATION_INIT_FAILED = 'migration_init_failed';
export const AUTO_MIGRATION_FAILED = 'auto_migration_failed';
export const JOB_STOPPED = 'stopped';
export const JOB_IN_SYNC = 'in-sync';
export const JOB_EXCEEDED_INTERVAL = 'exceeded-interval';
export const JOB_RECOVERED = 'recovered';
export const JOB_COMPLETED_WITH_ERRORS = 'completed with errors';
export const JOB_INIT_FAILED = 'init-failed';
export const JOB_INIT_SUCCESS = 'init-success';
export const JOB_INIT_PROGRESS = 'init-in-progress';
export const JOB_INIT_SYNC_PROGRESS = 'init-sync-in-progress';
export const JOB_RESYNC_IN_PROGRESS = 'resync-in-progress';
export const JOB_RESYNC_FAILED = 'resync-failed';
export const JOB_RESYNC_SUCCESS = 'resync-success';
export const JOB_SYNC_IN_PROGRESS = 'sync-in-progress';
export const JOB_SYNC_FAILED = 'sync-failed';
export const NODE_STATUS_ONLINE = 'online';
export const NODE_STATUS_OFFLINE = 'offline';
export const JOB_INIT_SYNC_FAILED = 'init-sync-failed';
export const JOB_MIGRATED = 'migrated';
export const STATUS_STARTED = 'Started';
export const PARTIALLY_COMPLETED = 'partially-completed';
export const JOB_QUEUED = 'queued';
export const PENDING_STATUS_STEP = 'Validating Instance Status from CSP';
export const PENDING_STATUS = 'pending-csp-verification';
export const VALIDATING = 'fetching latest status';
export const PASS = 'Pass';

export const REFRESH_RECOVERY_TYPE_FILTER = {
    TEST_RECOVERY: 'test recovery',
    RECOVERY: 'full recovery,migration',
};

export const RECOVERY_STEPS = {
    VALIDATION_INSTANCE_FOR_RECOVERY: 'Validating Instance for recovery',
};

export const MODAL_CONFIGURE_NEW_SITE = 'MODAL_CONFIGURE_NEW_SITE';
export const MODAL_CONFIRMATION_WARNING = 'MODAL_CONFIRMATION_WARNINGp';
export const MODAL_ABOUT = 'MODAL_ABOUT';
export const MODAL_ALERT_DETAILS = 'MODAL_ALERT_DETAILS';
export const MODAL_GENERATE_SUPPORT_BUNDLE = 'MODAL_GENERATE_SUPPORT_BUNDLE';
export const MODAL_NODE_CONFIGURATION = 'MODAL_NODE_CONFIGURATION';
export const MODAL_EMAIL_CONFIGURATION = 'MODAL_EMAIL_CONFIGURATION';
export const MODAL_EMAIL_RECIPIENTS_CONFIGURATION = 'MODAL_EMAIL_RECIPIENTS_CONFIGURATION';
export const MODAL_SHOW_ENCRYPTION_KEY = 'MODAL_SHOW_ENCRYPTION_KEY';
export const MODAL_NETWORK_CONFIG = 'MODAL_NETWORK_CONFIG';
export const MODAL_INSTALL_NEW_LICENSE = 'MODAL_INSTALL_NEW_LICENSE';
export const MODAL_BANDWIDTH_CONFIGURATION = 'MODAL_BANDWIDTH_CONFIGURATION';
export const MODAL_USER_SCRIPT = 'MODAL_USER_SCRIPT';
export const MODAL_LOCATION_CONFIG = 'MODAL_LOCATION_CONFIG';
export const MODAL_SUMMARY = 'MODAL_SUMMARY';
export const MODAL_NODE_PASSWORD_CHANGE = 'MODAL_NODE_PASSWORD_CHANGE';
export const MODAL_SHOW_RESETED_VMS = 'MODAL_SHOW_RESETED_VMS';
export const MODAL_PLAYBOOK_DOWNLOAD = 'MODAL_PLAYBOOK_DOWNLOAD';
export const MODAL_PLAYBOOK_UPLOAD = 'MODAL_PLAYBOOK_UPLOAD';
export const MODAL_TEMPLATE_ERROR = 'MODAL_TEMPLATE_ERROR';
export const MODAL_TEMPLATE_SHOW_PPLAN_CHANGES = 'MODAL_TEMPLATE_SHOW_PPLAN_CHANGES';
export const MODAL_REPLICATION_PRIORITY = 'MODAL_REPLICATION_PRIORITY';
export const MODAL_PRESERVE_CHECKPOINT = 'MODAL_PRESERVE_CHECKPOINT';
// MODAL RENDERERS
export const PPLAN_REMOVE_CHECKPOINT_RENDERER = 'PPLAN_REMOVE_CHECKPOINTS_RENDERER';
export const MODAL_DELETE_VM_CONFIRMATON = 'MODAL_DELETE_VM_CONFIRMATON';
export const MODAL_ADD_NEW_USER = 'MODAL_ADD_NEW_USER';
export const MODAL_CHANGE_PASSWORD = 'MODAL_CHANGE_PASSWORD';
export const MODAL_RESET_CREDENTIALS = 'MODAL_RESET_CREDENTIALS';
export const MODAL_RECONFIGURE_PLAYBOOK = 'MODAL_RECONFIGURE_PLAYBOOK';
export const MODAL_CBT_CONFIRMATION = 'MODAL_CBT_CONFIRMATION';
export const MODAL_APPLY_CREDENTIALS = 'MODAL_APPLY_CREDENTIALS';
export const MODAL_TROUBLESHOOTING_WINDOW = 'MODAL_TROUBLESHOOTING_WINDOW';
export const MODAL_VMWARE_QUIESCE = 'MODAL_VMWARE_QUIESCE';
export const MODAL_RESET_DISK_REPLICATION = 'MODAL_RESET_DISK_REPLICATION';
export const MODAL_REVERSE_CHANGES_WARNING = 'MODAL_REVERSE_CHANGES_WARNING';
export const MODAL_REFRESH_RECOVERY_STATUS = 'MODAL_REFRESH_RECOVERY_STATUS';
export const INFORMATION_MODAL = 'INFORMATION_MODAL';

export const PLATFORM_TYPES = {
    VMware: 'VMware',
    GCP: 'GCP',
    AWS: 'AWS',
    Azure: 'Azure',
};

export const COPY_CONFIG = {
    GENERAL_CONFIG: 'copy_gen_config',
    NETWORK_CONFIG: 'copy_net_config',
    REP_SCRIPT_CONFIG: 'copy_rep_script_config',
    REC_SCRIPT_CONFIG: 'copy_rec_script_config',
    ALL: 'ALL',
};

export const APP_TYPE = {
    CLIENT: 'CLIENT',
    SERVER: 'SERVER',
};
