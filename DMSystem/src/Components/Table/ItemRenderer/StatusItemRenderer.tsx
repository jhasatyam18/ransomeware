import { TFunction } from 'i18next';
import React, { useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Badge, Popover, PopoverBody } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { JOB_COMPLETION_STATUS, JOB_INACTIVE, JOB_IN_PROGRESS, JOB_RUNNING_STATUS, NODE_STATUS_OFFLINE, NODE_STATUS_ONLINE } from '../../../Constants/AppStatus';

interface StatusItemRendererProps extends WithTranslation {
    data: any;
    field: string;
    t: TFunction;
    noPopOver?: boolean;
    showDate?: boolean;
}

const StatusItemRenderer: React.FC<StatusItemRendererProps> = ({ data, field, t, noPopOver, showDate }) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const successStatus = [JOB_COMPLETION_STATUS, NODE_STATUS_ONLINE];
    const runningStatus = [JOB_RUNNING_STATUS, JOB_IN_PROGRESS];
    const errorStatus = [NODE_STATUS_OFFLINE, JOB_INACTIVE];

    if (!data) {
        return <React.Fragment>-</React.Fragment>;
    }

    let status = data[field];
    if (!status) {
        return <React.Fragment>-</React.Fragment>;
    }

    status = status.toLowerCase();
    let resp = status.charAt(0).toUpperCase() + status.slice(1);

    const renderPopOver = (hoverInfo: string, key: string) => {
        if (noPopOver || !hoverInfo) {
            return null;
        }
        return (
            <Popover
                placement="bottom"
                isOpen={popoverOpen}
                target={key}
                style={{
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    color: 'black',
                    border: 'none',
                    width: '280px',
                    textAlign: hoverInfo.length <= 50 ? 'center' : 'left',
                }}
            >
                <PopoverBody>
                    <SimpleBar style={{ maxHeight: '100px', minHeight: '30px', color: 'black' }}>{hoverInfo}</SimpleBar>
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
            <Badge id={`status-${field}-${data.name}-${data.id}`} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)} className={`pl-2 pr-2 pt-1 pb-1 fw-normal badge-soft-${colorinfo}`} color={`${colorinfo}`} pill>
                {icon ? (
                    <>
                        <i className="fa fa-spinner fa-spin" />
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
        resp = t('running');
        return statusRenderer({ name: 'info', icon: true });
    }

    if (errorStatus.includes(status)) {
        return statusRenderer({ name: 'danger' });
    }

    if (data[field] === true) {
        resp = t('active');
        return statusRenderer({ name: 'info' });
    }

    return statusRenderer({ name: 'info' });
};

export default withTranslation()(StatusItemRenderer);
