import { faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Popover, PopoverBody } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { REPLSTATUS_BREACHED, REPLSTATUS_MEETS } from '../../../constants/AppStatus';

const VmRpoStatusItemRenderer = ({ data, t }) => {
  const { rpoStatus } = data;
  const [popoverOpen, setPopoverOpen] = useState(false);
  const renderPopOver = () => (
    <Popover placement="bottom" isOpen={popoverOpen} target={`status-${rpoStatus}-${data.name}-${data.id}`} style={{ backgroundColor: 'black', color: 'black', border: 'none', width: rpoStatus.length > 5 ? '200px' : '100px', textAlign: 'center' }}>
      <PopoverBody style={{ color: 'white' }}>
        <SimpleBar style={{ color: 'white' }}>
          <span>{`RPO ${t(rpoStatus)}`}</span>
        </SimpleBar>
      </PopoverBody>
    </Popover>
  );
  if (rpoStatus === REPLSTATUS_MEETS) {
    return (
      <>
        <FontAwesomeIcon id={`status-${rpoStatus}-${data.name}-${data.id}`} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)} className="text-success mt-1 ms-1" icon={faCheckCircle} />
        {renderPopOver()}
      </>
    );
  }
  if (rpoStatus === REPLSTATUS_BREACHED) {
    return (

      <>
        <FontAwesomeIcon id={`status-${rpoStatus}-${data.name}-${data.id}`} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)} icon={faExclamationTriangle} className="text-warning mt-1 ms-1" />
        {renderPopOver()}
      </>
    );
  }
};

export default withTranslation()(VmRpoStatusItemRenderer);
