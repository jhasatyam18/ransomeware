import React, { useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Popover, PopoverBody } from 'reactstrap';
import { PLATFORM_TYPES } from '../../../constants/InputConstants';

function VMPlacementInfoItemRenderer(props) {
  const { data, drPlans, t } = props;
  const targetRef = useRef(null);
  // only id is added so that key is unique
  const key = `netowrk-placement-info-popover-key-${data.id}`;
  const { protectionPlan } = drPlans;
  const { recoverySite } = protectionPlan;
  const { platformType } = recoverySite.platformDetails;
  const { folderPath, availZone } = data;
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
  const label = (platformType === PLATFORM_TYPES.VMware) ? datacenterMoref : folderPath;
  if (!data) {
    return '-';
  }

  const renderVMwareDetails = () => (
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

  const renderAzureDetails = () => (
    <div key="nic">
      <div className="vmware_placement_info">
        <p className="vmware_placement_info_p">
          {' '}
          {t('title.resource.grp')}
        </p>
    &nbsp;
        <span>{folderPath}</span>
      </div>
      {availZone ? (
        <div className="vmware_placement_info">
          <p className="vmware_placement_info_p">
            {' '}
            {t('zone')}
          </p>
    &nbsp;
          <span>{availZone}</span>
        </div>
      ) : ''}
    </div>
  );
  const renderNetworkDetails = () => {
    if (platformType === PLATFORM_TYPES.VMware) {
      return renderVMwareDetails();
    }
    if (platformType === PLATFORM_TYPES.Azure) {
      return renderAzureDetails();
    }
  };

  const renderPopOver = () => (
    <Popover placement="bottom" isOpen={popoverOpen} target={targetRef}>
      <PopoverBody>
        {renderNetworkDetails()}
      </PopoverBody>
    </Popover>
  );
  return (
    <div>
      <a ref={targetRef} id={key} href="#" className="protectedvm-icon" onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)}>
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
export default connect(mapStateToProps)(withTranslation()(VMPlacementInfoItemRenderer));
