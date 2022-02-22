import React from 'react';

const DMProgressBar = (props) => {
  const { completed } = props;
  return (
    <div className="progress dm__progress__bar">
      <div
        className="progress-bar progress-bar-striped progress-bar-animated"
        role="progressbar"
        style={{ width: `${completed}%` }}
      >
        {completed}
        %
      </div>
    </div>
  );
};

export default DMProgressBar;
