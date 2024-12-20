import React, { useRef, useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Tooltip } from 'reactstrap';

interface Props extends WithTranslation {
    tooltip: string;
}

function DMToolTip(props: Props) {
    const localRef = useRef<HTMLSpanElement>(null);
    const { tooltip, t } = props;
    const [tooltipOpen, setTooltipOpen] = useState(false);
    const toggle = () => setTooltipOpen(!tooltipOpen);

    return (
        <div className="info__container">
            <i className="fas fa-info-circle info__icon" ref={localRef}></i>
            <Tooltip placement="auto" isOpen={tooltipOpen} target={localRef} toggle={toggle} autohide={false} className="dmtooltip">
                {t(tooltip)}
            </Tooltip>
        </div>
    );
}

export default withTranslation()(DMToolTip);
