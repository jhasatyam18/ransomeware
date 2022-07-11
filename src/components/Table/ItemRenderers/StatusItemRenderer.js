import React from 'react';
import { Badge } from 'reactstrap';
import { NODE_STATUS_ONLINE, NODE_STATUS_OFFLINE, JOB_RECOVERED, JOB_COMPLETION_STATUS, JOB_RUNNING_STATUS, JOB_IN_PROGRESS, JOB_FAILED, JOB_INIT_FAILED, JOB_IN_SYNC, JOB_COMPLETED_WITH_ERRORS, JOB_ONGOING, JOB_STOPPED, JOB_INIT_SUCCESS, JOB_INIT_PROGRESS, JOB_SYNC_FAILED, JOB_INIT_SYNC_PROGRESS, JOB_RESYNC_FAILED, JOB_RESYNC_IN_PROGRESS, JOB_RESYNC_SUCCESS, JOB_SYNC_IN_PROGRESS, JOB_INIT_SYNC_FAILED } from '../../../constants/AppStatus';
import 'boxicons';

function StatusItemRenderer({ data, field }) {
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

  // success info danger

  function successRenderer({ name, title, text, space, icon }) {
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
  if (status === JOB_COMPLETION_STATUS || status === JOB_INIT_SUCCESS || status === NODE_STATUS_ONLINE || status === JOB_RESYNC_SUCCESS) {
    return successRenderer({ name: 'success' });
  }
  if (status === JOB_RUNNING_STATUS || status === JOB_IN_PROGRESS) {
    return successRenderer({ name: 'info', title: data.step, text: 'Running', space: true, icon: true });
  }
  if (status === JOB_FAILED || status === JOB_STOPPED || status === JOB_INIT_FAILED || status === JOB_SYNC_FAILED || status === NODE_STATUS_OFFLINE || status === JOB_RESYNC_FAILED || status === JOB_INIT_SYNC_FAILED) {
    const { failureMessage, errorMessage } = data;
    const msg = (typeof failureMessage !== 'undefined' ? failureMessage : errorMessage);
    return successRenderer({ name: 'danger', title: msg });
  }
  if (status === JOB_IN_SYNC || status === 'migrated') {
    return successRenderer({ name: 'success' });
  }
  if (status === JOB_ONGOING) {
    return successRenderer({ name: 'info', space: true });
  }
  if (status === JOB_ONGOING || status === JOB_INIT_PROGRESS || status === JOB_INIT_SYNC_PROGRESS || status === JOB_RESYNC_IN_PROGRESS || status === JOB_SYNC_IN_PROGRESS) {
    return successRenderer({ name: 'info', space: true, icon: true });
  }
  if (status === JOB_RECOVERED) {
    return successRenderer({ name: 'success' });
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
    return successRenderer({ name: 'info', text: 'Active', space: true });
  }
  const { failureMessage, errorMessage } = data;
  const errMsg = (typeof failureMessage !== 'undefined' ? failureMessage : errorMessage);
  const msg = (typeof errMsg !== 'undefined' ? errMsg : '');
  return successRenderer({ name: 'info', title: msg, space: true });
}

export default StatusItemRenderer;
