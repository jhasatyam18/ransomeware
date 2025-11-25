import React, { useEffect, useRef, useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { INITIAL_STATE_INTERFACE } from '../../interfaces/interface';
import { Card, CardBody, Col, Row } from 'reactstrap';
import CardHeaderWithInfo from '../dashboard/CardHeaderWithInfo';
import UIPaginator from './UIPaginator';
import { callAPI, getValue } from '../../utils/apiUtils';
import { STATIC_KEYS } from '../../constants/StoreKey';
import { API_HEALTH_STATUS, API_HEALTH_THRESOLD } from '../../constants/ApiUrlConstant';
import { MESSAGE_TYPES } from '../../constants/userConstant';
import { addMessage } from '../../store/reducers/messageReducer';
import SiteHealthTitle from './SiteHealthTitle';
import NodeHealthHoverInfo from './NodeHealthHoverInfo';
import { useNavigate } from 'react-router-dom';
import { valueChange } from '../../store/reducers/userReducer';
import { DopHealthStatusItem } from './DopHealthStatusItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { filterNodeHealthData } from '../../store/actions/actions';

interface HealthProps {
    type: string;
    message: string;
    user: any;
    dispatch: any;
    dashboard: any;
}
interface SiteHealth {
    name: string;
    rpoStatus: string;
    lastTestDrillTime: string;
    drReady: boolean;
    id: string;
    testDrillStatus: string;
    entitiesMeets: number;
    entitiesPartial: number;
    entitiesBreached: number;
    totalEntities: number;
}

const NodeHealth: React.FC<HealthProps & WithTranslation> = ({ user, dispatch }) => {
    const { values } = user;
    const SITE_ID = getValue({ key: STATIC_KEYS.GLOBAL_SITE_KEY, values }) || '1';
    const refresh = useSelector((state: INITIAL_STATE_INTERFACE) => state.global.context.refresh);
    const siteHealth = useSelector((state: INITIAL_STATE_INTERFACE) => state.dashboard.titles.siteHealth) || [];
    const [thresold, setThresold] = useState<{ testDrillThreshold: number; rtoThreshold: number }>({ testDrillThreshold: 0, rtoThreshold: 0 });
    const updatedUrl = SITE_ID !== '1' ? `${API_HEALTH_STATUS}?siteID=${SITE_ID}` : `${API_HEALTH_STATUS}`;
    const navigate = useNavigate();
    const [loader, setLoader] = useState<boolean>(false);
    const siteIdRef = useRef(SITE_ID);
    useEffect(() => {
        siteIdRef.current = SITE_ID;
    }, [SITE_ID]);
    useEffect(() => {
        const currentSiteId = SITE_ID;
        let url = SITE_ID === '1' ? `${API_HEALTH_THRESOLD}?${SITE_ID}` : API_HEALTH_THRESOLD;
        callAPI(url).then(
            (json) => {
                if (json && json.length > 0 && currentSiteId === siteIdRef.current) {
                    setThresold(json[0]);
                }
            },
            (err) => {
                dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
            },
        );
    }, [refresh, SITE_ID]);

    const renderHoverText = (title: string, subtext: string) => {
        return (
            <>
                <div className="font-weight-medium">{title}</div>
                <span>{subtext}</span>
            </>
        );
    };

    const renderHoverInfo = () => {
        return <NodeHealthHoverInfo />;
    };

    const renderCol = () => {
        return (
            <>
                <Row style={{ fontWeight: 'bold' }}>
                    <Col sm={4}>
                        <SiteHealthTitle text={SITE_ID === '1' ? 'Site' : 'Protection Plan'} IconText={SITE_ID === '1' ? 'Site' : 'Protection Plan'} />
                    </Col>

                    <Col sm={3}>
                        <SiteHealthTitle text="RPO" IconText={renderHoverText} params={['Recovery Point Objective', 'Maximum acceptable data loss']} />
                    </Col>
                    <Col sm={3}>
                        <SiteHealthTitle text="Last Test Drill" IconText={renderHoverText} params={['Last DR test execution', ` Date Must be within ${thresold?.testDrillThreshold} days`]} />
                    </Col>
                    <Col sm={2}>
                        <SiteHealthTitle text="DR Ready" IconText={renderHoverText} params={['Overall DR readiness status All criteria must be met']} />
                    </Col>
                </Row>
                <hr />
            </>
        );
    };

    const onRpoClick = (el: SiteHealth) => {
        dispatch(valueChange([STATIC_KEYS.GLOBAL_SITE_KEY, el.id ? el.id : SITE_ID]));
        if (SITE_ID !== '1') {
            navigate('/dop/replication', { replace: true });
            dispatch(valueChange(['pagination.filter.value', el.name]));
        }
    };

    const renderDate = (el: SiteHealth) => {
        if (!el || !el?.lastTestDrillTime) return <span className="text-secondary">-</span>;
        const time = parseInt(el.lastTestDrillTime, 10) * 1000;
        const d = new Date(time);
        return `${d.toLocaleDateString()} - ${d.toLocaleTimeString()}`;
    };
    const renderRows = (r: SiteHealth) => {
        return (
            <>
                <Row key={r.id}>
                    <Col sm={4}>
                        <a href="#" onClick={() => onRpoClick(r)}>
                            {r.name}
                        </a>
                    </Col>
                    <Col sm={3}>
                        <DopHealthStatusItem data={r} field="rpoStatus" />
                    </Col>
                    <Col sm={3}>
                        <div className={`${r.testDrillStatus === 'breached' ? 'text-danger' : r.testDrillStatus === 'partial' ? 'text-warning' : 'text-success'} `}>{renderDate(r)}</div>
                    </Col>
                    <Col sm={2}>
                        <DopHealthStatusItem data={r} field="drReady" />
                    </Col>
                </Row>
                <hr />{' '}
            </>
        );
    };
    return (
        <Card style={{ minHeight: '315px' }}>
            <CardBody className="box-shadow" style={{ fontSize: '11px' }}>
                <CardHeaderWithInfo text="Health Status" IconText={renderHoverInfo} />
                <div className="d-flex flex-row-reverse mb-2 mt-2">
                    <UIPaginator user={user} dispatch={dispatch} url={updatedUrl} setLoader={setLoader} filteredData={filterNodeHealthData} />
                </div>
                {siteHealth.length > 0 ? (
                    <>
                        {renderCol()}
                        {siteHealth?.map((r: any) => {
                            return renderRows(r);
                        })}
                    </>
                ) : (
                    <>
                        {loader ? (
                            <>
                                {' '}
                                <h5 className="mb-0 mt-1 dashboard_rec_heading_size">
                                    <FontAwesomeIcon className="fa-spin me-2" size="lg" icon={faSpinner} />
                                    Loading...
                                </h5>
                            </>
                        ) : (
                            'No data to show'
                        )}
                    </>
                )}
            </CardBody>
        </Card>
    );
};

function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { global, user, dashboard } = state;
    return {
        global,
        user,
        dashboard,
    };
}

export default connect(mapStateToProps)(withTranslation()(NodeHealth));
