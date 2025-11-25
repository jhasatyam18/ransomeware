import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef, useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Tooltip } from 'reactstrap';

interface Props extends WithTranslation {
    tooltip: string;
}

function DMToolTip(props: Props) {
    const localRef = useRef<HTMLDivElement>(null);
    const { tooltip, t } = props;
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggle = () => setTooltipOpen(!tooltipOpen);

    return (
        <div className="info__container">
            <span ref={localRef}><FontAwesomeIcon size="lg" icon={faCircleInfo} /></span>
            <Tooltip placement="auto" isOpen={tooltipOpen} target={localRef} toggle={toggle} autohide={false} className="dmtooltip">
                {t(tooltip)}
            </Tooltip>
        </div>
    );
}

export default withTranslation()(DMToolTip);
