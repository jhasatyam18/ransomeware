import { faLaptop, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Popover, PopoverBody } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { convertMinutesToDaysHourFormat } from '../../../utils/AppUtils';

function PlaybookConfigureRenderer({ data, t }) {
  const { protectedEntitiesCount, protectionPlansCount, planConfigurations } = data;
  const [pplan, setPplanOpen] = useState(false);
  const [vm, setVmOpen] = useState(false);
  const [rpoOpen, setRpoOpen] = useState(false);
  const { rpo } = planConfigurations[0];
  const formatedRPO = convertMinutesToDaysHourFormat(rpo);
  const renderPopOver = (hoverInfo, key, open) => (
    <Popover placement="bottom" isOpen={open} target={key} style={{ backgroundColor: '#fff', borderRadius: '8px', color: 'black', border: 'none', width: '120px', textAlign: 'center' }}>
      <PopoverBody>
        <SimpleBar style={{ height: '20px', color: 'black' }}>
          {hoverInfo}
        </SimpleBar>
      </PopoverBody>
    </Popover>
  );
  return (
    <div className="playbook_configure_div">
      <div>
        <FontAwesomeIcon size="sm" icon={faLayerGroup} title={t('protection.plan')} />
        <span className="padding-left-3" id={`playbook-ppln-configuration-${data.id}`} onMouseEnter={() => setPplanOpen(true)} onMouseLeave={() => setPplanOpen(false)}>{protectionPlansCount}</span>
        {renderPopOver(t('protection.plan'), `playbook-ppln-configuration-${data.id}`, pplan)}
      </div>
      <div>
        <FontAwesomeIcon size="sm" icon={faLaptop} title={t('virtual.machine')} />
        <span className="padding-left-3" id={`playbook-vm-configuration-${data.id}`} onMouseEnter={() => setVmOpen(true)} onMouseLeave={() => setVmOpen(false)}>{protectedEntitiesCount}</span>
        {renderPopOver(t('virtual.machine'), `playbook-vm-configuration-${data.id}`, vm)}
      </div>
      <div className="w-50">
        <span id={`playbook-rpo-configuration-${data.id}`} onMouseEnter={() => setRpoOpen(true)} onMouseLeave={() => setRpoOpen(false)}>
          {`${formatedRPO}`}
        </span>
        {renderPopOver(t('rpo'), `playbook-rpo-configuration-${data.id}`, rpoOpen)}
      </div>
    </div>
  );
}

export default (withTranslation()(PlaybookConfigureRenderer));
