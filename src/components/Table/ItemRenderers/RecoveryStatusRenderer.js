import React, { useState } from 'react';
import { Col, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import StatusItemRenderer from './StatusItemRenderer';
import StatusSteps from '../../Common/StatusSteps';

function RecoveryStatusRenderer({ data, field, t }) {
  let { step } = data;
  if (typeof step === 'undefined' || step === null || step.length === 0) {
    return '-';
  }
  step = JSON.parse(step) || [];
  const [toggle, setToggle] = useState(false);
  const handleCheckbox = () => {
    setToggle(!toggle);
  };

  function renderCheckbox() {
    return (
      <>
        <div className="custom-control custom-checkbox">
          <input
            type="checkbox"
            className="custom-control-input"
            name={data.id}
            onChange={handleCheckbox}
            checked={toggle}
            id={data.id}
          />
          <label className="custom-control-label" htmlFor={data.id}>&nbsp;</label>
        </div>
      </>
    );
  }
  return (
    <>
      <Row>
        <Col sm={2}>
          <StatusItemRenderer data={data} field={field} />
        </Col>
        <Row>
          <Col sm={5}>
            {t('show.details')}
          </Col>
          <Col sm={3}>
            {renderCheckbox()}
          </Col>
        </Row>
      </Row>
      {toggle === true ? StatusSteps() : null}
    </>
  );
}

export default (withTranslation()(RecoveryStatusRenderer));
