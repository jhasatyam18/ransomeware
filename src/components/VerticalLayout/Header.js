import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import NotificationDropdown from '../CommonForBoth/TopbarDropdown/NotificationDropdown';
import ProfileMenu from '../CommonForBoth/TopbarDropdown/ProfileMenu';
import dmlogoname from '../../assets/images/logo_name.png';
import dmlogo from '../../assets/images/dm_logo.png';

// Redux Store
import { changeLeftSidebarType, refresh } from '../../store/actions';
import { APP_TYPE } from '../../constants/InputConstants';

class Header extends Component {
  constructor(props) {
    super(props);
    // TOGGLE MENU
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
  }

  onRefresh() {
    const { dispatch } = this.props;
    dispatch(refresh());
  }

  toggleMenu() {
    const { dispatch, layout } = this.props;
    const { leftSideBarType } = layout;
    if (leftSideBarType === 'default') {
      dispatch(changeLeftSidebarType('condensed', false));
    } else if (leftSideBarType === 'condensed') {
      dispatch(changeLeftSidebarType('default', false));
    }
  }

  toggleFullscreen() {
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
  }

  renderAppType() {
    const { user } = this.props;
    const { appType, platformType } = user;
    const type = appType === APP_TYPE.CLIENT ? `${platformType}-Client` : `${platformType}-Server`;
    return (
      <div className="dropdown d-none d-lg-inline-block ml-1">
        <button type="button" className="btn header-item noti-icon waves-effect">
          {` ${type}`}
        </button>
      </div>
    );
  }

  render() {
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
                onClick={this.toggleMenu}
                className="btn btn-sm px-3 font-size-16 header-item waves-effect"
                id="vertical-menu-btn"
              >
                <i className="fa fa-bars" />
              </button>
              {this.renderAppType()}
            </div>
            <div className="d-flex">
              <div className="dropdown d-none d-lg-inline-block ml-1">
                <button
                  type="button"
                  onClick={this.onRefresh}
                  className="btn header-item noti-icon waves-effect"
                  data-toggle="refresh"
                >
                  <box-icon name="refresh" color="#a6b0cf" animation="spin-hover" />
                </button>
              </div>
              <div className="dropdown d-none d-lg-inline-block ml-1">
                <button
                  type="button"
                  onClick={this.toggleFullscreen}
                  className="btn header-item noti-icon waves-effect"
                  data-toggle="fullscreen"
                >
                  <box-icon name="fullscreen" color="#a6b0cf" />
                </button>
              </div>

              <NotificationDropdown />
              <ProfileMenu {...this.props} />
            </div>
          </div>
        </header>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { layout, user } = state;
  return { layout, user };
}
export default connect(mapStateToProps)(Header);

Header.propTypes = {
  t: PropTypes.any,
  toggleMenuCallback: PropTypes.any,
  toggleRightSidebar: PropTypes.func,
};
