import { faBars, faExpand, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dispatch } from 'redux';
import dmlogo from '../assets/images/dm_logo.png';
import { GlobalInterface, INITIAL_STATE_INTERFACE, LayoutState, UserInterface } from '../interfaces/interface';
import { changeLeftSidebarType } from '../store/actions/actions';
import ProfileMenu from './ProfileMenu';
import HeaderDropdown from '../components/shared/HeaderDropdown';
import { findDifferenceInTimeFromNow, refresh } from '../utils/appUtils';
import { RESTRICTED_LAST_SYNC_ROUTES, STATIC_KEYS } from '../constants/StoreKey';
import NotificationDropdown from '../components/dashboard/NotificationDropdown';
import { DASHBOARD_PATH } from '../constants/routeConstant';
import { useLocation } from 'react-router-dom';

interface HeaderProps extends WithTranslation {
    user: UserInterface;
    dispatch: Dispatch<any>;
    layout?: LayoutState;
    global: GlobalInterface;
}

const Header: React.FC<HeaderProps> = ({ user, dispatch, layout, global }) => {
    const { lastSyncTime } = global;
    const location = useLocation();
    const isRestrictedPage = RESTRICTED_LAST_SYNC_ROUTES.some((path) => location.pathname.includes(path));
    const toggleMenu = () => {
        const { leftSideBarType } = layout || {};
        if (leftSideBarType === 'default') {
            dispatch(changeLeftSidebarType('condensed', false));
        } else if (leftSideBarType === 'condensed') {
            dispatch(changeLeftSidebarType('default', false));
        }
    };

    const toggleFullscreen = () => {
        const doc = document as any;
        const docEl = document.documentElement as any;

        if (!document.fullscreenElement) {
            if (docEl.requestFullscreen) {
                docEl.requestFullscreen();
            } else if (docEl.mozRequestFullScreen) {
                docEl.mozRequestFullScreen();
            } else if (docEl.webkitRequestFullscreen) {
                docEl.webkitRequestFullscreen();
            } else if (docEl.msRequestFullscreen) {
                docEl.msRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (doc.mozCancelFullScreen) {
                doc.mozCancelFullScreen();
            } else if (doc.webkitExitFullscreen) {
                doc.webkitExitFullscreen();
            } else if (doc.msExitFullscreen) {
                doc.msExitFullscreen();
            }
        }
    };

    const onRefresh = () => {
        dispatch(refresh());
    };
    const renderHeaderDropdown = () => {
        return (
            <div className="dropdown d-none d-lg-inline-block ms-2 mt-3" style={{ width: '250px' }}>
                <HeaderDropdown fieldKey={STATIC_KEYS.GLOBAL_SITE_KEY} />
            </div>
        );
    };

    return (
        <>
            <header id="page-topbar">
                <div className="navbar-header">
                    <div className="d-flex">
                        <div className="navbar-brand-box  pl-2 pr-5">
                            <Link to={DASHBOARD_PATH} style={{ position: 'relative', top: '14px' }} className="logo d-flex align-items-center">
                                <span>
                                    <img src={dmlogo} alt="Datamotive Logo" width={37} height={37} style={{ objectFit: 'contain' }} className="logo-size" />
                                </span>
                                <div className="logo-lg dm-logo-color">
                                    <p style={{ fontSize: '21px', fontWeight: 'none' }} className="mb-0  mt-2">
                                        DATAMOTIVE
                                    </p>
                                    <small style={{ position: 'relative', top: '-10px', fontSize: '9px' }}>Eliminating Cloud Boundaries</small>
                                </div>
                            </Link>
                        </div>
                        <button type="button" onClick={toggleMenu} className="btn btn-sm px-3 font-size-16 header-item waves-effect" id="vertical-menu-btn">
                            <FontAwesomeIcon size="lg" icon={faBars} />
                        </button>
                        {renderHeaderDropdown()}
                    </div>
                    <div className="d-flex">
                        {!isRestrictedPage && lastSyncTime && lastSyncTime > 0 ? (
                            <div className="dropdown d-lg-inline-block">
                                <button type="button" className="btn header-item noti-icon waves-effect" data-toggle="refresh">
                                    <span className="">Last Sync Time : {findDifferenceInTimeFromNow(lastSyncTime)}</span>
                                </button>
                            </div>
                        ) : null}
                        <div className="dropdown d-lg-inline-block">
                            <button onClick={onRefresh} type="button" className="btn header-item noti-icon waves-effect" data-toggle="refresh">
                                <FontAwesomeIcon size="lg" icon={faRefresh} className="fa-spin-hover" />
                            </button>
                        </div>
                        <div className="dropdown d-lg-inline-block ml-1">
                            <button type="button" onClick={toggleFullscreen} className="btn header-item noti-icon waves-effect" data-toggle="fullscreen">
                                <FontAwesomeIcon size="lg" icon={faExpand} />
                            </button>
                        </div>
                        <NotificationDropdown />
                        <ProfileMenu />
                    </div>
                </div>
            </header>
        </>
    );
};

function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { user, nodes, layout, global } = state;
    return {
        user,
        nodes,
        layout,
        global,
    };
}

export default connect(mapStateToProps)(withTranslation()(Header));
