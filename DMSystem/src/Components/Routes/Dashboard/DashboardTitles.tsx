import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faCloud, faDesktop, faHdd, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { Dispatch } from 'redux';
import { INITIAL_STATE, TilesData } from '../../../interfaces/interfaces';
import { GET_DASHBORAD_TITLE } from '../../../Constants/apiConstants';
import { MESSAGE_TYPES } from '../../../Constants/MessageConstants';
import { callAPI } from '../../../utils/apiUtils';
import { getStorageWithUnit } from '../../../utils/appUtils';
import { hideApplicationLoader, showApplicationLoader } from '../../../store/actions';
import { addMessage } from '../../../store/actions/MessageActions';

interface DashboardTitlesProps extends WithTranslation {
    dispatch: Dispatch<any>;
}
type titles = {
    siteCount: number;
    protectionPlans: number;
    protectedVMs: number;
    protectedStorage: number;
};

const DashboardTitles: React.FC<DashboardTitlesProps> = ({ t, dispatch }) => {
    const refresh = useSelector((state: INITIAL_STATE) => state.user.context.refresh);

    const [titles, setTitles] = useState<titles>({
        siteCount: 0,
        protectionPlans: 0,
        protectedVMs: 0,
        protectedStorage: 0,
    });

    useEffect(() => {
        setTitles({ siteCount: 0, protectionPlans: 0, protectedVMs: 0, protectedStorage: 0 });
        dispatch(showApplicationLoader(t('titles.data'), t('feching.titles')));
        callAPI(GET_DASHBORAD_TITLE).then(
            (json: TilesData) => {
                dispatch(hideApplicationLoader(t('titles.data')));
                const { siteCount, protectionPlans, protectedVMs, protectedStorage } = json;
                const info = { siteCount, protectionPlans, protectedVMs, protectedStorage };
                setTitles(info);
            },
            (err) => {
                dispatch(hideApplicationLoader(t('titles.data')));
                dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
            },
        );
    }, [refresh]);

    const infoCards = [
        { title: t('Sites'), icon: faCloud, description: titles.siteCount },
        { title: t('Protection Plans'), icon: faLayerGroup, description: titles.protectionPlans },
        { title: t('Protected Machines'), icon: faDesktop, description: titles.protectedVMs },
        { title: t('Protected Storage'), icon: faHdd, description: getStorageWithUnit(titles.protectedStorage) },
    ];

    return (
        <Row>
            {infoCards.map((report, key) => (
                <Col md="3" key={`_col_-${key * 2}`}>
                    <Card className="mini-stats-wid box-shadow">
                        <CardBody className="d-flex justify-content-between">
                            <div>
                                <p className="text-muted font-weight-medium">{report.title}</p>
                                <h4 className="mb-0">{report.description}</h4>
                            </div>
                            <div className="mini-stat-icon avatar-sm align-self-center">
                                <span className="">
                                    <FontAwesomeIcon size="lg" icon={report.icon as IconProp} color={'white'} className="pl-2 pt-1 h2" />
                                </span>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            ))}
        </Row>
    );
};

const mapStateToProps = (state: INITIAL_STATE) => {
    const { dashboard, user } = state;
    return { dashboard, user };
};

export default connect(mapStateToProps)(withTranslation()(DashboardTitles));
