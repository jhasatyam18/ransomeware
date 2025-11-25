import { faCloud, faDesktop, faDriversLicense, faHdd, faLayerGroup, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardBody } from 'reactstrap';
import styled from 'styled-components';
import { INSTANCES, LICENSE, PROTECTION_PLANS_PATH, Sites } from '../../constants/routeConstant';
import { STATIC_KEYS } from '../../constants/StoreKey';
import { UserInterface } from '../../interfaces/interface';
import { callAPI, getValue } from '../../utils/apiUtils';
import { setTitles } from '../../store/reducers/DashboardReducer';
import { API_DASHBOARD_TITLE } from '../../constants/ApiUrlConstant';
import { addMessage } from '../../store/reducers/messageReducer';
import { MESSAGE_TYPES } from '../../constants/userConstant';
import { formatDateWithSuffix, getStorageWithUnit } from '../../utils/appUtils';
import { fetchLicenses } from '../../store/actions/actions';

type DashboardTitlesProps = WithTranslation & {
    dispatch: (action: any) => void;
    user: UserInterface;
};

const DashboardTitles: React.FC<DashboardTitlesProps> = (props) => {
    const { user, dispatch } = props;
    const refresh = useSelector((state: any) => state.global.context.refresh);
    const { values } = user;
    const SITE_ID = getValue({ key: STATIC_KEYS.GLOBAL_SITE_KEY, values }) || '1';
    const [loading, setLoading] = useState<boolean>(false);
    const [dashTitles, setDashTitles] = useState({ siteCount: 0, protectionPlans: 0, protectedVMs: 0, protectedStorage: 0 });
    const licenseData = useSelector((state: any) => state.license);
    const siteIdRef = useRef(SITE_ID);
    useEffect(() => {
        siteIdRef.current = SITE_ID;
    }, [SITE_ID]);
    useEffect(() => {
        let isUnmounting = false;
        const currentSiteId = SITE_ID;
        const url = SITE_ID.length > 1 ? `${API_DASHBOARD_TITLE}?siteID=${SITE_ID}` : API_DASHBOARD_TITLE;
        setLoading(true);
        dispatch(fetchLicenses(SITE_ID === '1' ? '' : SITE_ID));
        setDashTitles({ siteCount: 0, protectionPlans: 0, protectedVMs: 0, protectedStorage: 0 });
        callAPI(url).then(
            (json) => {
                if (isUnmounting) return;
                if (siteIdRef.current !== currentSiteId) {
                    return;
                }
                setLoading(false);
                const { siteCount, protectionPlans, protectedVMs, protectedStorage, siteConnections, siteDetails } = json;
                const info = { siteCount, protectionPlans, protectedVMs, protectedStorage };
                setDashTitles(info);
                dispatch(setTitles({ sites: siteCount, protectionPlans, vms: protectedVMs, storage: protectedStorage, siteConnections, siteDetails }));
            },
            (err) => {
                if (isUnmounting) return;
                setLoading(false);
                dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
            },
        );

        return () => {
            isUnmounting = true;
        };
    }, [SITE_ID, refresh]);

    const nextExpiryDate = useMemo(() => {
        if (!licenseData || !Array.isArray(licenseData)) return null;
        const allExpiries = licenseData.flatMap(
            (site) => (site.licenses || []).filter((lic: any) => lic?.expiredTime && !lic?.isExpired).map((lic: any) => lic.expiredTime * 1000), // convert seconds → ms
        );
        if (allExpiries.length === 0) return null;
        const soonest = Math.min(...allExpiries);
        return new Date(soonest);
    }, [licenseData]);

    const formatted = nextExpiryDate ? formatDateWithSuffix(nextExpiryDate) : '-';

    let reports = [
        { title: 'Protection Plans', icon: faLayerGroup, value: dashTitles.protectionPlans, link: PROTECTION_PLANS_PATH },
        { title: 'Protected Machines', icon: faDesktop, value: dashTitles.protectedVMs, link: INSTANCES },
        { title: 'Protected Storage', icon: faHdd, value: getStorageWithUnit(dashTitles.protectedStorage), link: '#' },
    ];

    return (
        <Container>
            <SiteDiv key="faLayerGroup" className="mini-stats-wid font-weight-bold box-shadow">
                <Link to={Sites}>
                    <CardBody>
                        <div className="align-self-center d-flex justify-content-between">
                            <div className="d-flex">
                                <span>
                                    <FontAwesomeIcon size="lg" icon={faCloud} color={'white'} className="pl-2 pt-1 h2" style={{ fontSize: '1.5rem', marginRight: '5px' }} />
                                </span>
                                <p className="color-white font-weight-medium mb-0 mt-1 dashboard_rec_heading_size">{'Sites'}</p>
                            </div>
                            <h5 className="mb-0 mt-1 dashboard_rec_heading_size">{loading ? <FontAwesomeIcon className="fa-spin" size="lg" icon={faSpinner} /> : dashTitles.siteCount}</h5>
                        </div>
                    </CardBody>
                </Link>
            </SiteDiv>
            {reports.map((report, key) => (
                <ParentDiv key={key} className="mini-stats-wid font-weight-bold box-shadow">
                    <Link to={report.link}>
                        <CardBody>
                            <div className="align-self-center d-flex justify-content-between">
                                <div className="d-flex">
                                    <span>
                                        <FontAwesomeIcon size="lg" icon={report.icon} color={'white'} className="pl-2 pt-1 h2" style={{ fontSize: '1.5rem', marginRight: '5px' }} />
                                    </span>
                                    <p className="color-white font-weight-medium mb-0 mt-1 dashboard_rec_heading_size">{report.title}</p>
                                </div>
                                <h5 className="mb-0 mt-1 dashboard_rec_heading_size">{loading ? <FontAwesomeIcon className="fa-spin" size="lg" icon={faSpinner} /> : report.value}</h5>
                            </div>
                        </CardBody>
                    </Link>
                </ParentDiv>
            ))}

            {/* Static Active Licenses Section */}
            <LicenseDiv className="mini-stats-wid font-weight-bold box-shadow">
                <Link to={LICENSE}>
                    <CardBody>
                        <div className="align-self-center d-flex justify-content-between">
                            <div className="d-flex">
                                <span>
                                    <FontAwesomeIcon size="lg" icon={faDriversLicense} color={'white'} className="pl-2 pt-1 h2" style={{ fontSize: '1.5rem', marginRight: '5px' }} />
                                </span>
                                <p className="color-white font-weight-medium mb-0 mt-1 dashboard_rec_heading_size">Next License Renewal</p>
                            </div>

                            {formatted !== '-' && !loading ? (
                                <>
                                    <span className="mb-0 text-warning dashboard_rec_heading_size">
                                        {formatted.day}{' '}
                                        <span className="dashboard_license_date_size" style={{ position: 'relative', top: '-5px', left: '-3px' }}>
                                            {formatted.suffix}
                                        </span>{' '}
                                        {formatted.month} {formatted.year}
                                    </span>
                                </>
                            ) : loading ? (
                                <h5 className="mb-0 mt-1 dashboard_rec_heading_size">
                                    <FontAwesomeIcon className="fa-spin " size="lg" icon={faSpinner} />
                                </h5>
                            ) : (
                                <h5 className="mb-0 mt-1 dashboard_rec_heading_size">-</h5>
                            )}
                        </div>
                    </CardBody>
                </Link>
            </LicenseDiv>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-wrap: nowrap;
    gap: 16px;
    overflow-x: auto;
`;

const ParentDiv = styled(Card)`
    flex: 1;
    min-width: 130px;
    max-width: 20%;
    /* margin: 18px 1px 18px 1px; */
`;
const LicenseDiv = styled(Card)`
    flex: 1;
    min-width: 130px;
    max-width: 26%;
    /* margin: 18px 1px 18px 1px; */
`;
const SiteDiv = styled(Card)`
    flex: 1;
    min-width: 130px;
    max-width: 12%;
    /* margin: 18px 1px 18px 1px; */
`;

// export default DashTitles;
const mapStateToProps = (state: any) => {
    const { dashboard, user } = state;
    return { dashboard, user };
};

export default connect(mapStateToProps)(withTranslation()(DashboardTitles));
