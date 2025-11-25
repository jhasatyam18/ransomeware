import { faBook, faChevronDown, faCircleArrowUp, faCircleInfo, faKey, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
// users
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
// i18n
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Dropdown, DropdownItem, DropdownMenu, DropdownToggle,
} from 'reactstrap';
import { LOGIN_PATH, systemConst } from '../../../constants/RouterConstants';
import { AddUserThemePreference, setUserPreferences } from '../../../store/actions/UserPreferenceAction';
import { API_LOGOUT, API_SAML_LOGOUT, routeStart } from '../../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../../constants/MessageConstants';
import { MODAL_ABOUT } from '../../../constants/Modalconstant';
import { APPLICATION_API_USER, APPLICATION_THEME } from '../../../constants/UserConstant';
// users
import { initChangePassword, logOutUser, removeCookies, setUserDetails } from '../../../store/actions';
import { addMessage } from '../../../store/actions/MessageActions';
import { openModal } from '../../../store/actions/ModalActions';
import { API_TYPES, callAPI, createPayload } from '../../../utils/ApiUtils';
import { getCookie } from '../../../utils/CookieUtils';
import { fetchByDelay } from '../../../utils/SlowFetch';

class ProfileMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
    };
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
    this.aboutModal = this.aboutModal.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.toggleTheme = this.toggleTheme.bind(this);
  }

  logout() {
    const { dispatch, user } = this.props;
    const obj = createPayload(API_TYPES.POST, {});
    const { id = 0 } = user;
    // check if the user is logged in using SAML
    // if yes, then redirect to the SAML logout page
    if (id === 0) {
      window.open(`https://${window.location.host}/${API_SAML_LOGOUT}`, '_self');
      return;
    }
    callAPI(API_LOGOUT, obj).then(() => {
      dispatch(removeCookies());
      fetchByDelay(dispatch, logOutUser, 100);
      dispatch(setUserPreferences({}));
      dispatch(setUserDetails({}));
    },
    (err) => {
      dispatch(logOutUser());
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  }

  aboutModal() {
    const { dispatch } = this.props;
    dispatch(openModal(MODAL_ABOUT, { title: 'About' }));
  }

  changePassword() {
    const { dispatch } = this.props;
    dispatch(initChangePassword(true, true));
  }

  toggle() {
    this.setState((prevState) => ({
      menu: !prevState.menu,
    }));
  }

  toggleTheme() {
    const { dispatch } = this.props;
    dispatch(AddUserThemePreference());
  }

  renderChangePassword() {
    const { t } = this.props;
    return (
      <>
        <DropdownItem onClick={this.changePassword}>
          <FontAwesomeIcon size="lg" icon={faKey} />
          &nbsp;&nbsp;
          {t('change.password')}
        </DropdownItem>
        <div className="dropdown-divider" />
      </>
    );
  }

  render() {
    const { menu } = this.state;
    const { t, user } = this.props;
    const { id, localVMIP } = user;
    const name = getCookie(APPLICATION_API_USER) || '';
    const theme = localStorage.getItem(APPLICATION_THEME) || '';

    return (
      <>
        <Dropdown
          isOpen={menu}
          toggle={this.toggle}
          className="d-inline-block"
        >
          <DropdownToggle
            className="btn header-item waves-effect"
            id="page-header-user-dropdown"
            tag="button"
          >
            <span className="d-none d-xl-inline-block ml-2 mr-1 text-capitalize">
              {name}
            </span>
            <FontAwesomeIcon style={{ fontSize: '8px', padding: '1px' }} size="xs" icon={faChevronDown} />
          </DropdownToggle>
          <DropdownMenu end>
            <DropdownItem onClick={this.aboutModal}>
              <FontAwesomeIcon size="lg" icon={faCircleInfo} />
              &nbsp;&nbsp;
              {t('About')}
            </DropdownItem>
            <div className="dropdown-divider" />
            <a href={`${window.location.origin}/${routeStart}docs/index.html`} rel="noreferrer" target="_blank" className="drop-down-menu-color">
              <DropdownItem>
                <FontAwesomeIcon size="lg" icon={faBook} />
                &nbsp;&nbsp;
                {t('Documentation')}
              </DropdownItem>
            </a>
            <div className="dropdown-divider" />
            { id === 0 ? null : this.renderChangePassword()}
            <a href={`https://${localVMIP}:${5000}${systemConst}/upgrade`} rel="noreferrer" target="_blank" className="drop-down-menu-color">
              <DropdownItem>
                <FontAwesomeIcon size="lg" icon={faCircleArrowUp} />
                &nbsp;&nbsp;
                {t('Upgrade')}
              </DropdownItem>
            </a>
            {' '}
            <div className="dropdown-divider" />
            <Link onClick={this.toggleTheme} className="drop-down-menu-color">
              <DropdownItem>
                <FontAwesomeIcon size="lg" icon={theme === 'dark' ? faSun : faMoon} />
                &nbsp;&nbsp;
                {t('Switch Theme')}
              </DropdownItem>
            </Link>
            <div className="dropdown-divider" />
            <Link to={LOGIN_PATH} className="dropdown-item" onClick={this.logout}>
              <i className="fas fa-power-off font-size-16 align-middle mr-1 text-danger" />
              &nbsp;&nbsp;
              <span>{t('logout')}</span>
            </Link>
          </DropdownMenu>
        </Dropdown>
      </>
    );
  }
}

ProfileMenu.propTypes = {
  t: PropTypes.any,
};

export default (withTranslation()(ProfileMenu));
