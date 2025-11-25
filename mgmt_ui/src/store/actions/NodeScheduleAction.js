import { NODE_UPDATE_SCHEDULER } from '../../constants/RouterConstants';
import * as Types from '../../constants/actionTypes';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { addMessage } from './MessageActions';
import { closeModal } from './ModalActions';
import { hideApplicationLoader, showApplicationLoader, valueChange } from './UserActions';
import { API_DAYS_LATER, API_FETCH_SCHEDULED_NODE, API_SCHEDULED_NODE, API_TIME_ZONE } from '../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { STORE_KEYS } from '../../constants/StoreKeyConstants';

export function fetchScheduledNodeData(data) {
  return {
    type: Types.FETCH_SCHEDULED_NODES,
    data,
  };
}

export function fetchSheduledNodes() {
  return (dispatch) => {
    dispatch(showApplicationLoader(API_FETCH_SCHEDULED_NODE, 'loading users'));
    return callAPI(API_FETCH_SCHEDULED_NODE)
      .then((json) => {
        dispatch(hideApplicationLoader(API_FETCH_SCHEDULED_NODE));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(fetchScheduledNodeData(json));
          dispatch(setSelectedScheduledNodes([]));
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(API_FETCH_SCHEDULED_NODE));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function setSelectedScheduledNodes(selectedScheduledNodes) {
  return {
    type: Types.SET_SELECTED_SCEDULED_NODES,
    selectedScheduledNodes,
  };
}
export function setSelectedCreateScheduledNodes(selectedScheduledNodes) {
  return {
    type: Types.SET_SELECTED_CREATE_SCEDULED_NODES,
    selectedScheduledNodes,
  };
}

export function handleNodeScheduleTableSelection(data, isSelected, primaryKey) {
  return (dispatch, getState) => {
    const { settings } = getState();
    const { selectedScheduledNodes } = settings;
    if (isSelected) {
      if (!selectedScheduledNodes || selectedScheduledNodes.length === 0 || !selectedScheduledNodes[data[primaryKey]]) {
        const newNode = { ...selectedScheduledNodes, [data[primaryKey]]: data };
        dispatch(setSelectedScheduledNodes(newNode));
      }
    } else if (selectedScheduledNodes[data[primaryKey]]) {
      const newNode = selectedScheduledNodes;
      delete newNode[data[primaryKey]];
      dispatch(setSelectedScheduledNodes(newNode));
    }
  };
}

export function handleCreateNodeScheduleSelection(data, isSelected, primaryKey) {
  return (dispatch, getState) => {
    const { settings } = getState();
    const { selectedCreateScheduledNodes } = settings;
    if (isSelected) {
      if (!selectedCreateScheduledNodes || selectedCreateScheduledNodes.length === 0 || !selectedCreateScheduledNodes[data[primaryKey]]) {
        const newNode = { ...selectedCreateScheduledNodes, [data[primaryKey]]: data };
        dispatch(setSelectedCreateScheduledNodes(newNode));
      }
    } else if (selectedCreateScheduledNodes[data[primaryKey]]) {
      const newNode = selectedCreateScheduledNodes;
      delete newNode[data[primaryKey]];
      dispatch(setSelectedCreateScheduledNodes(newNode));
    }
  };
}

export function configureSchedule(payload, isUpdate = false, history, uuid = null) {
  return (dispatch) => {
    let url = API_SCHEDULED_NODE;
    if (isUpdate) {
      url = `${url}/${uuid}`;
    }
    const obj = createPayload(isUpdate ? API_TYPES.PUT : API_TYPES.POST, payload);
    dispatch(showApplicationLoader('configure-schedule', 'Creating Schedule...'));
    return callAPI(url, obj).then((json) => {
      dispatch(hideApplicationLoader('configure-schedule'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(addMessage('Schedule configuration successful', MESSAGE_TYPES.SUCCESS));
        dispatch(fetchSheduledNodes());
        dispatch(setSelectedCreateScheduledNodes([]));
        history(NODE_UPDATE_SCHEDULER);
        dispatch(valueChange(STORE_KEYS.UI_SCHEDULE_WORKFLOW, ''));
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('configure-schedule'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

export function removeSchedule(id) {
  return (dispatch) => {
    dispatch(showApplicationLoader(`${API_SCHEDULED_NODE}-${id}`, 'Removing Schedule'));
    const obj = createPayload(API_TYPES.DELETE, {});
    return callAPI(`${API_SCHEDULED_NODE}/${id}`, obj)
      .then((json) => {
        dispatch(hideApplicationLoader(`${API_SCHEDULED_NODE}-${id}`));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(addMessage('Schedule removed successfully', MESSAGE_TYPES.INFO));
          dispatch(fetchSheduledNodes());
          dispatch(setSelectedScheduledNodes([]));
          dispatch(closeModal());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(`${API_SCHEDULED_NODE}-${id}`));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function enableNodeSchedule(id) {
  return (dispatch, getState) => {
    const { settings } = getState();
    const { selectedScheduledNodes } = settings;
    const selectedScheduleObj = Object.values(selectedScheduledNodes)[0];
    selectedScheduleObj.status = 'Enabled';
    dispatch(showApplicationLoader(`${API_SCHEDULED_NODE}-${id}`, 'Changing schedule to enable'));
    const obj = createPayload(API_TYPES.PUT, selectedScheduleObj);
    return callAPI(`${API_SCHEDULED_NODE}/${id}`, obj)
      .then((json) => {
        dispatch(hideApplicationLoader(`${API_SCHEDULED_NODE}-${id}`));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(addMessage('Schedule status changed successfully to enable', MESSAGE_TYPES.INFO));
          dispatch(fetchSheduledNodes());
          dispatch(closeModal());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(`${API_SCHEDULED_NODE}-${id}`));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}
export function disableNodeSchedule(id) {
  return (dispatch, getState) => {
    const { settings } = getState();
    const { selectedScheduledNodes } = settings;
    const selectedScheduleObj = Object.values(selectedScheduledNodes)[0];
    selectedScheduleObj.status = 'Disabled';
    dispatch(showApplicationLoader(`${API_SCHEDULED_NODE}-${id}`, 'Changing schedule to disable'));
    const obj = createPayload(API_TYPES.PUT, selectedScheduleObj);
    return callAPI(`${API_SCHEDULED_NODE}/${id}`, obj)
      .then((json) => {
        dispatch(hideApplicationLoader(`${API_SCHEDULED_NODE}-${id}`));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(addMessage('Schedule status changed successfully to disable', MESSAGE_TYPES.INFO));
          dispatch(fetchSheduledNodes());
          dispatch(closeModal());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(`${API_SCHEDULED_NODE}-${id}`));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function getTimeZones() {
  const url = API_TIME_ZONE || '';
  return (dispatch) => {
    if (url !== '') {
      return callAPI(url)
        .then((json) => {
          if (json && json.hasError) {
            dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
          } else {
            let data = json;
            if (data === null) {
              data = [];
            }
            dispatch(valueChange(STORE_KEYS.UI_SCHEDULE_TIME_ZONE_OPTIONS, data));
          }
        },
        (err) => {
          dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
        });
    }
  };
}
export function getScheduleDaysLater() {
  const url = API_DAYS_LATER || '';
  return (dispatch) => {
    if (url !== '') {
      return callAPI(url)
        .then((json) => {
          if (json && json.hasError) {
            dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
          } else {
            let data = json;
            if (data === null) {
              data = [];
            }
            dispatch(valueChange(STORE_KEYS.UI_SCHEDULE_DAYS_LATER_OPTION, data));
          }
        },
        (err) => {
          dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
        });
    }
  };
}
