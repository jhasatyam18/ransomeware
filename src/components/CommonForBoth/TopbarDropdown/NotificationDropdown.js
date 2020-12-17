import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Dropdown, DropdownToggle, DropdownMenu, Row, Col,
} from 'reactstrap';
import SimpleBar from 'simplebar-react';

// i18n
import { withTranslation } from 'react-i18next';

class NotificationDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState((prevState) => ({
      menu: !prevState.menu,
    }));
  }

  render() {
    const { menu } = this.state;
    const { t } = this.props;
    return (
      <>
        <Dropdown
          isOpen={menu}
          toggle={this.toggle}
          className="dropdown d-inline-block"
          tag="li"
        >
          <DropdownToggle
            className="btn header-item noti-icon waves-effect"
            tag="button"
            id="page-header-notifications-dropdown"
          >
            <i className="bx bx-bell bx-tada" />
            <span className="badge badge-danger badge-pill" />
          </DropdownToggle>

          <DropdownMenu className="dropdown-menu dropdown-menu-lg p-0" right>
            <div className="p-3">
              <Row className="align-items-center">
                <Col>
                  <h6 className="m-0">
                    {' '}
                    {t('Notifications')}
                    {' '}
                  </h6>
                </Col>
                <div className="col-auto">
                  <a href="/" className="small">
                    {' '}
                    View All
                  </a>
                </div>
              </Row>
            </div>

            <SimpleBar style={{ height: '230px' }}>
              <Link to="" className="text-reset notification-item" />
            </SimpleBar>
            <div className="p-2 border-top">
              <Link
                className="btn btn-sm btn-link font-size-14 btn-block text-center"
                to="#"
              >
                {' '}
                {t('View all')}
                {' '}
              </Link>
            </div>
          </DropdownMenu>
        </Dropdown>
      </>
    );
  }
}

NotificationDropdown.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(NotificationDropdown);
