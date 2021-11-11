import React, { Component } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Card, CardBody, Col, Container, Form, Input, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import EventLevelItemRenderer from '../Table/ItemRenderers/EventLevelItemRenderer';
import DateItemRenderer from '../Table/ItemRenderers/DateItemRenderer';
import { closeModal } from '../../store/actions/ModalActions';
import { acknowledgeAlert } from '../../store/actions/AlertActions';
import { APPLICATION_API_USER } from '../../constants/UserConstant';
import { getCookie } from '../../utils/CookieUtils';

/**
 * Component to render Alert details.
 */
class ModalAlertDetails extends Component {
  constructor() {
    super();
    this.state = { activeTab: '1', ackMessage: '', error: '' };
    this.toggleTab = this.toggleTab.bind(this);
    this.acknowledgeAndClose = this.acknowledgeAndClose.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  handleChange = (e) => {
    this.setState({
      ackMessage: e.target.value,
      error: '',
    });
  }

  onClose() {
    const { dispatch } = this.props;
    dispatch(closeModal());
  }

  acknowledgeAndClose() {
    const { dispatch, alerts } = this.props;
    const { selected } = alerts;
    const { ackMessage } = this.state;
    const user = getCookie(APPLICATION_API_USER);
    if (ackMessage.length === 0) {
      this.setState({ error: 'Required acknowledge message' });
      return;
    }
    selected.acknowledgeMessage = ackMessage;
    selected.acknowledgeBy = user;
    dispatch(acknowledgeAlert(selected));
    dispatch(closeModal());
  }

  toggleTab(tab) {
    const { activeTab } = this.state;
    if (activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  renderNav() {
    const { activeTab } = this.state;
    return (
      <Nav tabs className="nav-tabs-custom nav-justified">
        <NavItem key="alert-navItem-1">
          <NavLink style={{ cursor: 'pointer' }} className={classnames({ active: activeTab === '1' })} onClick={() => { this.toggleTab('1'); }}>
            <span className="d-none d-sm-block">Info</span>
          </NavLink>
        </NavItem>
        <NavItem key="alert-navItem-2">
          <NavLink style={{ cursor: 'pointer' }} className={classnames({ active: activeTab === '2' })} onClick={() => { this.toggleTab('2'); }}>
            <span className="d-none d-sm-block">Associated Event</span>
          </NavLink>
        </NavItem>
      </Nav>
    );
  }

  renderAckInfo() {
    const { alerts } = this.props;
    const { selected } = alerts;
    if (selected.isAcknowledge) {
      return (
        <>
          <Col sm={4} className="margin-0">
            <hr />
          </Col>
          <Col sm={4} className="padding-top-5 text-center"> Acknowledge Details </Col>
          <Col sm={4} className="margin-0">
            <hr />
          </Col>
          <Col className="mt-2" sm={4}>Message</Col>
          <Col className="mt-2 text-muted" sm={8}>{selected.acknowledgeMessage}</Col>
          <Col className="mt-2" sm={4}>Time</Col>
          <Col className="mt-2 text-muted" sm={8}><DateItemRenderer data={selected} field="acknowledgeTime" /></Col>
          <Col className="mt-2" sm={4}>User</Col>
          <Col className="mt-2 text-muted" sm={8}>{selected.acknowledgeBy}</Col>
        </>
      );
    }
    return null;
  }

  renderAlertInfo() {
    const { alerts } = this.props;
    const { selected } = alerts;
    const { eventType, description, occurrence } = selected;
    return (
      <Row className="row row-grid">
        <Col className="mt-2" sm={4}>Severity</Col>
        <Col className="mt-2 text-muted" sm={8}><EventLevelItemRenderer data={selected} field="severity" /></Col>

        <Col className="mt-2" sm={4}>Event Type</Col>
        <Col className="mt-2 text-muted" sm={8}>{eventType}</Col>
        <Col className="mt-2" sm={4}>Description</Col>
        <Col className="mt-2 text-muted" sm={8}>{description}</Col>
        <Col className="mt-2" sm={4}>Created</Col>
        <Col className="mt-2 text-muted" sm={8}><DateItemRenderer data={selected} field="createdTime" /></Col>
        <Col className="mt-2" sm={4}>Updated</Col>
        <Col className="mt-2 text-muted" sm={8}><DateItemRenderer data={selected} field="updatedTime" /></Col>
        <Col className="mt-2" sm={4}>Occurrence</Col>
        <Col className="mt-2 text-muted" sm={8}>{occurrence}</Col>
      </Row>
    );
  }

  renderEventInfo() {
    const { alerts } = this.props;
    const { associatedEvent } = alerts;
    const { topic, description, type, id } = associatedEvent;
    return (
      <Row className="row row-grid">
        <Col className="mt-2" sm={4}>Event ID</Col>
        <Col className="mt-2 text-muted" sm={8}>{id}</Col>
        <Col className="mt-2" sm={4}>Level</Col>
        <Col className="mt-2 text-muted" sm={8}><EventLevelItemRenderer data={associatedEvent} field="severity" /></Col>

        <Col className="mt-2" sm={4}>Topic</Col>
        <Col className="mt-2 text-muted" sm={8}>{topic}</Col>
        <Col className="mt-2" sm={4}>Date</Col>
        <Col className="mt-2" sm={8}><DateItemRenderer data={associatedEvent} field="timeStamp" /></Col>

        <Col className="mt-2" sm={4}>Event Type</Col>
        <Col className="mt-2 text-muted" sm={8}>{type}</Col>
        <Col className="mt-2" sm={4}>Description</Col>
        <Col className="mt-2 text-muted" sm={8}>{description}</Col>

      </Row>
    );
  }

  renderAckMessageInput() {
    const { alerts } = this.props;
    const { selected } = alerts;
    const { ackMessage, error } = this.state;
    if (selected.isAcknowledge === false && selected.severity !== 'INFO' && selected.severity !== 'WARNING') {
      return (
        <Form>
          <div className="form-group row">
            <label htmlFor="ack-message-input" className="col-sm-4 col-form-label">Acknowledge Message</label>
            <div className="col-sm-8">
              <Input
                type="textarea"
                className="form-control"
                id="ack-message-input"
                value={ackMessage}
                autoComplete="off"
                onChange={this.handleChange}
              />
              {error.length > 0 ? <span className="error">{error}</span> : null}
            </div>
          </div>
        </Form>
      );
    }
    return null;
  }

  renderAcknowledge() {
    const { alerts } = this.props;
    const { selected } = alerts;
    if (selected.isAcknowledge === false && selected.severity !== 'INFO' && selected.severity !== 'WARNING') {
      return (
        <>
          <button type="button" className="btn btn-secondary" onClick={this.acknowledgeAndClose}>
            Acknowledge and Close
          </button>
        </>
      );
    }
    return null;
  }

  render() {
    const { activeTab } = this.state;
    return (
      <>
        <Container>
          <Card>
            <CardBody>
              {this.renderNav()}
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1" className="p-3">
                  <Row>
                    <Col sm="12">
                      {this.renderAlertInfo()}
                    </Col>
                  </Row>
                  <Row className="padding-top-15">
                    {this.renderAckInfo()}
                  </Row>
                </TabPane>
                <TabPane tabId="2" className="p-3">
                  <Row>
                    <Col sm="12">
                      {this.renderEventInfo()}
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </CardBody>
          </Card>
          {this.renderAckMessageInput()}
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={this.onClose}>Close </button>
            {this.renderAcknowledge()}
          </div>
        </Container>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { alerts } = state;
  return { alerts };
}
export default connect(mapStateToProps)(withTranslation()(ModalAlertDetails));
