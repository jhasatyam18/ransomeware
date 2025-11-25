import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { INITIAL_STATE, NodeUpgradeVersionInterface } from '../../interfaces/interfaces';
import { RendererProps } from '../../interfaces/upgradeInterfaces';
import { FIELD_TYPE } from '../../Constants/FielsConstants';
import { UPGRADE_NODE_VERSION_INFO_TABLE, UPGRADE_REVERT_TABLE } from '../../Constants/TableConstants';
import { STATIC_KEYS } from '../../Constants/userConstants';
import { getValue } from '../../utils/inputUtils';
import { getNodeVersionInfo, moveToPreviousStep, onActionClick } from '../../store/actions/upgradeAction';
import ActionButton from '../../Components/Shared/ActionButton';
import DMCheckbox from '../../Components/Shared/DMCheckbox';
import Table from '../../Components/Table/Table';
import PackageInfoCards from './PackageInfoCards';
import { hideApplicationLoader, showApplicationLoader, valueChange } from '../../store/actions';
import { callAPI } from '../../utils/apiUtils';
import { API_NODE_UPGRADE_INFO } from '../../Constants/apiConstants';
import { MESSAGE_TYPES } from '../../Constants/MessageConstants';
import { addMessage } from '../../store/actions/MessageActions';
import { NODE_TYPE } from '../../Constants/InputConstants';

const Preview: React.FC<RendererProps> = (props) => {
    const { user, dispatch, propsData, nextLabel, t } = props;
    const { values, nodeType } = user;
    const workflow = getValue(STATIC_KEYS.UI_CURRENT_FLOW, values);

    const inputField = {
        label: '',
        errorMessage: '',
        placeHolderText: 'Please provide upload url',
        shouldShow: true,
        type: FIELD_TYPE.CHECKBOX,
        hideLabel: true,
    };
    const concent = getValue(STATIC_KEYS.UI_UPGRADE_CONCENT, values);
    let [upgradeNodeInfo, setupgradeNodeInfo] = useState<any[]>([]);
    let [loader, setloader] = useState<boolean>(false);
    useEffect(() => {
        if (workflow !== STATIC_KEYS.REVERT) {
            dispatch(getNodeVersionInfo());
        }
        const url = API_NODE_UPGRADE_INFO.replace('<type>', workflow === STATIC_KEYS.UPGRADE ? 'init-upgrade' : 'init-revert');
        dispatch(showApplicationLoader(url, 'Loading nodes ...'));
        setloader(true);
        callAPI(url).then(
            (json) => {
                dispatch(hideApplicationLoader(url));
                if (json?.hasError) {
                    setloader(false);
                    dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
                } else {
                    setloader(false);
                    setupgradeNodeInfo(json || []);
                }
            },
            (err) => {
                setloader(false);
                dispatch(hideApplicationLoader(url));
                dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
            },
        );
        return () => {
            dispatch(valueChange(STATIC_KEYS.UI_UPGRADE_CONCENT, false));
        };
    }, []);

    const nodeUpgradeVersion: NodeUpgradeVersionInterface = getValue(STATIC_KEYS.UI_PREVIEW_NODE_VERSION_INFO, values) || {};

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
                {upgradeNodeInfo.length !== 0 ? (
                    <>
                        <div className="upgrade_concent_div" style={{ fontSize: '13px' }}>
                            {nodeType === NODE_TYPE.DOP ? null : (
                                <>
                                    <div className="padding-top-12">
                                        <DMCheckbox field={inputField} fieldKey="upgrade.concent" dispatch={dispatch} user={user} disabled={!(upgradeNodeInfo.length > 0)} />
                                    </div>
                                    <div>
                                        <label htmlFor="upgrade.concent" className="d-block margin-top-15">
                                            {propsData?.concent}
                                        </label>
                                    </div>
                                </>
                            )}
                        </div>
                        <div>
                            <h6 className="text-warning">{t('note')}</h6>
                            <ul className="text-warning">
                                {nodeType === NODE_TYPE.DOP ? null : (
                                    <li className="ms-2">
                                        <span>{`Do not power off or reboot any of the nodes and offline nodes will not be ${workflow === STATIC_KEYS.REVERT ? 'reverted' : 'upgraded'}`}</span>
                                    </li>
                                )}
                                {propsData?.note ? (
                                    <li className="ms-2">
                                        <span className=" display-block ">{propsData?.note}</span>
                                    </li>
                                ) : null}
                            </ul>
                        </div>
                    </>
                ) : null}
                {upgradeNodeInfo.length === 0 && workflow === STATIC_KEYS.UPGRADE ? (
                    <div style={{ fontSize: '13px', paddingTop: '12px' }}>
                        <span className="text-warning ">{t('preview.verify.node.version')}</span>
                    </div>
                ) : null}
                <div className="padding-10 d-flex flex-row-reverse">
                    <div>
                        {upgradeNodeInfo.length !== 0 ? <ActionButton cssName={`btn btn-success btn-sm margin-right-10 p-2 pl-3 pr-3`} isDisabled={!concent && nodeType !== NODE_TYPE.DOP} label={`${nextLabel}`} onClick={onNextClick} /> : null}
                        <ActionButton cssName="btn btn-secondary btn-sm p-2 pl-3 pr-3" label={`Cancel`} onClick={onCancelClick} />
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
            {loader ? null : (
                <>
                    <Row className="d-flex justify-content-center" style={{ fontSize: '0.8rem' }}>
                        {workflow === STATIC_KEYS.UPGRADE ? (
                            <Col sm={5}>
                                <PackageInfoCards nodeUpgradeVersion={nodeUpgradeVersion} />
                            </Col>
                        ) : null}
                        <Col sm={workflow === STATIC_KEYS.UPGRADE ? 7 : 7}>
                            {renderNodeTableHeader()}
                            <Table dispatch={dispatch} primaryKey="id" user={user} data={upgradeNodeInfo} columns={workflow === STATIC_KEYS.UPGRADE ? UPGRADE_NODE_VERSION_INFO_TABLE : UPGRADE_REVERT_TABLE} isSelectable={false} />
                            {workflow === STATIC_KEYS.REVERT ? renderFooter() : null}
                        </Col>
                    </Row>
                    {workflow === STATIC_KEYS.UPGRADE ? renderFooter() : null}
                </>
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
