import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { UpgradeNodeInterface } from '../../interfaces/HistoryInterface';
import { INITIAL_STATE, NodeInterface, NodeUpgradeVersionInterface } from '../../interfaces/interfaces';
import { RendererProps } from '../../interfaces/upgradeInterfaces';
import { FIELD_TYPE } from '../../Constants/FielsConstants';
import { UPGRADE_NODE_VERSION_INFO_TABLE, UPGRADE_REVERT_TABLE } from '../../Constants/TableConstants';
import { STATIC_KEYS } from '../../Constants/userConstants';
import { getValue } from '../../utils/inputUtils';
import { fetchNodes, getNodeVersionInfo, moveToPreviousStep, onActionClick } from '../../store/actions/upgradeAction';
import ActionButton from '../../Components/Shared/ActionButton';
import DMCheckbox from '../../Components/Shared/DMCheckbox';
import Table from '../../Components/Table/Table';
import PackageInfoCards from './PackageInfoCards';
import { valueChange } from '../../store/actions';
import { APP_CONSTANT } from '../../Constants/InputConstants';

const Preview: React.FC<RendererProps> = (props) => {
    const { user, dispatch, propsData, nextLabel, t } = props;
    const { values } = user;
    const workflow = getValue(STATIC_KEYS.UI_CURRENT_FLOW, values);
    let nodeInfo = getValue(STATIC_KEYS.UI_FTECH_NODE_INFO, values);
    const upgradeHistoryNodeInfo = getValue(STATIC_KEYS.UPGRADE_HISTORY_PREVIEW_NODE_INFO, values) || '';
    const revertNodeInfo: UpgradeNodeInterface[] = [];
    let applicableNodes = [];
    if (upgradeHistoryNodeInfo && workflow === STATIC_KEYS.REVERT) {
        applicableNodes = JSON.parse(upgradeHistoryNodeInfo?.applicableNodes);
        applicableNodes.forEach((applNode: UpgradeNodeInterface) => {
            nodeInfo.forEach((node: NodeInterface) => {
                if (applNode.nodeName === node.name && applNode.currentVersion < node.version) {
                    const el = applNode;
                    el.revertVersion = applNode.currentVersion;
                    el.currentVersion = applNode.appliedVersion;
                    revertNodeInfo.push(el);
                }
            });
        });
    }

    const inputField = {
        label: '',
        errorMessage: '',
        placeHolderText: 'Please provide upload url',
        shouldShow: true,
        type: FIELD_TYPE.CHECKBOX,
        hideLabel: true,
    };
    const concent = getValue(STATIC_KEYS.UI_UPGRADE_CONCENT, values);

    useEffect(() => {
        if (workflow !== STATIC_KEYS.REVERT) {
            dispatch(getNodeVersionInfo());
        }
        dispatch(fetchNodes(STATIC_KEYS.UI_FTECH_NODE_INFO));
        return () => {
            dispatch(valueChange(STATIC_KEYS.UI_UPGRADE_CONCENT, false));
        };
    }, []);

    const nodeUpgradeVersion: NodeUpgradeVersionInterface = getValue(STATIC_KEYS.UI_PREVIEW_NODE_VERSION_INFO, values) || {};
    const upgradeNodeInfo: any = [];
    if (workflow === STATIC_KEYS.UPGRADE && Object.keys(nodeUpgradeVersion).length > 0) {
        const availablePackages = nodeUpgradeVersion.packages.map((pkg) => pkg.package);
        nodeInfo.map((nodeinf: NodeInterface) => {
            if ((nodeinf.nodeType === APP_CONSTANT.MANAGEMENT && nodeinf.isLocalNode && availablePackages.includes(APP_CONSTANT.MANAGEMENT)) || (nodeinf.nodeType !== APP_CONSTANT.MANAGEMENT && availablePackages.includes(nodeinf.nodeType))) {
                const packageObj = nodeUpgradeVersion.packages[availablePackages.indexOf(nodeinf.nodeType)];
                const { component } = packageObj;
                for (let i = 0; i < component?.length; i++) {
                    let cmp = component[i];
                    if ((cmp.componentType === APP_CONSTANT.DM_APPLICATION_UPGRADE && cmp.version > nodeinf.version) || cmp.componentType == APP_CONSTANT.SYSTEM_PACKAGES_UPGRADE) {
                        upgradeNodeInfo.push(nodeinf);
                        break;
                    }
                }
            }
        });
    }

    const showNodeVersionInfo = () => {
        return (
            <>
                {renderNodeTableHeader()}
                <Table dispatch={dispatch} primaryKey="preview" user={user} data={upgradeNodeInfo} columns={UPGRADE_NODE_VERSION_INFO_TABLE} isSelectable={false} />
            </>
        );
    };

    const renderNodeTableHeader = () => {
        return (
            <h5>
                {t('applicable.node')}
                &nbsp;&nbsp;
            </h5>
        );
    };

    function onNextClick() {
        dispatch(onActionClick());
    }
    const onCancelClick = () => {
        dispatch(moveToPreviousStep(nodeUpgradeVersion?.name));
    };

    const renderFooter = () => {
        return (
            <>
                {upgradeNodeInfo.length !== 0 || revertNodeInfo.length !== 0 ? (
                    <>
                        <div className="upgrade_concent_div" style={{ fontSize: '13px' }}>
                            <div className="padding-top-12">
                                <DMCheckbox field={inputField} fieldKey="upgrade.concent" dispatch={dispatch} user={user} disabled={!(revertNodeInfo.length > 0 || nodeInfo.length > 0)} />
                            </div>
                            <div>
                                <label htmlFor="upgrade.concent" className="d-block margin-top-15">
                                    {propsData?.concent}
                                </label>
                            </div>
                        </div>
                        <div>
                            <h5 className="text-warning">{t('note:')}</h5>
                            <ul className="text-warning">
                                <li className="ms-2">
                                    <span>{`Do not power off or reboot any of the nodes and offline nodes will not be ${workflow === STATIC_KEYS.REVERT ? 'reverted' : 'upgraded'}`}</span>
                                </li>
                                <li className="ms-2">
                                    <span className=" display-block ">{propsData?.note}</span>
                                </li>
                            </ul>
                        </div>
                    </>
                ) : null}
                {upgradeNodeInfo.length === 0 && revertNodeInfo.length === 0 ? (
                    <div style={{ fontSize: '13px', paddingTop: '12px' }}>
                        <span className="text-warning ">{t('preview.verify.node.version')}</span>
                    </div>
                ) : null}
                <div className="padding-10 d-flex flex-row-reverse">
                    <div>
                        {upgradeNodeInfo.length !== 0 || revertNodeInfo.length !== 0 ? <ActionButton cssName={`btn btn-success btn-sm margin-right-10 p-2 pl-3 pr-3`} isDisabled={!concent} label={`${nextLabel}`} onClick={onNextClick} /> : null}
                        <ActionButton cssName="btn btn-secondary btn-sm p-2 pl-3 pr-3" label={`Cancel`} onClick={onCancelClick} />
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
            {workflow === STATIC_KEYS.UPGRADE ? (
                <>
                    <Row className="d-flex justify-content-center" style={{ fontSize: '0.8rem' }}>
                        <Col sm={5}>
                            <PackageInfoCards nodeUpgradeVersion={nodeUpgradeVersion} />
                        </Col>
                        <Col sm={7}>{showNodeVersionInfo()}</Col>
                    </Row>
                    {renderFooter()}
                </>
            ) : (
                <Row className="d-flex justify-content-center" style={{ fontSize: '0.8rem' }}>
                    <Col sm={10}>
                        {renderNodeTableHeader()}
                        <Table dispatch={dispatch} columns={UPGRADE_REVERT_TABLE} data={revertNodeInfo} primaryKey="id" user={user} />
                        {renderFooter()}
                    </Col>
                </Row>
            )}
        </>
    );
};

function mapStateToProps(state: INITIAL_STATE) {
    const { layout, user } = state;
    return {
        layout,
        user,
    };
}
export default connect(mapStateToProps)(withTranslation()(Preview));
