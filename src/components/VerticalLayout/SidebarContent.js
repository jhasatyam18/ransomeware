// MetisMenu
import MetisMenu from 'metismenujs';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
// i18n
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
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
    if (path1 === pathname || path2 === pathname || path3 === pathname) {
      return '#FFF';
    }
    return '';
  }

  renderIcon(item) {
    return (
      <i className={item.icon} style={{ fontSize: 16, color: this.isActive(item.isActivePath.join(',')) }} />
    );
  }

  renderItem(item) {
    const { t } = this.props;
    return (
      <li>
        <Link to={item.to} className="waves-effect" style={{ color: this.isActive(item.isActivePath.join(',')) }}>
          {this.renderIcon(item)}
          <span>{t(item.label)}</span>
        </Link>
      </li>
    );
  }

  renderMenu(menuItems) {
    const { t } = this.props;
    const sidebarMenu = menuItems.map((menu) => {
      if (menu.hasSubMenu) {
        return (
          <li>
            <Link to="/#" className="has-arrow waves-effect" style={{ color: this.isActive(menu.isActivePath.join(',')) }}>
              <i className={menu.icon} style={{ fontSize: 16, color: this.isActive(menu.isActivePath.join(',')) }} />
              <span>{t(menu.label)}</span>
            </Link>
            <ul className="sub-menu" aria-expanded="false">
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
