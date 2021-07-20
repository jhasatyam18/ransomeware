import React from 'react';

function RecoveryTypeItemRenderer({ data, field }) {
  if (!data || !field || !data[field]) {
    return '';
  }
  const recoveryType = data[field];
  const resp = recoveryType.charAt(0).toUpperCase() + recoveryType.slice(1);
  return (
    <>{resp}</>
  );
}

export default RecoveryTypeItemRenderer;
