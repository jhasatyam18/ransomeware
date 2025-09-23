import React, { useEffect } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { Dispatch } from 'redux';
import { NodeInterface, UserInterface } from '../../interfaces/interfaces';
import { UpgradeStepsInterface } from '../../interfaces/upgradeInterfaces';
import { compareVersions } from '../../utils/appUtils';
import { getValue } from '../../utils/inputUtils';
import { UPGRADED_NODE_DETAILS, UPGRADE_ASSOCIATED_SITE_tABLE } from '../../Constants/TableConstants';
import { STATIC_KEYS } from '../../Constants/userConstants';
import { clearValues, refresh, valueChange } from '../../store/actions';
import { addUpgradeStep, setCurrentUpgradeStep } from '../../store/actions/upgradeAction';
import ActionButton from '../../Components/Shared/ActionButton';
import Table from '../../Components/Table/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';

interface Props extends WithTranslation {
    dispatch: Dispatch<any>;
    user: UserInterface;
    upgrade: {
        steps: UpgradeStepsInterface[];
        currentStep: number;
    };
}

const UpgradeSummary: React.FC<Props> = ({ dispatch, user, upgrade, t }) => {
    const { values } = user;
    const { steps, currentStep } = upgrade;
    const step = steps[currentStep];
    const { propsData } = step;
    const isUpgradeFlow = getValue(STATIC_KEYS.IS_UPGRADE, values);

    useEffect(() => {
        return () => {
            dispatch(addUpgradeStep([]));
            dispatch(setCurrentUpgradeStep(0));
            dispatch(valueChange(STATIC_KEYS.UI_UPGRADE_PAGE, ''));
        };
    }, []);

    const nodeData: NodeInterface[] = getValue(STATIC_KEYS.UI_FTECH_NODE_INFO, values) || [];
    let filterData: NodeInterface[] = [];
    let localNodeVersion = '';
    if (nodeData.length > 0) {
        nodeData.forEach((node: NodeInterface) => {
            if (node.isLocalNode) {
                localNodeVersion = node.version;
            }
        });
        if (localNodeVersion) {
            filterData = nodeData.filter((node: NodeInterface) => {
                return !node.isLocalNode && node.nodeType === 'Management' && compareVersions(isUpgradeFlow ? localNodeVersion : node.version, isUpgradeFlow ? node.version : localNodeVersion) && node.status === 'online';
            });
        }
    }
    const upgradedStatus = getValue(STATIC_KEYS.UI_NODE_UPGRADE_INSTALLATION_STATUS, values);
    let parsedNodeInfp = [];
    if (upgradedStatus?.applicableNodes) {
        parsedNodeInfp = JSON.parse(upgradedStatus?.applicableNodes);
    }
    const onBackClick = () => {
        dispatch(addUpgradeStep([]));
        dispatch(setCurrentUpgradeStep(0));
        dispatch(valueChange(STATIC_KEYS.UI_UPGRADE_PAGE, true));
        dispatch(clearValues());
        dispatch(refresh());
    };

    return (
        <>
            <Container>
                <Card>
                    <CardBody>
                        <div className="margin-left-10">
                            <p className="text-success">{propsData ? propsData.successText : ''}</p>
                        </div>
                        <Row className="margin-left-1">
                            <Col sm={12}>
                                <Table dispatch={dispatch} primaryKey="preview" user={user} data={parsedNodeInfp} columns={UPGRADED_NODE_DETAILS} isSelectable={false} />
                            </Col>
                        </Row>
                        {filterData.length > 0 ? (
                            <Row className="margin-top-30 ">
                                <Col sm={12} className="pl-4">
                                    <p className="text-warning">
                                        <FontAwesomeIcon className="text-warning" size="xl" icon={faTriangleExclamation} />
                                        <span className="font-bold">WARNING:</span> {isUpgradeFlow ? t('upgrade.summary.version.mismatch.warning', { localNodeVersion }) : t('revert.summary.version.mismatch.warning', { localNodeVersion })}
                                    </p>
                                </Col>
                                <Col sm={12} className="margin-left-10">
                                    <Table dispatch={dispatch} primaryKey="preview" user={user} data={filterData} columns={UPGRADE_ASSOCIATED_SITE_tABLE} isSelectable={false} />
                                </Col>
                            </Row>
                        ) : null}
                        <p className="text-warning ms-2">{propsData?.note}</p>
                    </CardBody>
                </Card>
            </Container>
            <div className="margin-top-10 d-flex flex-row-reverse pr-4">
                <div>
                    <ActionButton cssName="btn btn-secondary btn-sm p-2 pl-3 pr-3" label="Close" onClick={onBackClick} />
                </div>
            </div>
        </>
    );
};

export default withTranslation()(UpgradeSummary);
