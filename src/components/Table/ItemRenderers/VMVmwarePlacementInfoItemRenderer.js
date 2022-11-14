import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Popover, PopoverBody } from 'reactstrap';
import { PLATFORM_TYPES } from '../../../constants/InputConstants';

function VMVmwarePlacementInfoItemRenderer(props) {
  const { data, drPlans, t } = props;
  const key = `netowrk-popover-key-${data.id - drPlans.size}`;
  const { protectionPlan } = drPlans;
  const { recoverySite } = protectionPlan;
  const { instanceType } = data;
  let { hostMoref, datacenterMoref, datastoreMoref } = data;
  if (typeof hostMoref !== 'undefined') {
    hostMoref = hostMoref.split(':') || '';
    const [i] = hostMoref;
    hostMoref = i;
  }
  if (typeof datacenterMoref !== 'undefined') {
    datacenterMoref = datacenterMoref.split(':') || '';
    const [i] = datacenterMoref;
    datacenterMoref = i;
  }
  if (typeof datastoreMoref !== 'undefined') {
    datastoreMoref = datastoreMoref.split(':') || '';
    const [i] = datastoreMoref;
    datastoreMoref = i;
  }
  const [popoverOpen, setPopoverOpen] = useState(false);
  const label = (recoverySite.platformDetails.platformType === PLATFORM_TYPES.VMware) ? datacenterMoref : instanceType;
  if (!data) {
    return '-';
  }
  const renderNetworkDetails = () => (
    <div key="nic">
      <div className="vmware_placement_info">
        <p className="vmware_placement_info_p">
          {' '}
          {t('title.hostname')}
        </p>
        &nbsp;
        <span>{hostMoref}</span>
      </div>
      <div className="vmware_placement_info">
        <p className="vmware_placement_info_p">
          {' '}
          {t('title.Datastore')}
        </p>
        &nbsp;
        <span>{datastoreMoref}</span>
      </div>
    </div>
  );

  const renderPopOver = () => (
    <Popover placement="bottom" isOpen={popoverOpen} target={key} style={{ backgroundColor: 'black', width: '250px' }}>
      <PopoverBody>
        {renderNetworkDetails()}
      </PopoverBody>
    </Popover>
  );
  return (
    <div>
      <a id={key} href="#" className="protectedvm-icon" onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)}>
        {label}
        {renderPopOver()}
      </a>
    </div>
  );
}
function mapStateToProps(state) {
  const { drPlans } = state;
  return { drPlans };
}
export default connect(mapStateToProps)(withTranslation()(VMVmwarePlacementInfoItemRenderer));
