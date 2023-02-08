import React, { useState } from 'react';
import { Col, Popover, PopoverBody, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck } from '@fortawesome/free-solid-svg-icons';
import { API_RESCOVERY_JOB_STATUS_STEPS } from '../../../constants/ApiConstants';
import StatusItemRenderer from './StatusItemRenderer';
import StepStatus from '../../Common/StepStatus';

function RecoveryStatusRenderer({ data, field, t }) {
  const [toggle, setToggle] = useState(false);
  const [popOver, setpopOver] = useState(false);

  const handleCheckbox = () => {
    setToggle(!toggle);
  };

  const renderPopOver = (key) => (
    <Popover placement="bottom" isOpen={popOver && !toggle} target={key} style={{ backgroundColor: '#fff', width: '110px', textAlign: 'center', borderRadius: '5px' }}>
      <PopoverBody style={{ color: 'black' }}>
        {t('show.details')}
      </PopoverBody>
    </Popover>
  );
  const renderShowProgress = () => {
    const key = `step-status-${field}-${data.name}-${data.id}`;
    return (
      <Row>
        <Col sm={12}>
          <div style={{ display: 'flex', float: 'right' }}>
            <FontAwesomeIcon
              size="lg"
              icon={faListCheck}
              className="progress_list"
              onClick={handleCheckbox}
              onMouseEnter={() => setpopOver(true)}
              onMouseLeave={() => setpopOver(false)}
              id={key}
            />
            {renderPopOver(key)}
          </div>
        </Col>
      </Row>
    );
  };
  return (
    <>
      <Row>
        <Col sm={6} className="status_renderer_Div">
          <StatusItemRenderer data={data} field={field} noPopOver />
        </Col>
        <Col sm={5} className="show_details">
          {renderShowProgress()}
        </Col>
      </Row>
      <Row className="padding-left-8">
        <Col sm={12}>
          {toggle === true ? <StepStatus data={data} apiURL={API_RESCOVERY_JOB_STATUS_STEPS} /> : null}
        </Col>
      </Row>
    </>
  );
}

export default (withTranslation()(RecoveryStatusRenderer));
