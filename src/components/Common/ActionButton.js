import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const ActionButton = (props) => {
  const { label, onClick, isDisabled, icon, t, cssName } = props;
  let btnCss = 'btn btn-secondary btn-sm margin-right-2';
  if (cssName !== '' && typeof cssName !== 'undefined') {
    btnCss = cssName;
  }
  return (
    <button type="button" className={`${btnCss}`} onClick={onClick} disabled={isDisabled}>
      <FontAwesomeIcon size="sm" icon={icon} />
      &nbsp;&nbsp;
      {t(`${label}`)}
    </button>
  );
};
export default ActionButton;
