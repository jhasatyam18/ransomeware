import React, { useState } from 'react';
import { Popover, PopoverBody } from 'reactstrap';
import { formatTime } from '../../utils/AppUtils';
import DateItemRenderer from './DateItemRenderer';

function TimeDurationItemRenderer({ data }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { startTime, endTime } = data;
  if (startTime && endTime) {
    const key = `key-${startTime}${endTime}`;
    const sDate = new Date(startTime * 1000);
    const eDate = new Date(endTime * 1000);
    const duration = formatTime(Math.ceil(eDate - sDate) / 1000);
    return (
      <div>
        <button type="button" id={key} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)} className="btn noPadding">
          {duration}
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
