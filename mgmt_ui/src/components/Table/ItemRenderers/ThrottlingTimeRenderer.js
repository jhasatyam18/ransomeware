import React from 'react';

export default function ThrottlingTimeRenderer({ data }) {
  const { startTime = '', endTime = '' } = data;
  if (startTime === '' || endTime === '') {
    return (
      '-'
    );
  }
  return (
    <div>
      {startTime}
      -
      {endTime}
    </div>
  );
}
