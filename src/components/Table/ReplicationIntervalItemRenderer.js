import React from 'react';
import { getInterval } from '../../utils/AppUtils';

function ReplicationIntervalItemRenderer({ data, field }) {
  const resp = getInterval(data[field]);
  return (
    <>{resp}</>
  );
}

export default ReplicationIntervalItemRenderer;
