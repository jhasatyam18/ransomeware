// collect data for dashboard
import { JOB_COMPLETION_STATUS } from '../../constants/AppStatus';
import * as Types from '../../constants/actionTypes';
import { REPLICATION_JOB_TYPE } from '../../constants/InputConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { fetchDrPlans } from './DrPlanActions';
import { changeReplicationJobType, fetchRecoveryJobs, fetchReplicationJobs } from './JobActions';
import { addMessage } from './MessageActions';
import { fetchSites } from './SiteActions';
import { hideApplicationLoader, showApplicationLoader } from './UserActions';
import INITIAL_STATE from '../../constants/InitialState';

// TODO : FOR ALPHA RELEASE ONLY
export function fetchDashboardData() {
  return (dispatch) => {
    dispatch(changeReplicationJobType(REPLICATION_JOB_TYPE.VM));
    dispatch(showApplicationLoader('LOADING_DASHBOARD_DATA', 'Loading...'));
    const apis = [dispatch(fetchSites()), dispatch(fetchDrPlans()), dispatch(fetchRecoveryJobs(0)), dispatch(fetchReplicationJobs(0))];
    return Promise.all(apis)
      .then(
        () => {
          dispatch(setDashboardData());
          dispatch(setStatsData());
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

export function setStatsData() {
  return (dispatch, getState) => {
    try {
      const { jobs } = getState();
      const { replication = [], recovery = [] } = jobs;
      let completed = 0;
      let running = 0;
      let failures = 0;
      let testExecutions = 0;
      let fullRecovery = 0;
      let migrations = 0;
      replication.forEach((rep) => {
        const { status = '' } = rep;
        if (status === JOB_COMPLETION_STATUS) {
          completed += 1;
        } else if (status.indexOf('fail') !== -1) {
          failures += 1;
        } else {
          running += 1;
        }
      });
      recovery.forEach((rec) => {
        const { recoveryType = '', status = '' } = rec;
        if (status.indexOf('completed') !== -1) {
          if (recoveryType.indexOf('test') !== -1) {
            testExecutions += 1;
          } else if (recoveryType.indexOf('full') !== -1) {
            fullRecovery += 1;
          } else if (recoveryType.indexOf('migration') !== -1) {
            migrations += 1;
          }
        }
      });
      const replicationStats = { completed, running, failures, copies: 0, changeRate: 0, dataReduction: 0, testExecutions, fullRecovery, migrations };
      dispatch(updateStatInfo(replicationStats));
    } catch (err) {
      dispatch(addMessage(err, MESSAGE_TYPES.ERROR));
      dispatch(updateStatInfo(INITIAL_STATE.dashboard.replicationStats));
    }
  };
}
export function setDashboardData() {
  return (dispatch, getState) => {
    dispatch(hideApplicationLoader('LOADING_DASHBOARD_DATA'));
    try {
      const { drPlans, sites } = getState();
      const { plans = [] } = drPlans;
      // const { replication, recovery } = jobs;
      // set total VMS && Storage
      let storage = 0;
      let vmCount = 0;
      plans.reduce((a, c) => {
        const { protectedEntities } = c;
        const { virtualMachines = [] } = protectedEntities;
        vmCount += virtualMachines.length;
        virtualMachines.forEach((vm) => {
          const { virtualDisks } = vm;
          virtualDisks.forEach((disk) => {
            storage += disk.size;
          });
        });
        return a;
      }, vmCount);
      const titles = { sites: sites.sites.length, protectionPlans: plans.length, vms: vmCount, storage };
      dispatch(updateTitleInfo(titles));
    } catch (error) {
      alert(error);
    }
  };
}

export function updateTitleInfo(titles) {
  return {
    type: Types.DASHBOARD_TILE_DATA,
    titles,
  };
}

export function updateStatInfo(replicationStats) {
  return {
    type: Types.DASHBOARD_STAT_DATA,
    replicationStats,
  };
}
