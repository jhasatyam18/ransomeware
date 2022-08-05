import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { addMessage } from '../../store/actions/MessageActions';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { API_FETCH_SITES } from '../../constants/ApiConstants';
import { callAPI } from '../../utils/ApiUtils';
import { PLATFORM_TYPES } from '../../constants/InputConstants';
import NotificationDropdown from '../CommonForBoth/TopbarDropdown/NotificationDropdown';
import ProfileMenu from '../CommonForBoth/TopbarDropdown/ProfileMenu';
import dmlogoname from '../../assets/images/logo_name.png';
import dmlogo from '../../assets/images/dm_logo.png';

// Redux Store
import { changeLeftSidebarType, refresh } from '../../store/actions';

export function Header(props) {
  const [vcIp, setVcIp] = useState('');
  const { sites, user } = props;
  const { platformType } = user;
  useEffect(() => {
    if (platformType === PLATFORM_TYPES.VMware) {
      if (vcIp === '') {
        if (!sites.sites || sites.sites.length === 0) {
          fetchVCIp();
        } else {
          sites.sites.forEach((s) => {
            if (s.node.isLocalNode) {
              setVcIp(s.platformDetails.hostname);
            }
          });
        }
      } else {
        let index;
        if (sites) {
          sites.sites.forEach((s, i) => {
            if (s.node.hostname === user.localVMIP) {
              index = i;
            }
          });
          if (typeof sites.sites[index] === 'undefined') {
            setVcIp('');
          }
        }
      }
    }
  },
  [sites.sites]);

  function fetchVCIp() {
    const { dispatch } = props;
    callAPI(API_FETCH_SITES)
      .then((json) => {
        let IP = '';
        json.map((site) => {
          if (site.node.isLocalNode) {
            const vcIP = site.platformDetails.hostname;
            IP = vcIP;
          }
        });
        setVcIp(IP);
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  }

  const onRefresh = () => {
    const { dispatch } = props;
    dispatch(refresh());
  };

  const toggleMenu = () => {
    const { dispatch, layout } = props;
    const { leftSideBarType } = layout;
    if (leftSideBarType === 'default') {
      dispatch(changeLeftSidebarType('condensed', false));
    } else if (leftSideBarType === 'condensed') {
      dispatch(changeLeftSidebarType('default', false));
    }
  };

  const toggleFullscreen = () => {
    if (
      !document.fullscreenElement
      /* alternative standard method */ && !document.mozFullScreenElement
      && !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(
          Element.ALLOW_KEYBOARD_INPUT,
        );
      }
    } else if (document.cancelFullScreen) {
      document.cancelFullScreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen();
    }
  };

  const renderAppType = () => {
    const { zone } = user;
    let type = `${platformType}`;
    const appZone = (typeof zone !== 'undefined' ? `${zone}` : '');
    if (vcIp !== '') {
      type += ` - ${vcIp}`;
    }
    return (
      <div className="dropdown d-none d-lg-inline-block ml-1">
        <button type="button" className="btn header-item noti-icon waves-effect">
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
            <div className="navbar-brand-box">
              <Link to="/" className="logo logo-light">
                <span className="logo-sm">
                  <img src={dmlogo} className="logo-size" alt="DATAMOTIVE" />
                </span>
                <span className="logo-lg">
                  <img src={dmlogoname} className="logo-name-size" alt="DATAMOTIVE" />
                </span>
              </Link>
            </div>
            <button
              type="button"
              onClick={toggleMenu}
              className="btn btn-sm px-3 font-size-16 header-item waves-effect"
              id="vertical-menu-btn"
            >
              <i className="fa fa-bars" />
            </button>
            {renderAppType()}
          </div>
          <div className="d-flex">
            <div className="dropdown d-none d-lg-inline-block ml-1">
              <button
                type="button"
                onClick={onRefresh}
                className="btn header-item noti-icon waves-effect"
                data-toggle="refresh"
              >
                <box-icon name="refresh" color="#a6b0cf" animation="spin-hover" />
              </button>
            </div>
            <div className="dropdown d-none d-lg-inline-block ml-1">
              <button
                type="button"
                onClick={toggleFullscreen}
                className="btn header-item noti-icon waves-effect"
                data-toggle="fullscreen"
              >
                <box-icon name="fullscreen" color="#a6b0cf" />
              </button>
            </div>

            <NotificationDropdown />
            <ProfileMenu {...props} />
          </div>
        </div>
      </header>
    </>
  );
}

function mapStateToProps(state) {
  const { layout, user, dispatch, sites } = state;
  return { layout, user, dispatch, sites };
}
export default connect(mapStateToProps)(Header);

Header.propTypes = {
  t: PropTypes.any,
  toggleMenuCallback: PropTypes.any,
  toggleRightSidebar: PropTypes.func,
};
