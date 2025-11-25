import React, { useRef, useState } from 'react';
import { Col, Label, Row, Tooltip } from 'reactstrap';

const DisplayString = (props) => {
  const { value, info } = props;
  let infoText = '';
  const localRef = useRef(null);
  const [tooltipOpen, toggleToolTip] = useState(false);
  const toggle = () => toggleToolTip(!tooltipOpen);

  const infoRenderer = () => {
    if (!info) {
      return null;
    }
    infoText = typeof info === 'function' ? info() : info;
    if (!infoText) {
      return null;
    }
    return (
      <>
        <i className="fas fa-info-circle info__icon padding-left-5 cursor-pointer" ref={localRef} />
        <Tooltip
          modifiers={[
            {
              name: 'preventOverflow',
              options: { boundary: 'viewport' },
            },
            {
              name: 'offset',
              options: { offset: [0, 10] }, // move popover away from the trigger
            },
          ]}
          placement="auto"
          isOpen={tooltipOpen}
          target={localRef}
          toggle={toggle}
          autohide={false}
          className="dmtooltip"
        >
          {infoText}
        </Tooltip>
      </>
    );
  };

  function getString() {
    let ret = '-';
    if (typeof value === 'number') {
      ret = value;
    } else if (typeof value === 'string' && value !== '') {
      ret = `${value}`;
    } else if (typeof value === 'boolean') {
      ret = value ? 'Enabled' : 'Disabled';
    }

    return ret;
  }

  const displayValue = getString();

  return (
    <div>
      <Row>
        <Col sm={12}>
          <Label>
            {displayValue}
            {infoRenderer()}
          </Label>
        </Col>
      </Row>
    </div>
  );
};
export default DisplayString;
