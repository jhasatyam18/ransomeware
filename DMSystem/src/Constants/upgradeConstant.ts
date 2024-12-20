import { UserInterface } from '../interfaces/interfaces';
import { UpgradeStepsInterface } from '../interfaces/upgradeInterfaces';
import { isUpgradeEnabled, UpgradeNode } from '../store/actions/upgradeAction';
import { API_GET_NODE_INSTALLATION_STATUS, API_GET_NODE_INSTALLATION_STATUS_REVERT } from './apiConstants';
import { STATIC_KEYS, UPGRADE_DOWNLOAD_PACKAGE_STEP, UPGRADE_INSTALLATION_STEP, UPGRADE_PREVIEW_STEP, UPGRADE_SUMMARY_STEP } from './userConstants';

export const UPGRADE_STEP: UpgradeStepsInterface[] = [
    {
        label: 'Upload Package',
        component: UPGRADE_DOWNLOAD_PACKAGE_STEP,
        state: '',
        stepIsDisabled: true,
        backLabel: 'Close',
        doNotShoNextLabel: true,
    },
    {
        label: 'Preview',
        component: UPGRADE_PREVIEW_STEP,
        state: '',
        stepIsDisabled: true,
        disableNext: (user: UserInterface) => isUpgradeEnabled(user),
        nextLabel: 'Upgrade',
        isAsync: true,
        postAction: () => UpgradeNode(undefined),
        propsData: { concent: STATIC_KEYS.UI_UPGRADE_CONCENT_TEXT, showSummary: true },
    },
    {
        label: 'Install',
        component: UPGRADE_INSTALLATION_STEP,
        state: '',
        stepIsDisabled: true,
        disableNext: true,
        url: API_GET_NODE_INSTALLATION_STATUS,
    },
    {
        label: 'Summary',
        component: UPGRADE_SUMMARY_STEP,
        state: '',
        stepIsDisabled: true,
        doNotShoNextLabel: true,
        propsData: { successText: 'Upgrade completed successfully on the following nodes' },
    },
];

export const UPGRADE_REVERT: UpgradeStepsInterface[] = [
    {
        label: 'Preview',
        component: UPGRADE_PREVIEW_STEP,
        state: '',
        stepIsDisabled: true,
        backLabel: 'Close',
        nextLabel: 'Revert',
        disableNext: (user: UserInterface) => isUpgradeEnabled(user),
        url: API_GET_NODE_INSTALLATION_STATUS_REVERT,
        isAsync: true,
        postAction: () => UpgradeNode('init-revert'),
        propsData: { concent: STATIC_KEYS.UI_REVERT_CONCENT_TEXT, showSummary: false },
    },
    {
        label: 'Install',
        component: UPGRADE_INSTALLATION_STEP,
        state: '',
        stepIsDisabled: true,
        disableNext: true,
        url: API_GET_NODE_INSTALLATION_STATUS_REVERT,
        doNotShoNextLabel: false,
    },
    {
        label: 'Summary',
        component: UPGRADE_SUMMARY_STEP,
        state: '',
        stepIsDisabled: true,
        propsData: { successText: 'Revert completed successfully on the following nodes' },
    },
];
