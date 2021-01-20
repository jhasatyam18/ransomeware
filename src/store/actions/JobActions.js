import * as Types from '../../constants/actionTypes';
import { API_PROTECTOIN_PLAN_REPLICATION_JOBS, API_RECOVERY_JOBS, API_RECOVERY_PLAN_RECOVERY_JOBS, API_REPLICATION_JOBS } from '../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { callAPI } from '../../utils/ApiUtils';
import { addMessage } from './MessageActions';
import { hideApplicationLoader, showApplicationLoader } from './UserActions';

export function setReplicationJobs(replication) {
  return {
    type: Types.FETCH_REPLICATION_JOBS,
    replication,
  };
}

export function setRecoveryJobs(recovery) {
  return {
    type: Types.FETCH_RECOVERY_JOBS,
    recovery,
  };
}

export function fetchReplicationJobs(id) {
  return (dispatch) => {
    dispatch(showApplicationLoader('JOBS_DATA', 'Fetching jobs...'));
    dispatch(setReplicationJobs([]));
    const url = (id === 0 ? API_REPLICATION_JOBS : API_PROTECTOIN_PLAN_REPLICATION_JOBS.replace('<id>', id));
    return callAPI(url).then((json) => {
      dispatch(hideApplicationLoader('JOBS_DATA'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(setReplicationJobs(json));
      }
    },
    (err) => {
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

export function fetchRecoveryJobs(id) {
  return (dispatch) => {
    dispatch(showApplicationLoader('JOBS_DATA', 'Fetching jobs...'));
    const url = (id === 0 ? API_RECOVERY_JOBS : API_RECOVERY_PLAN_RECOVERY_JOBS.replace('<id>', id));
    dispatch(setRecoveryJobs([]));
    return callAPI(url).then((json) => {
      dispatch(hideApplicationLoader('JOBS_DATA'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(setRecoveryJobs(json));
      }
    },
    (err) => {
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}
