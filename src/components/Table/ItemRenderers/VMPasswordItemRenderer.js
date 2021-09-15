import React from 'react';
import DMFieldText from '../../Shared/DMFieldText';
import { FIELD_TYPE } from '../../../constants/FieldsConstant';

function VMPasswordItemRenderer({ data, user, dispatch }) {
  const username = { label: '', placeHolderText: 'Enter password', type: FIELD_TYPE.PASSWORD, validate: null, errorMessage: 'Enter username.', shouldShow: true };
  if (user && dispatch && data && data.guestOS) {
    return (
      <div>
        <DMFieldText dispatch={dispatch} fieldKey={`${data.moref}-password`} field={username} user={user} hideLabel="true" />
      </div>
    );
  }
  return null;
}

export default VMPasswordItemRenderer;
