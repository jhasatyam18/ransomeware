import React, { useRef } from 'react';
import { withTranslation } from 'react-i18next';
import { Tooltip } from 'reactstrap';

function DMToolTip(props) {
  const localRef = useRef(null);
  const { tooltip, t } = props;
  const [tooltipOpen, toggleToolTip] = React.useState(false);
  const toggle = () => toggleToolTip(!tooltipOpen);
  return (
    <div className="info__container">
      <i className="fas fa-info-circle info__icon" ref={localRef} />
      <Tooltip placement="auto" isOpen={tooltipOpen} target={localRef} toggle={toggle} autohide={false} className="dmtooltip">
        {t(tooltip)}
      </Tooltip>
    </div>
  );
}

export default (withTranslation()(DMToolTip));
