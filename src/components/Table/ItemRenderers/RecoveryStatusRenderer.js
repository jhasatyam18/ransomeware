import React, { useEffect, useRef, useState } from 'react';
import { Col, Popover, PopoverBody, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { MESSAGE_TYPES } from '../../../constants/MessageConstants';
import { addMessage } from '../../../store/actions/MessageActions';
import { JOB_COMPLETION_STATUS, JOB_FAILED } from '../../../constants/AppStatus';
import { MILI_SECONDS_TIME } from '../../../constants/EventConstant';
import { callAPI } from '../../../utils/ApiUtils';
import { UI_WORKFLOW } from '../../../constants/InputConstants';
import { getRecoveryInfoForVM } from '../../../utils/RecoveryUtils';
import { MODAL_SUMMARY } from '../../../constants/Modalconstant';
import { openModal } from '../../../store/actions/ModalActions';
import { API_RESCOVERY_JOB_STATUS_STEPS } from '../../../constants/ApiConstants';
import StatusItemRenderer from './StatusItemRenderer';
import StepStatus from '../../Common/StepStatus';

function RecoveryStatusRenderer({ data, field, t, dispatch, user }) {
  const [toggle, setToggle] = useState(data.step === '');
  const [popOver, setpopOver] = useState(false);
  const [jobdata, setjobdata] = useState(data);
  const [steps, setSteps] = useState([]);
  const parsedConfiguration = data.config !== '' && typeof data.config !== 'undefined' ? JSON.parse(data.config) : undefined;
  const { values } = user;
  const COPY_CONFIG = [{ value: 'copy_gen_config', label: 'General' },
    { value: 'copy_net_config', label: 'Network' },
    { value: 'copy_rep_script_config', label: 'Replication Scripts' },
    { value: 'copy_rec_script_config', label: 'Recovery Scripts' }];
  const configData = getRecoveryInfoForVM({ user, configToCopy: COPY_CONFIG, recoveryConfig: parsedConfiguration, values, workFlow: UI_WORKFLOW.LAST_TEST_RECOVERY_SUMMARY });
  const options = { title: 'Recovery Configuration', data: configData, css: 'modal-lg', showSummary: true };
  const timerId = useRef();
  const RecoveryStatus = [JOB_COMPLETION_STATUS, JOB_FAILED];

  useEffect(() => () => {
    // while the step component is openeed and we went on other page then also the timer should get cleared
    clearInterval(timerId.current);
  }, []);

  const fetchRunningJobsSteps = () => {
    const url = API_RESCOVERY_JOB_STATUS_STEPS.replace('<id>', jobdata.id);
    callAPI(url).then((json) => {
      let step = [];
      if (json.step !== '' && typeof json.step !== 'undefined') {
        step = JSON.parse(json.step);
      }
      setSteps(step);
      setjobdata(json);
      if (RecoveryStatus.indexOf(json.status) !== -1) {
        clearInterval(timerId.current);
      }
    }, (err) => {
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };

  const handleCheckbox = () => {
    setToggle(!toggle);
    if (!toggle) {
      if (RecoveryStatus.indexOf(jobdata.status) !== -1) {
        try {
          const parsedData = JSON.parse(jobdata.step);
          setSteps(parsedData);
        } catch (e) {
          setSteps([]);
        }
      } else {
        fetchRunningJobsSteps();
        if (typeof timerId.current === 'undefined') {
          timerId.current = gitTimerTofetch();
        }
      }
    } else {
      // if the step component is hidden then clear the timer
      clearInterval(timerId.current);
      timerId.current = undefined;
    }
  };

  function gitTimerTofetch() {
    return setInterval(() => {
      try {
        fetchRunningJobsSteps();
      } catch (e) {
        dispatch(addMessage(e, MESSAGE_TYPES.ERROR));
        clearInterval(timerId.current);
      }
    }, MILI_SECONDS_TIME.TWENTY_THOUSAND_MS);
  }

  const onClick = () => {
    dispatch(openModal(MODAL_SUMMARY, options));
  };

  const renderPopOver = (key) => (
    <Popover placement="bottom" isOpen={popOver && !toggle} target={key} style={{ backgroundColor: '#fff', width: '110px', textAlign: 'center', borderRadius: '5px' }}>
      <PopoverBody style={{ color: 'black' }}>
        {t('show.details')}
      </PopoverBody>
    </Popover>
  );
  const renderShowProgress = () => {
    const key = `step-status-${field}-${data.id}`;
    return (
      <>
        <FontAwesomeIcon
          size="lg"
          icon={faListCheck}
          className="progress_list"
          onClick={jobdata.step !== '' ? handleCheckbox : null}
          onMouseEnter={() => setpopOver(true)}
          onMouseLeave={() => setpopOver(false)}
          id={key}
          color={toggle === true ? '#bfc8e2' : '#50a5f1'}
        />
        {renderPopOver(key)}
      </>
    );
  };
  return (
    <>
      <div className="rec_job_parent">
        <Row>
          <Col sm={7}>
            <StatusItemRenderer data={jobdata} field={field} />
          </Col>
          <Col sm={2} className="show_details">
            {renderShowProgress()}
          </Col>
          <Col sm={2}>
            <i className="fas fa-info-circle info__icon test_summary_icon" aria-hidden="true" onClick={onClick} style={{ height: 20, cursor: 'pointer' }} />
          </Col>
        </Row>
        <Row className=" padding-left-2">
          <Col sm={12}>
            {toggle === true ? <StepStatus steps={steps} data={jobdata} /> : null}
          </Col>
        </Row>
      </div>
    </>
  );
}

function mapStateToProps(state) {
  const { dispatch, user } = state;
  return { dispatch, user };
}
export default connect(mapStateToProps)(withTranslation()(RecoveryStatusRenderer));
