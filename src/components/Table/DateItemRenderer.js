import React from 'react';
import 'boxicons';

function DateItemRenderer({ data, field }) {
  if (data[field] === 0) {
    return null;
  }
  const time = data[field] * 1000;
  const d = new Date(time);
  const locale = `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`;
  return (
    <>{locale}</>
  );
}

export default DateItemRenderer;
