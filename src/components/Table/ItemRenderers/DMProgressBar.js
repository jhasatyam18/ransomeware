import React, { useState } from 'react';
import { Popover, PopoverBody } from 'reactstrap';

const DMProgressBar = (props) => {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { completed, id } = props;
  const key = `transferred-rate-popover-${id}-${completed}`;

  const renderPopOver = () => (
    <Popover placement="bottom" isOpen={popoverOpen} target={key} style={{ backgroundColor: 'black', width: '165px', borderRadius: '5px' }}>
      <PopoverBody>
        Transeferred Data -
        {' '}
        {completed}
        {' '}
        %
      </PopoverBody>
    </Popover>
  );

  return (
    <>
      <div className="progress dm__progress__bar" id={key} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)}>
        <div
          className="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar"
          style={{ width: `${completed}%` }}
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
