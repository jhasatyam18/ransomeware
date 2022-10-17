import React, { useState } from 'react';
import { Col, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { API_RESCOVERY_JOB_STATUS_STEPS } from '../../../constants/ApiConstants';
import { JOB_COMPLETION_STATUS } from '../../../constants/AppStatus';
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
  const renderShowDetails = () => {
    if (data.status !== JOB_COMPLETION_STATUS) {
      return (
        <>
          <Col sm={3}>
            {t('show.details')}
          </Col>
          <Col sm={3}>
            {renderCheckbox()}
          </Col>
        </>
      );
    }
    return null;
  };
  return (
    <>
      <Row>
        <Col sm={3}>
          <StatusItemRenderer data={data} field={field} />
        </Col>
        {renderShowDetails()}
      </Row>
      {toggle === true ? <StatusSteps data={data} apiURL={API_RESCOVERY_JOB_STATUS_STEPS} /> : null}
    </>
  );
}

export default (withTranslation()(RecoveryStatusRenderer));
