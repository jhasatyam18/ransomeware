// collect data for dashboard
import * as Types from '../../constants/actionTypes';
import { REPLICATION_JOB_TYPE } from '../../constants/InputConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { changeReplicationJobType, fetchRecoveryJobs, fetchReplicationJobs } from './JobActions';
import { addMessage } from './MessageActions';
import { hideApplicationLoader, showApplicationLoader } from './UserActions';
import { API_DASHBOARD_TITLE, API_DASHBOARD_REPLICATION_STATS, API_DASHBOARD_RECOVERY_STATS, API_DASHBOARD_VIRTUAL_MACHINE_PROTECTION_ANALYSIS_PROTECTED_VMS, API_DASHBOARD_NODE_STATS } from '../../constants/ApiConstants';
import { callAPI } from '../../utils/ApiUtils';

export function fetchDashboardTitles() {
  return (dispatch) => {
    dispatch(showApplicationLoader('DASHBOARD_TITLES', 'Loading Dashboard Titles.'));
    return callAPI(API_DASHBOARD_TITLE)
      .then((json) => {
        const { siteCount, protectionPlans, protectedVMs, protectedStorage, siteConnections, siteDetails } = json;
        dispatch(hideApplicationLoader('DASHBOARD_TITLES'));
        const titles = { sites: siteCount, protectionPlans, vms: protectedVMs, storage: protectedStorage, siteConnections, siteDetails };
        dispatch(updateTitleInfo(titles));
      },
      (err) => {
        dispatch(hideApplicationLoader('DASHBOARD_TITLES'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function fetchReplicationStats() {
  return (dispatch) => {
    dispatch(showApplicationLoader('DASHBOARD_REPLICATION_STATS', 'Loading Replication Statistics.'));
    return callAPI(API_DASHBOARD_REPLICATION_STATS)
      .then((json) => {
        const { completed = 0, failed = 0, running = 0, rpo = 0, inSync = 0, notInsync = 0, dataReduction = 0, changedData = 0 } = json;
        dispatch(hideApplicationLoader('DASHBOARD_REPLICATION_STATS'));
        const stats = { completed, running, failures: failed, copies: 0, changeRate: 0, dataReduction, rpo, inSync, notInsync, changedData };
        dispatch(updateReplicationStat(stats));
      },
      (err) => {
        dispatch(hideApplicationLoader('DASHBOARD_REPLICATION_STATS'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function fetchRecoveryStats() {
  return (dispatch) => {
    dispatch(showApplicationLoader('DASHBOARD_RECOVERY_STATS', 'Loading Recovery Statistics.'));
    return callAPI(API_DASHBOARD_RECOVERY_STATS)
      .then((json) => {
        const { testExecutions, fullRecovery, migrations, rto } = json;
        dispatch(hideApplicationLoader('DASHBOARD_RECOVERY_STATS'));
        const stats = { testExecutions, fullRecovery, migrations, rto };
        dispatch(updateRecoveryStat(stats));
      },
      (err) => {
        dispatch(hideApplicationLoader('DASHBOARD_RECOVERY_STATS'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

// TODO : FOR ALPHA RELEASE ONLY
export function fetchDashboardData() {
  return (dispatch) => {
    dispatch(changeReplicationJobType(REPLICATION_JOB_TYPE.VM));
    dispatch(showApplicationLoader('LOADING_DASHBOARD_DATA', 'Loading...'));
    const apis = [dispatch(fetchDashboardTitles()), dispatch(fetchRecoveryStats()), dispatch(fetchReplicationStats()), dispatch(fetchRecoveryJobs(0)), dispatch(fetchReplicationJobs(0)), dispatch(fetchProtectedVMStat()), dispatch(fetchNodeInfoStat())];
    return Promise.all(apis)
      .then(
        () => {
          dispatch(hideApplicationLoader('LOADING_DASHBOARD_DATA'));
          return new Promise((resolve) => resolve());
        },
        (err) => {
          dispatch(addMessage(err, MESSAGE_TYPES.ERROR));
          hideApplicationLoader('LOADING_DASHBOARD_DATA');
          return new Promise((resolve) => resolve());
        },
      );
  };
}

export function fetchProtectedVMStat() {
  return (dispatch) => {
    dispatch(showApplicationLoader('DASHBOARD_PROTECTED_VM_STATS', 'Loading Protected VM Statistics.'));
    return callAPI(API_DASHBOARD_VIRTUAL_MACHINE_PROTECTION_ANALYSIS_PROTECTED_VMS)
      .then((json) => {
        const { protectedVMs, unprotectedVMs } = json;
        dispatch(hideApplicationLoader('DASHBOARD_PROTECTED_VM_STATS'));
        const stats = { protectedVMs, unprotectedVMs };
        dispatch(updateProtectedVMStat(stats));
      },
      (err) => {
        dispatch(hideApplicationLoader('DASHBOARD_PROTECTED_VM_STATS'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function fetchNodeInfoStat() {
  return (dispatch) => {
    dispatch(showApplicationLoader('DASHBOARD_NODE_INFO_STATS', 'Loading Node Info Statistics.'));
    return callAPI(API_DASHBOARD_NODE_STATS)
      .then((json) => {
        dispatch(hideApplicationLoader('DASHBOARD_NODE_INFO_STATS'));
        dispatch(updateNodeInfoStat(json));
      },
      (err) => {
        dispatch(hideApplicationLoader('DASHBOARD_NODE_INFO_STATS'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function updateTitleInfo(titles) {
  return {
    type: Types.DASHBOARD_TILE_DATA,
    titles,
  };
}

export function updateReplicationStat(replicationStats) {
  return {
    type: Types.DASHBOARD_REPLICATION_STAT,
    replicationStats,
  };
}

export function updateRecoveryStat(recoveryStats) {
  return {
    type: Types.DASHBOARD_FETCH_DR_PLAN_DETAILS,
    recoveryStats,
  };
}

export function resetDashboard() {
  return {
    type: Types.RESET_DASHBOARD,
  };
}

export function updateProtectedVMStat(protectedVMStat) {
  return {
    type: Types.DASHBOARD_PROTECTED_VM_STAT,
    protectedVMStat,
  };
}

export function updateNodeInfoStat(nodeInfoStat) {
  return {
    type: Types.DASHBOARD_NODE_INFO_STAT,
    nodeInfoStat,
  };
}
