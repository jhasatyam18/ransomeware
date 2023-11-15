import { isEmpty } from 'lodash';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { geBootPriorityOptions } from '../../../utils/InputUtils';
import { FIELD_TYPE } from '../../../constants/FieldsConstant';
import DMFieldSelect from '../../Shared/DMFieldSelect';

function ReplicationPriorityItemRenderer({ data, user, dispatch }) {
  const replicationPriority = { type: FIELD_TYPE.SELECT, validate: (value) => isEmpty(value, user), errorMessage: 'Select Replication Priority order', shouldShow: true, options: (u) => geBootPriorityOptions(u), defaultValue: 3 };
  if (dispatch && data) {
    return (
      <div>
        <DMFieldSelect dispatch={dispatch} fieldKey={`${data.moref}-vmConfig.general.replicationPriority`} user={user} field={replicationPriority} hideLabel="true" />
      </div>
    );
  }
  return null;
}

export default (withTranslation()(ReplicationPriorityItemRenderer));
