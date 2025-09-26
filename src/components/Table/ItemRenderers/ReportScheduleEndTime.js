import React from 'react';
import DateItemRenderer from './DateItemRenderer';
import { JOB_COMPLETION_STATUS } from '../../../constants/AppStatus';

const ReportScheduleEndTime = (props) => {
  const { data, dispatch, user } = props;
  if (!data) {
    return <span>-</span>;
  }
  if (!data.updatedAt || !data.status) {
    return <span>-</span>;
  }
  const { status } = data;
  if (status !== JOB_COMPLETION_STATUS) {
    return <span>-</span>;
  }
  return <DateItemRenderer data={data} field="updatedAt" dispatch={dispatch} user={user} />;
};

export default ReportScheduleEndTime;
