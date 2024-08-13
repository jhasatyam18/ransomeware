import React from 'react';
import { FIELDS } from '../../../constants/FieldsConstant';
import DMFieldSelect from '../../Shared/DMFieldSelect';
import { getValue } from '../../../utils/InputUtils';
import { STATIC_KEYS } from '../../../constants/InputConstants';

function ReplicationTypeOptionRenderer({ data, dispatch, user, field }) {
  const { moref } = data;
  const { values } = user;
  if (field === 'replicationType') {
    if (!data[field]) {
      return '-';
    }
    return data[field];
  }
  const fieldObj = FIELDS['ui.vm.replication.type'];
  const recommendedData = getValue(STATIC_KEYS.UI_REVERSE_RECOMMENDED_DATA, values);
  const disabled = (recommendedData && recommendedData[moref].replicationType === 'full') || false;
  return (
    <>
      <DMFieldSelect dispatch={dispatch} fieldKey={`${moref}-replication.type`} field={fieldObj} user={user} hideLabel disabled={disabled} fieldName={STATIC_KEYS.REPLICATION_TYPE} />
    </>
  );
}

export default ReplicationTypeOptionRenderer;
