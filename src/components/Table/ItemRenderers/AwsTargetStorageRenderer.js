import React from 'react';
import { isEmpty } from '../../../utils/validationUtils';
import DMFieldSelect from '../../Shared/DMFieldSelect';
import { FIELD_TYPE } from '../../../constants/FieldsConstant';

const AwsTargetStorageRenderer = (props) => {
  const { dispatch, user, data } = props;
  const field = { label: '', shouldShow: true, type: FIELD_TYPE.SELECT, options: [{ label: 'Snapshot', value: 'Snapshot' }, { label: 'Volume', value: 'Disk' }], validate: ({ value }) => isEmpty({ value }), errorMessage: 'Please select replication type', defaultValue: 'Snapshot' };

  return (
    <DMFieldSelect fieldKey={`${data.moref}-vmConfig.general.targetStorageType`} user={user} hideLabel="true" dispatch={dispatch} field={field} />
  );
};

export default AwsTargetStorageRenderer;
