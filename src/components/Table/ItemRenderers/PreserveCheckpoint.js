import { faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { Popover, PopoverBody } from 'reactstrap';
import SimpleBar from 'simplebar-react';

function PreserveCheckpoint({ data, field }) {
  if (!data) {
    return null;
  }
  const preserved = data[field];
  const [popoverOpen, setPopoverOpen] = useState(false);
  const targetRef = useRef(null);
  const hoverInfo = data.preserveDescription || '';

  const renderPopOver = (info) => (
    <Popover placement="bottom" isOpen={popoverOpen} target={targetRef} style={{ backgroundColor: 'black', borderRadius: '5px', color: 'white', border: 'none', width: '280px', textAlign: info.length <= 50 ? 'center' : 'left' }}>
      <PopoverBody>
        <SimpleBar style={{ maxHeight: '100px', minHeight: '30px', color: 'white' }}>
          {info}
        </SimpleBar>
      </PopoverBody>
    </Popover>
  );

  return (
    <>
      <span id={`recovery-checkpoint-preserve-${data.id}`} key={`recovery-checkpoint-preserve-${data.id}`} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)} className={`mr-2 padding-left-10  ${preserved ? 'text-success' : 'text-secondary'}`}>
        <FontAwesomeIcon size="lg" icon={faCircleCheck} />
        {hoverInfo !== '' ? renderPopOver(hoverInfo) : null}
      </span>

    </>
  );
}
export default PreserveCheckpoint;
