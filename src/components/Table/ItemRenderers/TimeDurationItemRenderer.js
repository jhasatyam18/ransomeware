import React, { useState, useEffect } from 'react';
import { Popover, PopoverBody } from 'reactstrap';
import { formatTime } from '../../../utils/AppUtils';
import DateItemRenderer from './DateItemRenderer';

function TimeDurationItemRenderer({ data, field }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [renderPopOver, setRenderPopOver] = useState(false);
  const [key, setKey] = useState('');
  const [duration, setDuration] = useState('');
  const { startTime, endTime, id } = data;

  useEffect(() => {
    if (field === 'startTime') {
      if (startTime && endTime) {
        const sDate = new Date(startTime * 1000);
        const eDate = new Date(endTime * 1000);
        const d = formatTime(Math.ceil(eDate - sDate) / 1000);
        setRenderPopOver(true);
        setKey(`key-${id}${startTime}${endTime}`);
        setDuration(d);
      }
    } else {
      setKey(`key-${field}-${data[field]}`);
      const d = DateItemRenderer({ data, field, noDate: true });
      setDuration(d);
    }
  }, []);

  function renderPopOverItem() {
    return (
      <>
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
      </>
    );
  }

  if (endTime === 0) {
    return (<DateItemRenderer data={data} field="startTime" />);
  }

  if (duration) {
    return (
      <div>
        <button type="button" id={key} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)} className="btn noPadding">
          { duration === '-' ? '0s' : duration }
        </button>
        {renderPopOver ? renderPopOverItem() : null}
      </div>
    );
  }
  return null;
}

export default TimeDurationItemRenderer;
