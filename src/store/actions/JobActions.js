import { RECOVERY_JOB_TYPE, REPLICATION_JOB_TYPE } from '../../constants/InputConstants';
import * as Types from '../../constants/actionTypes';
import { API_PROTECTOIN_PLAN_REPLICATION_JOBS, API_RECOVERY_JOBS, API_PROTECTION_PLAN_RECOVERY_JOBS_STATUS, API_RECOVERY_PLAN_RECOVERY_JOBS, API_REPLICATION_JOBS, API_REPLICATION_VM_JOBS, API_PROTECTTION_PLAN_REPLICATION_VM_JOBS, API_PROTECTION_PLAN_REPLICATION_JOBS_STATUS } from '../../constants/ApiConstants';
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

export function changeReplicationJobType(jobType) {
  return {
    type: Types.CHANGE_REPLICATION_JOB_TYPE,
    jobType,
  };
}

export function fetchReplicationJobs(id) {
  return (dispatch, getState) => {
    dispatch(showApplicationLoader('JOBS_DATA', 'Loading jobs...'));
    dispatch(setReplicationJobs([]));
    const { jobs } = getState();
    const { replicationType } = jobs;
    let url = '';
    if (replicationType === REPLICATION_JOB_TYPE.DISK) {
      url = (id === 0 ? API_REPLICATION_JOBS : API_PROTECTOIN_PLAN_REPLICATION_JOBS.replace('<id>', id));
    } else if (replicationType === REPLICATION_JOB_TYPE.VM) {
      url = (id === 0 ? API_REPLICATION_VM_JOBS : API_PROTECTTION_PLAN_REPLICATION_VM_JOBS.replace('<id>', id));
    } else {
      url = API_PROTECTION_PLAN_REPLICATION_JOBS_STATUS;
    }
    return callAPI(url).then((json) => {
      dispatch(hideApplicationLoader('JOBS_DATA'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(setReplicationJobs(json));
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('JOBS_DATA'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

export function fetchRecoveryJobs(id) {
  return (dispatch, getState) => {
    dispatch(showApplicationLoader('JOBS_DATA', 'Loading jobs...'));
    dispatch(setRecoveryJobs([]));
    const { jobs } = getState();
    const { recoveryType } = jobs;
    let url = '';
    if (recoveryType === RECOVERY_JOB_TYPE.VM) {
      url = (id === 0 ? API_RECOVERY_JOBS : API_RECOVERY_PLAN_RECOVERY_JOBS.replace('<id>', id));
    } else {
      url = API_PROTECTION_PLAN_RECOVERY_JOBS_STATUS;
    }
    return callAPI(url).then((json) => {
      dispatch(hideApplicationLoader('JOBS_DATA'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(setRecoveryJobs(json));
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('JOBS_DATA'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

export function changeRecoveryJobType(jobType) {
  return {
    type: Types.CHANGE_RECOVERY_JOB_TYPE,
    jobType,
  };
}
