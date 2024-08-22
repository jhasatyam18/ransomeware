import React from 'react';
import { FIELDS } from '../../../constants/FieldsConstant';
import { RECOVERY_STATUS, STATIC_KEYS, UI_WORKFLOW } from '../../../constants/InputConstants';
import { getValue } from '../../../utils/InputUtils';
import DMSearchSelect from '../../Shared/DMSearchSelect';

function RecveryCheckpointOptionRenderer({ data, user, dispatch, field }) {
  const { moref } = data;
  const { values } = user;
  const fieldObj = FIELDS['ui.vm.recovery.checkpoints'];
  const isAutoMigrate = getValue('ui.automate.migration', values);
  const workflow = getValue(STATIC_KEYS.UI_WORKFLOW, values) || '';

  if (isAutoMigrate && data.recoveryStatus === '') {
    return '-';
  }

  // if the workflow is test recovery and vm is recovered then in point-in-time and latest option both should show the time at which it got recovered
  if (workflow === UI_WORKFLOW.TEST_RECOVERY && (data.recoveryStatus === RECOVERY_STATUS.RECOVERED || data.recoveryStatus === RECOVERY_STATUS.MIGRATED)) {
    if (!data.currentSnapshotTime) {
      return '-';
    }
    const time = data.currentSnapshotTime * 1000;
    const d = new Date(time);
    return `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`;
  }

  if (field === 'currentSnapshotTime') {
    if (!data[field]) {
      return '-';
    }
    const time = data[field] * 1000;
    const d = new Date(time);
    return `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`;
  }
  return (
    <>
      <DMSearchSelect fieldKey={`${moref}-recovery-checkpoint`} field={fieldObj} user={user} dispatch={dispatch} hideLabel disabled={isAutoMigrate} />
    </>
  );
}

export default RecveryCheckpointOptionRenderer;
