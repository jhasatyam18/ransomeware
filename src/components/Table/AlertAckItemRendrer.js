import React, { useState } from 'react';
import { Col, Popover, PopoverBody, Row } from 'reactstrap';
import DateItemRenderer from './DateItemRenderer';

function AlertAckItemRenderer({ data, field }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  if (!data) {
    return '-';
  }
  let isAcknowledged = data[field];
  const key = `alert-popover-key-${data.id}`;
  if (data.severity === 'INFO' || data.severity === 'WARNING') {
    isAcknowledged = true;
  }

  function acknowledgeBy() {
    if (isAcknowledged) {
      if (data.severity === 'INFO' || data.severity === 'WARNING') {
        return 'System';
      }
      return data.acknowledgeBy;
    }
    return '-';
  }

  function acknowledgeMessage() {
    if (isAcknowledged) {
      if (data.severity === 'INFO' || data.severity === 'WARNING') {
        return 'Auto acknowledge by the system';
      }
      return data.acknowledgeMessage;
    }
    return '-';
  }

  function acknowledgeTime() {
    if (isAcknowledged) {
      if (data.severity === 'INFO' || data.severity === 'WARNING') {
        return <DateItemRenderer data={data} field="timeStamp" />;
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
      <box-icon id={key} name={isAcknowledged ? 'check' : 'error-alt'} color={isAcknowledged ? 'green' : 'red'} style={{ width: 25 }} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)} />
      {renderTooltip()}
    </div>
  );
}

export default AlertAckItemRenderer;
