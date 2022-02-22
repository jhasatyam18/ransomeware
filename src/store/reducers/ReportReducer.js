import INITIAL_STATE from '../../constants/InitialState';
import * as Types from '../../constants/actionTypes';

export default function reports(state = INITIAL_STATE.reports, action) {
  switch (action.type) {
    case Types.SET_REPORT_CRITERIA:
      return INITIAL_STATE.reports;
    case Types.SET_REPORT_OBJECT:
      return { ...state, result: { ...state.result, [action.key]: action.value } };
    case Types.RESET_REPORT:
      return INITIAL_STATE.reports;
    default:
      return state;
  }
}
