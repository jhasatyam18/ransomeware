import { addMessage } from './MessageActions';
import { hideApplicationLoader, showApplicationLoader } from './UserActions';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { API_FETCH_ALERTS, API_FETCH_EVENT_BY_ID, API_ACKNOWLEDGE_ALERT, API_MARK_ALERT_AS_READ, API_FETCH_UNREAD_ALERTS } from '../../constants/ApiConstants';
import * as Types from '../../constants/actionTypes';
import { EVENT_LEVELS } from '../../constants/EventConstant';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';

/**
 * Action to fetch all alerts
 * @returns
 */
export function fetchAlerts() {
  return (dispatch) => {
    dispatch(showApplicationLoader('Fetching_alerts', 'Loading alerts...'));
    return callAPI(API_FETCH_ALERTS)
      .then((json) => {
        dispatch(hideApplicationLoader('Fetching_alerts'));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(alertsFetched(json));
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('Fetching_alerts'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * Action to fetch all unread alerts
 * @returns
 */
export function getUnreadAlerts() {
  return (dispatch) => {
    dispatch(hideApplicationLoader('Fetching_alerts'));
    return callAPI(API_FETCH_UNREAD_ALERTS)
      .then((json) => {
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(unreadAlertFetched(json));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * Action to fetch event by id
 */
export function getAlertEvent(id) {
  return (dispatch) => {
    dispatch(showApplicationLoader('FETCHING_ALERT_EVENT', 'Loading alert details...'));
    return callAPI(API_FETCH_EVENT_BY_ID.replace('<id>', id))
      .then((json) => {
        dispatch(hideApplicationLoader('FETCHING_ALERT_EVENT'));
        dispatch(alertEventFetched(json));
      },
      (err) => {
        dispatch(hideApplicationLoader('FETCHING_ALERT_EVENT'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * Action to mark alert as acknowledge
 */
export function acknowledgeAlert(alert) {
  return (dispatch) => {
    dispatch(showApplicationLoader('ACKNOWLEDGING_ALERT', 'Acknowledging alert.'));
    const obj = createPayload(API_TYPES.POST, alert);
    const URL = API_ACKNOWLEDGE_ALERT.replace('<id>', alert.id);
    return callAPI(URL, obj)
      .then(() => {
        dispatch(hideApplicationLoader('ACKNOWLEDGING_ALERT'));
        dispatch(alertsFetched([]));
        dispatch(fetchAlerts());
      },
      (err) => {
        dispatch(hideApplicationLoader('ACKNOWLEDGING_ALERT'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * Action to mark alert as read
 */
export function markAsRead(id) {
  return (dispatch) => {
    const obj = createPayload(API_TYPES.POST, {});
    const URL = API_MARK_ALERT_AS_READ.replace('<id>', id);
    return callAPI(URL, obj)
      .then((json) => {
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 *
 * @param data, type , action
 * @param {*} type
 * @param {*} action
 * @returns filtered data by type
 */
export function filterDataByType(data, type, action) {
  return (dispatch) => {
    let filterData = [];
    if (type === EVENT_LEVELS.ALL) {
      filterData = data;
    } else {
      filterData = data.filter((r) => r.severity === type);
    }
    if (action === 'alert') {
      dispatch(setFilteredAlerts(filterData));
    } else {
      dispatch(setFilteredEvents(filterData));
    }
    return null;
  };
}

/**
 * Reducer invoking functions
 */

export function alertsFetched(data) {
  return {
    type: Types.FETCH_ALERTS,
    data,
  };
}

export function unreadAlertFetched(unread) {
  return {
    type: Types.FETCH_UNREAD_ALERTS,
    unread,
  };
}

export function alertSelected(selected) {
  return {
    type: Types.SELECT_ALERT,
    selected,
  };
}

export function alertEventFetched(associatedEvent) {
  return {
    type: Types.SELECTED_ALERT_EVENT,
    associatedEvent,
  };
}

export function setFilteredAlerts(filteredData) {
  return {
    type: Types.FILTER_ALERTS,
    filteredData,
  };
}

export function setFilteredEvents(filteredData) {
  return {
    type: Types.FILTER_EVENTS,
    filteredData,
  };
}

export function resetAlerts() {
  return {
    type: Types.RESET_ALERTS,
  };
}
