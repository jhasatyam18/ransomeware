import React, { useEffect, useRef, useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, CardTitle, Col, Container, Popover, PopoverBody, Row } from 'reactstrap';
import { Dispatch } from 'redux';
import { INITIAL_STATE, NodeInterface, NodeVersionData, UserInterface } from '../../interfaces/interfaces';
import { UpgradeStepsInterface } from '../../interfaces/upgradeInterfaces';
import { NODE_TYPES, NODES_VERSION_KEYS } from '../../Constants/InputConstants';
import { UPGRADE_STEP } from '../../Constants/upgradeConstant';
import { STATIC_KEYS } from '../../Constants/userConstants';
import { areAllNodeVersionsSame, deepCopy, hasRequestedPrivileges } from '../../utils/appUtils';
import { getValue } from '../../utils/inputUtils';
import { addUpgradeStep, fetchNodes, getDownloadUpgradeProgress } from '../../store/actions/upgradeAction';
import ActionButton from '../../Components/Shared/ActionButton';
import { valueChange } from '../../store/actions';
import ComponentRenderer from '../ComponentRenderer';
import UpgradeSteps from '../upgrade/UpgradeSteps';
import UpgradeHistory from './UpgradeHistory';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props extends WithTranslation {
    dispatch: Dispatch<any>;
    user: UserInterface;
    history?: any;
    upgrade: {
        steps: UpgradeStepsInterface[];
        currentStep: number;
    };
}

const UpgradePage: React.FC<Props> = (props) => {
    const { dispatch, t, upgrade, user } = props;
    const { values } = user;
    const { steps, currentStep } = upgrade;
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [popoverOpenPrep, setPopoverOpenPrep] = useState(false);
    const targetRef = useRef(null);
    const historyData = getValue(STATIC_KEYS.UI_SELECTED_UPGRADE_HISTORY_LIST, values);
    const showSummary = getValue('ui.revert.show.summary', values);
    const showUpgrade = getValue(STATIC_KEYS.UI_UPGRADE_PAGE, values);
    let mgmtCount = 0;
    let replCount = 0;
    let prepCount = 0;
    let mgmtNodeVersion = '';
    let replNodes: NodeVersionData[] = [];
    let prepNodes: NodeVersionData[] = [];

    useEffect(() => {
        dispatch(fetchNodes(STATIC_KEYS.UI_FTECH_NODE_INFO));
        dispatch(getDownloadUpgradeProgress());
    }, []);

    const node: NodeInterface[] = getValue(STATIC_KEYS.UI_FTECH_NODE_INFO, values) || [];

    if (node.length === 0) {
        return null;
    }
    node.forEach((element: NodeInterface) => {
        if (element.nodeType === NODE_TYPES.MANAGEMENT && element.isLocalNode) {
            mgmtCount += 1;
            mgmtNodeVersion = `${element.version}`;
        }
        if (element.nodeType === NODE_TYPES.Replication) {
            replCount += 1;
            replNodes.push({ name: element.name, version: element.version, status: element.status });
        }
        if (element.nodeType === NODE_TYPES.PrepNode) {
            prepCount += 1;
            prepNodes.push({ name: element.name, version: element.version, status: element.status });
        }
    });
    const onUpgradeClick = () => {
        dispatch(valueChange(STATIC_KEYS.UI_CURRENT_FLOW, 'upgrade'));
        dispatch(addUpgradeStep(deepCopy(UPGRADE_STEP)));
        dispatch(valueChange(STATIC_KEYS.UI_UPGRADE_PAGE, STATIC_KEYS.UI_UPGRADE));
        dispatch(valueChange(STATIC_KEYS.IS_UPGRADE, true));
    };

    const renderNodeVersion = (nodeData: NodeVersionData[], key: any) => {
        if (nodeData.length === 0) {
            return <Col sm={3} />;
        }
        if (nodeData.length === 1) {
            return <Col sm={3}>{nodeData[0].version}</Col>;
        }
        if (areAllNodeVersionsSame(nodeData) && nodeData[0].version === mgmtNodeVersion) {
            return <Col sm={3}>{mgmtNodeVersion}</Col>;
        }
        return (
            <Col sm={3}>
                <FontAwesomeIcon ref={targetRef} id={key} key={key} className="text-warning" size="xl" icon={faTriangleExclamation} onMouseEnter={key === NODES_VERSION_KEYS.REPL_NODE ? () => setPopoverOpen(true) : () => setPopoverOpenPrep(true)} onMouseLeave={key === NODES_VERSION_KEYS.REPL_NODE ? () => setPopoverOpen(false) : () => setPopoverOpenPrep(false)} />
                <Popover placement="bottom" isOpen={key === NODES_VERSION_KEYS.REPL_NODE ? popoverOpen : popoverOpenPrep} target={targetRef} style={{ backgroundColor: '#222736', minWidth: '300px' }}>
                    <PopoverBody>
                        <table>
                            <thead>
                                <tr>
                                    <th className="p-1">{t('Name')}</th>
                                    <th className="p-1">{t('Version')}</th>
                                    <th className="p-1">{t('Status')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nodeData.map((f) => (
                                    <tr key={`row-${f.name}`}>
                                        <td className="pr-3">{f.name}</td>
                                        <td className="pr-3">{f.version}</td>
                                        <td className="">{f.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </PopoverBody>
                </Popover>
            </Col>
        );
    };

    const renderNodeInfo = () => {
        return (
            <Row className="margin-left-5">
                <Col sm={5}>
                    <Row className="mb-3">
                        <Col sm={7}>{t('mgmtnode')}</Col>
                        <Col sm={2}>{mgmtCount}</Col>
                        <Col sm={3}>{mgmtNodeVersion}</Col>
                    </Row>
                    <Row className="mb-3">
                        <Col sm={7}>{t('replNode')}</Col>
                        <Col sm={2}>{replCount}</Col>
                        {renderNodeVersion(replNodes, NODES_VERSION_KEYS.REPL_NODE)}
                    </Row>
                    <Row className="mb-3">
                        <Col sm={7}>{t('prepnode')}</Col>
                        <Col sm={2}>{prepCount}</Col>
                        {renderNodeVersion(prepNodes, NODES_VERSION_KEYS.PREP_NODE)}
                    </Row>
                </Col>
                <Col sm={3} className="mr-5">
                    <div className="stack__info">
                        <div className="line" />
                    </div>
                </Col>
                <Col sm={3} className="d-flex flex-row-reverse mt-3">
                    <div>
                        <ActionButton isDisabled={!hasRequestedPrivileges(user, ['upgrade.start']) || steps.length !== 0} onClick={onUpgradeClick} cssName={`btn btn-xl btn-success ml-5`} label="Upgrade" />
                    </div>
                </Col>
            </Row>
        );
    };

    const renderUpgrade = () => {
        const flow = getValue(STATIC_KEYS.UI_CURRENT_FLOW, values);
        return steps.length > 0 ? (
            <Card>
                <CardBody>
                    <CardTitle className="mb-4 title-color">
                        {flow === STATIC_KEYS.REVERT ? t('Revert') : t('Upgrade')}
                        &nbsp;&nbsp;
                    </CardTitle>
                    <UpgradeSteps steps={steps} currentStep={currentStep} />
                    <div className="padding-20">
                        <ComponentRenderer {...steps[currentStep]} />
                    </div>
                </CardBody>
            </Card>
        ) : null;
    };
    const flowRenderer = () => {
        switch (showUpgrade) {
            case STATIC_KEYS.UI_UPGRADE:
                return renderUpgrade();
            default:
                return <UpgradeHistory user={user} historyData={historyData} showSummary={showSummary} dispatch={dispatch} />;
        }
    };

    return (
        <>
            <Container fluid>
                {!showSummary ? (
                    <Card>
                        <CardBody>
                            <Row>
                                <Col sm={8}>
                                    <CardTitle className="mb-4 title-color">
                                        {t('Status')}
                                        &nbsp;&nbsp;
                                    </CardTitle>
                                </Col>
                            </Row>
                            {renderNodeInfo()}
                        </CardBody>
                    </Card>
                ) : null}
                {flowRenderer()}
            </Container>
        </>
    );
};

function mapStateToProps(state: INITIAL_STATE) {
    const { user, upgrade } = state;
    return {
        user,
        upgrade,
    };
}
export default connect(mapStateToProps)(withTranslation()(UpgradePage));
