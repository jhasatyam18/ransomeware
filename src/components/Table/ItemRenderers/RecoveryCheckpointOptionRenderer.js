import React from 'react';
import DMSearchSelect from '../../Shared/DMSearchSelect';
import { FIELDS } from '../../../constants/FieldsConstant';
import { getValue } from '../../../utils/InputUtils';

function RecveryCheckpointOptionRenderer({ data, user, dispatch }) {
  const { moref } = data;
  const { values } = user;
  const field = FIELDS['ui.vm.recovery.checkpoints'];
  const isAutoMigrate = getValue('ui.automate.migration', values);
  return (
    <>
      <DMSearchSelect fieldKey={`${moref}-recovery-checkpoint`} field={field} user={user} dispatch={dispatch} hideLabel disabled={isAutoMigrate} />
    </>
  );
}

export default RecveryCheckpointOptionRenderer;
