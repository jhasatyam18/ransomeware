import React from 'react';
import { withTranslation } from 'react-i18next';
import DMFieldSelect from '../../Shared/DMFieldSelect';
import { FIELD_TYPE } from '../../../constants/FieldsConstant';
import { geBootPriorityOptions } from '../../../utils/InputUtils';
import { isEmpty } from '../../../utils/validationUtils';

function VMBootOrderItemRenderer({ data, user, dispatch }) {
  const bootOrder = { label: 'boot.order', type: FIELD_TYPE.SELECT, validate: (value) => isEmpty(value, user), errorMessage: 'Select boot order', shouldShow: true, options: (u) => geBootPriorityOptions(u), defaultValue: 1 };
  if (dispatch && data) {
    return (
      <div>
        <DMFieldSelect dispatch={dispatch} fieldKey={`${data.moref}-vmConfig.general.bootOrder`} user={user} field={bootOrder} hideLabel="true" />
      </div>
    );
  }
  return null;
}

export default (withTranslation()(VMBootOrderItemRenderer));
