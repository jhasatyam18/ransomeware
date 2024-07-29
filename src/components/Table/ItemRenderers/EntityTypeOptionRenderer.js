import React from 'react';
import { FIELDS } from '../../../constants/FieldsConstant';
import DMFieldSelect from '../../Shared/DMFieldSelect';
import { STATIC_KEYS } from '../../../constants/InputConstants';

function EntityTypeOptionRenderer({ data, dispatch, user }) {
  const { moref } = data;
  const fieldObj = FIELDS['ui.vm.entity.type'];
  return (
    <>
      <DMFieldSelect dispatch={dispatch} fieldKey={`${moref}-vmConfig.general.entityType`} field={fieldObj} user={user} hideLabel fieldName={STATIC_KEYS.ENTITY_TYPE} />
    </>
  );
}

export default EntityTypeOptionRenderer;
