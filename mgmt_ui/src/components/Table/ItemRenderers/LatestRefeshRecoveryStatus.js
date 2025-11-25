import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Col, Row } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck } from '@fortawesome/free-solid-svg-icons';
import RenderDetailedStep from '../../Common/RenderDetailedStep';
import { STATIC_KEYS } from '../../../constants/InputConstants';
import { DETAILED_STEP_COMPONENTS, JOB_FAILED, JOB_IN_PROGRESS, PASS, VALIDATING } from '../../../constants/AppStatus';
import { getValue } from '../../../utils/InputUtils';
import StatusItemRenderer from './StatusItemRenderer';

function LatestRefeshRecoveryStatus({ data, user }) {
  const [toggle, setToggle] = useState(false);
  const { values } = user;
  const { vmMoref } = data;
  const validationStatus = getValue(STATIC_KEYS.UI_REFRESH_OP_STATE, values);
  const latestStateData = getValue('refreshStatusValues', values);
  const dataObj = latestStateData?.[vmMoref] || {};
  if (!dataObj || Object.keys(dataObj).length === 0 || !dataObj?.vmMoref) {
    return null;
  }
  if (validationStatus === JOB_IN_PROGRESS && !data.recoveryJobStatus) {
    dataObj.validationStatus = VALIDATING;
  } else if (validationStatus === JOB_FAILED) {
    dataObj.validationStatus = JOB_FAILED;
  }
  const status = dataObj.recoveryJobStatus;
  let statusChecks = [];
  if (dataObj?.cspCheckResp.length > 0) {
    statusChecks = JSON.parse(dataObj?.cspCheckResp);
  }
  let passedSteps = 0;
  statusChecks.forEach((element) => {
    if (element.result === PASS) {
      passedSteps += 1;
    }
  });
  const handleCheckbox = () => {
    setToggle(!toggle);
  };

  return (
    <>
      <Row style={{ minWidth: '280px' }}>
        {(validationStatus === JOB_FAILED || validationStatus === JOB_IN_PROGRESS) && !status ? (
          <Col sm={4}>
            <StatusItemRenderer data={dataObj} noPopOver={false} field="validationStatus" />
          </Col>
        ) : (
          <Col sm={4}>
            <StatusItemRenderer data={dataObj} noPopOver={false} field="recoveryJobStatus" />
          </Col>
        )}
        {status !== '' ? (
          <>
            <Col sm={8} style={{ fontSize: '11px' }} className={`${status === JOB_FAILED ? 'text-danger' : 'text-success'}`}>
              <Row>
                <Col sm={9}>
                  <span className="margin-right-7">{`${passedSteps}/${statusChecks.length} Checks Passed`}</span>
                </Col>
                <Col sm={3}>
                  {statusChecks.length > 0 ? (
                    <>
                      <FontAwesomeIcon
                        size="lg"
                        icon={faListCheck}
                        className="progress_list"
                        onClick={statusChecks.step !== '' ? handleCheckbox : null}
                        id={vmMoref}
                        color={toggle === true ? '#bfc8e2' : '#50a5f1'}
                      />
                    </>
                  ) : null}
                </Col>
              </Row>

            </Col>
          </>
        ) : null}
      </Row>
      {toggle ? (
        <>
          <p className="mb-0" style={{ minWidth: '250px' }}>
            <RenderDetailedStep parseData={statusChecks} id={vmMoref} name={DETAILED_STEP_COMPONENTS.PENDING_STATUS_STEPS} css="wizard-ref-rec-status" />
          </p>
        </>
      ) : null}
    </>
  );
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(LatestRefeshRecoveryStatus));
