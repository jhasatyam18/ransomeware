import React, { Suspense, useEffect } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Route, Routes } from 'react-router-dom';
import { DASHBOARD_PATH, INSTANCES, JOBS_RECOVERY_PATH, LICENSE, MONITOR_ALERTS, MONITOR_EVENTS, NODES_PATH, PROTECTION_PLANS_PATH, RECOVERY_JOBS, REPLICATION_JOBS, SITE_PRIORITY, SITES_PATH, SUPPORT_BUNDLE_PATH } from '../constants/routeConstant';
import Node from '../components/configure/Node';
import Site from '../components/configure/Site';
import ProtectionPlan from '../components/configure/ProtectionPlan';
import Replication from '../components/job/Replication';
import GlobalAlerts from '../components/configure/GlobalAlerts';
import Instances from '../components/configure/Instances';
import Recovery from '../pages/Recovery';
import SitePriority from '../components/dashboard/SitePriority';
import { changeLeftSidebarType } from '../store/actions/actions';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { INITIAL_STATE_INTERFACE, UserInterface } from '../interfaces/interface';
import { AppDispatch } from '../store';
import License from '../components/dashboard/License';
import Support from '../components/Settings/Support';

const Dashboard = React.lazy(() => import('../components/dashboard/index'));

interface Props {
    isPreloader?: boolean;
    location?: {
        pathname: string;
    };
    dispatch: AppDispatch;
    user: UserInterface;
}

const Layout: React.FC<Props> = ({ isPreloader, location, dispatch, user }) => {
    useEffect(() => {
        const preloader = document.getElementById('preloader') as HTMLElement | null;
        const status = document.getElementById('status') as HTMLElement | null;
        dispatch(changeLeftSidebarType('condensed', false));
        if (isPreloader) {
            preloader?.style.setProperty('display', 'block');
            status?.style.setProperty('display', 'block');

            setTimeout(() => {
                preloader?.style.setProperty('display', 'none');
                status?.style.setProperty('display', 'none');
            }, 2500);
        } else {
            preloader?.style.setProperty('display', 'none');
            status?.style.setProperty('display', 'none');
        }

        // Scroll Top to 0
        window.scrollTo(0, 0);

        // Update page title
        document.title = ` Datamotive`;
    }, []); // Dependency array ensures correct updates

    const renderRoutes = () => {
        return (
            <Suspense>
                <Routes>
                    <Route path={DASHBOARD_PATH} element={<Dashboard text={'Dashboard'} />} />
                    <Route path={NODES_PATH} element={<Node />} />
                    <Route path={SITES_PATH} element={<Site />} />
                    <Route path={PROTECTION_PLANS_PATH} element={<ProtectionPlan />} />
                    <Route path={REPLICATION_JOBS} element={<Replication />} />
                    <Route path={JOBS_RECOVERY_PATH} element={<Recovery />} />
                    <Route path={RECOVERY_JOBS} element={<Dashboard text={'Recopvery Jobs'} />} />
                    <Route path={MONITOR_EVENTS} element={<Dashboard text={'Events'} />} />
                    <Route path={MONITOR_ALERTS} element={<GlobalAlerts />} />
                    <Route path={INSTANCES} element={<Instances />} />
                    <Route path={SITE_PRIORITY} element={<SitePriority />} />
                    <Route path={LICENSE} element={<License />} />
                    <Route path={SUPPORT_BUNDLE_PATH} element={<Support />} />
                    <Route path="*" element={<Dashboard text={'Alerts'} />} />
                </Routes>
            </Suspense>
        );
    };
    return (
        <>
            <div id="layout-wrapper">
                <Header />
                <Sidebar />
                <div className="main-content">
                    <div className="page-content">{renderRoutes()}</div>
                </div>
            </div>
        </>
    );
};
function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { user, nodes, layout } = state;
    return {
        user,
        nodes,
        layout,
    };
}

export default connect(mapStateToProps)(withTranslation()(Layout));
