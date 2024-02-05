import React from 'react';
import 'boxicons';
import { JOB_COMPLETION_STATUS } from '../../../constants/AppStatus';

function DateItemRenderer({ data, field }) {
  const fieldArray = ['currentSnapshotTime', 'lastSyncTime'];
  const time = data[field] * 1000;
  const d = new Date(time);
  let resp = '';
  resp = `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`;

  if (fieldArray.includes(field)) {
    if (data.status !== JOB_COMPLETION_STATUS) {
      resp = '-';
    }
  }

  if (data[field] === 0) {
    resp = '-';
    return (
      <>
        {resp}
      </>
    );
  }

  return (
    <>
      {resp}
    </>
  );
}

export default DateItemRenderer;
