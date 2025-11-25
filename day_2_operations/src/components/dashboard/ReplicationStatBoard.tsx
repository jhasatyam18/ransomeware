import React, { useEffect, useRef, useState } from 'react';
// import { Dashboard_Replication_Data } from '../../constant/tableConstant';
import { INITIAL_STATE_INTERFACE, SiteOptions, UserInterface } from '../../interfaces/interface';
import { withTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Card, CardBody, Col, Row } from 'reactstrap';
import CardHeaderWithInfo from './CardHeaderWithInfo';
import styled from 'styled-components';
import { callAPI, getValue } from '../../utils/apiUtils';
import { API_DASHBOARD_REPLICATION_STATS } from '../../constants/ApiUrlConstant';
import { addMessage } from '../../store/reducers/messageReducer';
import { MESSAGE_TYPES } from '../../constants/userConstant';
import { STATIC_KEYS } from '../../constants/StoreKey';
import { calculateChangedData, formatTime } from '../../utils/appUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCopy, faExclamationTriangle, faFileArchive, faSpinner } from '@fortawesome/free-solid-svg-icons';

interface Props {
    dispatch: any;
    user: UserInterface;
}

const ReplicationStatBoard: React.FC<Props> = ({ user, dispatch }) => {
    const { values } = user;
    const [replicationStats, setReplicationStats] = useState({ failed: 0, exceedsInterval: 0, inSync: 0, dataReduction: 0, avgChangeRate: 0, avgRPO: 0 });
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
        const url = SITE_ID.length > 1 ? `${API_DASHBOARD_REPLICATION_STATS}?siteID=${SITE_ID}` : API_DASHBOARD_REPLICATION_STATS;
        setLoader(true);
        callAPI(url).then(
            (json) => {
                if (isUnmounting) return;
                if (siteIdRef.current !== currentSiteId) {
                    return;
                }
                setLoader(false);
                setReplicationStats(json);
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

    const calculateDataReduction = (val: number): string | undefined => {
        if (val === 0) {
            return '0%';
        }
        return `${parseInt(val.toString(), 10)}%`;
    };

    const data = {
        ReplicationStatus: [
            { label: 'Failed', value: replicationStats.failed, icon: faExclamationTriangle, color: 'app_danger' },
            { label: 'Exceeds-Interval', value: replicationStats.exceedsInterval, icon: faExclamationTriangle, color: 'text-warning' },
            { label: 'In-sync ', value: replicationStats.inSync, icon: faCheckCircle, color: 'text-success app_success' },
        ],
        ReplicationStat: [
            { label: 'Avg. RPO', value: formatTime(replicationStats.avgRPO), icon: faCheckCircle, color: 'app_success text-success' },
            { label: 'Avg. Change Rate', value: calculateChangedData(replicationStats.avgChangeRate), icon: faCopy, color: 'app_success' },
            { label: 'Data Reduction', value: calculateDataReduction(replicationStats.dataReduction), icon: faFileArchive, color: 'text-muted' },
        ],
    };

    const renderHoverInfo = () => {
        return (
            <>
                <div>
                    <span style={{ fontWeight: '500', fontSize: '11px' }}> Shows replication metrics for sites/plans acting as sources.</span>
                    <ul className="mt-2">
                        <li>Source Sites/Plans: Only replications originating from these are considered.</li>
                        <li>Failed: Replications that didn’t complete successfully.</li>
                        <li>Exceeds Interval: Taking longer than expected.</li>
                        <li>In-Sync: Currently up to date.</li>
                        <li>Avg. RPO: Average time gap between source and target data.</li>
                        <li>Avg. Change Rate: Speed of data change and replication.</li>
                        <li>Data Reduction: Storage saved during replication.</li>
                    </ul>
                </div>
            </>
        );
    };
    return (
        <Card>
            <CardBody className="box-shadow" style={{ minHeight: '157px' }}>
                <CardHeaderWithInfo text={`Replication (${selectedSite})`} IconText={renderHoverInfo} />
                <div className="h-100" style={{}}>
                    {loader ? (
                        <div className="font-weight-medium">
                            <FontAwesomeIcon icon={faSpinner} className="me-2" /> Loading...
                        </div>
                    ) : (
                        <>
                            <RowContainer className="dashboard_replicaiton_info">
                                {data.ReplicationStatus.map((task: any, index: any) => (
                                    <Col sm={4} style={{ height: '30%' }} className="dashboard_item" key={`replication-stat-${task.color}-${index + 1}`}>
                                        <Row className="dashboard_repl_size">
                                            <Col sm={8} style={{ position: 'relative', top: '12px' }}>
                                                <FontAwesomeIcon className={`${task.color}`} size="lg" icon={task.icon} />
                                                &nbsp;&nbsp;
                                                {`${task.label}`}
                                            </Col>
                                            <Col sm={4}>
                                                <p style={{ position: 'relative', top: '12px' }} className="color-white float-right">
                                                    {task.value || '-'}
                                                </p>
                                            </Col>
                                        </Row>
                                        <div className="dashboard_divider" />
                                    </Col>
                                ))}
                            </RowContainer>
                            <RowContainer className="dashboard_replicaiton_info">
                                {data.ReplicationStat.map((task: any, index: any) => (
                                    <Col sm={4} style={{ height: '30%' }} className="dashboard_item " key={`replication-stat-${task.color}-${index + 1}`}>
                                        <Row className="dashboard_repl_size">
                                            <Col sm={8} style={{ position: 'relative', top: '12px' }}>
                                                <FontAwesomeIcon className={`${task.color}`} size="lg" icon={task.icon} />
                                                &nbsp;&nbsp;
                                                {`${task.label}`}
                                            </Col>
                                            <Col sm={4}>
                                                <p style={{ position: 'relative', top: '12px' }} className="color-white float-right">
                                                    {task.value || '-'}
                                                </p>
                                            </Col>
                                        </Row>
                                        <div className="dashboard_divider" />
                                    </Col>
                                ))}
                            </RowContainer>
                        </>
                    )}
                </div>
            </CardBody>
        </Card>
    );
};

const RowContainer = styled(Row).attrs((props) => ({
    className: props.className,
}))`
    font-size: 11px;
    height: 100%;
    align-items: center;
    justify-content: left;
    @media (max-width: 1300px) {
        font-size: 10px;
    }
`;
function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { user } = state;
    return {
        user,
    };
}

export default connect(mapStateToProps)(withTranslation()(ReplicationStatBoard));
