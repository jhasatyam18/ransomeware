import * as Types from '../../constants/actionTypes';
import { API_LICENSE, API_LICENSE_ACTIVATE_DEACTIVATE } from '../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { hideApplicationLoader, showApplicationLoader } from '../actions';
import { addMessage } from './MessageActions';

export function fetchLicenses() {
  return (dispatch) => {
    dispatch(showApplicationLoader('FETCHING_LICENSES', 'Loading licenses...'));
    return callAPI(API_LICENSE)
      .then((json = []) => {
        dispatch(hideApplicationLoader('FETCHING_LICENSES'));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          const activeLicenses = json.filter((j) => j.licenseType !== 'Default');
          dispatch({
            type: Types.FETCH_LICENSES,
            licenses: activeLicenses,
          });
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('FETCHING_LICENSES'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function activateDeactivateLicense(id, type) {
  return (dispatch) => {
    let msg = 'Activating license';
    if (type !== 'activate') {
      msg = 'Deactivating license';
    }
    const url = API_LICENSE_ACTIVATE_DEACTIVATE.replace('<type>', type);
    dispatch(showApplicationLoader('ACTIVATE_LICENSE', msg));
    const obj = createPayload(API_TYPES.POST, {});
    return callAPI(url.replace('<id>', id), obj)
      .then((json) => {
        dispatch(hideApplicationLoader('ACTIVATE_LICENSE'));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(fetchLicenses());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('ACTIVATE_LICENSE'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}
