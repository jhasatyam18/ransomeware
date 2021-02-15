import React from 'react';
import { Badge } from 'reactstrap';
import { JOB_COMPLETION_STATUS, JOB_RUNNING_STATUS, JOB_IN_PROGRESS, JOB_FAILED, JOB_INIT_FAILED, JOB_IN_SYNC, JOB_COMPLETED_WITH_ERRORS, JOB_ONGOING, JOB_STOPPED } from '../../constants/AppStatus';
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
  const resp = status.charAt(0).toUpperCase() + status.slice(1);

  if (status === JOB_COMPLETION_STATUS) {
    return (
      <div>
        <Badge className="font-size-13 badge-soft-success" color="success" pill>
          {resp}
        </Badge>
      </div>
    );
  }
  if (status === JOB_RUNNING_STATUS || status === JOB_IN_PROGRESS) {
    return (
      <div>
        <Badge title={data.step} className="font-size-13 badge-soft-info" color="info" pill>
          <i className="fa fa-spinner fa-spin" />
          &nbsp;&nbsp;
          Running
        </Badge>
      </div>
    );
  }
  if (status === JOB_FAILED || status === JOB_STOPPED || status === JOB_INIT_FAILED) {
    return (
      <div>
        <Badge title={data.failureMessage} className="font-size-13 badge-soft-danger" color="danger" pill>
          {resp}
        </Badge>
      </div>
    );
  }
  if (status === JOB_IN_SYNC) {
    return (
      <div>
        <Badge className="font-size-13 badge-soft-success" color="success" pill>
          {resp}
        </Badge>
      </div>

    );
  }
  if (status === JOB_ONGOING) {
    return (
      <div>
        <Badge className="font-size-13 badge-soft-info" color="info" pill>
          <i className="fa fa-spinner fa-spin" />
          &nbsp;&nbsp;
          {resp}
        </Badge>
      </div>

    );
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
  return (
    <div>{resp}</div>
  );
}

export default StatusItemRenderer;
