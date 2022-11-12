import i18n from 'i18next';
import { getValue } from '../../utils/InputUtils';
import { MODAL_NODE_PASSWORD_CHANGE } from '../../constants/Modalconstant';
import * as Types from '../../constants/actionTypes';
import { API_ACKNOWLEDGE_ALERT, API_ACKNOWLEDGE_NODE_ALERT, API_ALERT_TAKE_VM_ACTION, API_FETCH_ALERTS, API_FETCH_DR_PLAN_BY_ID, API_FETCH_EVENT_BY_ID, API_FETCH_UNREAD_ALERTS, API_NODE_ALERTS } from '../../constants/ApiConstants';
import { EVENT_LEVELS, PPLAN_EVENTS, MONITOR_NODE_AUTH, VM_CONFIG_ACTION_EVENT, VM_DISK_ACTION_EVENT } from '../../constants/EventConstant';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { drPlanDetailsFetched, initReconfigureProtectedVM, openEditProtectionPlanWizard } from './DrPlanActions';
import { addMessage } from './MessageActions';
import { closeModal, openModal } from './ModalActions';
import { hideApplicationLoader, refresh, showApplicationLoader, valueChange } from './UserActions';

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

export function acknowledgeNodeAlert(alert) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    dispatch(showApplicationLoader('ACKNOWLEDGING_ALERT', i18n.t('succes.ackn.alert')));
    const obj = createPayload(API_TYPES.POST, alert);
    const alertStr = getValue('ui.ack.node.alerts.id', values);
    const URL = API_ACKNOWLEDGE_NODE_ALERT.replace('<alertid>', alertStr);
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
    if (PPLAN_EVENTS.indexOf(associatedEvent.type) !== -1) {
      dispatch(closeModal());
      dispatch(initEditPlanAction(associatedEvent, alert));
    }
    if (MONITOR_NODE_AUTH.indexOf(associatedEvent.type) !== -1) {
      dispatch(closeModal());
      dispatch(resetSystemCredentials(associatedEvent, alert));
    }
  };
}

export function resetSystemCredentials(associatedEvent, alert) {
  return (dispatch) => {
    let { impactedObjectURNs } = associatedEvent;
    impactedObjectURNs = impactedObjectURNs.split(':');
    let options = '';
    let nodeID = '';
    if (impactedObjectURNs.length > 2) {
      const nodeName = impactedObjectURNs[impactedObjectURNs.length - 2];
      nodeID = impactedObjectURNs[impactedObjectURNs.length - 1];
      options = { title: i18n.t('title.system.cred'), nodeName, nodeID };
    } else {
      dispatch(addMessage(i18n.t('error.ackn.pplan.alert'), MESSAGE_TYPES.ERROR));
    }
    dispatch(valueChange('user.newPassword', ''));
    dispatch(valueChange('user.confirmPassword', ''));
    const api = [dispatch(getAssociatedNodeAlerts(nodeID, alert.id))];
    return Promise.all(api).then(() => {
      dispatch(openModal(MODAL_NODE_PASSWORD_CHANGE, options));
    }, (err) => {
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
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
          dispatch(refresh());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('VM_ACTION'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function getAssociatedNodeAlerts(nodeID, alertID) {
  return (dispatch) => {
    let url = API_NODE_ALERTS.replace('<id>', nodeID);
    url = url.replace('<alertid>', alertID);
    return callAPI(url)
      .then((json) => {
        dispatch(hideApplicationLoader('NODE_ALERTS'));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          const idStr = json.map((el) => el.id);
          dispatch(valueChange('ui.ack.node.alerts.id', idStr.join(',')));
          dispatch(valueChange('ui.vm.alerts', json));
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('NODE_ALERTS'));
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
