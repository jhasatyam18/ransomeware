import React, { Component } from 'react';
import MetisMenu from 'metismenujs';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APPLICATION_THEME, THEME_CONSTANT } from '../constants/userConstant';
import { SideBarMenuItem } from '../interfaces/interface';
import { getSideBarContents } from '../utils/appUtils';
import withRouter from './withRoutes';

interface SidebarContentProps extends WithTranslation {
    type?: string;
}
type Theme = 'dark' | 'light';

class SidebarContent extends Component<SidebarContentProps> {
    componentDidMount() {
        this.initMenu();
    }

    componentDidUpdate(prevProps: SidebarContentProps) {
        const { type } = this.props;
        if (type !== prevProps.type) {
            this.initMenu();
        }
    }

    initMenu() {
        new MetisMenu('#side-menu');
    }

    isActive(path1: string, path2?: string, path3?: string): string {
        const { pathname } = window.location;
        const theme = localStorage.getItem(APPLICATION_THEME) as Theme;
        if (path1 === pathname || path2 === pathname || path3 === pathname) {
            return THEME_CONSTANT.SIDEBAR_MENU_ACTIVE[theme];
        }
        return '';
    }

    renderIcon(item: SideBarMenuItem) {
        return <FontAwesomeIcon icon={item.icon} style={{ fontSize: 15, color: this.isActive(item.isActivePath.join(',')), padding: '8px 6px 0px 6px' }} />;
    }

    renderItem(item: SideBarMenuItem) {
        const { t } = this.props;
        return (
            <li key={`sidebar-item-${item.label}`} className="responsive_height_sidebar_list">
                <Link to={item.to} className="waves-effect" style={{ color: this.isActive(item.isActivePath.join(',')) }}>
                    {this.renderIcon(item)}
                    <span>{t(item.label)}</span>
                </Link>
            </li>
        );
    }

    renderMenu(SideBarMenuItems: SideBarMenuItem[]) {
        const { t } = this.props;
        const sidebarMenu = SideBarMenuItems.map((menu, index) => {
            if (menu.hasSubMenu && menu.subMenu) {
                return (
                    <li key={`sidebarmenu-${menu.label}-${index + 1}`} className="responsive_height_sidebar_list">
                        <Link to="/#" className="has-arrow waves-effect" style={{ color: this.isActive(menu.isActivePath.join(',')) }}>
                            <FontAwesomeIcon icon={menu.icon} style={{ fontSize: 15, color: this.isActive(menu.isActivePath.join(',')), padding: '8px 6px 0px 6px' }} />
                            <span>{t(menu.label)}</span>
                        </Link>
                        <ul className="sub-menu">{this.renderMenu(menu.subMenu)}</ul>
                    </li>
                );
            }
            return this.renderItem(menu);
        });
        return sidebarMenu;
    }
    renderGlobalLabel(SideBarMenuItems: SideBarMenuItem[]) {
        const sidebarMenu = SideBarMenuItems.map((menu, index) => {
            if (menu.hasSubMenu && menu.subMenu) {
                return (
                    <>
                        <span id="sidebar-global">{menu.label}</span>
                        {this.renderMenu(menu.subMenu)}
                        {index === SideBarMenuItems.length - 1 ? null : <hr />}
                    </>
                );
            }
            return null;
        });
        return sidebarMenu;
    }

    render() {
        const SideBarMenuItems = getSideBarContents() as SideBarMenuItem[];
        return (
            <div id="sidebar-menu">
                <ul className="metismenu list-unstyled" id="side-menu">
                    {this.renderGlobalLabel(SideBarMenuItems)}
                </ul>
            </div>
        );
    }
}

export default withTranslation()(withRouter(SidebarContent));
