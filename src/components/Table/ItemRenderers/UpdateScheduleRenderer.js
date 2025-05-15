import React from 'react';
import cronstrue from 'cronstrue';

function UpdateScheduleRenderer({ data }) {
  const { powerOnCronSchedule, powerOffCronSchedule } = data;
  const stripSeconds = (cron) => cron.split(' ').slice(1).join(' ');
  const getScheduleText = () => {
    const powerOnText = cronstrue.toString(stripSeconds(powerOnCronSchedule), {
      locale: 'en',
      use24HourTimeFormat: false,
      throwExceptionOnParseError: false,
    });
    const powerOffText = cronstrue.toString(stripSeconds(powerOffCronSchedule), {
      locale: 'en',
      use24HourTimeFormat: false,
      throwExceptionOnParseError: false,
    });
    return `Power on ${powerOnText} and power off ${powerOffText}`;
  };
  return (
    <div>
      {getScheduleText()}
    </div>
  );
}

export default UpdateScheduleRenderer;
