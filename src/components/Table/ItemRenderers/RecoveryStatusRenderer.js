import React, { useState } from 'react';
import { Col, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import StatusItemRenderer from './StatusItemRenderer';
import StatusSteps from '../../Common/StatusSteps';

function RecoveryStatusRenderer({ data, field, t }) {
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
        <Col sm={3}>
          <StatusItemRenderer data={data} field={field} />
        </Col>
        <Col sm={3}>
          {t('show.details')}
        </Col>
        <Col sm={3}>
          {renderCheckbox()}
        </Col>
      </Row>
      {toggle === true ? <StatusSteps data={data} /> : null}
    </>
  );
}

export default (withTranslation()(RecoveryStatusRenderer));
