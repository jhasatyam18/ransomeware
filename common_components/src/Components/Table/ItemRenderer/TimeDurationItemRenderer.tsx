import React, { useState } from "react";
import { Popover, PopoverBody } from "reactstrap";
import { DateItemRenderer } from "./DateItemRenderer";
import { formatTime, getValue } from "../../../utils/AppUtils";
import { Theme, UserInterface } from "../../../interfaces/interfaces";
import { APPLICATION_THEME, THEME_CONSTANTS } from "../../../Constants/userConstants";

// Define the shape of `data` prop
interface TimeDurationData {
  id: number;
  startTime?: number;
  endTime?: number;
  [key: string]: any; // Allow additional fields
}

interface TimeDurationItemRendererProps {
  data: TimeDurationData;
  user:UserInterface
}

const TimeDurationItemRenderer: React.FC<TimeDurationItemRendererProps> = ({ data, user }) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { startTime, endTime, id } = data;
  const {values} = user;
  const theme = (getValue({key:APPLICATION_THEME, values}) as Theme)  || 'dark';
  if (endTime === 0) {
    return <DateItemRenderer data={data} field="startTime" />;
  }

  if (startTime && endTime) {
    const key = `key-${id}${startTime}${endTime}`;
    const sDate = new Date(startTime * 1000);
    const eDate = new Date(endTime * 1000);
    const duration = formatTime(Math.ceil((eDate.getTime() - sDate.getTime()) / 1000));
    const color = THEME_CONSTANTS.POPOVER?.[theme]?.color;
    const bgColor = THEME_CONSTANTS.POPOVER?.[theme]?.bgColor;
    return (
      <div>
        <button
          type="button"
          id={key}
          onMouseEnter={() => setPopoverOpen(true)}
          onMouseLeave={() => setPopoverOpen(false)}
          className="btn noPadding"
          style={{ fontSize: "13px" }}
        >
          {duration === "-" ? "0s" : duration}
        </button>
        <Popover placement="bottom" isOpen={popoverOpen} target={key} style={{ backgroundColor: bgColor }}>
          <PopoverBody style={{ fontSize: "11px", color:color}}>
            <p>Start Time : <DateItemRenderer data={data} field="startTime" /></p>
            <p>End Time : <DateItemRenderer data={data} field="endTime" /></p>
          </PopoverBody>
        </Popover>
      </div>
    );
  }

  return null;
};

export default TimeDurationItemRenderer;
