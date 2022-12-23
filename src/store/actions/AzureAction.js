import { getValue } from '../../utils/InputUtils';
import { STATIC_KEYS } from '../../constants/InputConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { API_AZURE_AVAILIBITY_ZONES } from '../../constants/ApiConstants';
import { callAPI } from '../../utils/ApiUtils';
import { addMessage } from './MessageActions';
import { valueChange } from './UserActions';

export function fetchAvailibilityZonesForAzure() {
  return (dispatch) => {
    const url = API_AZURE_AVAILIBITY_ZONES;
    return callAPI(url)
      .then((json) => {
        if (json && json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          let data = json;
          if (data === null) {
            data = [];
          }
          dispatch(valueChange(STATIC_KEYS.UI_AVAILABILITY_ZONES, data));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function onAzureResourceChange({ fieldKey, user }) {
  return (dispatch) => {
    const { values } = user;
    const key = fieldKey.replace('general.folderPath', 'network.net1');
    const net = getValue(key, values) || [];
    net.forEach((el) => {
      dispatch(valueChange(`${el.key}-subnet`, ''));
      dispatch(valueChange(`${el.key}-securityGroups`, ''));
    });
  };
}
