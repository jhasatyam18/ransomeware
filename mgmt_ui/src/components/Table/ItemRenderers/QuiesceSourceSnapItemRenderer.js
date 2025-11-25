import React from 'react';
import { withTranslation } from 'react-i18next';
import { FIELD_TYPE } from '../../../constants/FieldsConstant';
import { STATIC_KEYS } from '../../../constants/InputConstants';
import DMFieldCheckbox from '../../Shared/DMFieldCheckbox';

function QuiesceSourceSnapItemRenderer({ data, user, dispatch }) {
  const replicationPriority = { type: FIELD_TYPE.CHECKBOX, shouldShow: true, defaultValue: true };
  if (dispatch && data) {
    return (
      <div>
        <DMFieldCheckbox dispatch={dispatch} fieldKey={`${data.moref}${STATIC_KEYS.VMWARE_QUIESCE_KEY}`} user={user} field={replicationPriority} hideLabel="true" />
      </div>
    );
  }
  return null;
}

export default (withTranslation()(QuiesceSourceSnapItemRenderer));
