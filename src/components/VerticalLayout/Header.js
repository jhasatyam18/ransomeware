import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import NotificationDropdown from '../CommonForBoth/TopbarDropdown/NotificationDropdown';
import ProfileMenu from '../CommonForBoth/TopbarDropdown/ProfileMenu';
// import logoLightPng from '../../assets/images/logo-light.png';

// i18n

// Redux Store
import { changeLeftSidebarType } from '../../store/actions';

class Header extends Component {
  constructor(props) {
    super(props);
    // TOGGLE MENU
    this.toggleMenu = this.toggleMenu.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
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

  render() {
    return (
      <>
        <header id="page-topbar">
          <div className="navbar-header">
            <div className="d-flex">
              <div className="navbar-brand-box">

                {/* brand logo */}
                <Link to="/" className="logo logo-light">
                  <span className="logo-sm">
                    D
                  </span>
                  <span className="logo-lg">
                    DATAMOTIVE
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
            </div>
            <div className="d-flex">

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
  const { layout } = state;
  return { layout };
}
export default connect(mapStateToProps)(Header);

Header.propTypes = {
  t: PropTypes.any,
  toggleMenuCallback: PropTypes.any,
  toggleRightSidebar: PropTypes.func,
};
