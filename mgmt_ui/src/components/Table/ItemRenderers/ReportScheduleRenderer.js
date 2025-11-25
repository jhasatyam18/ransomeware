import React from 'react';
import cronstrue from 'cronstrue';

const ReportScheduleRenderer = ({ data }) => {
  if (!data) {
    return <span>-</span>;
  }
  const { cronString, reportsToRetain = 0 } = data;
  const [sec, min, hour, dayOfMonth, month, dayOfWeek] = cronString.split(' ');
  // Helper: treat "*" and "*/1" as equivalent
  const isEvery = (field) => field === '*' || field === '*/1';
  let readableCron;
  try {
    readableCron = cronstrue.toString(cronString, {
      locale: 'en',
      use24HourTimeFormat: false,
      throwExceptionOnParseError: true,
    });
    // Case 1: Daily at a specific time
    if (isEvery(dayOfMonth) && isEvery(month) && isEvery(dayOfWeek) && !hour.includes('*/') && hour !== '*' && (sec === '*' || sec === '0')) {
      readableCron = `${readableCron} daily`;
    }
    // Case 2: Hourly occurrence (every N hours)
    if (isEvery(dayOfMonth) && isEvery(month) && isEvery(dayOfWeek) && /every \d+ hours/i.test(readableCron) && (sec === '*' || sec === '0')) {
      if (min === '0') {
        // Remove "0 minutes past the hour, "
        readableCron = readableCron.replace(/0 minutes past the hour, /i, '');
      }
    }
  } catch (err) {
    return <span>-</span>;
  }
  return (
    <div>
      <div>
        {`Generate report ${readableCron}.`}
      </div>
      {reportsToRetain ? (
        <div>
          {`Maintain ${reportsToRetain} copies.`}
        </div>
      ) : null}
    </div>
  );
};

export default ReportScheduleRenderer;
