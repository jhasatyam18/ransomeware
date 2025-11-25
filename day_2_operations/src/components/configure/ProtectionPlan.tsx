import React, { useEffect, useState } from 'react';
import { ALERT_FILTERS, GLOBAL_ALERTS, PLAN_TABLE } from '../../constant/tableConstant';
import { Card, CardBody, Container } from 'reactstrap';
import NavItem from '../shared/NavItem';
import { INITIAL_STATE_INTERFACE, UserInterface } from '../../interfaces/interface';
import { connect } from 'react-redux';
import DMBreadCrumb from '../shared/DMBreadCrumb';
import { API_PLAN, API_PLAN_ALERTS } from '../../constants/ApiUrlConstant';
import { AppDispatch } from '../../store';
import DMPaginatorTableWrapper from '../shared/DMPaginatorTableWrapper';
import { getValue } from '../../utils/apiUtils';
import { STATIC_KEYS } from '../../constants/StoreKey';
import useEnforceNonGlobal from '../dashboard/EnforceNonGlobal';
type PlanType = {
    dispatch: AppDispatch;
    user: UserInterface;
};
const ProtectionPlan: React.FC<PlanType> = ({ dispatch, user }) => {
    const { activeTab, values } = user;
    const [apiUrl, setApiUrl] = useState<string>('');
    const [apiUrlReport, setApiUrlReport] = useState<string>('');
    const SITE_ID = getValue({ key: STATIC_KEYS.GLOBAL_SITE_KEY, values }) || '1';
    const tabOptions = [{ title: 'Summary' }, { title: 'Alerts' }];
    const OPTIONS = getValue({ key: STATIC_KEYS.GLOBAL_OPT_SITE_DATA, values }) || [];
    useEnforceNonGlobal(SITE_ID, OPTIONS, dispatch, activeTab === 2);
    useEffect(() => {
        const updatedUrl = SITE_ID.length > 1 ? `${API_PLAN}siteID=${SITE_ID}&sortColumn=replicationInterval&sortOrder=asc` : `${API_PLAN}sortColumn=replicationInterval&sortOrder=asc`;
        setApiUrl(updatedUrl);
        if (SITE_ID && SITE_ID !== '1') {
            const updatedAlertUrl = `${API_PLAN_ALERTS}siteID=${SITE_ID}`;
            setApiUrlReport(updatedAlertUrl);
        }
    }, [SITE_ID]);

    return (
        <Container fluid>
            <Card>
                <CardBody>
                    <DMBreadCrumb links={[{ label: 'Protection Plan', link: '#' }]} />
                    <NavItem data={tabOptions} />
                    {activeTab === 1 && apiUrl !== '' ? <DMPaginatorTableWrapper user={user} dispatch={dispatch} isSelectable={false} showFilter="true" name="PROTECTION_PLAN" apiUrl={apiUrl} columns={PLAN_TABLE} /> : null}
                    {activeTab === 2 ? <DMPaginatorTableWrapper subFilterTitle="Status" subFilter={ALERT_FILTERS} user={user} dispatch={dispatch} isSelectable={false} showFilter="true" name="PLAN_ALERT" apiUrl={apiUrlReport} columns={GLOBAL_ALERTS} /> : null}
                </CardBody>
            </Card>
        </Container>
    );
};

// export default Node;
function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { user, plan } = state;
    return {
        user,
        plan,
    };
}
export default connect(mapStateToProps)(ProtectionPlan);
