import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Badge, Col, Dropdown, DropdownMenu, DropdownToggle, Row } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { ALERTS_PATH } from '../../../constants/RouterConstants';
import { getUnreadAlerts } from '../../../store/actions/AlertActions';

class NotificationDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menu: false,
    };
    this.toggle = this.toggle.bind(this);
    this.loadAlerts = this.loadAlerts.bind(this);
    this.navigateToAlerts = this.navigateToAlerts.bind(this);
    this.pollAlerts = setInterval(this.loadAlerts, 60000);
  }

  componentWillUnmount() {
    clearInterval(this.pollAlerts);
  }

  loadAlerts() {
    const { dispatch } = this.props;
    dispatch(getUnreadAlerts());
  }

  toggle() {
    this.setState((prevState) => ({
      menu: !prevState.menu,
    }));
  }

  navigateToAlerts() {
    const { history } = this.props;
    this.toggle();
    history.push(ALERTS_PATH);
  }

  renderAlerts() {
    const { alerts, t } = this.props;
    const { unread } = alerts;
    if (unread.length === 0) {
      return <p className="ms-3 text-secondary">{t('no.new.notification')}</p>;
    }
    const notifications = (unread.length > 4 ? unread.slice(0, 4) : unread);
    return (
      notifications.map((not) => {
        const t2 = new Date(not.updatedTime * 1000);
        return (
          <Link to={ALERTS_PATH} onClick={this.toggle} key={`not-alert-${not.id}`} className="text-reset notification-item">
            <div className="media">
              <div className="media-body">
                <h6 className="mt-0 mb-1">
                  {not.title}
                </h6>
                <div className="font-size-12 text-muted" key={`notification-${not.id}`}>
                  <p className="mb-0">
                    <i className="mdi mdi-clock-outline" />
                    {' '}
                    {`${t2.toLocaleDateString()}-${t2.toLocaleTimeString()}`}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        );
      })
    );
  }

  renderAlertCount() {
    const { alerts } = this.props;
    const { unread } = alerts;
    if (unread && unread.length !== 0) {
      if (unread.length >= 99) {
        return <Badge color="danger" pill>99+</Badge>;
      }
      return <Badge color="danger" pill>{unread.length}</Badge>;
    }
    return null;
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
            <FontAwesomeIcon size="lg" icon={faBell} />
            <span className="me-3">{this.renderAlertCount()}</span>
          </DropdownToggle>

          <DropdownMenu className="dropdown-menu dropdown-menu-lg p-0" end>
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
                  <Link to={ALERTS_PATH} onClick={this.toggle} className="small">
                    {' '}
                    View All
                  </Link>
                </div>
              </Row>
            </div>

            <SimpleBar className="max-h-230 min-h-50">
              <Link to="notifications" className="text-reset notification-item" />
              {this.renderAlerts()}
            </SimpleBar>
          </DropdownMenu>
        </Dropdown>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { alerts } = state;
  return { alerts };
}
export default connect(mapStateToProps)(withTranslation()(withRouter(NotificationDropdown)));
