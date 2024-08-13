import { t } from 'i18next';
import * as Types from '../../constants/actionTypes';
import { API_CHECKPOINT_TAKE_ACTION, API_GET_SELECTED_CHECKPOINTS, API_RECOVERY_CHECKPOINT, API_RECOVERY_CHECKPOINT_BY_VM, API_REPLICATION_VM_JOBS, API_UPDAT_RECOVERY_CHECKPOINT_BY_ID } from '../../constants/ApiConstants';
import { CHECKPOINT_TYPE, MINUTES_CONVERSION, STATIC_KEYS, UI_WORKFLOW } from '../../constants/InputConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { MODAL_CONFIRMATION_WARNING, MODAL_PRESERVE_CHECKPOINT } from '../../constants/Modalconstant';
import { STORE_KEYS } from '../../constants/StoreKeyConstants';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { getValue } from '../../utils/InputUtils';
import { setRecoveryVMDetails } from './DrPlanActions';
import { addMessage } from './MessageActions';
import { closeModal, openModal } from './ModalActions';
import { clearValues, hideApplicationLoader, refresh, showApplicationLoader, valueChange } from './UserActions';

export function setRecoveryCheckpointJobs(checkpointJobs) {
  return {
    type: Types.CHANGE_RECOVERY_CHECKPOINT_JOB,
    checkpointJobs,
  };
}

export function setRecoveryCheckpoint(recoveryCheckpoints) {
  const obj = {};
  const moref = recoveryCheckpoints[0]?.workloadID;
  obj[moref] = recoveryCheckpoints;
  return {
    type: Types.FETCH_RECOVERY_CHECKPOINT,
    recoveryCheckpoints: obj,
  };
}

export function createPayloadForCheckpoints(checkpointid, user) {
  const { values } = user;
  const checkpontPayloadArray = [];
  const checkpointKeys = Object.keys(checkpointid);
  checkpointKeys.forEach((k) => {
    const { id, creationTime, affiliatedNodeKey } = checkpointid[k];
    const obj = {};
    obj.id = id;
    obj.creationTime = creationTime;
    obj.affiliatedNodeKey = affiliatedNodeKey;
    obj.isPreserved = true;
    obj.preserveDescription = getValue('checkpoint.preserve', values);
    checkpontPayloadArray.push(obj);
  });
  return checkpontPayloadArray;
}

/**
   *
   */
export function updateRecoveryCheckpoint(payload) {
  return (dispatch) => {
    const method = API_TYPES.PUT;
    const url = `${API_UPDAT_RECOVERY_CHECKPOINT_BY_ID}`;
    const obj = createPayload(method, payload);
    dispatch(showApplicationLoader('JOBS-DATA', 'Preserving Checkpoint'));
    return callAPI(url, obj)
      .then((json) => {
        dispatch(hideApplicationLoader('JOBS-DATA'));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          const str = [];
          json.forEach((el) => {
            const { errorMessage, PointInTimeCheckpoint } = el;
            if (errorMessage !== '') {
              const { workloadName, creationTime } = PointInTimeCheckpoint;
              const time = creationTime * 1000;
              const d = new Date(time);
              const timeStr = `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`;
              str.push(t('checkpoint.preserve.error.message', { workloadName, timeStr, errorMessage }));
            }
          });
          if (str.length !== 0) {
            dispatch(addMessage(str.join('\n'), MESSAGE_TYPES.ERROR));
            dispatch(clearValues());
            dispatch(closeModal());
          } else {
            dispatch(addMessage('Checkpoint preserved successfully', MESSAGE_TYPES.INFO));
            dispatch(clearValues());
            dispatch(closeModal());
            dispatch(refresh());
          }
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('JOBS-DATA'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
   *Opens modal for user to enter decription while preserving the checkpoint
   * @param {*} selectedCheckpoints
   * @returns
   */
export function preserveCheckpoint(selectedCheckpoints) {
  return (dispatch) => {
    const options = { title: 'Preserve Checkpoint', selectedCheckpoints, size: 'lg' };
    dispatch(openModal(MODAL_PRESERVE_CHECKPOINT, options));
  };
}

/**
   *Sets recovery checkpointing data while editing pplan or reversing pplan
   * @param {*} recoveryCheckpointConfig - Object for recovery checkpointing
   * @returns
   */
export function setPplanRecoveryCheckpointData(recoveryCheckpointConfig) {
  return (dispatch) => {
    const { isRecoveryCheckpointEnabled, recoveryPointTimePeriod, recoveryPointCopies, recoveryPointRetentionTime, id } = recoveryCheckpointConfig;
    dispatch(valueChange(STORE_KEYS.RECOVERY_CHECKPOINTING_ENABLED, isRecoveryCheckpointEnabled));
    dispatch(valueChange(STORE_KEYS.RECOVERY_CHECKPOINT_COUNT, recoveryPointCopies));
    dispatch(valueChange('recoveryPointConfiguration.id', id));
    const checkpointConfig = getCheckpointTimeFromMinute(recoveryPointTimePeriod);
    dispatch(valueChange(STORE_KEYS.RECOVERY_CHECKPOINT_DURATION_NUM, checkpointConfig.time));
    dispatch(valueChange(STORE_KEYS.RECOVERY_CHECKPOINT_DURATION_UNIT, checkpointConfig.unit));
    const checkpointRetention = getCheckpointTimeFromMinute(recoveryPointRetentionTime);
    dispatch(valueChange(STORE_KEYS.RECOVERY_CHECKPOINT_RETAIN_NUMEBER, checkpointRetention.time));
    dispatch(valueChange(STORE_KEYS.RECOVERY_CHECKPOINT_RETAIN_NUMEBER_UNIT, checkpointRetention.unit));
  };
}

/**
   *Converts provided minutes to appropriate time and it's unit
   * @param {*} time - takes time in minutes
   * @returns object with time and it's unit
   */
export function getCheckpointTimeFromMinute(time) {
  if (time === 0) {
    return { time, unit: '' };
  }

  if (time % MINUTES_CONVERSION.YEAR === 0) {
    return { time: Math.floor(time / MINUTES_CONVERSION.YEAR), unit: 'year' };
  } if (time % MINUTES_CONVERSION.MONTH === 0) {
    return { time: Math.floor(time / MINUTES_CONVERSION.MONTH), unit: 'month' };
  } if (time % MINUTES_CONVERSION.WEEK === 0) {
    return { time: Math.floor(time / MINUTES_CONVERSION.WEEK), unit: 'week' };
  } if (time % MINUTES_CONVERSION.DAY === 0) {
    return { time: Math.floor(time / MINUTES_CONVERSION.DAY), unit: 'day' };
  } if (time % MINUTES_CONVERSION.HOUR === 0) {
    return { time: Math.floor(time / MINUTES_CONVERSION.HOUR), unit: 'hour' };
  }
  return { time, unit: 'Minute' };
}

/**
   * Onselect checkpoint update the selected checkpointi in the store
   * @param {*} data
   * @param {*} isSelected
   * @param {*} primaryKey
   * @returns
   */

export function handleRecoveryCheckpointTableSelection(data, isSelected, primaryKey) {
  return (dispatch, getState) => {
    const { jobs } = getState();
    const { selectedCheckpoints } = jobs;
    if (isSelected) {
      if (!selectedCheckpoints || selectedCheckpoints.length === 0 || !selectedCheckpoints[data[primaryKey]]) {
        const newCheckpoints = { ...selectedCheckpoints, [data[primaryKey]]: data };
        dispatch(updateSelectedCheckpoints(newCheckpoints));
      }
    } else if (selectedCheckpoints[data[primaryKey]]) {
      const newCheckpoints = selectedCheckpoints;
      delete newCheckpoints[data[primaryKey]];
      dispatch(updateSelectedCheckpoints(newCheckpoints));
    }
  };
}

export function handleAllRecoveryCheckpointTableSelection(isSelected) {
  return (dispatch, getState) => {
    const { jobs } = getState();
    const { vmCheckpoint } = jobs;
    if (isSelected) {
      let newCheckpoints = {};
      vmCheckpoint.forEach((ch) => {
        newCheckpoints = { ...newCheckpoints, [ch.id]: ch };
      });
      dispatch(updateSelectedCheckpoints(newCheckpoints));
    } else {
      dispatch(updateSelectedCheckpoints({}));
    }
  };
}

/**
   *update selected checkpoint in the store
   * @param {*} selectedCheckpoints - checkpoint id
   * @returns used to preserve selecetd checkpoint
   */
export function updateSelectedCheckpoints(selectedCheckpoints) {
  return {
    type: Types.SELECTED_RECOVERY_CHECKPOINTS,
    selectedCheckpoints,
  };
}

/**
   * Opens Delete checkpoint confirmation modal
   * @param {*} selectedCheckpoints - selected checkpoint id
   * @returns opens confirmation modal
   */
export function openDeleteCheckpointModal() {
  return (dispatch, getState) => {
    const { jobs } = getState();
    const { selectedCheckpoints } = jobs;
    const selectedCheckpointKey = Object.keys(selectedCheckpoints);
    const ids = [];
    selectedCheckpointKey.forEach((el) => {
      ids.push(selectedCheckpoints[el].id);
    });
    const options = { title: 'Confirmation', confirmAction: removeCheckpoint, message: 'Are you sure want to remove selected Checkpoint ?', id: ids.join(',') };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  };
}

/**
   *Api to delete selected checkpoint
   * @param {*} id - checkpoint ID
   * @returns REMOVED CHECKPOINT
   */

export function removeCheckpoint(id) {
  return (dispatch, getState) => {
    const { jobs } = getState();
    const { selectedCheckpoints } = jobs;
    dispatch(showApplicationLoader('Checkpoint_Remove_Data', 'Removing Checkpoint'));
    const obj = createPayload(API_TYPES.DELETE, {});
    return callAPI(`${API_UPDAT_RECOVERY_CHECKPOINT_BY_ID}/?id=${id}`, obj)
      .then((json) => {
        dispatch(hideApplicationLoader('Checkpoint_Remove_Data'));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          if (json.length > 0) {
            let errStr = 'Failed to delete Point In Time checkpoint created at';
            json.map((j, i) => {
              let time = j.recoveryPointTime;
              time *= 1000;
              const d = new Date(time);
              let resp = '';
              resp = `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`;
              const name = j.workloadName;
              errStr = `${i !== 0 ? ',' : ''} ${errStr} ${resp} for ${name} with error ${j.errorMessage}`;
            });
          } else {
            // remove deleted id from the store
            const updatedCheckpoint = {};
            const idarray = id.split(',');
            Object.keys(selectedCheckpoints).map((el) => {
              if (idarray.indexOf(el) === -1) {
                updatedCheckpoint[el] = selectedCheckpoints[el];
              }
            });

            dispatch(updateSelectedCheckpoints(updatedCheckpoint));
            dispatch(addMessage('Checkpoint deleted successfully', MESSAGE_TYPES.INFO));
          }
          dispatch(refresh());
          dispatch(closeModal());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('Checkpoint_Remove_Data'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
   *
   *set recovery checkpoint option for vm in recovery wizard
   * @param {*} planId - protection plan id
   * @param {*} moref - vm moref's in comma separated form
   * @returns
   */

export function getVmCheckpoints(planId, moref) {
  return async (dispatch) => {
    try {
      dispatch(showApplicationLoader('job_data', 'Fetching Checkpoints'));
      let url = API_RECOVERY_CHECKPOINT_BY_VM.replace('<moref>', moref);
      url = url.replace('<id>', planId);
      url = `${url}&limit=${100}&searchstr=Available&searchcol=checkpointStatus`;
      const apiArray = [];
      const firstCheckpoinRes = await callAPI(url);
      const vmCheckpointRecords = [];
      if (firstCheckpoinRes.records.length > 0) {
        vmCheckpointRecords.push(firstCheckpoinRes.records);
        dispatch(valueChange(STATIC_KEYS.IS_POINT_IN_TIME_DISABLED, false));
      } else {
        dispatch(valueChange(STATIC_KEYS.IS_POINT_IN_TIME_DISABLED, true));
      }
      if (firstCheckpoinRes.hasNext && firstCheckpoinRes.records.length > 0) {
        for (let off = 0; off < firstCheckpoinRes.totalRecords - 1; off += 100) {
          const set = off + 100;
          apiArray.push(set);
        }
      }
      let resolvedApiResponse = [];
      if (apiArray.length > 0) {
        resolvedApiResponse = apiArray.map(async (i) => {
          vmCheckpointRecords.push(await fetchVmCheckpoint(planId, moref, i, dispatch));
        });
      }

      return Promise.all(resolvedApiResponse).then(
        async () => {
          dispatch(hideApplicationLoader('job_data'));
          const vmCheckpoints = {};
          if (vmCheckpointRecords.length > 0) {
            vmCheckpointRecords.forEach((el) => {
              el.forEach((els) => {
                if (vmCheckpoints[els.workloadID]) {
                  vmCheckpoints[els.workloadID].push(els);
                } else {
                  vmCheckpoints[els.workloadID] = [els];
                }
              });
            });
            const allCheckpointScheduleTime = vmCheckpointRecords[0].map((record) => ({ id: record.id, checkpointScheduleTime: record.checkpointScheduleTime }));
            const repeatedCheckpointScheduleTime = {};
            const uniqueCheckpointScheduleTime = [];

            allCheckpointScheduleTime.forEach((obj) => {
              if (!repeatedCheckpointScheduleTime[obj.checkpointScheduleTime]) {
                repeatedCheckpointScheduleTime[obj.checkpointScheduleTime] = true;
                uniqueCheckpointScheduleTime.push(obj);
              }
            });
            dispatch(valueChange(STATIC_KEYS.UI_COMMON_CHECKPOINT_OPTIONS, uniqueCheckpointScheduleTime));
            const latestReplicationOfVms = await fetchVMsLatestReplicaionJob(moref, dispatch);
            latestReplicationOfVms.forEach((latestJob) => {
              if (typeof vmCheckpoints[latestJob.vmMoref] !== 'undefined' && vmCheckpoints[latestJob.vmMoref].length > 0) {
                vmCheckpoints[latestJob.vmMoref].unshift(latestJob);
              }
            });
            dispatch(valueChange(STATIC_KEYS.UI_RECOVERY_CHECKPOINTS_BY_VM_ID, vmCheckpoints));
            dispatch(valueChange(`${planId}-has-checkpoint`, vmCheckpoints.length > 0));
          } else {
            fetchVMsLatestReplicaionJob(moref, dispatch);
          }
          return new Promise((resolve) => resolve());
        },
        (err) => {
          dispatch(hideApplicationLoader('job_data'));
          dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
          return new Promise((resolve) => resolve());
        },
      );
    } catch (err) {
      dispatch(hideApplicationLoader('job_data'));
      dispatch(hideApplicationLoader('job_data'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    }
  };
}

/**
 *
 * @param {*} planId - pplan id
 * @param {*} moref - vm moref
 * @param {*} offset
 * @param {*} dispatch
 * @returns fetch provide vm checkpoints in pplan
 */

export async function fetchVmCheckpoint(planId, moref, offset = 0, dispatch) {
  try {
    let url = API_RECOVERY_CHECKPOINT_BY_VM.replace('<moref>', moref);
    url = url.replace('<id>', planId);
    if (offset === 0) {
      url = `${url}&limit=${100}`;
    } else {
      url = `${url}&offset=${offset}&limit=${100}`;
    }
    const res = await callAPI(url);
    return res.records;
  } catch (err) {
    dispatch(hideApplicationLoader('job_data'));
    dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
  }
}

/**
   *fetch latest replication job of the provided vm's
   * @param {*} planId proection plan id
   * @param {*} moref - multiple vm moref in comma separated
   * @param {*} dispatch
   * @returns latest successfull replication job of the vm's
   */
export async function fetchVMsLatestReplicaionJob(moref, dispatch) {
  try {
    const url = `${API_REPLICATION_VM_JOBS}?latest=true&vmMorefs=${moref}`;
    const res = await callAPI(url);
    dispatch(valueChange(STATIC_KEYS.VM_LATEST_REPLICATION_JOBS, res));
    return res;
  } catch (err) {
    dispatch(hideApplicationLoader('job_data'));
    dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
  }
}

export function setVmlevelCheckpoints(checkpoints) {
  return {
    type: Types.VM_RECOVERY_CHECKPOINTS,
    vmCheckpoint: checkpoints,
  };
}

export function updateSelectedPlans(selectedPlans) {
  return {
    type: Types.UPDATE_SELECTED_DR_PLAN,
    selectedPlans,
  };
}

/**
 *
 * @param {*} id checkpoint id
 * @returns take action on selected checkpoint
 */

export function takeActionOnCheckpoint(alert, id) {
  return (dispatch) => {
    dispatch(showApplicationLoader('job_data', 'Taking action on VM Checkpoint'));
    const obj = createPayload(API_TYPES.POST, alert);
    const url = API_CHECKPOINT_TAKE_ACTION.replace('<id>', id);
    return callAPI(url, obj)
      .then((json) => {
        dispatch(hideApplicationLoader('job_data'));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(addMessage('Action initiated successfully', MESSAGE_TYPES.INFO));
          dispatch(refresh());
          dispatch(closeModal());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('job_data'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 *
 * @param {*} planId
 * @returns fetch recovery checkpoint by plan id
 */

export function fetchCheckpointsByPlanId(planId, key) {
  return (dispatch) => {
    const url = API_RECOVERY_CHECKPOINT.replace('<id>', planId);
    return callAPI(url).then((res) => {
      if (res.records.length > 0) {
        if (typeof key !== 'undefined') {
          dispatch(valueChange(key, true));
        }
        dispatch(setVmlevelCheckpoints(res.records));
        dispatch(setCheckpointCount(res.records.length));
      } else {
        dispatch(setVmlevelCheckpoints([]));
      }
    });
  };
}

export function changeCheckpointType(checkpointType) {
  return {
    type: Types.CHANGE_CHECKPOINT_TYPE,
    checkpointType,
  };
}

/**
 *It takes checkpoint id array and fetch all the recovery configs based on checkpoint ids
 *Updates recovery configs of the selected vms
 * @param {*} user
 * @param {*} selectedCheckpointsId : array of selected vm checkpoint id
 * @returns
 */

export function recoveryConfigOnCheckpointChanges(selectedCheckpointsId, selectedVmMoref) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const workflow = getValue(STATIC_KEYS.UI_WORKFLOW, values) || '';
    const selecetdVms = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
    if (workflow === UI_WORKFLOW.TEST_RECOVERY || workflow === UI_WORKFLOW.RECOVERY) {
      let checkpointRecConfigs = [];
      const url = API_GET_SELECTED_CHECKPOINTS.replace('<id>', selectedCheckpointsId);
      dispatch(showApplicationLoader('reseting-configuration', 'Setting Recovery Configurations'));
      return callAPI(url)
        .then((json) => {
          dispatch(hideApplicationLoader('reseting-configuration'));
          if (json.hasError) {
            dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
          } else {
            checkpointRecConfigs = [...json.records];
            // get checkpoint recovery config plan in case of single select or user added one more vm or checkpoint
            let checkpointPlan = getValue(STORE_KEYS.UI_CHECKPOINT_PLAN, values);
            let obj = { };
            if (Object.keys(checkpointPlan).length === 0) {
              // if user selected point-in-time option for the first time then get the recovery plan data and modify instance details based on json record
              checkpointPlan = getValue('ui.recovery.plan', values);
              obj = JSON.parse(JSON.stringify(checkpointPlan));
            } else {
              obj = { ...checkpointPlan };
            }
            if (Object.keys(obj).length > 0) {
              const { recoveryEntities } = obj;
              const { instanceDetails } = recoveryEntities;
              if (Object.keys(checkpointRecConfigs).length > 0) {
                checkpointRecConfigs.forEach((el) => {
                  for (let i = 0; i < instanceDetails.length; i += 1) {
                    if (el.workloadID === instanceDetails[i].sourceMoref) {
                      const newInstanceDetails = JSON.parse(el.targetWorkloadConfig);
                      newInstanceDetails.sourceMoref = instanceDetails[i].sourceMoref;
                      instanceDetails[i] = newInstanceDetails;
                    }
                  }
                });
              }
              dispatch(valueChange(STORE_KEYS.UI_CHECKPOINT_PLAN, obj));
              if (typeof selectedVmMoref !== 'undefined') {
                dispatch(setRecoveryVMDetails(selectedVmMoref, obj));
              } else if (Object.keys(selecetdVms).length > 0) {
                Object.keys(selecetdVms).forEach((vm) => {
                  dispatch(setRecoveryVMDetails(vm, obj));
                });
              }
            }
          }
        },
        (err) => {
          dispatch(hideApplicationLoader('reseting-configuration'));
          dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
        });
    }
  };
}

/**
 * sets latest replication job's data per VM to show in recovery, test-recoveyr and migration wizard
 * @param {*} data -> Array of VM object
 * @returns
 */

export function fetchLatestReplicationJob(data) {
  return (dispatch, getState) => {
    const { user } = getState();
    const { values } = user;
    const vms = data;
    const latestReplicationData = getValue(STATIC_KEYS.VM_LATEST_REPLICATION_JOBS, values) || [];
    let allVMsRecoveredSuccessfully = true;

    vms.forEach((vm, ind) => {
      const filterData = latestReplicationData.filter((ltsRepl) => vm.moref === ltsRepl.vmMoref);
      if (filterData.length > 0) {
        vms[ind].currentSnapshotTime = filterData[0].currentSnapshotTime;
        vms[ind].resetIteration = filterData[0].resetIteration;
        if (!filterData[0].resetIteration && allVMsRecoveredSuccessfully) {
          allVMsRecoveredSuccessfully = false;
        }
      }
    });

    dispatch(valueChange('ui.recovery.vms', vms));
    if (allVMsRecoveredSuccessfully) {
      dispatch(valueChange(STATIC_KEYS.DISABLE_RECOVERY_FROM_LATEST, true));
      dispatch(valueChange(STATIC_KEYS.UI_CHECKPOINT_RECOVERY_TYPE, CHECKPOINT_TYPE.POINT_IN_TIME));
    }
  };
}

export function setCheckpointCount(count) {
  return {
    type: Types.SET_CHECKPOINT_COUNT,
    count,
  };
}
