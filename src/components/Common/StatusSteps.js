import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Col, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { JOB_COMPLETION_STATUS, JOB_FAILED, JOB_IN_PROGRESS } from '../../constants/AppStatus';

function StatusSteps({ data }) {
  let { step } = data;
  if (typeof step === 'undefined' || step === null || step.length === 0 || typeof step !== 'object') {
    return null;
  }
  step = JSON.parse(step) || [];

  const renderSteps = () => step.map((st, i) => (
    <Row className="padding-left-15">
      <Col sm={12}>
        {renderIndividualSteps(st, i)}
      </Col>
    </Row>
  ));

  function renderIcons(st) {
    const { status } = st;
    if (status === JOB_COMPLETION_STATUS) {
      return <FontAwesomeIcon size="lg" icon={faCheckCircle} className="text-success" />;
    } if (status === JOB_FAILED) {
      return <FontAwesomeIcon size="lg" icon={faCircleXmark} className="text-danger" />;
    } if (status === JOB_IN_PROGRESS) {
      return <i className="fa fa-spinner fa-lg fa-spin text-info" />;
    }
  }

  function renderIndividualSteps(st, i) {
    const { message, time } = st;
    const convertTedTime = time * 1000;
    const d = new Date(convertTedTime);
    const resp = `${d.toLocaleTimeString()}`;

    return (
      <Row className="margin-top-20">
        <Col sm={1}>
          <div>
            {renderIcons(st)}
          </div>
          {i === step.length - 1 ? '' : (
            <div className="vertical" />
          ) }
        </Col>
        <Col sm={10}>
          <Row>{message}</Row>
          <Row>{resp}</Row>
        </Col>
      </Row>
    );
  }

  return (
    <>
      {renderSteps()}
    </>
  );
}

export default (withTranslation()(StatusSteps));
