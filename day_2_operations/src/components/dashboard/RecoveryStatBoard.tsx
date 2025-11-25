import React, { useEffect, useRef, useState } from 'react';
// import { Dashboard_Replication_Data } from '../../constant/tableConstant';
import { INITIAL_STATE_INTERFACE, SiteOptions, UserInterface } from '../../interfaces/interface';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Card, CardBody, Col, Row } from 'reactstrap';
import CardHeaderWithInfo from './CardHeaderWithInfo';
import { callAPI, getValue } from '../../utils/apiUtils';
import { API_DASHBOARD_RECOVERY_STATS } from '../../constants/ApiUrlConstant';
import { addMessage } from '../../store/reducers/messageReducer';
import { MESSAGE_TYPES } from '../../constants/userConstant';
import { STATIC_KEYS } from '../../constants/StoreKey';
import { formatTime, getLastRecovery } from '../../utils/appUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationTriangle, faSpinner } from '@fortawesome/free-solid-svg-icons';

interface Props {
    dispatch: any;
    user: UserInterface;
}
interface RecoveryStat {
    notTested: number;
    failed: number;
    passed: number;
    lastRecoveryTime: number;
    rto?: number;
}
const RecoveryStatBoard: React.FC<Props & WithTranslation> = ({ user, dispatch, t }) => {
    const { values } = user;
    const [recoveryStats, setRecoveryStats] = useState<RecoveryStat[]>([]);
    const [loader, setLoader] = useState<boolean>(false);
    const SITE_ID = getValue({ key: STATIC_KEYS.GLOBAL_SITE_KEY, values }) || '1';
    const siteOptions = getValue({ key: STATIC_KEYS.GLOBAL_OPT_SITE_DATA, values }) || [];
    const refresh = useSelector((state: any) => state.global.context.refresh);
    let selectedSite = 'All Sites';
    if (SITE_ID !== '1') {
        const matchedSite = siteOptions.find((site: SiteOptions) => site.value === SITE_ID);
        selectedSite = matchedSite?.label || 'All Sites';
    }
    const siteIdRef = useRef(SITE_ID);
    useEffect(() => {
        siteIdRef.current = SITE_ID;
    }, [SITE_ID]);

    useEffect(() => {
        let isUnmounting = false;
        const currentSiteId = SITE_ID;
        const url = SITE_ID.length > 1 ? `${API_DASHBOARD_RECOVERY_STATS}?siteID=${SITE_ID}` : API_DASHBOARD_RECOVERY_STATS;
        setLoader(true);
        callAPI(url).then(
            (json) => {
                if (isUnmounting) return;
                if (siteIdRef.current !== currentSiteId) {
                    return;
                }
                setLoader(false);
                setRecoveryStats(json);
            },
            (err) => {
                if (isUnmounting) return;
                setLoader(false);
                dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
            },
        );
        return () => {
            isUnmounting = true;
            setLoader(false);
        };
    }, [SITE_ID, refresh]);

    const data = {
        testRecoveyStatus: [
            { label: 'Not Tested', value: recoveryStats[0]?.notTested, icon: faExclamationTriangle, color: 'app_danger ' },
            { label: 'Failed', value: recoveryStats[0]?.failed, icon: faExclamationTriangle, color: 'text-warning' },
            { label: 'Passed ', value: recoveryStats[0]?.passed, icon: faCheckCircle, color: 'text-success app_success' },
        ],
        recoveryStatus: [
            { label: 'Not Recovered', value: recoveryStats[1]?.notTested, icon: faExclamationTriangle, color: 'app_danger' },
            { label: 'Failed', value: recoveryStats[1]?.failed, icon: faExclamationTriangle, color: 'text-warning' },
            { label: 'Passed', value: recoveryStats[1]?.passed, icon: faCheckCircle, color: 'text-success app_success' },
        ],
    };

    const renderHoverInfo = () => {
        return (
            <>
                <div>
                    <span style={{ fontWeight: '500', fontSize: '11px' }}>This section summarizes the recovery status for all your sites, including both test recoveries and full recoveries. It helps you track how well your disaster recovery setup is performing.</span>
                    <ul className="mt-2">
                        <li>Not Tested / Not Recovered: Recoveries that haven’t been performed yet.</li>
                        <li>Failed: Recoveries that didn’t complete successfully.</li>
                        <li>Passed: Recoveries that completed successfully.</li>
                        <li>Last Test Recovery / Last Recovery (Days Ago): How recently a test recovery was successfully completed.</li>
                    </ul>
                </div>
            </>
        );
    };
    return (
        <Card>
            <CardBody className="box-shadow" style={{ minHeight: '200px' }}>
                <CardHeaderWithInfo text={`Recovery (${selectedSite})`} IconText={renderHoverInfo} />
                {loader ? (
                    <div className="font-weight-medium">
                        <FontAwesomeIcon icon={faSpinner} className="me-2" /> Loading...
                    </div>
                ) : (
                    <>
                        <div className="h-100" style={{}}>
                            <span className="dashboard_rec_heading_size">{t('test.recovery')}</span>
                            <span className="float-end text-warning dashboard_last_rec_size">{t(`Last Test Recovery (Days Ago): ${getLastRecovery(recoveryStats[0]?.lastRecoveryTime)}`)}</span>
                            <Row style={{ fontSize: '11px', height: '100%', alignItems: 'center', justifyContent: 'left' }} className="dashboard_replicaiton_info">
                                {data.testRecoveyStatus.map((task: any, index: any) => (
                                    <Col sm={4} style={{ height: '30%' }} className="dashboard_item " key={`replication-stat-${task.color}-${index + 1}`}>
                                        <Row className="dashboard_repl_size">
                                            <Col sm={8} style={{ position: 'relative', top: '12px' }}>
                                                <FontAwesomeIcon className={`${task.color}`} size="lg" icon={task.icon} />
                                                &nbsp;&nbsp;
                                                {`${task.label}`}
                                            </Col>
                                            <Col sm={3}>
                                                <p className="color-white float-end" style={{ position: 'relative', top: '12px' }}>
                                                    {task.value || '-'}
                                                </p>
                                            </Col>
                                        </Row>
                                        <div className="dashboard_divider" />
                                    </Col>
                                ))}
                            </Row>
                        </div>
                        <div className="h-100 mt-3">
                            <span className="dashboard_rec_heading_size">{t('full.recovery')}</span>
                            <span className="pl-2 dashboard_last_rec_size">{`(${formatTime(recoveryStats[1]?.rto || 0)})`}</span>
                            <span className="float-end text-warning dashboard_last_rec_size">{t(`Last Recovery (Days Ago): ${getLastRecovery(recoveryStats[1]?.lastRecoveryTime)}`)}</span>
                            <Row style={{ fontSize: '11px', height: '100%', alignItems: 'center', justifyContent: 'left' }} className="dashboard_replicaiton_info">
                                {data.recoveryStatus.map((task: any, index: any) => (
                                    <Col sm={4} style={{ height: '30%' }} className="dashboard_item " key={`replication-stat-${task.color}-${index + 1}`}>
                                        <Row className="dashboard_repl_size">
                                            <Col sm={8} style={{ position: 'relative', top: '12px' }}>
                                                <FontAwesomeIcon className={`${task.color}`} size="lg" icon={task.icon} />
                                                &nbsp;&nbsp;
                                                {`${task.label}`}
                                            </Col>
                                            <Col sm={3}>
                                                <p className="color-white float-end" style={{ position: 'relative', top: '12px' }}>
                                                    {task.value || '-'}
                                                </p>
                                            </Col>
                                        </Row>
                                        <div className="dashboard_divider" />
                                    </Col>
                                ))}
                            </Row>
                        </div>
                    </>
                )}
            </CardBody>
        </Card>
    );
};

function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { user } = state;
    return {
        user,
    };
}

export default connect(mapStateToProps)(withTranslation()(RecoveryStatBoard));
