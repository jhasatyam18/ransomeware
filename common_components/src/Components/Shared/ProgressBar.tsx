import React, { useState } from 'react';
import { PARTIALLY_COMPLETED } from '../../Constants/statusConstant';
import { Popover, PopoverBody } from 'reactstrap';

interface Props {
    completed: number;
    staticBar?: boolean;
    text?: string;
    color?: string;
    data: any;
    size?: string;
}

export const ProgressBar: React.FC<Props> = (props: Props) => {
    const { completed, data, size, staticBar, text, color } = props;
    const [popoverOpen, setPopoverOpen] = useState(false);
    const key = `transferred-rate-popover-${completed}`;

    const renderPopOver = () => (
        <Popover placement="bottom" isOpen={popoverOpen} target={key} style={{ backgroundColor: 'black', width: '220px', borderRadius: '5px', textAlign: 'center' }}>
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
          { renderPopOver() }
        </>
    );
};
