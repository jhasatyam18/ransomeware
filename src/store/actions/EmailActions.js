// actions
import * as Types from '../../constants/actionTypes';
// constants
import { API_EMAIL_CONFIGURATION, API_EMAIL_CONFIGURE, API_EMAIL_RECIPIENTS } from '../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
// Util
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { addMessage } from './MessageActions';
import { closeModal } from './ModalActions';
import { hideApplicationLoader, showApplicationLoader } from './UserActions';
/**
 * Fetch email configuration
 * @returns set of email configuration data in redux managed state
 */
export function fetchEmailConfig() {
  return (dispatch) => {
    dispatch(showApplicationLoader(API_EMAIL_CONFIGURATION, 'Loading email configuration ...'));
    return callAPI(API_EMAIL_CONFIGURATION)
      .then((json) => {
        dispatch(hideApplicationLoader(API_EMAIL_CONFIGURATION));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(emailConfigurationFetched(json));
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(API_EMAIL_CONFIGURATION));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * Fetch email recipients
 * @returns set of email recipients data in redux managed state
 */
export function fetchEmailRecipients() {
  return (dispatch) => {
    dispatch(showApplicationLoader(API_EMAIL_RECIPIENTS, 'Loading...'));
    dispatch(emailRecipientsFetched([]));
    return callAPI(API_EMAIL_RECIPIENTS)
      .then((json) => {
        dispatch(hideApplicationLoader(API_EMAIL_RECIPIENTS));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(emailRecipientsFetched(json));
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(API_EMAIL_RECIPIENTS));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * Configure email
 */
export function configureEmail(config) {
  return (dispatch) => {
    dispatch(showApplicationLoader(API_EMAIL_CONFIGURE, 'Configuring email...'));
    const method = (typeof config.ID === 'undefined' ? API_TYPES.POST : API_TYPES.PUT);
    const url = (typeof config.ID === 'undefined' ? API_EMAIL_CONFIGURE : `${API_EMAIL_CONFIGURE}/${config.ID}`);
    const obj = createPayload(method, config);
    return callAPI(url, obj)
      .then((json) => {
        dispatch(hideApplicationLoader(API_EMAIL_CONFIGURE));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(addMessage('Email settings configured successfully.', MESSAGE_TYPES.INFO));
          dispatch(fetchEmailConfig());
          dispatch(closeModal());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(API_EMAIL_CONFIGURE));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * Configure recipient
 */
export function configureRecipient(config) {
  return (dispatch) => {
    dispatch(showApplicationLoader(API_EMAIL_RECIPIENTS, 'Saving recipient info...'));
    const method = (typeof config.ID === 'undefined' ? API_TYPES.POST : API_TYPES.PUT);
    const url = (typeof config.ID === 'undefined' ? API_EMAIL_RECIPIENTS : `${API_EMAIL_RECIPIENTS}/${config.ID}`);
    const obj = createPayload(method, config);
    return callAPI(url, obj)
      .then((json) => {
        dispatch(hideApplicationLoader(API_EMAIL_RECIPIENTS));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(addMessage('Email recipient info saved successfully.', MESSAGE_TYPES.INFO));
          dispatch(fetchEmailRecipients());
          dispatch(closeModal());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(API_EMAIL_RECIPIENTS));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * Delete recipient
 */
export function deleteRecipient(id) {
  return (dispatch) => {
    dispatch(showApplicationLoader(API_EMAIL_RECIPIENTS, 'Removing recipient...'));
    const url = `${API_EMAIL_RECIPIENTS}/${id}`;
    const obj = createPayload(API_TYPES.DELETE, {});
    return callAPI(url, obj)
      .then((json) => {
        dispatch(hideApplicationLoader(API_EMAIL_RECIPIENTS));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(addMessage('Email recipient removed successfully.', MESSAGE_TYPES.INFO));
          dispatch(fetchEmailRecipients());
          dispatch(closeModal());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(API_EMAIL_RECIPIENTS));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * Set email reducer objects
 */
export function emailConfigurationFetched(config) {
  return {
    type: Types.FETCH_EMAIL_CONFIGURATION,
    config,
  };
}

/**
 * Set email reducer objects
 */
export function emailRecipientsFetched(emailRecipients) {
  return {
    type: Types.FETCH_EMAIL_RECIPIENTS,
    emailRecipients,
  };
}
