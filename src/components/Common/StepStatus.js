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
function StepStatus(props) {
  const [steps, setSteps] = useState([]);
  const { data } = props;
  const jobStatus = [JOB_COMPLETION_STATUS, JOB_FAILED];
  let isUnmounting = false;

  const fetchRunningJobsSteps = () => {
    const { dispatch, apiURL } = props;
    if (data.status === 'running' || steps.length === 0) {
      const url = apiURL.replace('<id>', data.id);
      callAPI(url).then((json) => {
        if (isUnmounting) return;
        let step = [];
        if (json.step !== '' && typeof json.step !== 'undefined') {
          step = JSON.parse(json.step);
        }
        setSteps(step);
      }, (err) => {
        if (isUnmounting) return;
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
    }
  };

  useEffect(() => {
    const { dispatch } = props;
    let timerId;
    if (jobStatus.indexOf(data.status) !== -1) {
      try {
        const parsedData = JSON.parse(data.step);
        setSteps(parsedData);
      } catch (e) {
        setSteps([]);
      }
    } else {
      fetchRunningJobsSteps();
      timerId = setInterval(() => {
        try {
          fetchRunningJobsSteps();
        } catch (e) {
          dispatch(addMessage(e, MESSAGE_TYPES.ERROR));
        }
      }, MILI_SECONDS_TIME.TWENTY_SECONDS);
    }
    return () => {
      isUnmounting = true;
      clearInterval(timerId);
    };
  }, []);

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

  const renderSteps = (st, i) => {
    const { message, time } = st;
    const convertTedTime = time * 1000;
    const d = new Date(convertTedTime);
    const resp = `${d.toLocaleTimeString()}`;
    // vertical
    return (
      <div className="step_parent_div">
        <div className="step_icon_div">{renderIcon(st)}</div>
        <div className={`step_msg_div ${i === steps.length - 1 ? '' : 'progress_step_border'}`}>
          <p className="step_msg">
            {message}
          </p>
          <p className="step_time">
            {resp}
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
