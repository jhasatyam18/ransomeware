import { TFunction } from 'i18next';
import React, { useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Badge, Popover, PopoverBody } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { FULL_RECOVERY_FAILED, INIT_SUCCESS, JOB_COMPLETION_STATUS, JOB_INACTIVE, JOB_IN_PROGRESS, JOB_IN_SYNC, JOB_RUNNING_STATUS, MIGRATION_FAILED, NODE_STATUS_OFFLINE, NODE_STATUS_ONLINE, PARTIALLY_RUNNING, TEST_RECOVERY_FAILED } from '../../../Constants/AppStatus';
import { AUTO_MIGRATION_FAILED, JOB_COMPLETED_WITH_ERRORS, JOB_EXCEEDED_INTERVAL, JOB_FAILED, JOB_INIT_FAILED, JOB_INIT_PROGRESS, JOB_INIT_SYNC_FAILED, JOB_INIT_SYNC_PROGRESS, JOB_MIGRATED, JOB_QUEUED, JOB_RECOVERED, JOB_RESYNC_FAILED, JOB_RESYNC_IN_PROGRESS, JOB_RESYNC_SUCCESS, JOB_SYNC_FAILED, JOB_SYNC_IN_PROGRESS, MIGRATION_INIT_FAILED, PARTIALLY_COMPLETED, PENDING_STATUS, VALIDATING } from '../../../Constants/statusConstant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faS, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { APPLICATION_THEME, THEME_CONSTANTS } from '../../../Constants/userConstants';
import { getValue } from '../../../utils/AppUtils';
import { Theme, UserInterface } from '../../../interfaces/interfaces';

interface StatusItemRendererProps extends WithTranslation {
    data: any;
    field: string;
    t: TFunction;
    noPopOver?: boolean;
    showDate?: boolean;
    user:UserInterface
}

const StatusItemRenderer: React.FC<StatusItemRendererProps> = ({ data, field, t, noPopOver, showDate, user }) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const successStatus = [JOB_COMPLETION_STATUS, NODE_STATUS_ONLINE, 'yes', 'meets', JOB_IN_SYNC,INIT_SUCCESS, JOB_RECOVERED, JOB_MIGRATED, JOB_RESYNC_SUCCESS];
    const runningStatus = [JOB_RUNNING_STATUS, JOB_IN_PROGRESS, VALIDATING];
    const errorStatus = [NODE_STATUS_OFFLINE, JOB_INACTIVE, 'error', 'no', 'major', 'stopped', 'not meet', 'critical',JOB_FAILED, JOB_INIT_FAILED, JOB_SYNC_FAILED, JOB_RESYNC_FAILED, JOB_INIT_SYNC_FAILED, MIGRATION_INIT_FAILED, AUTO_MIGRATION_FAILED, TEST_RECOVERY_FAILED, FULL_RECOVERY_FAILED, MIGRATION_FAILED];
    const warning = ['warning', 'not tested', PARTIALLY_COMPLETED, JOB_EXCEEDED_INTERVAL, JOB_QUEUED, PENDING_STATUS, JOB_SYNC_IN_PROGRESS, PARTIALLY_RUNNING];
    const progressStatus = [JOB_INIT_PROGRESS, JOB_INIT_SYNC_PROGRESS, JOB_RESYNC_IN_PROGRESS];
    const {values} = user;
    const theme = (getValue({key:APPLICATION_THEME, values}) as Theme)  || 'dark';
    if (!data) {
        return <React.Fragment>-</React.Fragment>;
    }

    let status = data[field];
    if (typeof status === 'undefined' || status === null || status === '' || status === 0) {
        return <React.Fragment>-</React.Fragment>;
    }
    if (typeof status === 'boolean') {
        status = status ? 'yes' : 'no';
    }
    status = status.toLowerCase();
    let resp = status.charAt(0).toUpperCase() + status.slice(1);

    const renderPopOver = (hoverInfo: string, key: string) => {
        const color = THEME_CONSTANTS.POPOVER?.[theme]?.color;
        const bgColor = THEME_CONSTANTS.POPOVER?.[theme]?.bgColor;
        if (noPopOver || !hoverInfo) {
            return null;
        }
        return (
            <Popover
                placement="bottom"
                isOpen={popoverOpen}
                target={key}
                style={{
                    backgroundColor: bgColor,
                    borderRadius: '8px',
                    border: 'none',
                    width: '280px',
                    textAlign: hoverInfo.length <= 50 ? 'center' : 'left',
                }}
            >
                <PopoverBody>
                    <SimpleBar style={{ maxHeight: '100px', minHeight: '30px', color: color}}>{hoverInfo}</SimpleBar>
                </PopoverBody>
            </Popover>
        );
    };

    const statusRenderer = ({ name, icon }: { name: string; icon?: boolean }) => {
        const { failureMessage, errorMessage } = data;
        const errMsg = typeof failureMessage !== 'undefined' ? failureMessage : errorMessage;
        const msg = typeof errMsg !== 'undefined' ? errMsg : '';
        const hoverInfo = msg;
        let colorinfo = name;
        return (
            <Badge id={`status-${field}-${data.name}-${data.id}`} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)} className={`pl-2 pr-2 pt-1 pb-1 dashboard_rec_heading_size fw-normal badge-soft-${colorinfo}`} color={`${colorinfo}`} pill>
                {icon ? (
                    <>
                        <FontAwesomeIcon className='fa-spin' size="lg" icon={faSpinner} />
                        &nbsp;&nbsp;
                    </>
                ) : null}
                {t(resp)}
                {hoverInfo !== '' ? renderPopOver(hoverInfo, `status-${field}-${data.name}-${data.id}`) : null}
                {showDate ? <span className="font-size-11 padding-left-10">{new Date(data.lastRunTime * 1000).toLocaleString()}</span> : null}
            </Badge>
        );
    };

    if (successStatus.includes(status)) {
        return statusRenderer({ name: 'success' });
    }

    if (runningStatus.includes(status)) {
        resp = t('Running');
        return statusRenderer({ name: 'info', icon: true });
    }

    if (errorStatus.includes(status)) {
        return statusRenderer({ name: 'danger' });
    }
    if (progressStatus.includes(status)) {
        return statusRenderer({ name: 'info' });
    }
    if (status === JOB_COMPLETED_WITH_ERRORS) {
        return (
          <div className="container" title={data.message}>
            <div className="row">
              <div className="col-2">
                <FontAwesomeIcon size="xs" icon={faCheck} className="padding-4" />
              </div>
              <div className="col-10">
                {resp}
              </div>
            </div>
          </div>
        );
      }
    if (warning.includes(status)) {
        return statusRenderer({ name: 'warning' });
    }

    if (data[field] === true) {
        resp = t('active');
        return statusRenderer({ name: 'info' });
    }

    return statusRenderer({ name: 'success' });
};

export default withTranslation()(StatusItemRenderer);
