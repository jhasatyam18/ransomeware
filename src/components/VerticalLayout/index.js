import PropTypes from 'prop-types';
import React, { Component, Suspense } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { ALERTS_PATH, DASHBOARD_PATH, EVENTS_PATH, JOBS_PATH, LOGIN_PATH, NODES_PATH, PROTECTION_PLANS_PATH, PROTECTION_PLAN_DETAILS_PATH, REPORTS_PATH, SETTINGS_PATH, SITES_PATH } from '../../constants/RouterConstants';
import Login from '../../pages/AuthenticationInner/Login';
import Pages404 from '../../pages/Page-404';
import DRPlans from '../data-recovery/DRPlans';
import Node from '../Settings/node/Node';
import Header from './Header';
import Sidebar from './Sidebar';
// lazy load components
const Dashboard = React.lazy(() => import('../Dashboard/Dashboard'));
const Sites = React.lazy(() => import('../Configure/Sites/Sites'));
const DRPlanDetails = React.lazy(() => import('../data-recovery/DRPlanDetails'));
const Jobs = React.lazy(() => import('../Jobs/Jobs'));
const Events = React.lazy(() => import('../Events/Events'));
const Alerts = React.lazy(() => import('../Alerts/Alerts'));
// const Settings = React.lazy(() => import('../Settings/Settings'));
const Report = React.lazy(() => import('../Report/Report'));
const Settings = React.lazy(() => import('../Settings/Settings'));

// Settings
// const EmailSettings = React.lazy(() => import('../Settings/email/EmailSettings'));
class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    };
    this.toggleMenuCallback = this.toggleMenuCallback.bind(this);
  }

  componentDidMount() {
    const { isPreloader, location } = this.props;
    const { pathname } = location;
    if (isPreloader === true) {
      document.getElementById('preloader').style.display = 'block';
      document.getElementById('status').style.display = 'block';

      setTimeout(() => {
        document.getElementById('preloader').style.display = 'none';
        document.getElementById('status').style.display = 'none';
      }, 2500);
    } else {
      document.getElementById('preloader').style.display = 'none';
      document.getElementById('status').style.display = 'none';
    }

    // Scroll Top to 0
    window.scrollTo(0, 0);
    const currentage = this.capitalizeFirstLetter(pathname);

    document.title = `${currentage} | Datamotive`;
  }

  toggleMenuCallback = () => {

  }

  capitalizeFirstLetter(string) {
    return string.charAt(1).toUpperCase() + string.slice(2);
  }

  render() {
    const {
      layout, sites, dispatch, user, drPlans,
    } = this.props;
    const { isMobile } = this.state;
    const { leftSideBarTheme, leftSideBarType } = layout;
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
          <Header
            toggleMenuCallback={this.toggleMenuCallback}
          />
          <Sidebar
            theme={leftSideBarTheme}
            type={leftSideBarType}
            isMobile={isMobile}
          />
          <div className="main-content">
            <div className="page-content">
              <Suspense fallback={<div>Loading...</div>}>
                <Switch>
                  <Route path={LOGIN_PATH} render={() => <Login {...this.props} />} />
                  <Route path={NODES_PATH} render={() => <Node />} />
                  <Route path={DASHBOARD_PATH} render={() => <Dashboard {...this.props} />} />
                  <Route path={SITES_PATH} render={() => <Sites user={user} sites={sites} dispatch={dispatch} />} />
                  <Route path={PROTECTION_PLANS_PATH} render={() => <DRPlans user={user} sites={sites} dispatch={dispatch} drPlans={drPlans} />} />
                  <Route path={PROTECTION_PLAN_DETAILS_PATH} render={() => <DRPlanDetails {...this.props} />} />
                  <Route path={JOBS_PATH} render={() => <Jobs protectionplanID={0} {...this.props} />} />
                  <Route path={EVENTS_PATH} render={() => <Events />} />
                  <Route path={ALERTS_PATH} render={() => <Alerts />} />
                  <Route path={REPORTS_PATH} render={() => <Report />} />
                  <Route path={SETTINGS_PATH} render={() => <Settings />} />
                  <Route component={Pages404} />
                </Switch>
              </Suspense>
            </div>
          </div>
          {/* <Footer /> */}
        </div>
      </>
    );
  }
}

Layout.propTypes = {
  children: PropTypes.any,
  isPreloader: PropTypes.bool,
  layoutWidth: PropTypes.any,
  leftSideBarTheme: PropTypes.any,
  leftSideBarType: PropTypes.any,
  location: PropTypes.object,
  showRightSidebar: PropTypes.any,
  topbarTheme: PropTypes.any,
  dispatch: PropTypes.func.isRequired,
  sites: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default (withRouter(Layout));
