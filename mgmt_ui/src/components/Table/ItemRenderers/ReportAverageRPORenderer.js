import React from 'react';
import { formatTime } from '../../../utils/AppUtils';

function ReportAverageRPORenderer({ data, field }) {
  if (!data[field]) return '-';
  const resp = formatTime(data[field]);
  return (
    <div>{resp}</div>
  );
}

export default ReportAverageRPORenderer;
