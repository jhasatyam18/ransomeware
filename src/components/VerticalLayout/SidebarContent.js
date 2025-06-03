import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import MetisMenu from 'metismenujs';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
// i18n
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { APPLICATION_THEME, THEME_CONSTANT } from '../../constants/UserConstant';
import { getSideBarContents } from '../../utils/AppUtils';

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
    const theme = localStorage.getItem(APPLICATION_THEME) || '';
    if (path1 === pathname || path2 === pathname || path3 === pathname) {
      return THEME_CONSTANT.SIDEBAR_MENU_ACTIVE[theme];
    }
    return '';
  }

  renderIcon(item) {
    return (
      <FontAwesomeIcon style={{ color: this.isActive(item.isActivePath.join(',')), fontSize: '16px' }} className="sidebar-fa" icon={item.icon} size="lg" />
    );
  }

  renderItem(item) {
    const { t } = this.props;
    return (
      <li key={`sidebar-item-${item.label}`}>
        <Link to={item.to} className="waves-effect" style={{ color: this.isActive(item.isActivePath.join(',')) }}>
          {this.renderIcon(item)}
          <span className="pt-3">{t(item.label)}</span>
        </Link>
      </li>
    );
  }

  renderMenu(menuItems) {
    const { t } = this.props;
    const sidebarMenu = menuItems.map((menu, index) => {
      if (menu.hasSubMenu) {
        return (
          <li key={`sidebarmenu-${menu.label}-${index + 1}`}>
            <Link to="/#" className="has-arrow waves-effect" style={{ color: this.isActive(menu.isActivePath.join(',')) }}>
              <FontAwesomeIcon style={{ color: this.isActive(menu.isActivePath.join(',')), fontSize: '16px' }} className="sidebar-fa" icon={menu.icon} size="lg" />
              <span className="pt-3">{t(menu.label)}</span>
            </Link>
            <ul className="sub-menu">
              {this.renderMenu(menu.subMenu)}
            </ul>
          </li>
        );
      }
      return this.renderItem(menu);
    });
    return sidebarMenu;
  }

  render() {
    const menuItems = getSideBarContents();
    return (
      <>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            {this.renderMenu(menuItems)}
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
