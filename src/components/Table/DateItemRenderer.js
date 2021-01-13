import React from 'react';
import 'boxicons';

function DateItemRenderer({ data, field }) {
  if (data[field] === 0) {
    const resp = '-';
    return (
      <>{resp}</>
    );
  }
  const time = data[field] * 1000;
  const d = new Date(time);
  const resp = `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`;
  return (
    <>{resp}</>
  );
}

export default DateItemRenderer;
