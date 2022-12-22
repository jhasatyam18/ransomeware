import React, { useState } from 'react';
import { Popover, PopoverBody } from 'reactstrap';
import { formatTime } from '../../../utils/AppUtils';
import DateItemRenderer from './DateItemRenderer';

function TimeDurationItemRenderer({ data }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { startTime, endTime, id } = data;
  if (endTime === 0) {
    return (<DateItemRenderer data={data} field="startTime" />);
  }
  if (startTime && endTime) {
    // id is added in the key because if the start time and end time is same then popover shows in different direction
    const key = `key-${id}${startTime}${endTime}`;
    const sDate = new Date(startTime * 1000);
    const eDate = new Date(endTime * 1000);
    const duration = formatTime(Math.ceil(eDate - sDate) / 1000);
    return (
      <div>
        <button type="button" id={key} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)} className="btn noPadding">
          { duration === '-' ? '0s' : duration }
        </button>
        <Popover placement="bottom" isOpen={popoverOpen} target={key} style={{ backgroundColor: 'black' }}>
          <PopoverBody>
            <table>
              <tbody>
                <tr>
                  <td>Start Time</td>
                  <td>
                    <DateItemRenderer data={data} field="startTime" />
                  </td>
                </tr>
                <tr>
                  <td>End Time</td>
                  <td>
                    <DateItemRenderer data={data} field="endTime" />
                  </td>
                </tr>
              </tbody>
            </table>
          </PopoverBody>
        </Popover>
      </div>
    );
  }
  return null;
}

export default TimeDurationItemRenderer;
