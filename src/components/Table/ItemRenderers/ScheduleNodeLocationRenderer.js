import React from 'react';

function ScheduleNodeLocationRenderer({ data }) {
  if (!data || !data.hostname) {
    return '-';
  }

  return (
    <div>
      {data.hostname}
    </div>
  );
}

export default ScheduleNodeLocationRenderer;
