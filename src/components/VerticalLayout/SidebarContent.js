import PropTypes from 'prop-types';
import React, { Component } from 'react';

// MetisMenu
import MetisMenu from 'metismenujs';
import { Link } from 'react-router-dom';

// i18n
import { withTranslation } from 'react-i18next';
import { DASHBOARD_PATH, JOBS, PROTECTION_PLANS_PATH, SITES_PATH } from '../../constants/RouterConstants';

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

  // activateParentDropdown = (item) => {
  //   item.classList.add('active');
  //   const parent = item.parentElement;

  //   if (parent) {
  //     parent.classList.add('mm-active');
  //     const parent2 = parent.parentElement;

  //     if (parent2) {
  //       parent2.classList.add('mm-show');

  //       const parent3 = parent2.parentElement;

  //       if (parent3) {
  //         parent3.classList.add('mm-active'); // li
  //         parent3.childNodes[0].classList.add('mm-active'); // a
  //         const parent4 = parent3.parentElement;
  //         if (parent4) {
  //           parent4.classList.add('mm-active');
  //         }
  //       }
  //     }
  //     return false;
  //   }
  //   return false;
  // }

  initMenu() {
    // const { location } = this.props;
    // const { pathname } = location;
    new MetisMenu('#side-menu');
    // let matchingMenuItem = null;
    // const ul = document.getElementById('side-menu');
    // const items = ul.getElementsByTagName('a');
    // for (let i = 0; i < items.length; i += 1) {
    //   if (pathname === items[i].pathname) {
    //     matchingMenuItem = items[i];
    //     break;
    //   }
    // }
    // if (matchingMenuItem) {
    //   this.activateParentDropdown(matchingMenuItem);
    // }
  }

  isActive(path) {
    const { pathname } = window.location;
    if (path === pathname) {
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
              <Link to="/#" className="has-arrow waves-effect">
                <i className="fa fa-cog fa-s-lg" />
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
