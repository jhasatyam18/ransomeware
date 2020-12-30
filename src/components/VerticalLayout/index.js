import React, { Component, Suspense } from 'react';
import PropTypes from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import DRPlans from '../data-recovery/DRPlans';
import {
  DASHBOARD_PATH, SITES_PATH, LOGIN_PATH, PROTECTION_PLANS_PATH, PROTECTION_PLAN_DETAILS, REPLICATIONS,
} from '../../constants/RouterConstants';
import Pages404 from '../../pages/Page-404';
import Login from '../../pages/AuthenticationInner/Login';
import Sidebar from './Sidebar';
import Header from './Header';

// lazy load components
const Dashboard = React.lazy(() => import('components/Dashboard/Dashboard'));
const Sites = React.lazy(() => import('components/Configure/Sites/Sites'));
const DRPlanDetails = React.lazy(() => import('components/data-recovery/DRPlanDetails'));
const ReplicationJobs = React.lazy(() => import('components/Replication/ReplicationJobs'));

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
                  <Route path={DASHBOARD_PATH} render={() => <Dashboard />} />
                  <Route path={SITES_PATH} render={() => <Sites user={user} sites={sites} dispatch={dispatch} />} />
                  <Route path={PROTECTION_PLANS_PATH} render={() => <DRPlans user={user} sites={sites} dispatch={dispatch} drPlans={drPlans} />} />
                  <Route path={PROTECTION_PLAN_DETAILS} render={() => <DRPlanDetails {...this.props} />} />
                  <Route path={REPLICATIONS} render={() => <ReplicationJobs drPlanID={0} {...this.props} />} />
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
