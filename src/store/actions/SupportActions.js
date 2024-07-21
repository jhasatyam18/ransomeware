// actions
import * as Types from '../../constants/actionTypes';
// constants
import { API_DELETE_SUPPORT_BUNDLE, API_SUPPORT_BUNDLE } from '../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
// Util
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { addMessage } from './MessageActions';
import { closeModal } from './ModalActions';
import { hideApplicationLoader, refresh, showApplicationLoader } from './UserActions';

/**
 * Fetch all the available support bundles
 * @returns set bundle data in redux managed state
 */
export function fetchSupportBundles() {
  return (dispatch) => {
    dispatch(showApplicationLoader(API_SUPPORT_BUNDLE, 'Loading support bundles...'));
    return callAPI(API_SUPPORT_BUNDLE)
      .then((json) => {
        dispatch(hideApplicationLoader(API_SUPPORT_BUNDLE));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(supportBundleFetched(json));
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(API_SUPPORT_BUNDLE));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * Delete support bundle for specified id
 */
export function deleteSupportBundle(id) {
  return (dispatch) => {
    dispatch(showApplicationLoader(API_DELETE_SUPPORT_BUNDLE, 'Removing support bundle...'));
    const obj = createPayload(API_TYPES.DELETE, {});
    return callAPI(API_DELETE_SUPPORT_BUNDLE.replace('<id>', id), obj)
      .then((json) => {
        dispatch(hideApplicationLoader(API_DELETE_SUPPORT_BUNDLE));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(addMessage('Support bundle deleted successfully', MESSAGE_TYPES.INFO));
          dispatch(fetchSupportBundles());
          dispatch(closeModal());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(API_DELETE_SUPPORT_BUNDLE));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * create support bundle for specified id
 */
export function generateSupportBundle(bundle) {
  return (dispatch) => {
    dispatch(showApplicationLoader(API_SUPPORT_BUNDLE, 'Generate support bundle.'));
    const obj = createPayload(API_TYPES.POST, bundle);
    return callAPI(API_SUPPORT_BUNDLE, obj)
      .then((json) => {
        dispatch(hideApplicationLoader(API_SUPPORT_BUNDLE));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(addMessage('Generate new support bundle started. Use support bundle list for more details.', MESSAGE_TYPES.INFO));
          dispatch(fetchSupportBundles());
          dispatch(refresh());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(API_SUPPORT_BUNDLE));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function supportBundleFetched(bundles) {
  return {
    type: Types.FETCH_SUPPORT_BUNDLES,
    bundles,
  };
}
