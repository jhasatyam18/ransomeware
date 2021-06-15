// collect data for dashboard
import * as Types from '../../constants/actionTypes';
import { REPLICATION_JOB_TYPE } from '../../constants/InputConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { changeReplicationJobType } from './JobActions';
import { addMessage } from './MessageActions';
import { hideApplicationLoader, showApplicationLoader } from './UserActions';
import { API_DASHBOARD_TITLE, API_DASHBOARD_REPLICATION_STATS, API_DASHBOARD_RECOVERY_STATS } from '../../constants/ApiConstants';
import { callAPI } from '../../utils/ApiUtils';

export function fetchDashboardTitles() {
  return (dispatch) => {
    dispatch(showApplicationLoader('DASHBOARD_TITLES', 'Loading Dashboard Titles.'));
    return callAPI(API_DASHBOARD_TITLE)
      .then((json) => {
        const { siteCount, protectionPlans, protectedVMs, protectedStorage } = json;
        dispatch(hideApplicationLoader('DASHBOARD_TITLES'));
        const titles = { sites: siteCount, protectionPlans, vms: protectedVMs, storage: protectedStorage };
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
        const { completed, failed, running } = json;
        dispatch(hideApplicationLoader('DASHBOARD_REPLICATION_STATS'));
        const stats = { completed, running, failures: failed, copies: 0, changeRate: 0, dataReduction: 0 };
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
        const { testExecutions, fullRecovery, migrations } = json;
        dispatch(hideApplicationLoader('DASHBOARD_RECOVERY_STATS'));
        const stats = { testExecutions, fullRecovery, migrations };
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
    const apis = [dispatch(fetchDashboardTitles()), dispatch(fetchRecoveryStats()), dispatch(fetchReplicationStats())];
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
