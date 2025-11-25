import React, { useEffect, useRef } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { Dispatch } from 'redux';
import { INITIAL_STATE, UserInterface } from '../../interfaces/interfaces';
import { UpgradeStepsInterface } from '../../interfaces/upgradeInterfaces';
import { MESSAGE_TYPES } from '../../Constants/MessageConstants';
import { UPGRADE_NODE_STATUS_TABLE } from '../../Constants/TableConstants';
import { STATIC_KEYS, TIMER } from '../../Constants/userConstants';
import { callAPI } from '../../utils/apiUtils';
import { getValue } from '../../utils/inputUtils';
import { hideApplicationLoader, showApplicationLoader, valueChange } from '../../store/actions';
import { addMessage } from '../../store/actions/MessageActions';
import { addUpgradeStep, fetchNodes, setCurrentUpgradeStep } from '../../store/actions/upgradeAction';
import ActionButton from '../../Components/Shared/ActionButton';
import StepStatus from '../../Components/Shared/StepStatus';
import Table from '../../Components/Table/Table';
import { API_GET_NODE_INSTALLATION_STATUS } from '../../Constants/apiConstants';

interface Props {
    noCard?: boolean;
    dispatch: Dispatch<any>;
    user: UserInterface;
    upgrade: {
        steps: UpgradeStepsInterface[];
        currentStep: number;
    };
}

const UpgradeInstallationStep: React.FC<Props> = (props) => {
    const { dispatch, user, upgrade } = props;
    const { steps, currentStep } = upgrade;
    const { values } = user;
    const timerId = useRef<number | null>(null);
    const installationStepFailed = getValue(STATIC_KEYS.UPGRADE_INSTALLATION_STEP_FAILED, values);

    useEffect(() => {
        getUpgradeStatusJobId();

        return () => {
            if (timerId.current !== null) {
                clearInterval(timerId.current);
            }

            dispatch(valueChange(STATIC_KEYS.UPGRADE_INSTALLATION_STEP_FAILED, false));
        };
    }, []);
    function getUpgradeStatusJobId() {
        dispatch(showApplicationLoader(API_GET_NODE_INSTALLATION_STATUS, 'Loading...'));
        return callAPI(API_GET_NODE_INSTALLATION_STATUS).then(
            (json) => {
                if (json.hasError) {
                    dispatch(hideApplicationLoader(API_GET_NODE_INSTALLATION_STATUS));
                    dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
                } else {
                    dispatch(hideApplicationLoader(API_GET_NODE_INSTALLATION_STATUS));
                    if (json.jobId !== '') {
                        getUpgradeInstallationStep(json.jobID, true);
                        timerId.current = window.setInterval(() => {
                            getUpgradeInstallationStep(json.jobID);
                        }, TIMER.TEN_SECONDS);
                    }
                }
            },
            (err) => {
                if (timerId.current) {
                    clearInterval(timerId.current);
                }
                dispatch(hideApplicationLoader(API_GET_NODE_INSTALLATION_STATUS));
                dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
            },
        );
    }
    function getUpgradeInstallationStep(id: string, showLoader?: boolean) {
        const { url } = steps[currentStep];
        if (typeof url !== 'undefined' && url !== '') {
            const urlWithId = url.replace('<id>', id);
            if (showLoader) dispatch(showApplicationLoader(url, 'Loading...'));
            return callAPI(urlWithId).then(
                (json) => {
                    dispatch(hideApplicationLoader(url));
                    if (json.hasError) {
                        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
                    } else {
                        dispatch(valueChange(STATIC_KEYS.UI_NODE_UPGRADE_INSTALLATION_STATUS, json));
                        if (timerId.current !== null && (json.status === 'completed' || json.status === 'failed')) {
                            if (json.status === 'completed') {
                                const upgArr = [...steps];
                                upgArr[currentStep].state = 'done';
                                upgArr[currentStep + 1].state = 'done';
                                dispatch(setCurrentUpgradeStep(currentStep + 1));
                                dispatch(addUpgradeStep(upgArr));
                                if (installationStepFailed) {
                                    dispatch(valueChange(STATIC_KEYS.UPGRADE_INSTALLATION_STEP_FAILED, false));
                                }
                                dispatch(fetchNodes(STATIC_KEYS.UI_FTECH_NODE_INFO));
                            } else {
                                dispatch(valueChange(STATIC_KEYS.UPGRADE_INSTALLATION_STEP_FAILED, true));
                                const st = [...steps];
                                st[currentStep].state = '';
                                let i = currentStep;
                                while (i >= 0) {
                                    st[i].stepIsDisabled = false;
                                    i--;
                                }
                                dispatch(addUpgradeStep(st));
                            }
                            clearInterval(timerId.current);
                        }
                    }
                },
                (err) => {
                    if (timerId.current) {
                        clearInterval(timerId.current);
                    }
                    dispatch(hideApplicationLoader(url));
                    dispatch(hideApplicationLoader('node_version'));
                    dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
                },
            );
        }
    }

    const installationData = getValue(STATIC_KEYS.UI_NODE_UPGRADE_INSTALLATION_STATUS, values);
    let parsedSteps = [];
    let parsedNodeInfo = [];
    if (installationData && installationData.steps) {
        parsedSteps = JSON.parse(installationData.steps);
        parsedNodeInfo = JSON.parse(installationData.applicableNodes);
    }

    const onCancelClick = () => {
        dispatch(setCurrentUpgradeStep(0));
        dispatch(addUpgradeStep([]));
        dispatch(valueChange(STATIC_KEYS.UI_UPGRADE_PAGE, ''));
    };

    return (
        <>
            <Row>
                <Col sm={6}>
                    <StepStatus steps={parsedSteps} {...props} maxHeight="400px" />
                </Col>
                <Col sm={6} style={{ fontSize: '0.8rem' }}>
                    <Table dispatch={dispatch} primaryKey="preview" user={user} data={parsedNodeInfo} columns={UPGRADE_NODE_STATUS_TABLE} isSelectable={false} />
                </Col>
            </Row>
            {installationStepFailed ? (
                <div className="mt-4 d-flex flex-row-reverse">
                    <div>
                        <ActionButton cssName="btn btn-secondary btn-sm p-2 pl-3 pr-3" label={`Close`} onClick={onCancelClick} />
                    </div>
                </div>
            ) : null}
        </>
    );
};

const mapStateToProps = (state: INITIAL_STATE) => {
    const { user } = state;
    return { user };
};

export default connect(mapStateToProps)(withTranslation()(UpgradeInstallationStep));
