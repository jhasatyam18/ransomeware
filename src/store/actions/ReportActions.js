import * as Types from '../../constants/actionTypes';
import { API_FETCH_ALERTS, API_FETCH_DR_PLANS, API_FETCH_DR_PLAN_BY_ID, API_FETCH_EVENTS, API_FETCH_SITES, API_NODES, API_PROTECTION_PLAN_REPLICATION_JOBS_STATUS, API_PROTECTTION_PLAN_REPLICATION_VM_JOBS, API_RECOVERY_JOBS, API_RECOVERY_PLAN_RECOVERY_JOBS, API_REPLICATION_VM_JOBS, API_UPDAT_RECOVERY_CHECKPOINT_BY_ID } from '../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { callAPI } from '../../utils/ApiUtils';
import { getAppDateFormat } from '../../utils/AppUtils';
import { getValue } from '../../utils/InputUtils';
import { addFooters, addHeaderPage, exportDoc, createPDFDoc, systemOverview, addTableFromData, getStartDate } from '../../utils/ReportUtils';
import { fetchDashboardTitles, fetchRecoveryStats, fetchReplicationStats } from './DashboardActions';
import { addMessage } from './MessageActions';
import { hideApplicationLoader, showApplicationLoader } from './UserActions';
import { API_MAX_RECORD_LIMIT } from '../../constants/UserConstant';
import { ALERTS_COLUMNS, EVENTS_COLUMNS, NODE_COLUMNS, PROTECTED_VMS_COLUMNS, PROTECTION_PLAN_COLUMNS, RECOVERY_JOB_COLUMNS, REPLICATION_JOB_COLUMNS, SITE_COLUMNS, TABLE_REPORTS_CHECKPOINTS } from '../../constants/TableConstants';
import { REPORT_DURATION, STATIC_KEYS } from '../../constants/InputConstants';

export function generateAuditReport() {
  return (dispatch, getState) => {
    const { user } = getState();
    const criteria = getCriteria(user);
    dispatch(resetReport());
    const apis = getRequiredReportObjects(criteria, dispatch);
    dispatch(showApplicationLoader('AUDIT_REPORT', 'Generating audit report...'));
    return Promise.all(apis)
      .then(
        () => {
          dispatch(hideApplicationLoader('AUDIT_REPORT'));
          return new Promise((resolve) => resolve());
        },
        (err) => {
          dispatch(addMessage(err, MESSAGE_TYPES.ERROR));
          dispatch(hideApplicationLoader('AUDIT_REPORT'));
          return new Promise((resolve) => resolve());
        },
      );
  };
}

/**
 * @returns Fetch and set sites info for report
 */
export function reportFetchSites(id) {
  return (dispatch) => {
    if (isPlanSpecificData(id)) {
      return;
    }
    callAPI(API_FETCH_SITES)
      .then((json) => {
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(setReportObject('sites', json));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * @returns Fetch and set node info for report
 */
export function reportFetchNodes() {
  return (dispatch) => (
    callAPI(API_NODES)
      .then((json) => {
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(setReportObject('nodes', json));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      })
  );
}

/**
 * @returns Fetch and set protection plan info for report
 */
export function reportFetchPlans(id) {
  return (dispatch) => {
    const isPlanSpecific = isPlanSpecificData(id);
    const url = (isPlanSpecific ? API_FETCH_DR_PLAN_BY_ID.replace('<id>', id) : API_FETCH_DR_PLANS);
    callAPI(url)
      .then((json) => {
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          const data = isPlanSpecific ? [json] : json;
          if (isPlanSpecific && data.length > 0) {
            const { protectedSite, recoverySite } = data[0];
            dispatch(setReportObject('sites', [protectedSite, recoverySite]));
          }
          dispatch(setReportObject('plans', data));
          dispatch(setProtectedVMs(data, id));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * @returns Fetch and set events info for report
 */
export function reportFetchEvents(data = [], offSet = 0, criteria) {
  const { startDate, endDate } = criteria;
  const url = `${API_FETCH_EVENTS}?offset=${offSet}&limit=${API_MAX_RECORD_LIMIT}&starttime=${startDate}&endtime=${endDate}`;
  return (dispatch) => (
    callAPI(url)
      .then((json) => {
        if (json.hasNext === true) {
          dispatch(reportFetchEvents([...data, ...json.records], json.nextOffset, criteria));
        } else {
          dispatch(setReportObject('events', [...data, ...json.records]));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      })
  );
}

/**
 * @returns Fetch and set alerts info for report
 */
export function reportFetchAlerts(data = [], offSet = 0, criteria) {
  const { startDate, endDate } = criteria;
  const url = `${API_FETCH_ALERTS}?offset=${offSet}&limit=${API_MAX_RECORD_LIMIT}&starttime=${startDate}&endtime=${endDate}`;
  return (dispatch) => (
    callAPI(url)
      .then((json) => {
        if (json.hasNext === true) {
          dispatch(reportFetchAlerts([...data, ...json.records], json.nextOffset, criteria));
        } else {
          dispatch(setReportObject('alerts', [...data, ...json.records]));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      })
  );
}

/**
 * @returns Fetch and set replication job info for report
 */
export function reportFetchReplicationJobs(id, data = [], offset = 0, criteria = {}, limit, totalFetched = 0) {
  return (dispatch) => {
    const { startDate, endDate } = criteria;
    const url = (isPlanSpecificData(id) ? `${API_PROTECTTION_PLAN_REPLICATION_VM_JOBS.replace('<id>', id)}&limit=${API_MAX_RECORD_LIMIT}&offset=${offset}&starttime=${startDate}&endtime=${endDate}` : `${API_REPLICATION_VM_JOBS}?limit=${limit || API_MAX_RECORD_LIMIT}&offset=${offset}&starttime=${startDate}&endtime=${endDate}`);
    dispatch(showApplicationLoader('replication_report', 'generating replications'));
    callAPI(url)
      .then((json) => {
        if (json.hasNext === true) {
          const tFetched = totalFetched + json.limit;
          dispatch(reportFetchReplicationJobs(id, [...data, ...json.records], json.nextOffset, criteria, limit, tFetched));
        } else {
          dispatch(setReportObject('replication', [...data, ...json.records]));
          dispatch(hideApplicationLoader('replication_report', 'Generating audit report...'));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * @returns Fetch and set recovery job info for report
 */
export function reportFetchRecoveryJobs(id, data = [], offset = 0, criteria = {}) {
  return (dispatch) => {
    const { startDate, endDate } = criteria;
    const url = (isPlanSpecificData(id) ? `${API_RECOVERY_PLAN_RECOVERY_JOBS.replace('<id>', id)}&limit=${API_MAX_RECORD_LIMIT}&offset=${offset}&starttime=${startDate}&endtime=${endDate}` : `${API_RECOVERY_JOBS}?limit=${API_MAX_RECORD_LIMIT}&offset=${offset}&starttime=${startDate}&endtime=${endDate}`);
    callAPI(url)
      .then((json) => {
        if (json.hasNext === true) {
          dispatch(reportFetchRecoveryJobs(id, [...data, ...json.records], json.nextOffset, criteria));
        } else {
          dispatch(setReportObject('recovery', [...data, ...json.records]));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * @param {*} data
 * @returns set protected vm details for report
 */
export function setProtectedVMs(pPlans, id) {
  return (dispatch, getState) => {
    dispatch(setReportObject('protectedVMS', []));
    const { user } = getState();
    const criteria = getCriteria(user);
    const { startDate, endDate } = criteria;
    if (!criteria.includeProtectedVMS) {
      return;
    }
    const url = `${API_PROTECTION_PLAN_REPLICATION_JOBS_STATUS}?starttime=${startDate}&endtime=${endDate}`;
    callAPI(url)
      .then((json) => {
        if ((json && isPlanSpecificData(id)) || (json && json.length > 0 && json.length === pPlans.length)) {
          const protectedVMS = [];
          try {
            pPlans.forEach((plan) => {
              // get protected vms
              const { protectedEntities = { } } = plan;
              const { virtualMachines = [] } = protectedEntities;
              // get replication vms for plan
              const replicationPlan = json.filter((rp) => rp.id === plan.id);
              if (replicationPlan.length > 0) {
                const { vms = [] } = replicationPlan[0];
                // if replication and protected vm info available
                if (virtualMachines.length > 0 && vms.length > 0) {
                  virtualMachines.forEach((vm) => {
                    const replicationVM = vms.filter((rm) => rm.name === vm.name);
                    if (replicationVM.length > 0) {
                      const protectedVM = { ...vm, ...replicationVM[0], planName: plan.name };
                      protectedVMS.push(protectedVM);
                    }
                  });
                }
              }
            });
          } catch (error) {
            dispatch(addMessage('Error occurred while processing protected virtual machines', MESSAGE_TYPES.WARNING));
          }
          dispatch(setReportObject('protectedVMS', protectedVMS));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function setReportObject(key, value) {
  return {
    type: Types.SET_REPORT_OBJECT,
    key,
    value,
  };
}

export function setReportCriteria(criteria) {
  return {
    type: Types.SET_REPORT_CRITERIA,
    criteria,
  };
}

export function resetReport() {
  return {
    type: Types.RESET_REPORT,
  };
}

function getRequiredReportObjects(criteria, dispatch) {
  const apis = [dispatch(reportFetchSites(criteria.protectionPlanID)), dispatch(reportFetchPlans(criteria.protectionPlanID))];
  if (criteria.includeSystemOverView) {
    apis.push(dispatch(fetchRecoveryStats()));
    apis.push(dispatch(fetchReplicationStats()));
    apis.push(dispatch(fetchDashboardTitles()));
  }
  if (criteria.includeNodes) {
    apis.push(dispatch(reportFetchNodes()));
  }
  if (criteria.includeEvents) {
    apis.push(dispatch(reportFetchEvents([], 0, criteria)));
  }
  if (criteria.includeAlerts) {
    apis.push(dispatch(reportFetchAlerts([], 0, criteria)));
  }
  if (criteria.includeReplicationJobs) {
    apis.push(dispatch(reportFetchReplicationJobs(criteria.protectionPlanID, [], 0, criteria)));
  }
  if (criteria.includeRecoveryJobs) {
    apis.push(dispatch(reportFetchRecoveryJobs(criteria.protectionPlanID, [], 0, criteria)));
  }
  if (criteria.includeCheckpoints) {
    apis.push(dispatch(reportFetchCheckpoints(criteria.protectionPlanID, [], 0, criteria)));
  }
  return apis;
}

export function getCriteria(user) {
  const { values } = user;
  let startDate = new Date(getValue(STATIC_KEYS.REPORT_DURATION_START_DATE, values));
  startDate.setHours(0, 0, 0, 0); // setting start date time to 12AM
  let endDate = new Date(getValue(STATIC_KEYS.REPORT_DURATION_END_DATE, values));
  if (endDate.toDateString() !== new Date().toDateString()) {
    endDate.setHours(23, 59, 59, 999); // Setting end date time to 11:59 PM if end date is not today
  }
  const durationType = getValue(STATIC_KEYS.REPORT_DURATION_TYPE, values);

  switch (durationType) {
    case REPORT_DURATION.CUSTOM:
      startDate = startDate.getTime();
      endDate = endDate.getTime();
      break;
    case REPORT_DURATION.WEEK:
      startDate = getStartDate(REPORT_DURATION.WEEK);
      endDate = new Date().getTime();
      break;
    case REPORT_DURATION.MONTH:
      startDate = getStartDate(REPORT_DURATION.MONTH);
      endDate = new Date().getTime();
      break;
    case REPORT_DURATION.YEAR:
      startDate = getStartDate(REPORT_DURATION.YEAR);
      endDate = new Date().getTime();
      break;
    default:
      break;
  }

  const startTimeInSecond = Math.floor(startDate / 1000);
  const endTimeInSecond = Math.floor(endDate / 1000);

  return {
    startDate: startTimeInSecond,
    endDate: endTimeInSecond,
    includeSystemOverView: getValue('report.system.includeSystemOverView', values),
    includeNodes: getValue('report.system.includeNodes', values),
    includeEvents: getValue('report.system.includeEvents', values),
    includeAlerts: getValue('report.system.includeAlerts', values),
    includeReplicationJobs: getValue('report.protectionPlan.includeReplicationJobs', values),
    includeRecoveryJobs: getValue('report.protectionPlan.includeRecoveryJobs', values),
    includeProtectedVMS: getValue('report.protectionPlan.includeProtectedVMS', values),
    protectionPlanID: getValue('report.protectionPlan.protectionPlans', values),
    durationType: getValue(STATIC_KEYS.REPORT_DURATION_TYPE, values),
    includeCheckpoints: getValue('report.protectionPlan.includeCheckpoints', values),
  };
}

export function exportReportToPDF() {
  return (dispatch, getState) => {
    const { user, dashboard, reports } = getState();
    const { result } = reports;
    const { protectedVMS, replication, plans, sites, nodes, events, alerts, recovery } = result;
    try {
      const criteria = getCriteria(user, dispatch);
      const doc = createPDFDoc();
      addHeaderPage(doc, criteria.startDate, criteria.endDate);
      if (criteria.includeSystemOverView) {
        doc.addPage();
        systemOverview(doc, dashboard);
      }
      const planColumn = PROTECTION_PLAN_COLUMNS;
      const siteColumn = SITE_COLUMNS;
      addTableFromData(doc, planColumn, 'Protection Plans', plans);
      addTableFromData(doc, siteColumn, 'Sites', sites);
      if (criteria.includeNodes) {
        const columns = NODE_COLUMNS;
        addTableFromData(doc, columns, 'Nodes', nodes);
      }
      if (criteria.includeProtectedVMS) {
        const columns = PROTECTED_VMS_COLUMNS;
        addTableFromData(doc, columns, 'Protected Machines', protectedVMS);
      }
      if (criteria.includeEvents) {
        const columns = EVENTS_COLUMNS;
        addTableFromData(doc, columns, 'Events', events);
      }
      if (criteria.includeAlerts) {
        const columns = ALERTS_COLUMNS;
        addTableFromData(doc, columns, 'Alerts', alerts);
      }
      if (criteria.includeReplicationJobs) {
        const columns = REPLICATION_JOB_COLUMNS;
        addTableFromData(doc, columns, 'Replication Jobs', replication);
      }
      if (criteria.includeRecoveryJobs) {
        const columns = RECOVERY_JOB_COLUMNS;
        addTableFromData(doc, columns, 'Recovery Jobs', recovery);
      }
      if (criteria.includeCheckpoints) {
        const columns = TABLE_REPORTS_CHECKPOINTS;
        addTableFromData(doc, columns, 'Point In Time Checkpoints', result.point_in_time_checkpoints);
      }
      const d = new Date();
      addFooters(doc);
      exportDoc(doc, `Datamotive-report-${getAppDateFormat(d, true)}`);
    } catch (error) {
      dispatch(hideApplicationLoader('PDF_REPORT'));
      dispatch(addMessage(error, MESSAGE_TYPES.ERROR));
    }
  };
}

function isPlanSpecificData(id) {
  return !(`${id}` === '0' || `${id}` === '');
}

export function reportFetchCheckpoints(id, data = [], offset = 0, criteria = {}, limit, totalFetched = 0) {
  return (dispatch) => {
    const { startDate, endDate } = criteria;
    const apiQuery = `limit=${limit || API_MAX_RECORD_LIMIT}&offset=${offset}&starttime=${startDate}&endtime=${endDate}`;
    const url = isPlanSpecificData(id) ? `${API_UPDAT_RECOVERY_CHECKPOINT_BY_ID}?planID=${id}&${apiQuery}` : `${API_UPDAT_RECOVERY_CHECKPOINT_BY_ID}?${apiQuery}`;
    dispatch(showApplicationLoader('report_checkpoints', 'generating checkpoints'));
    callAPI(url)
      .then((json) => {
        if (json.hasNext === true) {
          const tFetched = totalFetched + json.limit;
          dispatch(reportFetchCheckpoints(id, [...data, ...json.records], json.nextOffset, criteria, limit, tFetched));
        } else {
          dispatch(setReportObject('point_in_time_checkpoints', [...data, ...json.records]));
          dispatch(hideApplicationLoader('report_checkpoints', 'Generating audit report...'));
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('report_checkpoints', 'Generating audit report...'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}
