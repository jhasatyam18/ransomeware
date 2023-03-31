import React from 'react';
import 'boxicons';
import { dateDiffInMonthDayFromnNow, dateDiffInHrMinSecFromNow } from '../../../utils/AppUtils';

function DateItemRenderer({ data, field }) {
  const fieldsForTimeDiff = ['currenSnapshotTime', 'lastSyncTime'];
  const time = data[field] * 1000;
  const d = new Date(time);
  let resp = '';
  if (fieldsForTimeDiff.indexOf(field) !== -1) {
    const dayDiff = dateDiffInMonthDayFromnNow(d);
    const timeDiff = dateDiffInHrMinSecFromNow(d);
    resp = `${dayDiff}  ${timeDiff}`;
  } else {
    resp = `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`;
  }
  if (data[field] === 0) {
    resp = '-';
    return (
      <>
        <p>
          {resp}
        </p>

      </>
    );
  }
  return (
    <>
      <p style={{ textAlign: 'center' }}>
        {resp}
      </p>

    </>
  );
}

export default DateItemRenderer;
