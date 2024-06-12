import React from 'react';
import { FIELDS } from '../../../constants/FieldsConstant';
import { getValue } from '../../../utils/InputUtils';
import DMSearchSelect from '../../Shared/DMSearchSelect';

function RecveryCheckpointOptionRenderer({ data, user, dispatch, field }) {
  const { moref } = data;
  const { values } = user;
  const fieldObj = FIELDS['ui.vm.recovery.checkpoints'];
  const isAutoMigrate = getValue('ui.automate.migration', values);
  if (isAutoMigrate || !data[field]) {
    return '-';
  }
  if (field === 'currentSnapshotTime') {
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
