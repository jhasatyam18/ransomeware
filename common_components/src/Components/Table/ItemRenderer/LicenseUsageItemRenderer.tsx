import React from 'react';
import ProgressBarComp from '../ProgressBarComp';

export interface LicenseData {
  ID: number;
  licenseType: string;
  platform: string;
  createTime: number;
  expiredTime: number;
  isExpired: boolean;
  isActive: boolean;
  allowRecovery: boolean;
  allowMigration: boolean;
  recoveryLimit: string;
  migrationLimit: string;
  completedRecoveries: string;
  completedMigrations: string;
}
interface LicenseUsageItemRendererProps {
  field: string;
  data: LicenseData;
}

function LicenseUsageItemRenderer({ data, field }: LicenseUsageItemRendererProps) {
  if (!data) {
    return <span>-</span>;
  }
  const used = Number(data[field as keyof LicenseData]); // cast string/number safely
  let max = 0;
  if (field.toLowerCase().includes('recoveries')) {
    max = Number(data.recoveryLimit);
    if (!data.allowRecovery) {
      return <span>-</span>;
    }
  } else {
    if (!data.allowMigration) {
      return <span>-</span>;
    }
    max = Number(data.migrationLimit);
  }
  return (
    <div>
      <ProgressBarComp total={max} used={used} />
    </div>
  );
};

export default LicenseUsageItemRenderer;
