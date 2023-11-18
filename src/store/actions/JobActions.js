import * as Types from '../../constants/actionTypes';
import { API_PROTECTION_PLAN_RECOVERY_JOBS_STATUS, API_PROTECTION_PLAN_REPLICATION_JOBS_STATUS, API_PROTECTTION_PLAN_REPLICATION_VM_JOBS } from '../../constants/ApiConstants';
import { RECOVERY_JOB_TYPE, REPLICATION_JOB_TYPE, STATIC_KEYS } from '../../constants/InputConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { callAPI } from '../../utils/ApiUtils';
import { addMessage } from './MessageActions';
import { hideApplicationLoader, showApplicationLoader, valueChange } from './UserActions';

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
    dispatch(setReplicationJobs([]));
    const { jobs } = getState();
    const { replicationType } = jobs;
    let url = '';
    let type = '';
    if (replicationType === REPLICATION_JOB_TYPE.DISK || replicationType === REPLICATION_JOB_TYPE.VM) {
      return;
    }
    type = 'protection plan replication';
    url = (id === 0 ? API_PROTECTION_PLAN_REPLICATION_JOBS_STATUS : `${API_PROTECTION_PLAN_REPLICATION_JOBS_STATUS}?protectionplanid=${id}`);
    dispatch(showApplicationLoader('JOBS_DATA', `Loading ${type} jobs...`));
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
    dispatch(setRecoveryJobs([]));
    const { jobs } = getState();
    const { recoveryType } = jobs;
    let url = '';
    let type = '';
    if (recoveryType === RECOVERY_JOB_TYPE.VM) {
      return;
    }
    type = 'protection plan recovery';
    url = (id === 0 ? API_PROTECTION_PLAN_RECOVERY_JOBS_STATUS : `${API_PROTECTION_PLAN_RECOVERY_JOBS_STATUS}?protectionplanid=${id}`);
    dispatch(showApplicationLoader('JOBS_DATA', `Loading ${type} jobs...`));
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

export function resetJobs() {
  return {
    type: Types.RESET_JOBS,
  };
}

export function fetchReplicationJobsByPplanId(pplanID) {
  return (dispatch) => {
    let url = API_PROTECTTION_PLAN_REPLICATION_VM_JOBS;
    url = url.replace('<id>', pplanID);
    return callAPI(url).then((json) => {
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(valueChange(STATIC_KEYS.UI_REPLICATIONJOBS_BY_PPLAN_ID, json.records));
      }
    },
    (err) => {
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}
