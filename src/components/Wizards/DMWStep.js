import React from 'react';

const DMWStep = (props) => {
  const { isCompleted } = props;
  const { isActive, label } = props;
  const isActiveCss = (isActive ? 'step-active' : '');
  return (
    <div className={`row step-wizard ${isActiveCss}`}>
      <li className="waves-effect col-sm-2">
        {isCompleted ? <box-icon name="check-double" color="green" style={{ width: 20 }} /> : null}
      </li>
      <span className="col-sm-10 ">{label}</span>
    </div>
  );
};

export default DMWStep;
