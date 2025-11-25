import { addMessage } from './MessageActions';
import { hideApplicationLoader, showApplicationLoader } from './UserActions';
import * as Types from '../../constants/actionTypes';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { API_FETCH_EVENTS } from '../../constants/ApiConstants';
import { callAPI } from '../../utils/ApiUtils';
/**
 * Action to fetch all events
 * @returns
 */
export function fetchEvents() {
  return (dispatch) => {
    dispatch(showApplicationLoader('Fetching_events', 'Loading events...'));
    return callAPI(API_FETCH_EVENTS)
      .then((json) => {
        dispatch(hideApplicationLoader('Fetching_events'));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(eventsFetched(json));
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('Fetching_events'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function eventsFetched(data) {
  return {
    type: Types.FETCH_EVENTS,
    data,
  };
}

export function setSelectedEvent(selected) {
  return {
    type: Types.SELECT_EVENT,
    selected,
  };
}

export function resetEvents() {
  return {
    type: Types.RESET_EVENTS,
  };
}
