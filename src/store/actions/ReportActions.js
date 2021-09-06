import * as Types from '../../constants/actionTypes';
import { API_FETCH_ALERTS, API_FETCH_DR_PLANS, API_FETCH_EVENTS, API_FETCH_SITES, API_NODES, API_PROTECTION_PLAN_REPLICATION_JOBS_STATUS, API_RECOVERY_JOBS, API_REPLICATION_VM_JOBS } from '../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { callAPI } from '../../utils/ApiUtils';
import { getAppDateFormat } from '../../utils/AppUtils';
import { getValue } from '../../utils/InputUtils';
import { addHeaderPage, addTableFromHtml, createPDFDoc, exportDoc, systemOverview } from '../../utils/PdfUtil';
import { fetchDashboardTitles, fetchRecoveryStats, fetchReplicationStats } from './DashboardActions';
import { addMessage } from './MessageActions';
import { hideApplicationLoader, showApplicationLoader } from './UserActions';

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
export function reportFetchSites() {
  return (dispatch) => (
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
      })
  );
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
export function reportFetchPlans() {
  return (dispatch) => (
    callAPI(API_FETCH_DR_PLANS)
      .then((json) => {
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          const data = json;
          dispatch(setReportObject('plans', data));
          dispatch(setProtectedVMs(json));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      })
  );
}

/**
 * @returns Fetch and set events info for report
 */
export function reportFetchEvents() {
  return (dispatch) => (
    callAPI(API_FETCH_EVENTS)
      .then((json) => {
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(setReportObject('events', json));
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
export function reportFetchAlerts() {
  return (dispatch) => (
    callAPI(API_FETCH_ALERTS)
      .then((json) => {
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(setReportObject('alerts', json));
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
export function reportFetchReplicationJobs() {
  return (dispatch) => (
    callAPI(API_REPLICATION_VM_JOBS)
      .then((json) => {
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(setReportObject('replication', json));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      })
  );
}

/**
 * @returns Fetch and set recovery job info for report
 */
export function reportFetchRecoveryJobs() {
  return (dispatch) => (
    callAPI(API_RECOVERY_JOBS)
      .then((json) => {
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(setReportObject('recovery', json));
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      })
  );
}

/**
 * @param {*} data
 * @returns set protected vm details for report
 */
export function setProtectedVMs(pPlans) {
  return (dispatch) => {
    dispatch(setReportObject('protectedVMS', []));
    callAPI(API_PROTECTION_PLAN_REPLICATION_JOBS_STATUS)
      .then((json) => {
        if (json && json.length > 0 && json.length === pPlans.length) {
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
  const apis = [dispatch(reportFetchSites()), dispatch(reportFetchPlans())];
  if (criteria.includeSystemOverView) {
    apis.push(dispatch(fetchRecoveryStats()));
    apis.push(dispatch(fetchReplicationStats()));
    apis.push(dispatch(fetchDashboardTitles()));
  }
  if (criteria.includeNodes) {
    apis.push(dispatch(reportFetchNodes()));
  }
  if (criteria.includeEvents) {
    apis.push(dispatch(reportFetchEvents()));
  }
  if (criteria.includeAlerts) {
    apis.push(dispatch(reportFetchAlerts()));
  }
  if (criteria.includeReplicationJobs) {
    apis.push(dispatch(reportFetchReplicationJobs()));
  }
  if (criteria.includeRecoveryJobs) {
    apis.push(dispatch(reportFetchRecoveryJobs()));
  }
  return apis;
}

export function getCriteria(user) {
  const { values } = user;
  return {
    startDate: getValue('report.startDate', values),
    endDate: getValue('report.endDate', values),
    includeSystemOverView: getValue('report.includeSystemOverView', values),
    includeNodes: getValue('report.includeNodes', values),
    includeEvents: getValue('report.includeEvents', values),
    includeAlerts: getValue('report.includeAlerts', values),
    includeReplicationJobs: getValue('report.includeReplicationJobs', values),
    includeRecoveryJobs: getValue('report.includeRecoveryJobs', values),
    includeProtectedVMS: getValue('report.includeProtectedVMS', values),
  };
}

export function exportReportToPDF() {
  return (dispatch, getState) => {
    const { user, dashboard } = getState();
    try {
      const criteria = getCriteria(user);
      const doc = createPDFDoc();
      addHeaderPage(doc, criteria.startDate, criteria.endDate);
      if (criteria.includeSystemOverView) {
        doc.addPage();
        systemOverview(doc, dashboard);
      }
      addTableFromHtml(doc, 'rpt-protection_plans', 'Protection Plans');
      addTableFromHtml(doc, 'rpt-sites', 'Sites');
      if (criteria.includeNodes) {
        addTableFromHtml(doc, 'rpt-nodes', 'Nodes');
      }
      if (criteria.includeProtectedVMS) {
        addTableFromHtml(doc, 'rpt-protected_machines', 'Protected Machines');
      }
      if (criteria.includeEvents) {
        addTableFromHtml(doc, 'rpt-events', 'Events');
      }
      if (criteria.includeAlerts) {
        addTableFromHtml(doc, 'rpt-alerts', 'Alerts');
      }
      if (criteria.includeReplicationJobs) {
        addTableFromHtml(doc, 'rpt-replication_jobs', 'Replication Jobs');
      }
      if (criteria.includeRecoveryJobs) {
        addTableFromHtml(doc, 'rpt-recovery_jobs', 'Recovery Jobs');
      }
      const d = new Date();
      exportDoc(doc, `Datamotive-report-${getAppDateFormat(d, true)}`);
    } catch (error) {
      dispatch(hideApplicationLoader('PDF_REPORT'));
      dispatch(addMessage(error, MESSAGE_TYPES.ERROR));
    }
  };
}

// function getPDFTableFormat(columns) {
//   const pdfTableFormat = [];
//   columns.forEach((col) => {
//     const c = { title: col.label, dataKey: col.field };
//     pdfTableFormat.push(c);
//   });
// }
