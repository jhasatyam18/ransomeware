import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { Col, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { addMessage } from '../../store/actions/MessageActions';
import { callAPI } from '../../utils/ApiUtils';
import { JOB_COMPLETION_STATUS, JOB_FAILED, JOB_IN_PROGRESS } from '../../constants/AppStatus';
import { MILI_SECONDS_TIME } from '../../constants/EventConstant';

/**
 *
 * @param {*} props is an object of data , apiURL
 * @returns render recovery jobs status in steps
 */
function StatusSteps(props) {
  const [steps, setSteps] = useState([]);
  const { data } = props;
  let isUnmounting = false;
  useEffect(() => {
    fetchRunningJobsSteps();
    const timerId = setInterval(() => {
      fetchRunningJobsSteps();
    }, MILI_SECONDS_TIME.TEN_THOUSAND);

    return () => {
      isUnmounting = true;
      clearInterval(timerId);
    };
  }, []);

  function fetchRunningJobsSteps() {
    const { dispatch, apiURL } = props;
    let runningState = false;
    if (steps.length > 0) {
      runningState = steps.all((step) => step.status === JOB_IN_PROGRESS);
    }
    if (!runningState || steps.length === 0) {
      const url = apiURL.replace('<id>', data.id);
      callAPI(url).then((json) => {
        if (isUnmounting) return;
        const step = JSON.parse(json.step);
        setSteps(step);
      }, (err) => {
        if (isUnmounting) return;
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
    }
  }
  if (typeof steps === 'undefined' || steps === null || steps.length === 0) {
    return null;
  }

  const renderSteps = () => steps.map((st, i) => (
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
          {i === steps.length - 1 ? '' : (
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
function mapStateToProps(state) {
  const { dispatch } = state;
  return { dispatch };
}
export default connect(mapStateToProps)(withTranslation()(StatusSteps));
