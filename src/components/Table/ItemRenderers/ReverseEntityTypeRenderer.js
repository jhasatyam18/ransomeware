import React from 'react';
import { withTranslation } from 'react-i18next';
import { REVERSE_ENTITY_TYPE, STATIC_KEYS } from '../../../constants/InputConstants';
import { getValue } from '../../../utils/InputUtils';
import { getStorageWithUnit } from '../../../utils/AppUtils';

const ReverseEntityTypeRenderer = (props) => {
  const { user, data } = props;
  const { values } = user;
  let size = 0;
  const { virtualDisks = [] } = data;
  if (virtualDisks !== null) {
    virtualDisks.forEach((disk) => {
      if (typeof disk.isDeleted !== 'undefined' && !disk.isDeleted && typeof disk.size !== 'undefined') {
        size += disk.size;
      }
    });
  }
  size = getStorageWithUnit(size);
  const planEntityType = getValue(STATIC_KEYS.UI_REVERSE_RECOVERY_ENTITY, values);
  const VMEntityType = getValue(`${data.moref}-vmConfig.general.entityType`, values) || planEntityType;
  let resp = '';
  if (!VMEntityType) {
    return resp;
  }
  const VMEntityTypeMapper = {
    'maintain-original': 'Maintain Original',
    'create-new': 'Create New',
  };

  const entityType = VMEntityTypeMapper[VMEntityType] || VMEntityType;

  if (VMEntityType === REVERSE_ENTITY_TYPE.MAINTAIN_ORIGINAL) {
    resp = entityType;
  } else {
    resp = `${entityType} (${size} additional storage)`;
  }

  return (
    <p>{resp}</p>
  );
};

export default (withTranslation()(ReverseEntityTypeRenderer));
