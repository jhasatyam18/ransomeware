import { faListCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Col, Popover, PopoverBody, Row } from 'reactstrap';
import { API_RESCOVERY_JOB_STATUS_STEPS } from '../../../constants/ApiConstants';
import { JOB_COMPLETION_STATUS, JOB_FAILED } from '../../../constants/AppStatus';
import { MILI_SECONDS_TIME } from '../../../constants/EventConstant';
import { RECOVERY_GUEST_OS, RECOVERY_STATUS, RECOVERY_STEPS, STATIC_KEYS, UI_WORKFLOW } from '../../../constants/InputConstants';
import { MESSAGE_TYPES } from '../../../constants/MessageConstants';
import { MODAL_SUMMARY, MODAL_TROUBLESHOOTING_WINDOW } from '../../../constants/Modalconstant';
import { addMessage } from '../../../store/actions/MessageActions';
import { openModal } from '../../../store/actions/ModalActions';
import { callAPI } from '../../../utils/ApiUtils';
import { getRecoveryInfoForVM } from '../../../utils/RecoveryUtils';
import StepStatus from '../../Common/StepStatus';
import StatusItemRenderer from './StatusItemRenderer';

function RecoveryStatusRenderer({ data, field, t, dispatch, user }) {
  const [toggle, setToggle] = useState(data.step === '');
  const [popOver, setpopOver] = useState(false);
  const [jobdata, setjobdata] = useState(data);
  const [steps, setSteps] = useState([]);
  const [detailedStepError, setDetailedStepError] = useState(false);
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

  useEffect(() => {
    if (typeof data !== 'undefined' && data.step !== '') {
      const step = JSON.parse(data.step);
      step.forEach((element) => {
        if (typeof element.data !== 'undefined' && element.data !== '' && element.name === RECOVERY_STEPS.VALIDATION_INSTANCE_FOR_RECOVERY) {
          const parseData = JSON.parse(element.data);
          parseData.forEach((pd) => {
            const key = Object.keys(pd);
            const detailedStepStatus = pd[key[0]].result;
            if (detailedStepStatus === STATIC_KEYS.REC_STEP_FAIL) {
              setDetailedStepError(true);
            }
          });
        }
      });
    }
    // while the step component is openeed and we went on other page then also the timer should get cleared
    return () => {
      clearInterval(timerId.current);
    };
  }, []);
  const fetchRunningJobsSteps = () => {
    const url = API_RESCOVERY_JOB_STATUS_STEPS.replace('<id>', jobdata.id);
    return callAPI(url).then((json) => {
      let step = [];
      if (json.step !== '' && typeof json.step !== 'undefined') {
        step = JSON.parse(json.step);
        if (step.length > 0 && json.name === RECOVERY_STEPS.VALIDATION_INSTANCE_FOR_RECOVERY) {
          step.forEach((element) => {
            if (element.data !== '') {
              const parseData = JSON.parse(element.data);
              for (let j = 0; j < parseData.length; j += 1) {
                if (parseData[j].result === STATIC_KEYS.REC_STEP_FAIL) {
                  setDetailedStepError(true);
                  break;
                }
              }
            }
          });
        }
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

  const openTroubleshootingWindow = () => {
    const opts = { title: data.recoveryType === 'full recovery' ? t('title.troubleshoot.recovery') : t('title.troubleshoot.test.recovery'), css: 'modal-xl', data: { recoveryType: data.recoveryType, protectionPlanID: data.protectionPlanID } };
    dispatch(openModal(MODAL_TROUBLESHOOTING_WINDOW, opts));
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
          <Col lg={8}>
            <StatusItemRenderer data={jobdata} field={field} />
          </Col>
          <Col sm={4}>
            <Row>
              <Col sm={3} className="show_details margin-left-8 margin-right-5">
                {renderShowProgress()}
              </Col>
              <Col sm={3}>
                <i title="View Recovery Configuration" className="fas fa-info-circle info__icon test_summary_icon" aria-hidden="true" onClick={onClick} style={{ height: 20, cursor: 'pointer' }} />
              </Col>
              {((data.status === RECOVERY_STATUS.FAILED || detailedStepError) && data.guestOS === RECOVERY_GUEST_OS.WINDOWS) ? (
                <Col sm={3} className="padding-left-5" title="Troubleshooting Steps">
                  <i title="Troubleshooting Steps" className="fas fa-exclamation-triangle icon__warning" aria-hidden="true" onClick={openTroubleshootingWindow} style={{ height: 20, cursor: 'pointer' }} />
                </Col>
              ) : null}
            </Row>
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
