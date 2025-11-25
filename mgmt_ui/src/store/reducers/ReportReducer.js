import INITIAL_STATE from '../../constants/InitialState';
import * as Types from '../../constants/actionTypes';

export default function reports(state = INITIAL_STATE.reports, action) {
  switch (action.type) {
    case Types.SET_REPORT_CRITERIA:
      return { ...state, criteria: {}, result: {} };
    case Types.SET_REPORT_OBJECT:
      return { ...state, result: { ...state.result, [action.key]: action.value } };
    case Types.RESET_REPORT:
      return { ...state, criteria: {}, result: {} };
    case Types.FETCH_SCHEDULED_REPORTS:
      return { ...state, scheduledReports: action.scheduledReports };
    case Types.FETCH_SCHEDULED_REPORTS_JOBS:
      return { ...state, scheduledReportsJobs: action.scheduledReportsJobs };
    case Types.SET_SELECTED_SCHEDULE:
      return { ...state, selectedSchedule: action.selectedSchedule };
    default:
      return state;
  }
}
