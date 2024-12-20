/* eslint-disable no-unused-vars */
import React, { Component, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { UserInterface } from '../../interfaces/interfaces';
import { DASHBOARD_PATH, LOGIN_PATH, UPGRADE } from '../../Constants/routeConstants';
import { changePageTitle } from '../../utils/appUtils';
import Login from '../../pages/Authentication/Login';
import UpgradePage from '../../pages/upgrade/Upgrade';
import Loader from '../Shared/Loader';
import Header from './Header';
import Sidebar from './SideBar';
import withRouter from './withRouter';

interface LayoutProps {
    isPreloader: boolean;
    layoutWidth?: any;
    leftSideBarTheme?: any;
    leftSideBarType?: any;
    showRightSidebar?: any;
    topbarTheme?: any;
    dispatch: (...args: any[]) => any;
    user: UserInterface;
    location?: any;
    layout?: any;
    history?: any;
}

const Dashboard = React.lazy(() => import('./Dashboad'));

class Layout extends Component<LayoutProps> {
    state = {
        isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    };

    componentDidMount() {
        const { isPreloader } = this.props;
        // const { pathname } = history;
        if (isPreloader === true) {
            (document.getElementById('preloader') as HTMLDivElement).style.display = 'block';
            (document.getElementById('status') as HTMLDivElement).style.display = 'block';

            setTimeout(() => {
                (document.getElementById('preloader') as HTMLDivElement).style.display = 'none';
                (document.getElementById('status') as HTMLDivElement).style.display = 'none';
            }, 2500);
        } else {
            (document.getElementById('preloader') as HTMLDivElement).style.display = 'none';
            (document.getElementById('status') as HTMLDivElement).style.display = 'none';
        }

        // Scroll Top to 0

        window.scrollTo(0, 0);
        // const currentage = this.capitalizeFirstLetter(pathname);

        // document.title = `${currentage} | Datamotive`;
    }

    toggleMenuCallback = () => {
        // Implement your toggle logic here
    };

    capitalizeFirstLetter = (string: string) => {
        return string.charAt(1).toUpperCase() + string.slice(2);
    };

    renderRoutes = () => {
        const { user } = this.props;
        changePageTitle(user);

        return (
            <Suspense fallback={<Loader />}>
                <Routes>
                    <Route path={LOGIN_PATH} element={<Login {...this.props} />} />
                    <Route path={DASHBOARD_PATH} element={<Dashboard />} />
                    <Route path={UPGRADE} element={<UpgradePage {...this.props} />} />
                    <Route path="*" element={<Dashboard />} />
                </Routes>
            </Suspense>
        );
    };

    render() {
        return (
            <>
                <div id="preloader">
                    <div id="status">
                        <div className="spinner-chase">
                            <div className="chase-dot" />
                            <div className="chase-dot" />
                            <div className="chase-dot" />
                            <div className="chase-dot" />
                            <div className="chase-dot" />
                            <div className="chase-dot" />
                        </div>
                    </div>
                </div>
                <div id="layout-wrapper">
                    <Header />
                    <Sidebar />
                    <div className="main-content">
                        <div className="page-content">{this.renderRoutes()}</div>
                    </div>
                </div>
            </>
        );
    }
}

export default withRouter(Layout);
