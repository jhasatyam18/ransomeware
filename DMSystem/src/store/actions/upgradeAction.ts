import { Dispatch } from 'redux';
import * as Types from '../../Constants/actionTypes';
import { API_CLEAR_UPGRADE, API_GET_HISTORY, API_GET_NODE_VERSION_INFO, API_GET_UPGRADE_DOWNLOAD, API_NODES, API_UPGRADE } from '../../Constants/apiConstants';
import { MESSAGE_TYPES } from '../../Constants/MessageConstants';
import { UPGRADE_REVERT, UPGRADE_STEP } from '../../Constants/upgradeConstant';
import { STATIC_KEYS } from '../../Constants/userConstants';
import { INITIAL_STATE, UpgradeInstallationStatus, UserInterface } from '../../interfaces/interfaces';
import { UpgradeStepsInterface } from '../../interfaces/upgradeInterfaces';
import { API_TYPES, callAPI, createPayload } from '../../utils/apiUtils';
import { deepCopy } from '../../utils/appUtils';
import { getValue } from '../../utils/inputUtils';
import { addMessage } from './MessageActions';
import { clearValues, hideApplicationLoader, showApplicationLoader, valueChange } from './UserActions';

export function addUpgradeStep(steps: UpgradeStepsInterface[] | []) {
    return {
        type: Types.SET_UPGRADE_STEPS,
        steps,
    };
}

export function setCurrentUpgradeStep(currentStep: number | null | undefined) {
    return {
        type: Types.SET_CURRENT_UPGRADE_STEP,
        currentStep,
    };
}

export function setUpgradeCurrentStep(currentStep: number | null | undefined, currentObj: UpgradeStepsInterface) {
    return {
        type: Types.UPDATE_UPGRADE_STEPS_DATA,
        stepInd: currentStep,
        stepObj: currentObj,
    };
}

export function getNodeVersionInfo() {
    return (dispatch: Dispatch<any>) => {
        dispatch(showApplicationLoader('node_version', 'Loading node version info'));
        return callAPI(API_GET_NODE_VERSION_INFO).then(
            (json) => {
                dispatch(hideApplicationLoader('node_version'));
                if (json.hasError) {
                    dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
                } else {
                    dispatch(valueChange(STATIC_KEYS.UI_PREVIEW_NODE_VERSION_INFO, json));
                }
            },
            (err) => {
                dispatch(hideApplicationLoader('node_version'));
                dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
            },
        );
    };
}

export function fetchNodes(key: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch(showApplicationLoader(API_NODES, 'Loading nodes ...'));
        return callAPI(API_NODES).then(
            (json) => {
                dispatch(hideApplicationLoader(API_NODES));
                if (json.hasError) {
                    dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
                } else {
                    if (key) {
                        dispatch(valueChange(key, json));
                    }
                }
            },
            (err) => {
                dispatch(hideApplicationLoader(API_NODES));
                dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
            },
        );
    };
}

export function UpgradeNode(action: string | undefined) {
    return (dispatch: Dispatch<any>, getState: () => INITIAL_STATE) => {
        const { user } = getState();
        const { values } = user;
        const upgradeInstallationStatus: UpgradeInstallationStatus = getValue(STATIC_KEYS.UI_NODE_UPGRADE_INSTALLATION_STATUS, values) || '';
        if (upgradeInstallationStatus?.status !== 'completed') {
            const { user } = getState();
            const { values } = user;
            const nodeInfo = getValue(STATIC_KEYS.UI_PREVIEW_NODE_VERSION_INFO, values);
            const obj = createPayload(API_TYPES.POST, {
                upgradeBundleName: nodeInfo.name,
                action: action || 'init-upgrade',
            });
            dispatch(showApplicationLoader('UPGRADING', `${action ? 'Reverting' : 'Upgrading'}`));
            return callAPI(API_UPGRADE, obj).then(
                (json) => {
                    dispatch(hideApplicationLoader('UPGRADING'));
                    if (json.hasError) {
                        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
                        return;
                    }
                    dispatch(goToNextStep());
                },
                (err) => {
                    dispatch(hideApplicationLoader('UPGRADING'));
                    dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
                    return;
                },
            );
        }
    };
}

export function goToNextStep() {
    return (dispatch: Dispatch<any>, getState: () => INITIAL_STATE) => {
        const { upgrade } = getState();
        const { steps, currentStep } = upgrade;
        const updeteStep = steps[currentStep];
        updeteStep.state = 'done';
        dispatch(setCurrentUpgradeStep(currentStep + 1));
        dispatch(setUpgradeCurrentStep(currentStep, updeteStep));
    };
}

export function moveToPreviousStep(filename: string) {
    return (dispatch: Dispatch<any>, getState: () => INITIAL_STATE) => {
        const { upgrade } = getState();
        const { steps, currentStep } = upgrade;
        if (currentStep - 1 < 0) {
            dispatch(setCurrentUpgradeStep(0));
            dispatch(addUpgradeStep([]));
            dispatch(valueChange(STATIC_KEYS.UI_UPGRADE_PAGE, ''));
        } else {
            const upgArr = [...steps];
            upgArr[currentStep - 1].state = '';
            dispatch(setCurrentUpgradeStep(currentStep - 1));
            dispatch(addUpgradeStep(upgArr));
            dispatch(clearUpgrade(filename));
        }
    };
}

export function revert() {
    return (dispatch: Dispatch<any>) => {
        const obj = createPayload(API_TYPES.POST, { action: 'init-revert', filename: '' });
        dispatch(showApplicationLoader('reverting', 'Reverting'));
        return callAPI(API_UPGRADE, obj).then(
            (json) => {
                dispatch(hideApplicationLoader('reverting'));
                if (json.hasError) {
                    dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
                }
            },
            (err) => {
                dispatch(hideApplicationLoader('reverting'));
                dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
            },
        );
    };
}

export function getUpgradeHistory() {
    return (dispatch: Dispatch<any>) => {
        dispatch(showApplicationLoader('load_history', 'Loading History...'));
        return callAPI(`${API_GET_HISTORY}`).then(
            (json) => {
                dispatch(hideApplicationLoader('load_history'));
                if (json.hasError) {
                    dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
                } else {
                    dispatch(valueChange(STATIC_KEYS.UI_SELECTED_UPGRADE_HISTORY_LIST, json));
                }
            },
            (err) => {
                dispatch(hideApplicationLoader('load_history'));
                dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
            },
        );
    };
}

export function getDownloadUpgradeProgress() {
    return (dispatch: Dispatch<any>) => {
        dispatch(showApplicationLoader('fetch_download_package_Data', 'Loading dowloading status'));
        return callAPI(API_GET_UPGRADE_DOWNLOAD).then(
            (json) => {
                dispatch(hideApplicationLoader('fetch_download_package_Data'));
                if (json.hasError) {
                    dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
                } else {
                    if (json.jobType === 'init-upgrade') {
                        if (json.jobStatus === 'running') {
                            const arr = deepCopy(UPGRADE_STEP);
                            arr[0].state = 'done';
                            arr[1].state = 'done';
                            dispatch(addUpgradeStep(arr));
                            dispatch(setCurrentUpgradeStep(2));
                            dispatch(valueChange(STATIC_KEYS.UI_UPGRADE_PAGE, STATIC_KEYS.UI_UPGRADE));
                        }
                    } else if (json.jobType === 'init-revert' && json.jobStatus === 'running') {
                        dispatch(valueChange(STATIC_KEYS.UI_UPGRADE_PAGE, STATIC_KEYS.UI_UPGRADE));
                        const arr = deepCopy(UPGRADE_REVERT);
                        arr[0].state = 'done';
                        dispatch(addUpgradeStep(arr));
                        dispatch(setCurrentUpgradeStep(1));
                        dispatch(valueChange(STATIC_KEYS.UI_UPGRADE_PAGE, STATIC_KEYS.UI_UPGRADE));
                    }
                }
            },
            (err: any) => {
                dispatch(hideApplicationLoader('fetch_download_package_Data'));
                dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
            },
        );
    };
}

export function isUpgradeEnabled(user: UserInterface) {
    const { values } = user;
    const concent = getValue(STATIC_KEYS.UI_UPGRADE_CONCENT, values);
    return !concent;
}

export function onActionClick() {
    return async (dispatch: Dispatch<any>, getState: () => INITIAL_STATE) => {
        const { upgrade } = getState();
        const { steps, currentStep } = upgrade;
        const { isAsync, postAction } = steps[currentStep];
        if (isAsync) {
            if (typeof postAction !== 'undefined') {
                try {
                    await dispatch(postAction());
                    return;
                } catch (err: any) {
                    dispatch(clearValues());
                    dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
                    return;
                }
            }
        } else if (typeof postAction === 'function') {
            dispatch(postAction());
        }
        dispatch(goToNextStep());
    };
}

export function clearUpgrade(name: string) {
    return (dispatch: Dispatch<any>) => {
        dispatch(showApplicationLoader('fetch_download_package_Data', ''));
        const url = API_CLEAR_UPGRADE.replace('filename', name);
        const obj = createPayload(API_TYPES.DELETE, {});
        return callAPI(url, obj).then(
            (json) => {
                dispatch(hideApplicationLoader('fetch_download_package_Data'));
                if (json.hasError) {
                    dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
                } else {
                    dispatch(setCurrentUpgradeStep(0));
                    dispatch(addUpgradeStep(UPGRADE_STEP));
                }
            },
            (err: any) => {
                dispatch(hideApplicationLoader('fetch_download_package_Data'));
                dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
            },
        );
    };
}
