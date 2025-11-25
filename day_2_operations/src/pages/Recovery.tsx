import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, Container } from 'reactstrap';
import { RECOVERY_JOBS, GLOBAL_ALERTS, ALERT_FILTERS } from '../constant/tableConstant';
import { API_RECOVERY, API_RECOVERY_ALERTS } from '../constants/ApiUrlConstant';
import { INITIAL_STATE_INTERFACE, UserInterface } from '../interfaces/interface';
import DMBreadCrumb from '../components/shared/DMBreadCrumb';
import NavItem from '../components/shared/NavItem';
import { AppDispatch } from '../store';
import { STATIC_KEYS } from '../constants/StoreKey';
import { getValue } from '../utils/apiUtils';
import DMPaginatorTableWrapper from '../components/shared/DMPaginatorTableWrapper';
import useEnforceNonGlobal from '../components/dashboard/EnforceNonGlobal';
interface SiteProps {
    dispatch: AppDispatch;
    user: UserInterface;
}
const Recovery: React.FC<SiteProps> = ({ dispatch, user }) => {
    const [apiUrl, setApiUrl] = useState<string>('');
    const [apiUrlReport, setApiUrlReport] = useState<string>('');
    const { activeTab, values } = user;
    const SITE_ID = getValue({ key: STATIC_KEYS.GLOBAL_SITE_KEY, values }) || '1';
    const OPTIONS = getValue({ key: STATIC_KEYS.GLOBAL_OPT_SITE_DATA, values }) || [];
    useEnforceNonGlobal(SITE_ID, OPTIONS, dispatch);

    useEffect(() => {
        if (SITE_ID && SITE_ID !== '1') {
            if (activeTab === 2) {
                const updatedAlertUrl = `${API_RECOVERY_ALERTS}siteID=${SITE_ID}`;
                setApiUrlReport(updatedAlertUrl);
            } else {
                const updatedUrl = `${API_RECOVERY}siteID=${SITE_ID}`;
                setApiUrl(updatedUrl);
            }
        }
    }, [SITE_ID, activeTab]);

    return (
        <>
            <Container fluid>
                <Card>
                    <CardBody>
                        <DMBreadCrumb links={[{ label: 'Recovery Jobs', link: '#' }]} />
                        <NavItem data={[{ title: 'Summary' }, { title: 'Alerts' }]} />
                        {activeTab === 1 ? <DMPaginatorTableWrapper user={user} dispatch={dispatch} isSelectable={false} showFilter="true" name="RECOVERY" apiUrl={apiUrl} columns={RECOVERY_JOBS} /> : null}
                        {activeTab === 2 ? <DMPaginatorTableWrapper subFilterTitle="Status" subFilter={ALERT_FILTERS} user={user} dispatch={dispatch} isSelectable={false} showFilter="true" name="RECOVERY_ALERT" apiUrl={apiUrlReport} columns={GLOBAL_ALERTS} /> : null}
                    </CardBody>
                </Card>
            </Container>
        </>
    );
};

function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { global, nodes, user, jobs } = state;
    return {
        global,
        nodes,
        user,
        jobs,
    };
}

export default connect(mapStateToProps)(withTranslation()(Recovery));
