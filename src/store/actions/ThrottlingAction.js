// actions
import * as Types from '../../constants/actionTypes';
// constants
import { API_THROTTLING_CONFIGURATION, API_THROTTLING_REPLNODES, API_UPDATE_THROTTLING_CONFIGURATION } from '../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
// Util
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { addMessage } from './MessageActions';
import { closeModal } from './ModalActions';
import { hideApplicationLoader, showApplicationLoader, valueChange } from './UserActions';

/**
 * Fetch throttling configuration
 */
export function fetchBandwidthConfig() {
  return (dispatch) => {
    dispatch(showApplicationLoader(API_THROTTLING_CONFIGURATION, 'Loading bandwidth configuration ...'));
    return callAPI(API_THROTTLING_CONFIGURATION)
      .then((json) => {
        dispatch(hideApplicationLoader(API_THROTTLING_CONFIGURATION));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(throttlingConfigurationFetched(json));
          dispatch(setBandwidthFields(json));
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(API_THROTTLING_CONFIGURATION));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * Fetch throttling nodes
 * @returns set of throttling nodes data in redux managed state
 */
export function fetchBandwidthReplNodes() {
  return (dispatch) => {
    dispatch(showApplicationLoader(API_THROTTLING_REPLNODES, 'Loading...'));
    dispatch(throttlingReplNodesFetched([]));
    return callAPI(API_THROTTLING_REPLNODES)
      .then((json) => {
        dispatch(hideApplicationLoader(API_THROTTLING_REPLNODES));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(throttlingReplNodesFetched(json));
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(API_THROTTLING_REPLNODES));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * Configure bandwidth
 */
export function configureBandwidth(config) {
  return (dispatch) => {
    dispatch(showApplicationLoader(API_THROTTLING_CONFIGURATION, 'Configuring bandwidth...'));
    const method = (typeof config.id === 'undefined' ? API_TYPES.POST : API_TYPES.PUT);
    const url = (method === API_TYPES.POST ? API_THROTTLING_CONFIGURATION : API_UPDATE_THROTTLING_CONFIGURATION.replace('<id>', config.id).replace());
    const obj = createPayload(method, config);
    return callAPI(url, obj)
      .then((json) => {
        dispatch(hideApplicationLoader(API_THROTTLING_CONFIGURATION));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(addMessage('Bandwidth configured successfully.', MESSAGE_TYPES.INFO));
          dispatch(fetchBandwidthConfig());
          dispatch(fetchBandwidthReplNodes());
          dispatch(closeModal());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(API_THROTTLING_CONFIGURATION));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * Set throttling reducer objects
 */
export function throttlingConfigurationFetched(config) {
  return {
    type: Types.FETCH_THROTTLING_CONFIGURATION,
    config,
  };
}

/**
 * Set throttling reducer objects
 */
export function throttlingReplNodesFetched(replNodes) {
  return {
    type: Types.FETCH_THROTTLING_REPLNODES,
    replNodes,
  };
}

export function setBandwidthFields(json) {
  return (dispatch) => {
    dispatch(valueChange('throttling.isLimitEnabled', json.isLimitEnabled));
    dispatch(valueChange('throttling.bandwidthLimit', json.bandwidthLimit));
    dispatch(valueChange('throttling.isTimeEnabled', json.isLimitEnabled));
    dispatch(valueChange('throttling.timeLimit', json.timeLimit));
    dispatch(valueChange('throttling.startTime', getDateFromTime(json.startTime)));
    dispatch(valueChange('throttling.endTime', getDateFromTime(json.endTime)));
    dispatch(valueChange('throttling.applyToAll', json.applyToAll));
  };
}

function getDateFromTime(time) {
  if (time === '') {
    return time;
  }
  const date = new Date();
  const values = time.split(':');
  date.setHours(values[0]);
  date.setMinutes(values[1]);
  return date;
}

export function onLimitChange({ value }) {
  return (dispatch) => {
    if (value === false) {
      dispatch(valueChange('throttling.bandwidthLimit', 0));
    }
  };
}

export function onTimeLimitChange({ value }) {
  return (dispatch) => {
    if (value === false) {
      dispatch(valueChange('throttling.timeLimit', 0));
      dispatch(valueChange('throttling.startTime', ''));
      dispatch(valueChange('throttling.endTime', ''));
    }
  };
}
