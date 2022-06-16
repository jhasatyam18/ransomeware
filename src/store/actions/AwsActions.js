import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { API_AWS_AVAILABILITY_ZONES, API_AWS_REGIONS, API_GCP_AVAILABILITY_ZONES, API_GCP_REGIONS } from '../../constants/ApiConstants';
import { callAPI } from '../../utils/ApiUtils';
import { getValue, isAWSCopyNic, isPlanWithSamePlatform } from '../../utils/InputUtils';
import { PLATFORM_TYPES, STATIC_KEYS } from '../../constants/InputConstants';
import { valueChange } from './UserActions';
import { addMessage } from './MessageActions';

export function onAwsStorageTypeChange({ value, fieldKey }) {
  return (dispatch) => {
    if (value === 'gp2') {
      const keys = fieldKey.split('.');
      const iopsKey = `${keys.slice(0, keys.length - 1).join('.')}.volumeIOPS`;
      dispatch(valueChange(iopsKey, '0'));
    }
  };
}

export function onAwsPublicIPChecked({ value, fieldKey }) {
  return (dispatch) => {
    if (value) {
      const networkKey = fieldKey.replace('isPublic', 'network');
      const publicIPKey = fieldKey.replace('isPublic', 'publicIP');
      dispatch(valueChange(networkKey, ''));
      dispatch(valueChange(publicIPKey, ''));
    }
  };
}

export function onAwsCopyNetConfigChange({ value, fieldKey }) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    if (!fieldKey) {
      return;
    }
    const networkKey = fieldKey.replace('-isFromSource', '');
    if (!value) {
      // reset all the values
      dispatch(valueChange(`${networkKey}-subnet`, ''));
      dispatch(valueChange(`${networkKey}-availZone`, ''));
      dispatch(valueChange(`${networkKey}-isPublic`, false));
      dispatch(valueChange(`${networkKey}-securityGroups`, ''));
      dispatch(valueChange(`${networkKey}-network`, ''));
      dispatch(valueChange(`${networkKey}-privateIP`, ''));
    } else {
      // set the source VM values
      const keys = fieldKey.split('-');
      if (keys.length > 3) {
        // nic index
        const index = keys[keys.length - 2];
        const vmKey = `${keys[0]}-${keys[1]}`;
        const selectedVMS = getValue('ui.site.seletedVMs', values);
        Object.keys(selectedVMS).forEach((key) => {
          if (vmKey === key) {
            const nics = selectedVMS[key].virtualNics;
            if (nics && nics.length >= index) {
              const nic = nics[index];
              dispatch(valueChange(`${networkKey}-subnet`, nic.Subnet));
              dispatch(valueChange(`${networkKey}-isPublic`, nic.isPublicIP));
              dispatch(valueChange(`${networkKey}-privateIP`, nic.privateIP));
              if (nic.securityGroups) {
                const sgp = nic.securityGroups.split(',');
                dispatch(valueChange(`${networkKey}-securityGroups`, sgp));
              }
            }
          }
        });
      }
    }
  };
}

/**
   * AWS Network subnet change
   * Set the subnet zone value
   * @param value value of the subnet
   * @param fieldKey field key for which value is changed
   */
export function onAwsSubnetChange({ value, fieldKey }) {
  return (dispatch, getState) => {
    if (value) {
      const { user } = getState();
      const { values } = user;
      let isCopyConfiguration = false;
      if (fieldKey && isPlanWithSamePlatform(user)) {
        isCopyConfiguration = isAWSCopyNic(fieldKey, '-subnet', user);
      }
      const dataSourceKey = (isCopyConfiguration === true ? STATIC_KEYS.UI_SUBNETS__SOURCE : STATIC_KEYS.UI_SUBNETS);
      const subnets = getValue(dataSourceKey, values) || [];
      for (let s = 0; s < subnets.length; s += 1) {
        if (subnets[s].id === value) {
          const availZoneKey = fieldKey.replace('-subnet', '-availZone');
          dispatch(valueChange(availZoneKey, subnets[s].zone));
        }
      }
    }
  };
}

/**
   * AWS Network VPC change
   * Set the subnet zone and sg value
   * @param value value of the subnet
   * @param fieldKey field key for which value is changed
   */
export function onAwsVPCChange({ value, fieldKey }) {
  return (dispatch) => {
    if (value) {
      const key = fieldKey.split('-');
      const networkKey = key.slice(0, key.length - 1).join('-');
      dispatch(valueChange(`${networkKey}-isFromSource`, false));
      dispatch(valueChange(`${networkKey}-subnet`, ''));
      dispatch(valueChange(`${networkKey}-availZone`, ''));
      dispatch(valueChange(`${networkKey}-isPublic`, false));
      dispatch(valueChange(`${networkKey}-privateIP`, ''));
      dispatch(valueChange(`${networkKey}-securityGroups`, ''));
      dispatch(valueChange(`${networkKey}-network`, ''));
    }
  };
}

export function updateAvailabilityZones({ value }) {
  return (dispatch, getState) => {
    if (value === '') {
      dispatch(valueChange('ui.values.availabilityZones', []));
      return;
    }
    const { user } = getState();
    const { values } = user;
    const data = getValue('ui.values.regions', values);
    const zones = data.filter((item) => item.value === value);
    dispatch(valueChange('ui.values.availabilityZones', (zones[0] ? zones[0].zones : [])));
  };
}

export function fetchAvailibilityZones({ value }) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const platfromType = getValue('ui.values.sites', values).filter((site) => `${site.id}` === `${value}`)[0].platformDetails.platformType;
    const url = (platfromType === PLATFORM_TYPES.AWS ? API_AWS_AVAILABILITY_ZONES : API_GCP_AVAILABILITY_ZONES);
    return callAPI(url)
      .then((json) => {
        if (json && json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          let data = json;
          if (data === null) {
            data = [];
          }
          dispatch(valueChange('ui.values.availabilityZones', data));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function fetchRegions(TYPE) {
  return (dispatch) => {
    const url = (PLATFORM_TYPES.AWS === TYPE ? API_AWS_REGIONS : API_GCP_REGIONS);
    return callAPI(url)
      .then((json) => {
        if (json && json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          let data = json;
          if (data === null) {
            data = [];
          }
          dispatch(valueChange('ui.values.regions', data));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}
