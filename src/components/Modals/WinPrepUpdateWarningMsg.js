import React from 'react';

const WinPrepUpdateWarningMsg = ({ options }) => {
  const { data } = options;
  return data.map((el) => <li style={{ fontSize: '12px' }}>{el}</li>);
};

export default WinPrepUpdateWarningMsg;
