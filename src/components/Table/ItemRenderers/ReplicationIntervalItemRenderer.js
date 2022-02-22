import React from 'react';
import { convertMinutesToDaysHourFormat } from '../../../utils/AppUtils';

function ReplicationIntervalItemRenderer({ data, field }) {
  const resp = convertMinutesToDaysHourFormat(data[field]);
  return (
    <div>
      {resp}
    </div>
  );
}

export default ReplicationIntervalItemRenderer;
