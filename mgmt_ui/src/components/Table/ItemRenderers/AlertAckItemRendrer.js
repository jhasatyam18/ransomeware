import React, { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Col, Popover, PopoverBody, Row } from 'reactstrap';
import { MESSAGE_TYPES } from '../../../constants/MessageConstants';
import { MODAL_ALERT_DETAILS } from '../../../constants/Modalconstant';
import { alertSelected, getAlertEvent } from '../../../store/actions/AlertActions';
import { addMessage } from '../../../store/actions/MessageActions';
import { openModal } from '../../../store/actions/ModalActions';
import DateItemRenderer from './DateItemRenderer';

function AlertAckItemRenderer({ data, field }) {
  const dispatch = useDispatch();
  const targetRef = useRef(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  if (!data) {
    return '-';
  }

  function onViewDetails() {
    const apis = [dispatch(alertSelected(data)), dispatch(getAlertEvent(data.eventID))];
    return Promise.all(apis).then(
      () => {
        dispatch(openModal(MODAL_ALERT_DETAILS, { title: data.title }));
        return new Promise((resolve) => resolve());
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
        return new Promise((resolve) => resolve());
      },
    );
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
      <Popover placement="bottom" isOpen={popoverOpen} target={targetRef} style={{ backgroundColor: 'black' }}>
        <PopoverBody>
          <Row style={{ color: 'white' }}>
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
        <i ref={targetRef} className={`${isAcknowledged ? 'fas fa-check-circle text-success' : 'fas fa-exclamation-triangle text-danger'}`} id={key} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)} />
        {renderTooltip()}
      </a>
    </div>
  );
}

export default AlertAckItemRenderer;
