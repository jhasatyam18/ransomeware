import React from 'react';
import { JOB_COMPLETION_STATUS, JOB_RUNNING_STATUS, JOB_IN_PROGRESS, JOB_FAILED, JOB_IN_SYNC, JOB_COMPLETED_WITH_ERRORS } from '../../constants/AppStatus';
import 'boxicons';

function StatusItemRenderer({ data }) {
  const { status } = data;
  const resp = status.charAt(0).toUpperCase() + status.slice(1);

  if (status === JOB_COMPLETION_STATUS) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-2">
            <box-icon color="green" name="check" />
          </div>
          <div className="col-10">
            {resp}
          </div>
        </div>
      </div>
    );
  }
  if (status === JOB_RUNNING_STATUS || status === JOB_IN_PROGRESS) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-2">
            <box-icon color="white" animation="spin" name="loader circle" />
          </div>
          <div className="col-10">
            Running
          </div>
        </div>
      </div>
    );
  }
  if (status === JOB_FAILED) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-2">
            <box-icon color="red" name="x" />
          </div>
          <div className="col-10">
            {resp}
          </div>
        </div>
      </div>
    );
  }
  if (status === JOB_IN_SYNC) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-2">
            <box-icon color="white" name="sync" />
          </div>
          <div className="col-10">
            {resp}
          </div>
        </div>
      </div>
    );
  }
  if (status === JOB_COMPLETED_WITH_ERRORS) {
    return (
      <div className="container">
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
  return (
    <div>{resp}</div>
  );
}

export default StatusItemRenderer;
