import React, { useRef, useState } from 'react';
import { Badge, Popover, PopoverBody } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import SimpleBar from 'simplebar-react';
import { MIGRATION_INIT_FAILED, AUTO_MIGRATION_FAILED, CHECKPOINT_STATUS_AVAILABLE, CHECKPOINT_STATUS_DELETED_FROM_INFRA, MIGRATION_FAILED, FULL_RECOVERY_FAILED, TEST_RECOVERY_FAILED } from '../../../constants/AppStatus';

function RecoveryStatusItemRenderer(props) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const targetRef = useRef(null);
  const { t, data, field } = props;
  const failedStatus = [MIGRATION_INIT_FAILED, AUTO_MIGRATION_FAILED, TEST_RECOVERY_FAILED, FULL_RECOVERY_FAILED, MIGRATION_FAILED];
  if (!data) {
    return '-';
  }

  if (field) {
    if (data[field] === CHECKPOINT_STATUS_AVAILABLE) {
      return (
        <div>
          <Badge className="font-size-13 badge-soft-success" pill>
            {data[field]}
          </Badge>
        </div>
      );
    } if (data[field] === CHECKPOINT_STATUS_DELETED_FROM_INFRA) {
      return (
        <div>
          <Badge className="font-size-13 badge-soft-danger" pill>
            {data[field]}
          </Badge>
        </div>
      );
    }
  }

  const renderPopOver = (hoverInfo) => {
    const { noPopOver } = props;
    if (noPopOver) {
      return null;
    }
    return (
      <Popover placement="bottom" isOpen={popoverOpen} target={targetRef} style={{ backgroundColor: 'black', borderRadius: '6px', color: 'black', border: 'none', width: '250px', textAlign: hoverInfo.length <= 50 ? 'center' : 'left' }}>
        <PopoverBody>
          <SimpleBar style={{ maxHeight: '100px', minHeight: '20px', color: 'white' }}>
            { `Recovered : ${hoverInfo}`}
          </SimpleBar>
        </PopoverBody>
      </Popover>
    );
  };

  if (data.isRemovedFromPlan === true) {
    const msg = t('vm.remove.description');
    return (
      <div>
        <Badge title={msg} className="font-size-13 badge-soft-info" color="info" pill>
          {t('removing')}
        </Badge>
      </div>
    );
  }
  function renderDeleted() {
    if (data.isDeleted === true) {
      return (
        <Badge className="font-size-13 badge-soft-danger mb-2 me-2" color="danger" pill>
          Deleted From Source
        </Badge>
      );
    }
    return null;
  }

  function renderStatus() {
    if (typeof data.recoveryStatus === 'undefined') {
      return null;
    }
    const { failureMessage, errorMessage } = data;
    const errMsg = (typeof failureMessage !== 'undefined' ? failureMessage : errorMessage);
    const msg = (typeof errMsg !== 'undefined' ? errMsg : '');
    let hoverInfo = msg;
    if (data.recoveryPointTime) {
      const { recoveryPointTime } = data;
      const time = recoveryPointTime * 1000;
      const d = new Date(time);
      hoverInfo = `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`;
    }
    const { id } = data;
    const color = (failedStatus.includes(data.recoveryStatus) ? 'danger' : 'success');
    return (
      <>
        <Badge className={`font-size-13 badge-soft-${color}`} id={`status-${id}`} pill onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)}>
          {data.recoveryStatus}
        </Badge>
        {hoverInfo !== '' ? renderPopOver(hoverInfo) : null}
      </>
    );
  }

  return (
    <>
      { renderDeleted() }
      { renderStatus() }
    </>
  );
}

export default (withTranslation()(RecoveryStatusItemRenderer));
