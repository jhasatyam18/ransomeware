import React from 'react';

const ProgressBar = (props) => {
  const { total, used } = props;
  const available = total - used;
  if (total === 0 || typeof total === 'undefined' || total === '') {
    return (
      '-'
    );
  }
  let bg = '';
  if (available > used) {
    bg = 'bg-success';
  } else if ((total / 3) < available) {
    bg = 'bg-warning';
  } else {
    bg = 'bg-danger';
  }
  const percentage = (100 * used) / total;
  return (
    <div className="margin-top-5">
      <div className="progress position-relative">
        <span>
          {`${used} / ${total}`}
        </span>
        <div
          className={`progress-bar ${bg}`}
          style={{ width: `${percentage}%` }}
          title={`${used} / ${total}`}
        />

      </div>
    </div>
  );
};

export default ProgressBar;
