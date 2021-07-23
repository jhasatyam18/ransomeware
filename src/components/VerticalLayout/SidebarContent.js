import PropTypes from 'prop-types';
import React, { Component } from 'react';

// MetisMenu
import MetisMenu from 'metismenujs';
import { Link } from 'react-router-dom';

// i18n
import { withTranslation } from 'react-i18next';
import { DASHBOARD_PATH, JOBS, PROTECTION_PLANS_PATH, SITES_PATH, Activity, Logs, Reports, Analytics, EVENTS, ALERTS } from '../../constants/RouterConstants';

class SidebarContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.initMenu();
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, ss) {
    const { type } = this.props;
    if (type !== prevProps.type) {
      this.initMenu();
    }
  }

  initMenu() {
    new MetisMenu('#side-menu');
  }

  isActive(path1, path2, path3) {
    const { pathname } = window.location;
    if (path1 === pathname || path2 === pathname || path3 === pathname) {
      return '#FFF';
    }
    return '';
  }

  render() {
    const { t } = this.props;
    return (
      <>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li>
              <Link to={DASHBOARD_PATH} className="waves-effect" style={{ color: this.isActive(DASHBOARD_PATH) }}>
                <i className="fa fa-desktop fa-s-lg" style={{ fontSize: 16, color: this.isActive(DASHBOARD_PATH) }} />
                <span>{t('dashboard')}</span>
              </Link>
            </li>
            <li>
              <Link to="/#" className="has-arrow waves-effect" style={{ color: this.isActive(SITES_PATH, PROTECTION_PLANS_PATH) }}>
                <i className="fa fa-cog fa-s-lg" style={{ fontSize: 16, color: this.isActive(SITES_PATH, PROTECTION_PLANS_PATH) }} />
                <span>{t('configure')}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to={SITES_PATH} style={{ color: this.isActive(SITES_PATH) }}>
                    <i className="bx bx-cloud" style={{ color: this.isActive(SITES_PATH) }} />
                    {t('sites')}
                  </Link>
                </li>
                <li>
                  <Link to={PROTECTION_PLANS_PATH} className="waves-effect" style={{ color: this.isActive(PROTECTION_PLANS_PATH) }}>
                    <i className="bx bx-layer" style={{ color: this.isActive(PROTECTION_PLANS_PATH) }} />
                    <span>{t('protection.plans')}</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to={JOBS} className="waves-effect" style={{ color: this.isActive(JOBS) }}>
                <i className="fa fa-tasks" style={{ fontSize: 16, color: this.isActive(JOBS) }} />
                <span>{t('jobs')}</span>
              </Link>
            </li>
            <li>
              <Link to="/#" className="has-arrow waves-effect" style={{ color: this.isActive(Activity, Logs, Reports) }}>
                <i className="fa fa-chart-bar fa-s-lg" style={{ fontSize: 16, color: this.isActive(Activity, Logs, Reports) }} />
                <span>{t('Monitor')}</span>
              </Link>
              <ul className="sub-menu" aria-expanded="false">
                <li>
                  <Link to={EVENTS} style={{ color: this.isActive(EVENTS) }}>
                    <i className="bx bxs-calendar-event" style={{ fontSize: 16, color: this.isActive(EVENTS) }} />
                    {t('Events')}
                  </Link>
                </li>
                <li>
                  <Link to={ALERTS} style={{ color: this.isActive(ALERTS) }}>
                    <i className="bx bx-alarm" style={{ fontSize: 16, color: this.isActive(ALERTS) }} />
                    <span>Alerts</span>
                  </Link>
                </li>
                <li>
                  <Link to="/Reports" className="waves-effect" style={{ color: this.isActive('/Reports') }}>
                    <i className="bx bxs-report" style={{ fontSize: 16, color: this.isActive('/Reports') }} />
                    <span>Reports</span>
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link to="/Analytics" className="waves-effect" style={{ color: this.isActive(Analytics) }}>
                <i className="bx bx-stats" style={{ fontSize: 16, color: this.isActive(Analytics) }} />
                <span>Analytics</span>
              </Link>
            </li>
          </ul>
        </div>
      </>
    );
  }
}

SidebarContent.propTypes = {
  t: PropTypes.any,
  type: PropTypes.string,
};

export default (withTranslation()(SidebarContent));
