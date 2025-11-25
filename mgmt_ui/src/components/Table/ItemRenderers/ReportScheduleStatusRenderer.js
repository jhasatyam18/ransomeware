import React from 'react';
import StatusItemRenderer from './StatusItemRenderer';

const ReportScheduleStatusRenderer = ({ data }) => {
  if (!data) {
    return '-';
  }
  const status = data.disabled ? 'disabled' : 'enabled';
  return (
    <StatusItemRenderer data={{ ...data, status }} field="status" />
  );
};

export default ReportScheduleStatusRenderer;
