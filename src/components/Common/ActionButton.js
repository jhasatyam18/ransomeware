import React from 'react';

const ActionButton = (props) => {
  const { label, onClick, isDisabled, icon, t } = props;
  return (
    <button type="button" className="btn btn-secondary btm-sm margin-right-2" onClick={onClick} disabled={isDisabled}>
      <i className={icon} />
      &nbsp;&nbsp;
      {t(`${label}`)}
    </button>
  );
};
export default ActionButton;
