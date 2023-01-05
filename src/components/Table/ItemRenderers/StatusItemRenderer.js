import { withTranslation } from 'react-i18next';
import React, { useState } from 'react';
import SimpleBar from 'simplebar-react';
import { Badge, Popover, PopoverBody } from 'reactstrap';
import { NODE_STATUS_ONLINE, NODE_STATUS_OFFLINE, JOB_RECOVERED, JOB_COMPLETION_STATUS, JOB_RUNNING_STATUS, JOB_IN_PROGRESS, JOB_FAILED, JOB_INIT_FAILED, JOB_IN_SYNC, JOB_COMPLETED_WITH_ERRORS, JOB_ONGOING, JOB_STOPPED, JOB_INIT_SUCCESS, JOB_INIT_PROGRESS, JOB_SYNC_FAILED, JOB_INIT_SYNC_PROGRESS, JOB_RESYNC_FAILED, JOB_RESYNC_IN_PROGRESS, JOB_RESYNC_SUCCESS, JOB_SYNC_IN_PROGRESS, JOB_INIT_SYNC_FAILED, JOB_MIGRATED, MIGRATION_INIT_FAILED } from '../../../constants/AppStatus';
import 'boxicons';

function StatusItemRenderer({ data, field, t }) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const successStatus = [JOB_COMPLETION_STATUS, JOB_INIT_SUCCESS, NODE_STATUS_ONLINE, JOB_RESYNC_SUCCESS, JOB_IN_SYNC, JOB_RECOVERED, JOB_MIGRATED];
  const runningStatus = [JOB_RUNNING_STATUS, JOB_IN_PROGRESS];
  const errorStatus = [JOB_FAILED, JOB_STOPPED, JOB_INIT_FAILED, JOB_SYNC_FAILED, NODE_STATUS_OFFLINE, JOB_RESYNC_FAILED, JOB_INIT_SYNC_FAILED, MIGRATION_INIT_FAILED];
  const progressStatus = [JOB_ONGOING, JOB_INIT_PROGRESS, JOB_INIT_SYNC_PROGRESS, JOB_RESYNC_IN_PROGRESS, JOB_SYNC_IN_PROGRESS];

  if (!data) {
    return '-';
  }
  let status = data[field];
  if (!status) {
    return '-';
  }
  status = status.toLowerCase();
  let resp = status.charAt(0).toUpperCase() + status.slice(1);
  if (resp === 'Partialycompleted') {
    resp = 'Partially Completed';
  }

  const renderPopOver = (hoverInfo, key) => {
    const wid = hoverInfo.length <= 50 ? '300px' : '380px';
    return (
      <Popover placement="bottom" isOpen={popoverOpen} target={key} style={{ backgroundColor: 'black', width: wid, textAlign: hoverInfo.length <= 50 ? 'center' : 'left' }}>
        <PopoverBody>
          <SimpleBar style={{ maxHeight: '30vh' }}>
            {hoverInfo}
            {/* length
            {' '}
            {hoverInfo.length} */}
          </SimpleBar>
        </PopoverBody>
      </Popover>
    );
  };

  function statusRenderer({ name, title, icon }) {
    const { failureMessage, errorMessage } = data;
    const errMsg = (typeof failureMessage !== 'undefined' ? failureMessage : errorMessage);
    const msg = (typeof errMsg !== 'undefined' ? errMsg : '');
    const hoverInfo = title || msg;
    //  hoverInfo = hoverInfo.length > 50 ? hoverInfo.slice(0, 50) : hoverInfo;
    return (
      <div>
        <Badge id={`status-${field}-${data.name}-${data.id}`} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)} className={`font-size-13 badge-soft-${name}`} color={`${name}`} pill>
          {icon ? (
            <>
              <i className="fa fa-spinner fa-spin" />
            &nbsp;&nbsp;
            </>
          ) : null}
          {resp}
          {hoverInfo !== '' ? renderPopOver(hoverInfo, `status-${field}-${data.name}-${data.id}`) : null}
        </Badge>
      </div>
    );
  }
  if (successStatus.includes(status)) {
    return statusRenderer({ name: 'success' });
  }

  if (runningStatus.includes(status)) {
    resp = t('running');
    return statusRenderer({ name: 'info', title: data.step, icon: true });
  }

  if (errorStatus.includes(status)) {
    return statusRenderer({ name: 'danger' });
  }
  if (status === JOB_ONGOING) {
    return statusRenderer({ name: 'info' });
  }
  if (status === progressStatus.includes(status)) {
    return statusRenderer({ name: 'info', icon: true });
  }
  if (status === JOB_COMPLETED_WITH_ERRORS) {
    return (
      <div className="container" title={data.message}>
        <div className="row">
          <div className="col-2">
            <box-icon color="yellow" name="check" />
          </div>
          <div className="col-10">
            {resp}
          </div>
        </div>
      </div>
    );
  }
  if (data[field] === true) {
    resp = t('active');
    return statusRenderer({ name: 'info' });
  }

  return statusRenderer({ name: 'info' });
}

export default (withTranslation()(StatusItemRenderer));
