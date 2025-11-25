import React, { useEffect } from 'react';
import { ALERT_FILTERS, GLOBAL_ALERTS } from '../../constant/tableConstant';
import { Card, CardBody, Container } from 'reactstrap';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import DMBreadCrumb from '../shared/DMBreadCrumb';
import { API_ALERTS } from '../../constants/ApiUrlConstant';
import { INITIAL_STATE_INTERFACE } from '../../interfaces/interface';
import { getValue } from '../../utils/apiUtils';
import { STATIC_KEYS } from '../../constants/StoreKey';
import DMPaginatorTableWrapper from '../shared/DMPaginatorTableWrapper';
import useEnforceNonGlobal from '../dashboard/EnforceNonGlobal';
type AlertType = {
    dispatch: any;
    user: any;
};

const GloablAlerts: React.FC<AlertType> = ({ dispatch, user }) => {
    const { values } = user;
    const SITE_ID = getValue({ key: STATIC_KEYS.GLOBAL_SITE_KEY, values }) || '1';
    const [apiUrl, setApiUrl] = React.useState<string>('');
    const OPTIONS = getValue({ key: STATIC_KEYS.GLOBAL_OPT_SITE_DATA, values }) || [];
    useEnforceNonGlobal(SITE_ID, OPTIONS, dispatch);

    useEffect(() => {
        if (SITE_ID && SITE_ID !== '1') {
            const updatedUrl = `${API_ALERTS}siteID=${SITE_ID}`;
            setApiUrl(updatedUrl);
        }
    }, [SITE_ID]);
    return (
        <Container fluid>
            <Card>
                <CardBody>
                    <DMBreadCrumb links={[{ label: 'Alerts', link: '#' }]} />
                    <div className="ml-4 mr-4">
                        <DMPaginatorTableWrapper subFilterTitle="Status" subFilter={ALERT_FILTERS} user={user} dispatch={dispatch} isSelectable={false} showFilter="true" name="ALERTS" apiUrl={apiUrl} columns={GLOBAL_ALERTS} />
                    </div>
                </CardBody>
            </Card>
        </Container>
    );
};

function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { user, nodes } = state;
    return {
        user,
        nodes,
    };
}

export default connect(mapStateToProps)(withTranslation()(GloablAlerts));
