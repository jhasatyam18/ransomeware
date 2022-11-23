import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Col, Popover, PopoverBody, Row } from 'reactstrap';
import { MODAL_ALERT_DETAILS } from '../../../constants/Modalconstant';
import { alertSelected, getAlertEvent } from '../../../store/actions/AlertActions';
import { openModal } from '../../../store/actions/ModalActions';
import DateItemRenderer from './DateItemRenderer';

function AlertAckItemRenderer({ data, field }) {
  const dispatch = useDispatch();
  const [popoverOpen, setPopoverOpen] = useState(false);
  if (!data) {
    return '-';
  }

  function onViewDetails() {
    dispatch(alertSelected(data));
    dispatch(getAlertEvent(data.eventID));
    dispatch(openModal(MODAL_ALERT_DETAILS, { title: data.title }));
  }

  let isAcknowledged = data[field];
  const key = `alert-popover-key-${data.id}`;
  if (data.severity === 'INFO' || data.severity === 'WARNING') {
    isAcknowledged = true;
  }

  function acknowledgeBy() {
    if (isAcknowledged) {
      return data.acknowledgeBy;
    }
    return '-';
  }

  function acknowledgeMessage() {
    if (isAcknowledged) {
      return data.acknowledgeMessage;
    }
    return '-';
  }

  function acknowledgeTime() {
    if (isAcknowledged) {
      if (data.severity === 'INFO' || data.severity === 'WARNING') {
        return <DateItemRenderer data={data} field="updatedTime" />;
      }
      return <DateItemRenderer data={data} field="acknowledgeTime" />;
    }
    return '-';
  }

  function renderTooltip() {
    if (isAcknowledged === false) {
      return null;
    }
    return (
      <Popover placement="bottom" isOpen={popoverOpen} target={key} style={{ backgroundColor: 'black' }}>
        <PopoverBody>
          <Row>
            <Col sm={4}>Message</Col>
            <Col sm={8}>{acknowledgeMessage()}</Col>
            <Col sm={4}>User</Col>
            <Col sm={8}>{acknowledgeBy()}</Col>
            <Col sm={4}>Time</Col>
            <Col sm={8}>{acknowledgeTime()}</Col>
          </Row>
        </PopoverBody>
      </Popover>
    );
  }
  return (
    <div>
      <a href="#" onClick={onViewDetails} className="icon_font">
        <i className={`${isAcknowledged ? 'fas fa-check-circle text-success' : 'fas fa-exclamation-triangle text-danger'}`} id={key} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)} />
        {renderTooltip()}
      </a>
    </div>
  );
}

export default AlertAckItemRenderer;
