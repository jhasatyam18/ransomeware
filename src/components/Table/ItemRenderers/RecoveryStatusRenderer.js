import React, { useState } from 'react';
import { Col, Popover, PopoverBody, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListCheck } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import { UI_WORKFLOW } from '../../../constants/InputConstants';
import { getRecoveryInfoForVM } from '../../../utils/RecoveryUtils';
import { MODAL_SUMMARY } from '../../../constants/Modalconstant';
import { openModal } from '../../../store/actions/ModalActions';
import { API_RESCOVERY_JOB_STATUS_STEPS } from '../../../constants/ApiConstants';
import StatusItemRenderer from './StatusItemRenderer';
import StepStatus from '../../Common/StepStatus';

function RecoveryStatusRenderer({ data, field, t, dispatch, user }) {
  const [toggle, setToggle] = useState(false);
  const [popOver, setpopOver] = useState(false);
  const parsedConfiguration = data.config !== '' && typeof data.config !== 'undefined' ? JSON.parse(data.config) : undefined;
  const { values } = user;
  const COPY_CONFIG = [{ value: 'copy_gen_config', label: 'General' },
    { value: 'copy_net_config', label: 'Network' },
    { value: 'copy_rep_script_config', label: 'Replication Scripts' },
    { value: 'copy_rec_script_config', label: 'Recovery Scripts' }];
  const configData = getRecoveryInfoForVM({ user, configToCopy: COPY_CONFIG, recoveryConfig: parsedConfiguration, values, workFlow: UI_WORKFLOW.LAST_TEST_RECOVERY_SUMMARY });
  const options = { title: 'Recovery Configuration', data: configData, css: 'modal-lg', showSummary: true };

  const handleCheckbox = () => {
    setToggle(!toggle);
  };

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
    const key = `step-status-${field}-${data.vmName}-${data.id}`;
    return (
      <Row>
        <Col sm={12}>
          <div className="status_view_prog_icon">
            <FontAwesomeIcon
              size="lg"
              icon={faListCheck}
              className="progress_list"
              onClick={handleCheckbox}
              onMouseEnter={() => setpopOver(true)}
              onMouseLeave={() => setpopOver(false)}
              id={key}
              color={toggle === true ? '#bfc8e2' : '#50a5f1'}
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
        <Col sm={4} className="status_renderer_Div">
          <StatusItemRenderer data={data} field={field} noPopOver />
        </Col>
        <Col sm={4} className="show_details">
          {renderShowProgress()}
        </Col>
        <Col sm={4}>
          <i className="fas fa-info-circle info__icon test_summary_icon" aria-hidden="true" onClick={onClick} style={{ height: 20, cursor: 'pointer' }} />
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

function mapStateToProps(state) {
  const { dispatch, user } = state;
  return { dispatch, user };
}
export default connect(mapStateToProps)(withTranslation()(RecoveryStatusRenderer));
