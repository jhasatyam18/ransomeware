import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { Link } from 'react-router-dom';

// i18n
import { withTranslation } from 'react-i18next';

// users
import { initChangePassword, logOutUser, removeCookies } from '../../../store/actions';
import { addMessage } from '../../../store/actions/MessageActions';
import { openModal } from '../../../store/actions/ModalActions';
import { MODAL_ABOUT } from '../../../constants/Modalconstant';
import { APPLICATION_API_USER } from '../../../constants/UserConstant';
import { API_LOGOUT, API_SAML_LOGOUT } from '../../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../../constants/MessageConstants';
import { getCookie } from '../../../utils/CookieUtils';
import { API_TYPES, callAPI, createPayload } from '../../../utils/ApiUtils';
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

  renderChangePassword() {
    const { t } = this.props;
    return (
      <>
        <DropdownItem onClick={this.changePassword}>
          <i className="fas fa-key font-size-16 align-middle mr-1" />
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
    const { id } = user;
    const name = getCookie(APPLICATION_API_USER) || '';
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
            <i className="bx bx-chevron-down" />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem onClick={this.aboutModal}>
              <i className="fa fa-info font-size-16 align-middle mr-1" />
              &nbsp;&nbsp;
              {t('About')}
            </DropdownItem>
            <div className="dropdown-divider" />
            <a href={`${window.location.origin}/docs/index.html`} rel="noreferrer" target="_blank" className="drop-down-menu-color">
              <DropdownItem>
                <i className="fa fa-book font-size-16 align-middle mr-1" />
                &nbsp;&nbsp;
                {t('Documentation')}
              </DropdownItem>
            </a>
            <div className="dropdown-divider" />
            { id === 0 ? null : this.renderChangePassword()}
            <Link to="/logout" className="dropdown-item" onClick={this.logout}>
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
