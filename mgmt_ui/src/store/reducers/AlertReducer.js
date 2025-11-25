import INITIAL_STATE from '../../constants/InitialState';
import * as Types from '../../constants/actionTypes';

export default function alerts(state = INITIAL_STATE.alerts, action) {
  switch (action.type) {
    case Types.FETCH_ALERTS:
      return {
        ...state,
        data: action.data,
        filteredData: action.data,
        selected: {},
      };
    case Types.SELECT_ALERT:
      return { ...state, selected: action.selected, associatedEvent: {} };
    case Types.SELECTED_ALERT_EVENT:
      return { ...state, associatedEvent: action.associatedEvent };
    case Types.FETCH_UNREAD_ALERTS:
      return { ...state, unread: action.unread };
    case Types.FILTER_ALERTS:
      return { ...state, filteredData: action.filteredData };
    case Types.RESET_ALERTS:
      return INITIAL_STATE.alerts;
    default:
      return state;
  }
}
