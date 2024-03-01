import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Col, Popover, PopoverBody, Row } from 'reactstrap';
import { PLATFORM_TYPES } from '../../../constants/InputConstants';

function VMNetworkInfoItemRenderer(props) {
  const { t, data, drPlans } = props;
  const { recoverySite } = drPlans.protectionPlan;
  const key = `netowrk-popover-key-${data.id}`;
  const [popoverOpen, setPopoverOpen] = useState(false);
  if (!data) {
    return '-';
  }

  const { networks } = data;

  const renderField = (field, obj, index) => {
    const object = obj;
    if (field && object[field.field]) {
      if (recoverySite.platformDetails.platformType === PLATFORM_TYPES.Azure && field.field === 'isPublicIP') {
        if (object[field.field] === true) {
          object[field.field] = 'Auto';
        } else if (object[field.field] === false) {
          object[field.field] = 'None';
        }
      }
      return (
        <Row key={`${field.label}-${index}`}>
          <Col sm={6}>{t(field.label)}</Col>
          <Col sm={6}>{object[field.field]}</Col>
        </Row>
      );
    }
    return null;
  };

  const platformSpecificDetails = () => {
    const fields = [];
    if (recoverySite.platformDetails.platformType === PLATFORM_TYPES.VMware) {
      const netowrk = { label: 'vmware.network', field: 'network' };
      const adapterType = { label: 'vmware.adapterType', field: 'adapterType' };
      fields.push(netowrk, adapterType);
    }
    if (recoverySite.platformDetails.platformType === PLATFORM_TYPES.AWS || recoverySite.platformDetails.platformType === PLATFORM_TYPES.GCP) {
      fields.push({ label: 'VPC', field: 'vpcId' });
    }
    return fields;
  };
  const renderNetworkDetails = () => {
    if (networks.length === 0) {
      return null;
    }
    return networks.map((n, index) => {
      let fields = [
        { label: 'public.ip.assigned', field: 'isPublicIP' },
        { label: 'public.ip.address', field: 'publicIP' },
        { label: 'private.ip.address', field: 'privateIP' },
        { label: 'subnet', field: 'Subnet' },
        { label: 'networkTier', field: 'networkTier' },
      ];

      const val = platformSpecificDetails(n);
      fields = [...fields, ...val];
      return (
        <div key={`nic-${index + 1}`}>
          <div className="vmnetwork_info">
            {`Nic-${index + 1}`}
          </div>
          {
            fields.map((f) => renderField(f, n, index))
          }
        </div>
      );
    });
  };

  const renderPopOver = () => (
    <Popover placement="bottom" isOpen={popoverOpen} target={key} style={{ backgroundColor: 'black', width: '300px' }}>
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

function mapStateToProps(state) {
  const { drPlans, user, dispatch } = state;
  return { drPlans, user, dispatch };
}
export default connect(mapStateToProps)(withTranslation()(VMNetworkInfoItemRenderer));
