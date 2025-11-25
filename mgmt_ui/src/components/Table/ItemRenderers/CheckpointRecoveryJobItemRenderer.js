import React from 'react';
import { withTranslation } from 'react-i18next';
import RecoveryStatusItemRenderer from './RecoveryStatusItemRenderer';

function CheckpointRecoveryJobItemRenderer({ data, field }) {
  return <RecoveryStatusItemRenderer data={data} field={field} />;
}

export default (withTranslation()(CheckpointRecoveryJobItemRenderer));
