import React, { useState } from 'react';
import { Popover, PopoverBody } from 'reactstrap';
import { PARTIALLY_COMPLETED } from '../../../constants/AppStatus';

const DMProgressBar = (props) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { completed, data, size } = props;
  const key = `transferred-rate-popover-${data.id}-${completed}`;

  const renderPopOver = () => (
    <Popover placement="bottom" isOpen={popoverOpen} target={key} style={{ backgroundColor: 'black', width: '190px', borderRadius: '5px' }}>
      <PopoverBody>
        Transferred Data
        {' '}
        {completed}
        %
        (
        {size}
        )
      </PopoverBody>
    </Popover>
  );

  return (
    <>
      <div className="progress dm__progress__bar" id={key} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)}>
        <div
          className={data.status === PARTIALLY_COMPLETED ? 'progress-bar progress-bar-striped' : 'progress-bar progress-bar-striped progress-bar-animated'}
          role="progressbar"
          style={{ width: `${completed}%`, backgroundColor: `${data.status === PARTIALLY_COMPLETED ? '#51556a' : '#556ee6'}` }}
        >
          {completed}
          %
        </div>
      </div>
      {completed < 20 ? renderPopOver() : null}
    </>
  );
};

export default DMProgressBar;
