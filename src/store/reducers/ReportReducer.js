import INITIAL_STATE from '../../constants/InitialState';
import * as Types from '../../constants/actionTypes';

export default function reports(state = INITIAL_STATE.reports, action) {
  switch (action.type) {
    case Types.SET_REPORT_CRITERIA:
      return INITIAL_STATE.reports;
    case Types.SET_REPORT_OBJECT:
      return { ...state, result: { ...state.result, [action.key]: action.value } };
    default:
      return state;
  }
}
