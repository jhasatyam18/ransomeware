import React from 'react';
import 'boxicons';

function DateItemRenderer({ data, field, noDate }) {
  const time = data[field] * 1000;
  const d = new Date(time);
  let resp = `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`;
  if (noDate) {
    resp = d.toLocaleTimeString();
  }
  if (data[field] === 0) {
    resp = '-';
    return (
      <>{resp}</>
    );
  }
  return (
    <>{resp}</>
  );
}

export default DateItemRenderer;
