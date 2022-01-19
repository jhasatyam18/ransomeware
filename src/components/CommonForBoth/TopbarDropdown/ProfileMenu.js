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
import { logOutUser, initChangePassword } from '../../../store/actions';
import { openModal } from '../../../store/actions/ModalActions';
import { MODAL_ABOUT } from '../../../constants/Modalconstant';
import { APPLICATION_API_USER } from '../../../constants/UserConstant';
import { getCookie } from '../../../utils/CookieUtils';

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
    const { dispatch } = this.props;
    dispatch(logOutUser());
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

  render() {
    const { menu } = this.state;
    const { t } = this.props;
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
            <span className="d-none d-xl-inline-block ml-2 mr-1" style={{ textTransform: 'capitalize' }}>
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
            <DropdownItem>
              <a href={`${window.location.origin}/docs/index.html`} rel="noreferrer" target="_blank" style={{ color: '#BFC8E2' }}>
                <i className="fa fa-book font-size-16 align-middle mr-1" />
                &nbsp;&nbsp;
                {t('Documentation')}
              </a>
            </DropdownItem>
            <div className="dropdown-divider" />
            <DropdownItem onClick={this.changePassword}>
              <i className="fas fa-key font-size-16 align-middle mr-1" />
              &nbsp;&nbsp;
              {t('change.password')}
            </DropdownItem>
            <div className="dropdown-divider" />
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
