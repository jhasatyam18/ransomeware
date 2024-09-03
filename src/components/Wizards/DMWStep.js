import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const DMWStep = (props) => {
  const { isCompleted } = props;
  const { isActive, label } = props;
  const isActiveCss = (isActive ? 'step-active' : '');
  return (
    <div className={`row step-wizard ${isActiveCss}`}>
      <li className="waves-effect col-sm-2">
        {isCompleted ? <FontAwesomeIcon size="lg" icon={faCheck} className="text-success" /> : null}
      </li>
      <span className="col-sm-10 ">{label}</span>
    </div>
  );
};

export default DMWStep;
