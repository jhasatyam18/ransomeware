import React from 'react';
import DMFieldText from '../Shared/DMFieldText';
import { FIELD_TYPE } from '../../constants/FieldsConstant';

function VMPasswordItemRenderer({ data, user, dispatch }) {
  const username = { label: '', placeHolderText: 'Enter username', type: FIELD_TYPE.PASSOWRD, validate: null, errorMessage: 'Enter username.', shouldShow: true };
  if (user && dispatch && data && data.guestOS && data.guestOS.toLowerCase().indexOf('window') !== -1) {
    return (
      <div>
        <DMFieldText dispatch={dispatch} fieldKey={`${data.moref}-password`} field={username} user={user} hideLabel="true" hidepassword="true" />
      </div>
    );
  }
  return null;
}

export default VMPasswordItemRenderer;
