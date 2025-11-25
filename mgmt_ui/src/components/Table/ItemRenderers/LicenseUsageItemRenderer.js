import React from 'react';
import ProgressBar from '../../Common/ProgressBar';

export default function LicenseUsageItemRenderer({ field, data }) {
  if (!data) {
    return '-';
  }
  const used = data[field];
  let max = 0;
  if (field.indexOf('Recoveries') !== -1) {
    max = data.recoveryLimit;
    if (!data.allowRecovery) {
      return '-';
    }
  } else {
    if (!data.allowMigration) {
      return '-';
    }
    max = data.migrationLimit;
  }
  return (
    <div>
      <ProgressBar total={max} used={used} />
    </div>
  );
}
