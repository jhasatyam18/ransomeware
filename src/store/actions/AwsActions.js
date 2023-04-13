import { getValue, isAWSCopyNic, isPlanWithSamePlatform } from '../../utils/InputUtils';
import { STATIC_KEYS } from '../../constants/InputConstants';
import { valueChange } from './UserActions';

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
        const selectedVMS = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
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

export function addAssociatedIPForAzure({ fieldKey, ip, id, values }) {
  if (typeof ip === 'undefined' || ip === '' || typeof id === 'undefined' || id === '') {
    return;
  }
  let ips = getValue(STATIC_KEYS.UI_ASSOCIATED_RESERVE_IPS, values) || {};
  const hasKey = Object.keys(ips).filter((key) => ips[key].ip === ip);
  if (hasKey.length === 0) {
    ips = { ...ips, [ip]: { label: ip, value: id, fieldKey } };
  }
  return ip;
}

export function addAssociatedReverseIP({ fieldKey, ip, id }) {
  return (dispatch, getState) => {
    if (typeof ip === 'undefined' || ip === '' || typeof id === 'undefined') {
      return;
    }
    const { user } = getState();
    const { values } = user;
    let ips = getValue(STATIC_KEYS.UI_ASSOCIATED_RESERVE_IPS, values) || {};
    const hasKey = Object.keys(ips).filter((key) => ips[key].ip === ip);
    if (hasKey.length === 0) {
      ips = { ...ips, [ip]: { label: ip, value: id, fieldKey } };
      dispatch(valueChange(STATIC_KEYS.UI_ASSOCIATED_RESERVE_IPS, ips));
    }
  };
}
