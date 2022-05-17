import * as Types from '../../constants/actionTypes';
import { API_ACKNOWLEDGE_ALERT, API_ALERT_TAKE_VM_ACTION, API_FETCH_ALERTS, API_FETCH_DR_PLAN_BY_ID, API_FETCH_EVENT_BY_ID, API_FETCH_UNREAD_ALERTS } from '../../constants/ApiConstants';
import { EVENT_LEVELS, VM_CONFIG_ACTION_EVENT, VM_DISK_ACTION_EVENT } from '../../constants/EventConstant';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { drPlanDetailsFetched, initReconfigureProtectedVM, openEditProtectionPlanWizard } from './DrPlanActions';
import { addMessage } from './MessageActions';
import { closeModal } from './ModalActions';
import { hideApplicationLoader, showApplicationLoader } from './UserActions';

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
      },
      (err) => {
        dispatch(hideApplicationLoader('ACKNOWLEDGING_ALERT'));
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

export function takeVMAction(alert, associatedEvent) {
  return (dispatch) => {
    if (VM_DISK_ACTION_EVENT.indexOf(associatedEvent.type) !== -1) {
      dispatch(takeActionOnVMAlert(alert, associatedEvent.id));
      dispatch(closeModal());
    }
    if (VM_CONFIG_ACTION_EVENT.indexOf(associatedEvent.type) !== -1) {
      dispatch(closeModal());
      dispatch(initReconfigureProtectedVM(null, null, associatedEvent, alert));
    }
  };
}

export function initEditPlanAction(event, alert) {
  return async (dispatch) => {
    function fetchProtection(id) {
      return callAPI(API_FETCH_DR_PLAN_BY_ID.replace('<id>', id)).then((json) => {
        dispatch(drPlanDetailsFetched(json));
        return json;
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
        return false;
      });
    }
    const parts = event.impactedObjectURNs.split(',');
    const urn = parts[0].split(':');
    if (urn.length > 1) {
      const pPlan = await fetchProtection(urn[2]);
      dispatch(openEditProtectionPlanWizard(pPlan, true, alert, event));
    }
  };
}

export function takeActionOnVMAlert(alert) {
  return (dispatch) => {
    const url = API_ALERT_TAKE_VM_ACTION.replace('<id>', alert.id);
    const payload = createPayload(API_TYPES.POST, alert);
    return callAPI(url, payload)
      .then((json) => {
        dispatch(hideApplicationLoader('VM_ACTION'));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(addMessage('Action initiated successfully', MESSAGE_TYPES.SUCCESS));
          dispatch(acknowledgeAlert(alert));
          dispatch(closeModal());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('VM_ACTION'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
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
