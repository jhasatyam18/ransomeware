import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Col, Popover, PopoverBody, Row } from 'reactstrap';

function VMNetworkInfoItemRenderer(props) {
  const { t, data } = props;
  const key = `netowrk-popover-key-${data.id}`;
  const [popoverOpen, setPopoverOpen] = useState(false);
  if (!data) {
    return '-';
  }
  const { networks } = data;

  const renderField = (field, obj, index) => {
    if (field && obj[field.field]) {
      return (
        <Row key={`${field.label}-${index}`}>
          <Col sm={6}>{t(field.label)}</Col>
          <Col sm={6}>{obj[field.field]}</Col>
        </Row>
      );
    }
    return null;
  };

  const renderNetworkDetails = () => {
    if (networks.length === 0) {
      return null;
    }
    return networks.map((n, index) => {
      const fields = [
        { label: 'public.ip.assigned', field: 'isPublicIP' },
        { label: 'public.ip.address', field: 'publicIP' },
        { label: 'private.ip.address', field: 'privateIP' },
        { label: 'subnet', field: 'Subnet' },
        { label: 'networkTier', field: 'networkTier' },
        { label: 'vmware.network', field: 'network' },
        { label: 'vmware.adapterType', field: 'adapterType' },
      ];
      return (
        <div key={`nic-${index + 1}`}>
          <div style={{ textDecoration: 'underline' }}>
            {`Nic-${index}`}
          </div>
          {
            fields.map((f) => renderField(f, n, index))
          }
        </div>
      );
    });
  };

  const renderPopOver = () => (
    <Popover placement="bottom" isOpen={popoverOpen} target={key} style={{ backgroundColor: 'black', width: '260px' }}>
      <PopoverBody>
        {renderNetworkDetails()}
      </PopoverBody>
    </Popover>
  );

  return (
    <div>
      <a id={key} href="#" className="icon_font" onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)}>
        {networks.length}
        {renderPopOver()}
      </a>
    </div>
  );
}

export default (withTranslation()(VMNetworkInfoItemRenderer));
