import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Col, Popover, PopoverBody, Row } from 'reactstrap';
import { fetchNetworks } from '../../../store/actions/SiteActions';
import { getValue, isSamePlatformPlan } from '../../../utils/InputUtils';
import { PLATFORM_TYPES, STATIC_KEYS } from '../../../constants/InputConstants';

function VMNetworkInfoItemRenderer(props) {
  const { t, data, drPlans, user, dispatch } = props;
  const { recoverySite } = drPlans.protectionPlan;
  const key = `netowrk-popover-key-${data.id}`;
  const [popoverOpen, setPopoverOpen] = useState(false);
  if (!data) {
    return '-';
  }

  useEffect(() => {
    const { values } = user;
    const vpcOption = getValue(STATIC_KEYS.UI_VPC_TARGET, values) || [];
    let availZone = '';
    if (vpcOption.length === 0) {
      if (!isSamePlatformPlan(drPlans.protectionPlan)) {
        availZone = recoverySite.platformDetails.availZone;
      }
      dispatch(fetchNetworks(recoverySite.id, undefined, availZone));
    }
  }, []);
  const { networks } = data;

  const renderField = (field, obj, index) => {
    if (field && (obj[field.field] || field.fieldValue)) {
      return (
        <Row key={`${field.label}-${index}`}>
          <Col sm={5}>{t(field.label)}</Col>
          {field.fieldValue ? <Col sm={7}>{field.fieldValue}</Col> : <Col sm={7}>{obj[field.field]}</Col>}
        </Row>
      );
    }
    return null;
  };

  const platformSpecificDetails = (n) => {
    const fields = [];
    if (recoverySite.platformDetails.platformType === PLATFORM_TYPES.VMware) {
      const netowrk = { label: 'vmware.network', field: 'network' };
      const adapterType = { label: 'vmware.adapterType', field: 'adapterType' };
      fields.push(netowrk, adapterType);
    }
    if (recoverySite.platformDetails.platformType === PLATFORM_TYPES.AWS || recoverySite.platformDetails.platformType === PLATFORM_TYPES.GCP) {
      const { values } = user;
      const opts = getValue(STATIC_KEYS.UI_VPC_TARGET, values) || [];
      let vpcID = '';
      opts.map((op) => {
        if (op.id === n.vpcId) {
          vpcID = op.id;
        }
      });
      const vpc = { label: 'VPC', fieldValue: vpcID };
      fields.push(vpc);
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
