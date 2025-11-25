import { MAPPING_REVERSE_RECOMMENDED_DATA, REVERSE_ENTITY_TYPE, REVERSE_REPLICATION_TYPE, STATIC_KEYS } from '../constants/InputConstants';
import { valueChange, valueChanges } from '../store/actions';
import { getValue } from './InputUtils';
import { closeModal } from '../store/actions/ModalActions';

export function setRecommendedData(user, dispatch, failedEntitie) {
  const { values } = user;
  const result = {};
  const drPlanData = getValue('ui.reverse.drPlan', values);
  const { protectedEntities } = drPlanData;
  const { virtualMachines } = protectedEntities;
  if (failedEntitie && failedEntitie.length > 0) {
    virtualMachines.forEach((vm) => {
      const failedEntity = failedEntitie.find((entity) => entity.failedEntity === vm.moref);
      result[vm.moref] = {
        workloadName: vm.name,
        replicationType: failedEntity ? REVERSE_REPLICATION_TYPE.FULL : REVERSE_REPLICATION_TYPE.DIFFERENTIAL,
        entityType: REVERSE_ENTITY_TYPE.MAINTAIN_ORIGINAL,
        msg: failedEntity && failedEntity.failureMessage,
      };
    });
  } else {
    virtualMachines.forEach((vm) => {
      result[vm.moref] = {
        workloadName: vm.name,
        replicationType: REVERSE_REPLICATION_TYPE.DIFFERENTIAL,
        entityType: REVERSE_ENTITY_TYPE.MAINTAIN_ORIGINAL,
      };
    });
  }

  dispatch(valueChange(STATIC_KEYS.UI_REVERSE_RECOMMENDED_DATA, result));
}

export function getVmReplicationTypeOptions(user, fieldKey) {
  const { values } = user;
  const recommendedData = getValue(STATIC_KEYS.UI_REVERSE_RECOMMENDED_DATA, values);
  const options = [];
  const trimmedKey = extractMoref(fieldKey);
  if (recommendedData && fieldKey && recommendedData[trimmedKey].replicationType === REVERSE_REPLICATION_TYPE.FULL) {
    options.push({ label: STATIC_KEYS.FULL, value: REVERSE_REPLICATION_TYPE.FULL });
  } else {
    options.push({ label: STATIC_KEYS.DIFFERENTIAL, value: REVERSE_REPLICATION_TYPE.DIFFERENTIAL }, { label: STATIC_KEYS.FULL, value: REVERSE_REPLICATION_TYPE.FULL });
  }
  return options;
}

export function defaultReplicationTypeForVm({ user, fieldKey }) {
  const { values } = user;
  let defaultOption;
  const recommendedData = getValue(STATIC_KEYS.UI_REVERSE_RECOMMENDED_DATA, values);
  const trimmedKey = extractMoref(fieldKey);
  if (recommendedData && recommendedData[trimmedKey].replicationType !== REVERSE_REPLICATION_TYPE.FULL) {
    defaultOption = REVERSE_REPLICATION_TYPE.DIFFERENTIAL;
  } else {
    defaultOption = REVERSE_REPLICATION_TYPE.FULL;
  }
  return defaultOption;
}
export function getVmEntityTypeOptions() {
  const options = [
    { label: 'Create New Copy', value: REVERSE_ENTITY_TYPE.CREATE_NEW_COPY },
    { label: 'Maintain Original', value: REVERSE_ENTITY_TYPE.MAINTAIN_ORIGINAL },
  ];
  return options;
}

export function defaultEntityTypeForVm() {
  const defaultOption = REVERSE_ENTITY_TYPE.MAINTAIN_ORIGINAL;
  return defaultOption;
}

export function extractMoref(fieldKey) {
  const parts = fieldKey.split('-');
  parts.pop(); // Remove the last part
  return parts.join('-');
}

export function hasWarning(user, fieldKey, fieldName) {
  const { values } = user;
  const recommendedData = getValue(STATIC_KEYS.UI_REVERSE_RECOMMENDED_DATA, values);
  if (recommendedData && fieldKey) {
    const trimmedKey = extractMoref(fieldKey);
    const recommendedValue = recommendedData[trimmedKey][fieldName];
    const fieldValue = getValue(fieldKey, values);
    if (fieldValue !== recommendedValue) {
      return true;
    }
  }
  return false;
}

export function getWarningVMS(user) {
  const { values } = user;
  const recommendedData = getValue(STATIC_KEYS.UI_REVERSE_RECOMMENDED_DATA, values);
  const warningVMS = [];
  if (recommendedData && Object.keys(recommendedData).length > 0) {
    Object.keys(recommendedData).forEach((el) => {
      const entityType = getValue(`${el}-vmConfig.general.entityType`, values);
      const replicationType = getValue(`${el}-replication.type`, values);
      if (recommendedData[el].replicationType !== replicationType || recommendedData[el].entityType !== entityType) {
        warningVMS.push({ name: recommendedData[el].workloadName, moref: el, selectedEntityType: MAPPING_REVERSE_RECOMMENDED_DATA[entityType], selectedReplType: MAPPING_REVERSE_RECOMMENDED_DATA[replicationType], recommendedEntityType: MAPPING_REVERSE_RECOMMENDED_DATA[recommendedData[el].entityType], recommendedReplType: MAPPING_REVERSE_RECOMMENDED_DATA[recommendedData[el].replicationType], message: recommendedData[el].msg });
      }
    });
  }
  return warningVMS;
}

export function applyRecommendedDataToAllVM() {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const val = {};
    const recommendedData = getValue(STATIC_KEYS.UI_REVERSE_RECOMMENDED_DATA, values);
    if (recommendedData && Object.keys(recommendedData).length > 0) {
      Object.keys(recommendedData).forEach((el) => {
        val[`${el}-vmConfig.general.entityType`] = recommendedData[el].entityType;
        val[`${el}-replication.type`] = recommendedData[el].replicationType;
      });
    }
    dispatch(valueChanges(val));
    dispatch(closeModal());
  };
}
