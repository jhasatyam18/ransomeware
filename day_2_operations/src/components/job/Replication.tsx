import React, { useEffect, useState } from 'react';
import { ALERT_FILTERS, GLOBAL_ALERTS, REPLICATION_TABLE } from '../../constant/tableConstant';
import { Card, CardBody, Container } from 'reactstrap';
import NavItem from '../shared/NavItem';
import { INITIAL_STATE_INTERFACE, UserInterface } from '../../interfaces/interface';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import DMBreadCrumb from '../shared/DMBreadCrumb';
import { API_REPLICATION_ALERTS, API_REPLICATIONS } from '../../constants/ApiUrlConstant';
import { AppDispatch } from '../../store';
import { STATIC_KEYS } from '../../constants/StoreKey';
import { getValue } from '../../utils/apiUtils';
import DMPaginatorTableWrapper from '../shared/DMPaginatorTableWrapper';
import useEnforceNonGlobal from '../dashboard/EnforceNonGlobal';

interface ReplicationType {
    dispatch: AppDispatch;
    user: UserInterface;
}

const Replication: React.FC<ReplicationType> = ({ dispatch, user }) => {
    const { activeTab, values } = user;
    const [apiUrlReport, setApiUrlReport] = useState<string>('');
    const SITE_ID = getValue({ key: STATIC_KEYS.GLOBAL_SITE_KEY, values }) || '1';
    const [apiUrl, setApiUrl] = React.useState<string>('');
    const tabOptions = [{ title: 'Summary' }, { title: 'Alerts' }];
    const OPTIONS = getValue({ key: STATIC_KEYS.GLOBAL_OPT_SITE_DATA, values }) || [];
    useEnforceNonGlobal(SITE_ID, OPTIONS, dispatch);

    useEffect(() => {
        if (SITE_ID && SITE_ID !== '1') {
            if (activeTab === 2) {
                const updatedAlertUrl = `${API_REPLICATION_ALERTS}siteID=${SITE_ID}`;
                setApiUrlReport(updatedAlertUrl);
            } else {
                const updatedUrl = `${API_REPLICATIONS}siteID=${SITE_ID}`;
                setApiUrl(updatedUrl);
            }
        }
    }, [SITE_ID, activeTab]);

    return (
        <Container fluid>
            <Card>
                <CardBody>
                    <DMBreadCrumb links={[{ label: 'Replication Jobs', link: '#' }]} />
                    <NavItem data={tabOptions} />
                    {activeTab === 1 ? <DMPaginatorTableWrapper user={user} dispatch={dispatch} isSelectable={false} showFilter="true" name="REPLICATION" apiUrl={apiUrl} columns={REPLICATION_TABLE} /> : null}
                    {activeTab === 2 ? <DMPaginatorTableWrapper subFilterTitle="Status" subFilter={ALERT_FILTERS} user={user} dispatch={dispatch} isSelectable={false} showFilter="true" name="REPLICATION_ALERT" apiUrl={apiUrlReport} columns={GLOBAL_ALERTS} /> : null}
                </CardBody>
            </Card>
        </Container>
    );
};

// export default Node;
function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { user, nodes, jobs } = state;
    return {
        user,
        nodes,
        jobs,
    };
}

export default connect(mapStateToProps)(withTranslation()(Replication));
