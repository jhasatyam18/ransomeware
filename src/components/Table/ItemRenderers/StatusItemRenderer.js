import React from 'react';
import { Badge } from 'reactstrap';
import { NODE_STATUS_ONLINE, NODE_STATUS_OFFLINE, JOB_RECOVERED, JOB_COMPLETION_STATUS, JOB_RUNNING_STATUS, JOB_IN_PROGRESS, JOB_FAILED, JOB_INIT_FAILED, JOB_IN_SYNC, JOB_COMPLETED_WITH_ERRORS, JOB_ONGOING, JOB_STOPPED, JOB_INIT_SUCCESS, JOB_INIT_PROGRESS, JOB_SYNC_FAILED, JOB_INIT_SYNC_PROGRESS, JOB_RESYNC_FAILED, JOB_RESYNC_IN_PROGRESS, JOB_RESYNC_SUCCESS, JOB_SYNC_IN_PROGRESS, JOB_INIT_SYNC_FAILED } from '../../../constants/AppStatus';
import 'boxicons';

function StatusItemRenderer({ data, field }) {
  const successArray = [JOB_COMPLETION_STATUS, JOB_INIT_SUCCESS, NODE_STATUS_ONLINE, JOB_RESYNC_SUCCESS, JOB_IN_SYNC, JOB_RECOVERED, 'migrated'];
  const runningStatus = [JOB_RUNNING_STATUS, JOB_IN_PROGRESS];
  const errorStatus = [JOB_FAILED, JOB_STOPPED, JOB_INIT_FAILED, JOB_SYNC_FAILED, NODE_STATUS_OFFLINE, JOB_RESYNC_FAILED, JOB_INIT_SYNC_FAILED];
  const progressArray = [JOB_ONGOING, JOB_INIT_PROGRESS, JOB_INIT_SYNC_PROGRESS, JOB_RESYNC_IN_PROGRESS, JOB_SYNC_IN_PROGRESS];

  if (!data) {
    return '-';
  }
  let status = data[field];
  if (!status) {
    return '-';
  }
  status = status.toLowerCase();
  let resp = status.charAt(0).toUpperCase() + status.slice(1);
  if (resp === 'Partialycompleted') {
    resp = 'Partially Completed';
  }
  function statusRenderer({ name, title, text, space, icon }) {
    return (
      <div>
        <Badge title={title ? `${title}` : null} className={`font-size-13 badge-soft-${name}`} color={`${name}`} pill>
          {icon ? <i className="fa fa-spinner fa-spin" /> : null}
          { space ? (
            <>
          &nbsp;&nbsp;
            </>
          ) : null}
          {text || resp}
        </Badge>
      </div>
    );
  }
  for (let i = 0; i < successArray.length; i += 1) {
    if (status === successArray[i]) {
      return statusRenderer({ name: 'success' });
    }
  }
  for (let i = 0; i < runningStatus; i += 1) {
    if (status === runningStatus[i]) {
      return statusRenderer({ name: 'info', title: data.step, text: 'Running', space: true, icon: true });
    }
  }
  for (let i = 0; i < errorStatus.length; i += 1) {
    if (status === errorStatus[i]) {
      const { failureMessage, errorMessage } = data;
      const msg = (typeof failureMessage !== 'undefined' ? failureMessage : errorMessage);
      return statusRenderer({ name: 'danger', title: msg });
    }
  }
  if (status === JOB_ONGOING) {
    return statusRenderer({ name: 'info', space: true });
  }
  for (let i = 0; i < progressArray; i += 1) {
    if (status === progressArray[i]) {
      return statusRenderer({ name: 'info', space: true, icon: true });
    }
  }
  if (status === JOB_COMPLETED_WITH_ERRORS) {
    return (
      <div className="container" title={data.message}>
        <div className="row">
          <div className="col-2">
            <box-icon color="yellow" name="check" />
          </div>
          <div className="col-10">
            {resp}
          </div>
        </div>
      </div>
    );
  }
  // active status
  if (data[field] === true) {
    return statusRenderer({ name: 'info', text: 'Active', space: true });
  }
  const { failureMessage, errorMessage } = data;
  const errMsg = (typeof failureMessage !== 'undefined' ? failureMessage : errorMessage);
  const msg = (typeof errMsg !== 'undefined' ? errMsg : '');
  return statusRenderer({ name: 'info', title: msg, space: true });
}

export default StatusItemRenderer;
