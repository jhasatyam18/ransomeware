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
import { logOutUser } from '../../../store/actions';
import { openModal } from '../../../store/actions/ModalActions';
import { MODAL_ABOUT } from '../../../constants/Modalconstant';

class ProfileMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
      name: 'Admin',
    };
    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
    this.aboutModal = this.aboutModal.bind(this);
  }

  logout() {
    const { dispatch } = this.props;
    dispatch(logOutUser());
  }

  aboutModal() {
    const { dispatch } = this.props;
    dispatch(openModal(MODAL_ABOUT, { title: 'About' }));
  }

  toggle() {
    this.setState((prevState) => ({
      menu: !prevState.menu,
    }));
  }

  render() {
    const { menu, name } = this.state;
    const { t } = this.props;
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
            <span className="d-none d-xl-inline-block ml-2 mr-1">
              {name}
            </span>
            <i className="bx bx-chevron-down" />
          </DropdownToggle>
          <DropdownMenu right>
            <DropdownItem onClick={this.aboutModal}>
              <i className="bx bx-info-circle font-size-16 align-middle mr-1" />
              {t('About')}
            </DropdownItem>
            <div className="dropdown-divider" />
            <DropdownItem>
              <a href="docs/index.html" target="_blank" style={{ color: '#BFC8E2' }}>
                <i className="bx bx-file font-size-16 align-middle mr-1" />
                {t('Documentation')}
              </a>
            </DropdownItem>
            <div className="dropdown-divider" />
            <Link to="/logout" className="dropdown-item" onClick={this.logout}>
              <i className="bx bx-power-off font-size-16 align-middle mr-1 text-danger" />
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
