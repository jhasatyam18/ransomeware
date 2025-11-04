import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const ActionButton = (props) => {
  const { label, onClick, isDisabled, icon, t, cssName, id } = props;
  let btnCss = 'btn btn-secondary btn-sm margin-right-2';
  const labelID = label.replaceAll(' ', '');
  if (cssName !== '' && typeof cssName !== 'undefined') {
    btnCss = cssName;
  }
  return (
    <button type="button" className={`${btnCss}`} onClick={onClick} disabled={isDisabled} id={id || `actionButton-${labelID}`}>
      {icon ? <FontAwesomeIcon size="sm" icon={icon} /> : null}
      &nbsp;&nbsp;
      {t(`${label}`)}
    </button>
  );
};
export default ActionButton;
