import classnames from 'classnames';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { Card, CardBody, Col, Container, Form, Input, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { CHECKPOINT_ACTION_EVENT, MONITOR_NODE_AUTH, PPLAN_EVENTS, VM_CONFIG_ACTION_EVENT, VM_DISK_ACTION_EVENT } from '../../constants/EventConstant';
import { APPLICATION_API_USER } from '../../constants/UserConstant';
import { acknowledgeAlert, takeVMAction } from '../../store/actions/AlertActions';
import { closeModal } from '../../store/actions/ModalActions';
import { refresh, valueChange } from '../../store/actions/UserActions';
import { getCookie } from '../../utils/CookieUtils';
import { hasRequestedPrivileges } from '../../utils/PrivilegeUtils';
import DateItemRenderer from '../Table/ItemRenderers/DateItemRenderer';
import EventLevelItemRenderer from '../Table/ItemRenderers/EventLevelItemRenderer';

/**
 * Functional component to render Alert details.
 */
const ModalAlertDetails = (props) => {
  const { alerts, user, dispatch, t } = props;

  const [activeTab, setActiveTab] = useState('1');
  const [ackMessage, setAckMessage] = useState('');
  const [error, setError] = useState('');
  const history = useNavigate();

  const handleChange = (e) => {
    const val = e.target.value;
    setAckMessage(val);
    setError('');
    dispatch(valueChange('alert.acknowledge.message', val));
  };

  const onClose = () => {
    dispatch(closeModal());
  };

  const takeAction = () => {
    if (ackMessage.length === 0) {
      setError(t('required.acknowledge.message'));
      return;
    }
    dispatch(takeVMAction());
  };

  const acknowledgeAndClose = () => {
    const { selected } = alerts;
    const userCookie = getCookie(APPLICATION_API_USER);
    if (ackMessage.length === 0) {
      setError(t('required.acknowledge.message'));
      return;
    }
    // mutate selected as original code did
    selected.acknowledgeMessage = ackMessage;
    selected.acknowledgeBy = userCookie;
    dispatch(acknowledgeAlert(selected));
    dispatch(closeModal());
    dispatch(refresh(history));
  };

  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  const renderNav = () => (
    <Nav tabs className="nav-tabs-custom nav-justified">
      <NavItem key="alert-navItem-1">
        <NavLink className={`${classnames({ active: activeTab === '1' })} cursor-pointer`} onClick={() => toggleTab('1')}>
          <span className="d-none d-sm-block">Info</span>
        </NavLink>
      </NavItem>
      <NavItem key="alert-navItem-2">
        <NavLink className={`${classnames({ active: activeTab === '2' })} cursor-pointer`} onClick={() => toggleTab('2')}>
          <span className="d-none d-sm-block">Associated Event</span>
        </NavLink>
      </NavItem>
    </Nav>
  );

  const renderAckInfo = () => {
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
  };

  const renderAlertInfo = () => {
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
  };

  const renderEventInfo = () => {
    const { associatedEvent } = alerts;
    const { topic, description, type, id } = associatedEvent || {};
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
  };

  const renderAckMessageInput = () => {
    const { selected } = alerts;
    if (!hasRequestedPrivileges(user, ['alerts.acknowledge'])) {
      return null;
    }
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
                onChange={handleChange}
              />
              {error.length > 0 ? <span className="error">{error}</span> : null}
            </div>
          </div>
        </Form>
      );
    }
    return null;
  };

  const renderAcknowledge = () => {
    const { selected } = alerts;
    const isOnReportsPage = window?.location.pathname.includes('/reports'); // Disable Acknowledge button on reports page
    if (!hasRequestedPrivileges(user, ['alerts.acknowledge'])) {
      return null;
    }
    if (selected.isAcknowledge === false && selected.severity !== 'INFO' && selected.severity !== 'WARNING') {
      return (
        <>
          <button type="button" className="btn btn-secondary" disabled={isOnReportsPage} onClick={acknowledgeAndClose}>
            Acknowledge
          </button>
        </>
      );
    }
    return null;
  };

  const renderTakeAction = () => {
    const { associatedEvent, selected } = alerts;
    const { type } = associatedEvent || {};
    const isOnReportsPage = window?.location.pathname.includes('/reports'); // Disable Take Action button on reports page
    if (selected.isAcknowledge || !hasRequestedPrivileges(user, ['alerts.actions'])) {
      return null;
    }
    if (VM_DISK_ACTION_EVENT.indexOf(type) !== -1 || VM_CONFIG_ACTION_EVENT.indexOf(type) !== -1 || PPLAN_EVENTS.indexOf(type) !== -1 || MONITOR_NODE_AUTH.indexOf(type) !== -1 || CHECKPOINT_ACTION_EVENT.indexOf(type) !== -1) {
      const toolTip = (VM_DISK_ACTION_EVENT.indexOf(type) !== -1 ? t('take.action.tooltip.vm.disk.operation') : t('take.action.tooltip.vm.reconfigure.operation'));
      return (
        <button type="button" className="btn btn-secondary" disabled={isOnReportsPage} onClick={takeAction} title={toolTip}>
          {t('take.action')}
        </button>
      );
    }
    return null;
  };

  return (
    <>
      <Container>
        <Card>
          <SimpleBar className="max-h-350">
            <CardBody>
              {renderNav()}
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1" className="p-3">
                  <Row>
                    <Col sm="12">
                      {renderAlertInfo()}
                    </Col>
                  </Row>
                  <Row className="padding-top-15">
                    {renderAckInfo()}
                  </Row>
                </TabPane>
                <TabPane tabId="2" className="p-3">
                  <Row>
                    <Col sm="12">
                      {renderEventInfo()}
                    </Col>
                  </Row>
                </TabPane>
              </TabContent>
            </CardBody>
          </SimpleBar>
        </Card>
        {renderAckMessageInput()}
        <div className="modal-footer">
          {renderTakeAction()}
          {renderAcknowledge()}
          <button type="button" className="btn btn-secondary" onClick={onClose}>Close </button>
        </div>
      </Container>
    </>
  );
};

function mapStateToProps(state) {
  const { alerts, user } = state;
  return { alerts, user };
}
export default connect(mapStateToProps)(withTranslation()(ModalAlertDetails));
