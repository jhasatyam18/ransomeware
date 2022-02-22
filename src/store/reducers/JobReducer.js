import INITIAL_STATE from '../../constants/InitialState';
import * as Types from '../../constants/actionTypes';

export default function jobs(state = INITIAL_STATE.jobs, action) {
  switch (action.type) {
    case Types.FETCH_REPLICATION_JOBS:
      return {
        ...state, replication: action.replication,
      };

    case Types.FETCH_RECOVERY_JOBS:
      return {
        ...state, recovery: action.recovery,
      };

    case Types.CHANGE_REPLICATION_JOB_TYPE:
      return {
        ...state, replicationType: action.jobType,
      };
    case Types.CHANGE_RECOVERY_JOB_TYPE:
      return {
        ...state, recoveryType: action.jobType,
      };
    case Types.RESET_JOBS:
      return INITIAL_STATE.jobs;
    default:
      return state;
  }
}
