import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import SimpleBar from 'simplebar-react';
import { Badge, Popover, PopoverBody } from 'reactstrap';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NODE_STATUS_ONLINE, NODE_STATUS_OFFLINE, JOB_RECOVERED, JOB_COMPLETION_STATUS, JOB_RUNNING_STATUS, JOB_IN_PROGRESS, JOB_FAILED, JOB_INIT_FAILED, JOB_IN_SYNC, JOB_COMPLETED_WITH_ERRORS, JOB_EXCEEDED_INTERVAL, JOB_STOPPED, JOB_INIT_SUCCESS, JOB_INIT_PROGRESS, JOB_SYNC_FAILED, JOB_INIT_SYNC_PROGRESS, JOB_RESYNC_FAILED, JOB_RESYNC_IN_PROGRESS, JOB_RESYNC_SUCCESS, JOB_SYNC_IN_PROGRESS, JOB_INIT_SYNC_FAILED, JOB_MIGRATED, MIGRATION_INIT_FAILED, PARTIALLY_COMPLETED, JOB_QUEUED, PENDING_STATUS, VALIDATING, AUTO_MIGRATION_FAILED } from '../../../constants/AppStatus';
import 'boxicons';
import { getValue } from '../../../utils/InputUtils';
import { STATIC_KEYS, UI_WORKFLOW } from '../../../constants/InputConstants';
// import { openModal } from '../../../store/actions/ModalActions';
// import { INFORMATION_MODAL } from '../../../constants/Modalconstant';

function StatusItemRenderer({ data, field, t, noPopOver, showDate, user }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { values } = user;
  const successStatus = [JOB_COMPLETION_STATUS, JOB_INIT_SUCCESS, NODE_STATUS_ONLINE, JOB_RESYNC_SUCCESS, JOB_IN_SYNC, JOB_RECOVERED, JOB_MIGRATED];
  const runningStatus = [JOB_RUNNING_STATUS, JOB_IN_PROGRESS, VALIDATING];
  const errorStatus = [JOB_FAILED, JOB_STOPPED, JOB_INIT_FAILED, JOB_SYNC_FAILED, NODE_STATUS_OFFLINE, JOB_RESYNC_FAILED, JOB_INIT_SYNC_FAILED, MIGRATION_INIT_FAILED, AUTO_MIGRATION_FAILED];
  const progressStatus = [JOB_INIT_PROGRESS, JOB_INIT_SYNC_PROGRESS, JOB_RESYNC_IN_PROGRESS, JOB_SYNC_IN_PROGRESS];
  const warningStatus = [PARTIALLY_COMPLETED, JOB_EXCEEDED_INTERVAL, JOB_QUEUED, PENDING_STATUS];
  const noPopOverForWorkflow = [UI_WORKFLOW.REFRESH_RECOVERY];
  const currentWorkflow = getValue(STATIC_KEYS.UI_WORKFLOW, values);
  useEffect(() => {
  }, [data[field]]);
  if (!data) {
    return '-';
  }

  let status = data[field];
  if (!status) {
    return '-';
  }
  status = status.toLowerCase();

  status = status.toLowerCase();

  let resp = status.charAt(0).toUpperCase() + status.slice(1);

  const renderPopOver = (hoverInfo, key) => {
    if (noPopOver || noPopOverForWorkflow.indexOf(currentWorkflow) !== -1) {
      return null;
    }
    return (
      <Popover placement="bottom" isOpen={popoverOpen} target={key} style={{ backgroundColor: '#fff', borderRadius: '8px', color: 'black', border: 'none', width: '280px', textAlign: hoverInfo.length <= 50 ? 'center' : 'left' }}>
        <PopoverBody>
          <SimpleBar style={{ maxHeight: '100px', minHeight: '30px', color: 'black' }}>
            {hoverInfo}
          </SimpleBar>
        </PopoverBody>
      </Popover>
    );
  };

  // const onKnowMoreClick = () => {
  //   const textObject = { reasonTitle: t('pending.reason'), reasonDescription: t('pending.reason.description'), resolutionStepTitle: t('pending.resolution.step.title'), resolutionSteps: [t('pending.resolution.step.1'), t('pending.resolution.step.2'), t('pending.resolution.step.3'), t('pending.resolution.step.4')], impactDescription: t('impact.description') };
  //   const options = { title: 'Pending Platform Checks', floatModalRight: true, modal: INFORMATION_MODAL, textObject };
  //   dispatch(openModal(INFORMATION_MODAL, options));
  // };

  function statusRenderer({ name, icon }) {
    const { failureMessage, errorMessage } = data;
    const errMsg = (typeof failureMessage !== 'undefined' ? failureMessage : errorMessage);
    const msg = (typeof errMsg !== 'undefined' ? errMsg : '');
    const hoverInfo = msg;
    let colorinfo = name;
    // if status is equal partially completed then mark syncstatus as warning status
    if (field === 'syncStatus' && data.status === PARTIALLY_COMPLETED) {
      colorinfo = 'warning';
    }
    return (
      <>
        <Badge id={`status-${field}-${data.name}-${data.id}`} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)} className={`font-size-13 badge-soft-${colorinfo}`} color={`${colorinfo}`} pill>
          {icon ? (
            <>
              <i className="fa fa-spinner fa-spin" />
            &nbsp;&nbsp;
            </>
          ) : null}
          {t(resp)}
          {hoverInfo !== '' ? renderPopOver(hoverInfo, `status-${field}-${data.name}-${data.id}`) : null}
          {showDate === 'true' ? <span className="font-size-11 padding-left-10">{new Date(data.lastRunTime * 1000).toLocaleString()}</span> : null}
        </Badge>
        {/* {status === PENDING_STATUS ? <span onMouseEnter={() => setPopoverOpen(false)} aria-hidden onClick={onKnowMoreClick} className="link_color d-block margin-left-5 margin-top-5" style={{ fontSize: '10px' }}>Know more...</span> : null} */}
      </>
    );
  }

  if (successStatus.includes(status)) {
    return statusRenderer({ name: 'success' });
  }

  if (runningStatus.includes(status)) {
    return statusRenderer({ name: 'info', icon: true });
  }

  if (errorStatus.includes(status)) {
    return statusRenderer({ name: 'danger' });
  }
  if (progressStatus.includes(status)) {
    return statusRenderer({ name: 'info' });
  }
  if (status === JOB_COMPLETED_WITH_ERRORS) {
    return (
      <div className="container" title={data.message}>
        <div className="row">
          <div className="col-2">
            <FontAwesomeIcon size="xs" icon={faCheck} className="padding-4" />
          </div>
          <div className="col-10">
            {resp}
          </div>
        </div>
      </div>
    );
  }

  if (warningStatus.includes(status)) {
    return statusRenderer({ name: 'warning' });
  }

  if (data[field] === true) {
    resp = t('active');
    return statusRenderer({ name: 'info' });
  }

  return statusRenderer({ name: 'success' });
}

function mapStateToProps(state) {
  const { dispatch, user } = state;
  return { dispatch, user };
}
export default connect(mapStateToProps)(withTranslation()(StatusItemRenderer));
