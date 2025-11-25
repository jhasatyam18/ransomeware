import React, { useEffect, useState } from 'react';
import { ALERT_FILTERS, GLOBAL_ALERTS, TABLE_NODE } from '../../constant/tableConstant';
import { Card, CardBody, Container } from 'reactstrap';
// import NodeAlerts from './NodeAlerts';
import NavItem from '../shared/NavItem';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import DMBreadCrumb from '../shared/DMBreadCrumb';
import { API_NODES, API_NODES_ALERTS } from '../../constants/ApiUrlConstant';
import { STATIC_KEYS } from '../../constants/StoreKey';
import { getValue } from '../../utils/apiUtils';
import { INITIAL_STATE_INTERFACE, UserInterface } from '../../interfaces/interface';
import DMPaginatorTableWrapper from '../shared/DMPaginatorTableWrapper';
import { AppDispatch } from '../../store';
import useEnforceNonGlobal from '../dashboard/EnforceNonGlobal';
type NodeType = {
    dispatch: AppDispatch;
    user: UserInterface;
};
const Node: React.FC<NodeType> = ({ dispatch, user }) => {
    const [apiUrl, setApiUrl] = useState<string>('');
    const [apiUrlReport, setApiUrlReport] = useState<string>('');
    const { activeTab, values } = user;
    const SITE_ID = getValue({ key: STATIC_KEYS.GLOBAL_SITE_KEY, values }) || '1';
    const tabOptions = [{ title: 'Summary' }, { title: 'Alerts' }];
    const OPTIONS = getValue({ key: STATIC_KEYS.GLOBAL_OPT_SITE_DATA, values }) || [];
    useEnforceNonGlobal(SITE_ID, OPTIONS, dispatch, activeTab === 2);

    useEffect(() => {
        const updatedUrl = SITE_ID.length > 1 ? `${API_NODES}siteID=${SITE_ID}` : `${API_NODES}`;
        setApiUrl(updatedUrl);
        if (SITE_ID && SITE_ID !== '1') {
            const updatedAlertUrl = `${API_NODES_ALERTS}siteID=${SITE_ID}`;
            setApiUrlReport(updatedAlertUrl);
        }
    }, [SITE_ID]);

    return (
        <Container fluid>
            <Card>
                <CardBody>
                    <DMBreadCrumb links={[{ label: 'Nodes', link: '#' }]} />
                    <NavItem data={tabOptions} />
                    {activeTab === 1 && apiUrl !== '' ? <DMPaginatorTableWrapper user={user} dispatch={dispatch} isSelectable={false} showFilter="true" name="SITES" apiUrl={apiUrl} columns={TABLE_NODE} /> : null}
                    {activeTab === 2 ? <DMPaginatorTableWrapper subFilterTitle="Status" subFilter={ALERT_FILTERS} user={user} dispatch={dispatch} isSelectable={false} showFilter="true" name="NODES_ALERT" apiUrl={apiUrlReport} columns={GLOBAL_ALERTS} /> : null}
                </CardBody>
            </Card>
        </Container>
    );
};

// export default Node;
function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { user, nodes } = state;
    return {
        user,
        nodes,
    };
}

export default connect(mapStateToProps)(withTranslation()(Node));
