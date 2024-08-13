import React from 'react';
import { REVERSE_ENTITY_TYPE, REVERSE_REPLICATION_TYPE } from '../../../constants/InputConstants';
import { getStorageWithUnit } from '../../../utils/AppUtils';
import { getValue } from '../../../utils/InputUtils';
import { hasWarning } from '../../../utils/ReverseReplicationUtils';

const ReverseVMDescriptionRenderer = ({ data, user, field }) => {
  const { values } = user;
  const { moref } = data;
  const entityTypeFieldKey = `${moref}-vmConfig.general.entityType`;
  const replTypeFieldKey = `${moref}-replication.type`;
  const entityType = getValue(entityTypeFieldKey, values);
  const replicationType = getValue(replTypeFieldKey, values);
  let val = '';
  let size = 0;
  // get VM from plan
  const plan = getValue('ui.reverse.drPlan', values);
  const { protectedEntities } = plan;
  const { VirtualMachines } = protectedEntities;
  const filteredVMS = VirtualMachines.filter((v) => v.moref === data.moref);
  const vm = (filteredVMS.length > 0 ? filteredVMS[0] : {});
  const { virtualDisks = [] } = vm;
  if (virtualDisks !== null) {
    virtualDisks.forEach((disk) => {
      if (typeof disk.isDeleted !== 'undefined' && !disk.isDeleted && typeof disk.size !== 'undefined') {
        size += disk.size;
      }
    });
  }
  size = getStorageWithUnit(size);
  const changeInEntityType = hasWarning(user, entityTypeFieldKey, 'entityType');
  const changeInReplType = hasWarning(user, replTypeFieldKey, 'replicationType');
  const cssClassName = (changeInEntityType || changeInReplType) ? 'text-warning' : '';
  if (replicationType === REVERSE_REPLICATION_TYPE.FULL && entityType === REVERSE_ENTITY_TYPE.MAINTAIN_ORIGINAL) {
    val = 'Full data will be used for egress charges';
  } else if (replicationType === REVERSE_REPLICATION_TYPE.DIFFERENTIAL && entityType === REVERSE_ENTITY_TYPE.CREATE_NEW_COPY) {
    val = `Additional ${size} storage, compute resources and IPs will be required.`;
  } else if (replicationType === REVERSE_REPLICATION_TYPE.FULL && entityType === REVERSE_ENTITY_TYPE.CREATE_NEW_COPY) {
    val = `Additional ${size} storage, compute resources and IPs will be required. Full data will be used for egress charges.`;
  }
  if (data[field]) {
    // make the first letter capital
    val = `${data[field].charAt(0).toUpperCase() + data[field].slice(1)} ( ${val} )`;
  } else if (!data[field] && val.length === 0) {
    val = '-';
  }
  return (
    <p className={`${cssClassName}`}>{val}</p>
  );
};

export default ReverseVMDescriptionRenderer;
