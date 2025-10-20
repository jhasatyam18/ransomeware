import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import React, { useEffect, useRef, useState } from 'react';
import SimpleBar from 'simplebar-react';
import { Badge, Popover, PopoverBody } from 'reactstrap';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NODE_STATUS_ONLINE, NODE_STATUS_OFFLINE, JOB_RECOVERED, JOB_COMPLETION_STATUS, JOB_RUNNING_STATUS, JOB_IN_PROGRESS, JOB_FAILED, JOB_INIT_FAILED, JOB_IN_SYNC, JOB_COMPLETED_WITH_ERRORS, JOB_EXCEEDED_INTERVAL, JOB_STOPPED, JOB_INIT_SUCCESS, JOB_INIT_PROGRESS, JOB_SYNC_FAILED, JOB_INIT_SYNC_PROGRESS, JOB_RESYNC_FAILED, JOB_RESYNC_IN_PROGRESS, JOB_RESYNC_SUCCESS, JOB_SYNC_IN_PROGRESS, JOB_INIT_SYNC_FAILED, JOB_MIGRATED, MIGRATION_INIT_FAILED, PARTIALLY_COMPLETED, JOB_QUEUED, PENDING_STATUS, VALIDATING, AUTO_MIGRATION_FAILED, ENABLED, DISABLED, PARTIALLY_RUNNING } from '../../../constants/AppStatus';
import 'boxicons';
import { getValue } from '../../../utils/InputUtils';
import { STATIC_KEYS, UI_WORKFLOW } from '../../../constants/InputConstants';
import { getItemRendererComponent } from '../../../utils/ComponentFactory';

function StatusItemRenderer({ data, field, t, noPopOver, showDate, user, dispatch, options }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const targetRef = useRef(null);
  const { values } = user;
  const successStatus = [JOB_COMPLETION_STATUS, JOB_INIT_SUCCESS, NODE_STATUS_ONLINE, JOB_RESYNC_SUCCESS, JOB_IN_SYNC, JOB_RECOVERED, JOB_MIGRATED, ENABLED];
  const runningStatus = [JOB_RUNNING_STATUS, JOB_IN_PROGRESS, VALIDATING];
  const errorStatus = [JOB_FAILED, JOB_STOPPED, JOB_INIT_FAILED, JOB_SYNC_FAILED, NODE_STATUS_OFFLINE, JOB_RESYNC_FAILED, JOB_INIT_SYNC_FAILED, MIGRATION_INIT_FAILED, AUTO_MIGRATION_FAILED, DISABLED];
  const progressStatus = [JOB_INIT_PROGRESS, JOB_INIT_SYNC_PROGRESS, JOB_RESYNC_IN_PROGRESS, JOB_SYNC_IN_PROGRESS];
  const warningStatus = [PARTIALLY_COMPLETED, JOB_EXCEEDED_INTERVAL, JOB_QUEUED, PENDING_STATUS, PARTIALLY_RUNNING];
  const noPopOverForWorkflow = [UI_WORKFLOW.REFRESH_RECOVERY];
  const currentWorkflow = getValue(STATIC_KEYS.UI_WORKFLOW, values);
  // option field to retrieve data value from a function
  const { getValueFromFunc, shouldShowFnc } = options || {};
  useEffect(() => {
  }, [data[field]]);
  if (!data) {
    return '-';
  }
  let status = data[field];
  if (typeof shouldShowFnc === 'function') {
    const show = shouldShowFnc(data);
    if (!show) return '-';
  }
  if (getValueFromFunc && typeof getValueFromFunc === 'function') {
    status = getValueFromFunc(data);
  }

  if (!status) {
    return '-';
  }
  status = status.toLowerCase();

  status = status.toLowerCase();

  let resp = status.charAt(0).toUpperCase() + status.slice(1);

  const renderPopOver = (hoverInfo) => {
    if (noPopOver || noPopOverForWorkflow.indexOf(currentWorkflow) !== -1) {
      return null;
    }
    return (
      <Popover placement="bottom" isOpen={popoverOpen} target={targetRef} style={{ backgroundColor: 'black', color: 'black', border: 'none', width: '280px', textAlign: hoverInfo.length <= 50 ? 'center' : 'left' }}>
        <PopoverBody style={{ color: 'white' }}>
          <SimpleBar style={{ maxHeight: '100px', minHeight: '30px', color: 'white' }}>
            {hoverInfo}
          </SimpleBar>
        </PopoverBody>
      </Popover>
    );
  };

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
      <div className="d-flex">
        <Badge innerRef={targetRef} id={`status-${field}-${data.name}-${data.id}`} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)} className={`me-1 font-size-13 badge-soft-${colorinfo}`} color={`${colorinfo}`} pill>
          {icon ? (
            <>
              <i className="fa fa-spinner fa-spin" />
              &nbsp;&nbsp;
            </>
          ) : null}
          {t(resp)}
          {hoverInfo !== '' ? renderPopOver(hoverInfo) : null}
          {showDate === 'true' ? <span className="font-size-11 padding-left-10">{new Date(data.lastRunTime * 1000).toLocaleString()}</span> : null}
        </Badge>
        {options?.ItemRenderer ? getItemRendererComponent({ render: options?.ItemRenderer, data, field: options?.field, user, dispatch }) : null}
      </div>
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
