import { valueChange } from './UserActions';

export function onGCPNetworkChange({ fieldKey }) {
  return (dispatch) => {
    if (fieldKey) {
      const subnetFieldKey = fieldKey.replace('-network', '-subnet');
      dispatch(valueChange(subnetFieldKey, ''));
    }
  };
}
