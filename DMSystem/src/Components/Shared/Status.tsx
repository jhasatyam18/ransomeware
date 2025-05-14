import React, { useRef, useState } from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';
import { Badge, Popover, PopoverBody } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { JOB_COMPLETION_STATUS, PARTIALLY_COMPLETED } from '../../Constants/statusConstant';

type StatusProps = {
    name: string;
    icon?: boolean;
};

interface Props extends WithTranslation {
    data: {
        failureMessage: string;
        errorMessage: string;
        status: string;
        name: string;
        id: string;
        message: string;
        lastRunTime: number;
        [key: string]: number | string | undefined | boolean;
    };
    field: string;
    noPopOver: any;
    showDate: any;
    t: any;
}

const StatusItemRenderer: React.FC<Props> = ({ data, field, t, noPopOver, showDate }: Props) => {
    const [popoverOpen, setPopoverOpen] = useState(false);
    const targetRef = useRef(null);
    const successStatus = [JOB_COMPLETION_STATUS];

    if (!data) {
        return <span>-</span>;
    }

    let status = data[field] || '';
    if (!status) {
        return <span>-</span>;
    }

    let resp = '';
    if (typeof status === 'string') {
        status = status.toLowerCase();

        resp = status.charAt(0).toUpperCase() + status.slice(1);
    }

    const renderPopOver = (hoverInfo: string) => {
        if (noPopOver || !hoverInfo) {
            return null;
        }
        return (
            <Popover
                placement="bottom"
                isOpen={popoverOpen}
                target={targetRef}
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

    function statusRenderer({ name, icon }: StatusProps) {
        const { failureMessage, errorMessage } = data;
        const errMsg = typeof failureMessage !== 'undefined' ? failureMessage : errorMessage;
        const msg = typeof errMsg !== 'undefined' ? errMsg : '';
        const hoverInfo = msg;
        let colorinfo = name;
        // if status is equal partially completed then mark syncstatus as warning status
        if (field === 'syncStatus' && data.status === PARTIALLY_COMPLETED) {
            colorinfo = 'warning';
        }
        return (
            <Badge innerRef={targetRef} id={`status-${field}-${data.name}-${data.id}`} onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)} className={`font-size-13 badge-soft-${colorinfo}`} color={`${colorinfo}`} pill>
                {icon ? (
                    <>
                        <i className="fa fa-spinner fa-spin" />
                        &nbsp;&nbsp;
                    </>
                ) : null}
                {resp}
                {hoverInfo !== '' ? renderPopOver(hoverInfo) : null}
                {showDate === 'true' ? <span className="font-size-11 padding-left-10">{new Date(data.lastRunTime * 1000).toLocaleString()}</span> : null}
            </Badge>
        );
    }

    if (successStatus.includes(`${status}`)) {
        return statusRenderer({ name: 'success' });
    }

    if (data[field] === true) {
        resp = t('active');
        return statusRenderer({ name: 'info' });
    }

    return statusRenderer({ name: 'info' });
};

export default withTranslation()(StatusItemRenderer);
