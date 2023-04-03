import React from 'react';
import 'boxicons';

function DateItemRenderer({ data, field }) {
  const time = data[field] * 1000;
  const d = new Date(time);
  let resp = '';
  resp = `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`;
  if (data[field] === 0) {
    resp = '-';
    return (
      <>
        {resp}
      </>
    );
  }
  return (
    <>
      {resp}
    </>
  );
}

export default DateItemRenderer;
