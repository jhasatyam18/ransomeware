import INITIAL_STATE from '../../constants/InitialState';
import * as Types from '../../constants/actionTypes';

export default function events(state = INITIAL_STATE.events, action) {
  switch (action.type) {
    case Types.FETCH_EVENTS:
      return {
        data: action.data,
        selected: {},
        filteredData: action.data,
      };
    case Types.SELECT_EVENT:
      return { ...state, selected: action.selected };
    case Types.FILTER_EVENTS:
      return { ...state, filteredData: action.filteredData };
    case Types.RESET_EVENTS:
      return INITIAL_STATE.events;
    default:
      return state;
  }
}
