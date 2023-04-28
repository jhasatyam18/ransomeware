import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Col, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { JOB_COMPLETION_STATUS, JOB_FAILED, JOB_IN_PROGRESS } from '../../constants/AppStatus';

/**
 *
 * @param {*} props is an object of data , apiURL
 * @returns render recovery jobs status in steps
 */
function StepStatus(props) {
  const { steps, data } = props;
  const shortFailureMsg = data.failureMessage ? data.failureMessage.substring(0, 30) : '';
  const [errormsg, setErrorMsg] = useState(`${shortFailureMsg}...`);
  const [show, setshow] = useState('More');
  if (typeof steps === 'undefined' || steps === null || steps.length === 0) {
    return null;
  }

  const renderIcon = (st) => {
    const { status } = st;
    if (status === JOB_COMPLETION_STATUS) {
      return <FontAwesomeIcon size="lg" icon={faCheckCircle} className="text-success recovery_step_icon" />;
    } if (status === JOB_FAILED) {
      return <FontAwesomeIcon size="lg" icon={faCircleXmark} className="text-danger recovery_step_icon" />;
    } if (status === JOB_IN_PROGRESS) {
      return <i className="fa fa-spinner fa-lg fa-spin text-info recovery_step_icon" />;
    }
  };

  const showFullErrorText = () => {
    if (show === 'More') {
      setErrorMsg(data.failureMessage);
      setshow('Less');
    } else {
      setshow('More');
      setErrorMsg(`${data.failureMessage.substring(0, 30)}...` || '');
    }
  };

  const renderSteps = (st, i) => {
    const { message, time } = st;
    const convertTedTime = time * 1000;
    const d = new Date(convertTedTime);
    const resp = `${d.toLocaleTimeString()}`;
    return (
      <div className="step_parent_div">
        <div className="step_icon_div">{renderIcon(st)}</div>
        <div className={`step_msg_div ${i === steps.length - 1 ? '' : 'progress_step_border'}`}>
          <p className="step_msg" style={{ cursor: 'pointer' }}>
            {message}
          </p>
          <p className="step_time">
            {resp}
            {st.status === JOB_FAILED ? (
              <p aria-hidden onClick={showFullErrorText}>
                {`${errormsg}`}
                {' '}
                  &nbsp;
                <span style={{ color: '#556ee6' }}>{show}</span>
              </p>
            ) : null}
          </p>
        </div>
      </div>
    );
  };

  const renderProgress = () => steps.map((st, i) => (
    <Row>
      <Col sm={12}>
        {renderSteps(st, i)}
      </Col>
    </Row>
  ));

  if (steps.length === 0) {
    return null;
  }

  return (
    <>
      {renderProgress()}
    </>
  );
}
function mapStateToProps(state) {
  const { dispatch } = state;
  return { dispatch };
}
export default connect(mapStateToProps)(withTranslation()(StepStatus));
