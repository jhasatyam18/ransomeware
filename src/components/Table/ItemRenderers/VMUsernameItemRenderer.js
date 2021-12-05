import React from 'react';
import DMFieldText from '../../Shared/DMFieldText';
import { FIELD_TYPE } from '../../../constants/FieldsConstant';

function VMUsernameItemRenderer({ data, user, dispatch }) {
  if ((typeof data.isDisabled !== 'undefined' && data.isDisabled === true)) {
    return (
      '-'
    );
  }
  const username = { label: '', placeHolderText: 'Enter username', type: FIELD_TYPE.TEXT, validate: null, errorMessage: 'Enter username.', shouldShow: true };
  if (user && dispatch && data && data.guestOS) {
    return (
      <div>
        <DMFieldText dispatch={dispatch} fieldKey={`${data.moref}-username`} field={username} user={user} hideLabel="true" />
      </div>
    );
  }
  return null;
}

export default VMUsernameItemRenderer;
