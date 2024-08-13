import * as Types from '../../constants/actionTypes';
import INITIAL_STATE from '../../constants/InitialState';

export default function jobs(state = INITIAL_STATE.jobs, action) {
  switch (action.type) {
    case Types.FETCH_REPLICATION_JOBS:
      return {
        ...state, replication: action.replication,
      };
    case Types.FETCH_DISK_REPLICATION_JOBS:
      return {
        ...state, diskReplication: action.replication,
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
    case Types.CHANGE_RECOVERY_CHECKPOINT_JOB:
      return {
        ...state, checkpointJobs: action.checkpointJobs,
      };
    case Types.FETCH_RECOVERY_CHECKPOINT:
      return {
        ...state, recoveryCheckpoints: { ...state.recoveryCheckpoints, ...action.recoveryCheckpoints },
      };
    case Types.SELECTED_RECOVERY_CHECKPOINTS:
      return {
        ...state, selectedCheckpoints: action.selectedCheckpoints,
      };
    case Types.VM_RECOVERY_CHECKPOINTS:
      return {
        ...state, vmCheckpoint: action.vmCheckpoint,
      };
    case Types.CHANGE_CHECKPOINT_TYPE:
      return {
        ...state, checkpointType: action.checkpointType,
      };
    case Types.SET_CHECKPOINT_COUNT:
      return {
        ...state, checkpointCount: action.count,
      };
    default:
      return state;
  }
}
