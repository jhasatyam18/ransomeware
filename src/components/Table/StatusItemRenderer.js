import React from 'react';
import { JOB_COMPLETION_STATUS, JOB_RUNNING_STATUS } from '../../constants/AppStatus';
import 'boxicons';

function StatusItemRenderer({ data }) {
  if (data.status === JOB_COMPLETION_STATUS) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-2">
            <box-icon color="white" name="check" />
          </div>
          <div className="col-10">
            {data.status}
          </div>
        </div>
      </div>
    );
  }
  if (data.status === JOB_RUNNING_STATUS) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-2">
            <box-icon color="white" animation="burst" name="dots-horizontal-rounded" />
          </div>
          <div className="col-10">
            Running
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>{data.status}</div>
  );
}

export default StatusItemRenderer;
