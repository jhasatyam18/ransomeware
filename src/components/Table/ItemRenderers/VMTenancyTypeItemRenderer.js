import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Popover, PopoverBody } from 'reactstrap';
import { AWS_TARGET_HOST_TYPES, AWS_TENANCY_TYPES } from '../../../constants/InputConstants';

function VMTenancyTypeItemRenderer(props) {
  const { data } = props;
  const [popoverOpen, setPopoverOpen] = useState(false);
  let selector = '';
  if (data.id) {
    selector = `placement-${data.id}`;
  }
  const renderPopOver = () => (
    <Popover placement="bottom" isOpen={popoverOpen} target={selector} style={{ backgroundColor: 'black', width: '300px' }}>
      <PopoverBody>
        <>
          <section>
            {`Host Type  : ${data.hostType}`}
          </section>
          <section>
            {`Affinity   : ${data.affinity ? data.affinity : ''}`}
          </section>
          <section>
            {`${data.hostType === AWS_TARGET_HOST_TYPES.Host_ID ? 'Host ID' : 'Host Resource Group Arn :'}  : ${data.hostMoref}`}
          </section>
        </>
      </PopoverBody>
    </Popover>
  );

  if (data.tenancy === AWS_TENANCY_TYPES.Dedicated_Host) {
    return (
      <div>
        <a id={selector} href="#" className="protectedvm-icon" onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)}>
          {data.tenancy}
          {renderPopOver()}
        </a>
      </div>
    );
  }
  return (
    <>
      {data.tenancy}
    </>
  );
}

export default (withTranslation()(VMTenancyTypeItemRenderer));
