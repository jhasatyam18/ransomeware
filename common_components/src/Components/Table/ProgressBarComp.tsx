import React from 'react';

interface ProgressBarCompProps {
  total: number;
  used: number;
}

const ProgressBarComp: React.FC<ProgressBarCompProps> = ({ total, used }) => {
  if (!total || total === 0) {
    return <span>-</span>; // ✅ Return JSX instead of raw string
  }

  const available = total - used;
  let bg = '';

  if (available > used) {
    bg = 'bg-success';
  } else if (available > total / 3) {
    bg = 'bg-warning';
  } else {
    bg = 'bg-danger';
  }

  const percentage = (100 * used) / total;

  return (
    <div className="margin-top-5">
      <div className="progress position-relative align-items-center">
        <span>{`${used} / ${total}`}</span>
        <div
          className={`progress-bar ${bg}`}
          style={{ width: `${percentage}%`, height: '100%' }}
          title={`${used} / ${total}`}
        />
      </div>
    </div>
  );
};

export default ProgressBarComp;
