import React, { useRef, useState } from 'react';
import { Popover, PopoverBody } from 'reactstrap';
import { PARTIALLY_COMPLETED } from '../../../constants/AppStatus';

const DMProgressBar = (props) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const targetRef = useRef(null);
  const { completed, data, size } = props;
  const key = `transferred-rate-popover-${data.id}`;

  const renderPopOver = () => (
    <Popover placement="bottom" isOpen={popoverOpen} target={targetRef} style={{ backgroundColor: 'black', width: '220px', borderRadius: '5px', textAlign: 'center' }}>
      <PopoverBody>
        Transferred Data
        {' '}
        {completed}
        %
        {typeof size !== 'undefined' && size ? ` (${size}) ` : ''}
      </PopoverBody>
    </Popover>
  );

  return (
    <>
      <div ref={targetRef} className="progress dm__progress__bar" id={key} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)}>
        <div
          className={data.status === PARTIALLY_COMPLETED ? 'progress-bar progress-bar-striped' : 'progress-bar progress-bar-striped progress-bar-animated'}
          role="progressbar"
          style={{ width: `${completed}%`, backgroundColor: `${data.status === PARTIALLY_COMPLETED ? '#51556a' : '#556ee6'}` }}
        >
          {completed}
          %
        </div>
      </div>
      { renderPopOver() }
    </>
  );
};

export default DMProgressBar;
