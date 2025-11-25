import React from 'react';
import cronstrue from 'cronstrue';
import { DAYS_CONSTANT, STATIC_KEYS } from '../../../constants/InputConstants';
import { formatTimeFromCron, toOrdinal } from '../../../utils/SystemUpdateScheduleUtils';

function UpdateScheduleRenderer({ data }) {
  const { powerOnCronSchedule, powerOffCronSchedule, cronType, occurrence } = data;
  const stripSeconds = (cron) => cron.split(' ').slice(1).join(' ');

  const getDayOfWeekFromCron = (cron) => {
    const parts = cron.trim().split(' ');
    const dayField = parts[parts.length - 1]; // e.g., "2"
    const index = parseInt(dayField, 10);
    if (Number.isNaN(index) || index < 0 || index > 6) return null;
    return DAYS_CONSTANT[index];
  };

  const formatManualText = () => {
    const day = getDayOfWeekFromCron(powerOnCronSchedule);
    const powerOnTime = formatTimeFromCron(powerOnCronSchedule);
    const powerOffText = cronstrue.toString(stripSeconds(powerOffCronSchedule), {
      locale: 'en',
      use24HourTimeFormat: false,
      throwExceptionOnParseError: false,
    });
    const dayText = `every ${toOrdinal(occurrence)} week on ${day}`;
    return `Power on ${dayText} At ${powerOnTime} and power off every ${toOrdinal(occurrence)} week ${powerOffText}`;
  };

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

  const shouldRenderManually = cronType === STATIC_KEYS.WEEK && occurrence > 1;
  return (
    <div>
      {shouldRenderManually ? formatManualText() : getScheduleText()}
    </div>
  );
}

export default UpdateScheduleRenderer;
