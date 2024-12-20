import { faExpand, faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dispatch } from 'redux';
import dmlogo from '../../assets/images/dm_logo.png';
import dmlogoname from '../../assets/images/logo_name.png';
import { INITIAL_STATE, SiteInterface, UserInterface } from '../../interfaces/interfaces';
import { SITE_API } from '../../Constants/apiConstants';
import { PLATFORM_TYPES } from '../../Constants/InputConstants';
import { callAPI } from '../../utils/apiUtils';
import { changeLeftSidebarType, refresh } from '../../store/actions/actions';
import ProfileMenu from './ProfileMenu';
import { addMessage } from '../../store/actions/MessageActions';
import { MESSAGE_TYPES } from '../../Constants/MessageConstants';

interface HeaderProps extends WithTranslation {
    user: UserInterface;
    dispatch: Dispatch<any>;
    layout: any;
}

const Header: React.FC<HeaderProps> = ({ user, dispatch, layout }) => {
    const [vcIp, setVcIp] = useState('');
    const [siteData, setSiteData] = useState<SiteInterface[]>([]);
    const { platformType } = user;

    useEffect(() => {
        callAPI(SITE_API).then(
            (data) => {
                setSiteData(data);
            },
            (err) => {
                dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
            },
        );
        if (platformType === PLATFORM_TYPES.VMware) {
            if (vcIp === '') {
                if (!siteData || siteData.length === 0) {
                    fetchVCIp();
                } else {
                    siteData.forEach((s) => {
                        if (s.node.isLocalNode) {
                            setVcIp(s.platformDetails.hostname);
                        }
                    });
                }
            } else {
                let index: number = 0;
                if (siteData) {
                    siteData.forEach((s, i) => {
                        if (s.node.hostname === user.localVMIP) {
                            index = i;
                        }
                    });
                    if (typeof siteData[index] === 'undefined') {
                        setVcIp('');
                    }
                }
            }
        }
    }, []);

    const onRefresh = () => {
        dispatch(refresh());
    };

    const toggleMenu = () => {
        const { leftSideBarType } = layout;
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

    function fetchVCIp() {
        let IP = '';
        if (siteData.length > 0) {
            siteData.map((site: SiteInterface) => {
                if (site.node.isLocalNode) {
                    const vcIP = site.platformDetails.hostname;
                    IP = vcIP;
                }
            });
            setVcIp(IP);
        }
    }

    const renderAppType = () => {
        const { zone } = user;
        let type = `${platformType}`;
        const appZone = typeof zone !== 'undefined' ? `${zone}` : '';
        if (vcIp !== '') {
            type += ` - ${vcIp}`;
        }
        return (
            <div className="dropdown d-none d-lg-inline-block ml-1">
                <button type="button" className="btn platform-header noti-icon waves-effect">
                    {` ${type} ${appZone}`}
                </button>
            </div>
        );
    };

    return (
        <>
            <header id="page-topbar">
                <div className="navbar-header">
                    <div className="d-flex">
                        <div className="navbar-brand-box  pl-2 pr-5">
                            <Link to="/" className="logo logo-light">
                                <span className="logo-sm ml-2">
                                    <img src={dmlogo} className="logo-size" alt="DATAMOTIVE" />
                                </span>
                                <span className="logo-lg">
                                    <img src={dmlogoname} className="logo-name-size" alt="DATAMOTIVE" />
                                </span>
                            </Link>
                        </div>
                        <button type="button" onClick={toggleMenu} className="btn btn-sm px-3 font-size-16 header-item waves-effect" id="vertical-menu-btn">
                            <i className="fa fa-bars" />
                        </button>
                        {renderAppType()}
                    </div>
                    <div className="d-flex">
                        <div className="dropdown d-lg-inline-block">
                            <button type="button" onClick={onRefresh} className="btn header-item noti-icon waves-effect" data-toggle="refresh">
                                <FontAwesomeIcon size="lg" icon={faRefresh} className="fa-spin-hover" />
                            </button>
                        </div>
                        <div className="dropdown d-lg-inline-block ml-1">
                            <button type="button" onClick={toggleFullscreen} className="btn header-item noti-icon waves-effect" data-toggle="fullscreen">
                                <FontAwesomeIcon size="lg" icon={faExpand} />
                            </button>
                        </div>
                        <ProfileMenu />
                    </div>
                </div>
            </header>
        </>
    );
};

const mapStateToProps = (state: INITIAL_STATE) => {
    const { layout, user } = state;
    return { layout, user };
};

export default connect(mapStateToProps)(withTranslation()(Header));
