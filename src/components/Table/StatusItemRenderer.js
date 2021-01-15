import React from 'react';
import { JOB_COMPLETION_STATUS, JOB_RUNNING_STATUS } from '../../constants/AppStatus';
import 'boxicons';

function StatusItemRenderer({ data }) {
  if (data.Status === JOB_COMPLETION_STATUS) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-3">
            <box-icon color="white" name="check" />
          </div>
          <div className="col-9">
            {data.Status}
          </div>
        </div>
      </div>
    );
  }
  if (data.Status === JOB_RUNNING_STATUS) {
    return (
      <div className="container">
        <div className="row">
          <div className="col-3">
            <box-icon color="white" animation="burst" name="dots-horizontal-rounded" />
          </div>
          <div className="col-9">
            {data.Status}
          </div>
        </div>
      </div>
    );
  }
}

export default StatusItemRenderer;
