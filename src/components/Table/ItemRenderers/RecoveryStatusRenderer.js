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

  function renderShowProgressCheck() {
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
  const renderShowProgress = () => {
    if (data.status !== JOB_COMPLETION_STATUS) {
      return (
        <>
          <Row>
            <Col sm={12}>
              <div style={{ display: 'flex' }}>
                <p style={{ paddingRight: '5px', display: 'inline' }}>{t('show.details')}</p>
                {renderShowProgressCheck()}
              </div>
            </Col>
          </Row>
        </>
      );
    }
    return null;
  };
  return (
    <>
      <Row>
        <Col sm={6} className="status_renderer_Div">
          <StatusItemRenderer data={data} field={field} noPopOver />
        </Col>
        <Col sm={6} className="show_details">
          {renderShowProgress()}
        </Col>
      </Row>
      <Row className="padding-left-8">
        <Col sm={12}>
          {toggle === true ? <StatusSteps data={data} apiURL={API_RESCOVERY_JOB_STATUS_STEPS} /> : null}
        </Col>
      </Row>
    </>
  );
}

export default (withTranslation()(RecoveryStatusRenderer));
