import { faCheckCircle, faCircleXmark, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Col, Popover, PopoverBody, Row } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { JOB_COMPLETION_STATUS, JOB_FAILED, JOB_IN_PROGRESS } from '../../constants/AppStatus';
import { STATIC_KEYS } from '../../constants/InputConstants';
import { DATA_GRID_SHORT_TEXT_LENGTH } from '../../constants/UserConstant';

/**
 *
 * @param {*} props is an object of data , apiURL
 * @returns render recovery jobs status in steps
 */
function StepStatus(props) {
  const { steps, data, t } = props;
  const { id } = data;
  const shortFailureMsg = data.failureMessage ? data.failureMessage.substring(0, DATA_GRID_SHORT_TEXT_LENGTH) : '';
  const [errormsg, setErrorMsg] = useState(`${shortFailureMsg}...`);
  const [show, setshow] = useState(false);
  const [popOver, setPopOver] = useState({});
  if (typeof steps === 'undefined' || steps === null || steps.length === 0) {
    return null;
  }

  const renderIcon = (st, iconClass) => {
    const { status } = st;
    if (iconClass) {
      return <FontAwesomeIcon size="lg" icon={faExclamationTriangle} className="text-warning recovery_step_icon" />;
    }
    if (status === JOB_COMPLETION_STATUS) {
      return <FontAwesomeIcon size="lg" icon={faCheckCircle} className={`${iconClass || 'text-success'} recovery_step_icon`} />;
    } if (status === JOB_FAILED) {
      return <FontAwesomeIcon size="lg" icon={faCircleXmark} className="text-danger recovery_step_icon" />;
    } if (status === JOB_IN_PROGRESS) {
      return <i className="fa fa-spinner fa-lg fa-spin text-info recovery_step_icon" />;
    }
  };

  const renderPopOver = (hoverInfo, key, isOpen) => (
    <Popover placement="bottom" isOpen={popOver[isOpen]} target={key} style={{ backgroundColor: 'black', color: 'white', border: 'none', width: '200px', textAlign: 'left' }}>
      <PopoverBody>
        <SimpleBar style={{ maxHeight: '100px', minHeight: '30px' }}>
          {hoverInfo}
        </SimpleBar>
      </PopoverBody>
    </Popover>
  );

  const showFullErrorText = () => {
    setshow(!show);
    if (!show) {
      setErrorMsg(data.failureMessage);
    } else {
      setErrorMsg(`${data.failureMessage.substring(0, DATA_GRID_SHORT_TEXT_LENGTH)}...` || '');
    }
  };

  const renderSteps = (st, i) => {
    const { message, time } = st;
    let parseData = [];
    let stepStatusWarn = false;
    if (typeof st.data !== 'undefined' && st.data !== '') {
      parseData = JSON.parse(st.data);
    }

    if (parseData.length > 0) {
      parseData.forEach((pd) => {
        const key = Object.keys(pd);
        const detailedStepStatus = pd[key[0]].result;
        if (detailedStepStatus === STATIC_KEYS.REC_STEP_FAIL) {
          stepStatusWarn = true;
        }
      });
    }

    const convertTedTime = time * 1000;
    const d = new Date(convertTedTime);
    const resp = `${d.toLocaleTimeString()}`;
    const stepDivClss = parseData.length > 0 ? 'step_msg_div_data' : 'step_msg_div';
    return (
      <div className="step_parent_div">
        <div className="step_icon_div">{renderIcon(st, stepStatusWarn)}</div>
        <div className={`  ${stepDivClss} ${i === steps.length - 1 ? '' : 'progress_step_border'}`}>
          <p className="step_msg" style={{ cursor: 'pointer' }}>
            {message}
          </p>
          <p className="step_time">
            {resp}
            {st.status === JOB_FAILED ? (
              <p aria-hidden onClick={showFullErrorText} className="rec_status_error_Div">
                {`${errormsg}`}
                  &nbsp;
                <span className="link_color">{show ? 'Less' : 'More'}</span>
              </p>
            ) : null}
          </p>
          {parseData.length > 0
            ? (
              <ul className="rec_step_list">
                {parseData.map((pd) => {
                  const key = Object.keys(pd);
                  const detailedStepStatus = pd[key[0]].result;
                  return (
                    <li id={`rec-step-${id}-${key}`} onMouseEnter={() => setPopOver({ [key]: true })} onMouseLeave={() => setPopOver({ [key]: false })}>
                      { `${t(key)}   `}
                      {detailedStepStatus === STATIC_KEYS.REC_STEP_PASS ? (
                        <span className="text-success">
                          <FontAwesomeIcon size="sm" icon={faCheckCircle} />
                        </span>
                      ) : (
                        <>
                          <span className="text-danger">
                            <FontAwesomeIcon size="sm" icon={faCircleXmark} />
                          </span>
                        </>
                      )}
                      {renderPopOver(pd[key[0]].message, `rec-step-${id}-${key}`, key)}
                    </li>
                  );
                })}
              </ul>
            ) : null}
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
