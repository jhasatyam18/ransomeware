import { addMessage } from './MessageActions';
import { hideApplicationLoader, showApplicationLoader } from './UserActions';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import * as Types from '../../constants/actionTypes';
import { API_CLEANUP_RECOVERIES, API_CLEANUP_RECOVERIES_FETCH } from '../../constants/ApiConstants';
import { MESSAGE_TYPES, RENDER_CLEANUP_MESSAGE } from '../../constants/MessageConstants';
import { getValue } from '../../utils/InputUtils';
import { getCleanupResourcesPayload } from '../../utils/PayloadUtil';
import { closeModal } from './ModalActions';
import { TABLE_CLEANUP_DR_COPIES } from '../../constants/TableConstants';
import { filterNestedCleanupData, getStorageWithUnit } from '../../utils/AppUtils';
import { CLEANUP_DR } from '../../constants/InputConstants';

// Store functions
export function updateSelectedCleanupResources(selectedCleanupSources) {
  return {
    type: Types.UPDATE_SELECTED_CLEANUP_RESOURCES,
    selectedCleanupSources,
  };
}

export function cleanupResourcesFetched(data, fullData) {
  return {
    type: Types.FETCHED_CLEAN_UP_RESOURCES,
    data,
    fullData,
  };
}

export function setCleanupData(data) {
  return {
    type: Types.SET_CLEANUP_DATA,
    data,
  };
}

// Action Handling function
export function handleSelectAllCleanupResources(isSelected) {
  return (dispatch, getState) => {
    const { drPlans } = getState();
    const { cleanup } = drPlans;
    const { data } = cleanup;
    const childKeyName = 'resourceID';
    const primaryKey = 'workloadID';
    const newResources = {};
    if (!isSelected) {
      dispatch(updateSelectedCleanupResources(newResources));
      return;
    }
    data.forEach((w) => {
      let isChildAdded = false;
      if (w.resources && w.resources.length > 0) {
        w.resources.forEach((child) => {
          if (!child.isDisabled) {
            newResources[child[childKeyName]] = child;
            isChildAdded = true;
          }
        });
      }
      if (isChildAdded) {
        newResources[w[primaryKey]] = w;
      }
    });
    // Update the state with the new resources
    dispatch(updateSelectedCleanupResources(newResources));
  };
}

export function handleCleanupTableSelection(rowData, isSelected, primaryKey) {
  return (dispatch, getState) => {
    const { drPlans } = getState();
    const { cleanup } = drPlans;
    const { selectedResources, data = [] } = cleanup;
    const childKeyName = 'resourceID';
    const newResources = { ...selectedResources };

    if (isSelected) {
      // Add the selected row
      if (!selectedResources[rowData[primaryKey]]) {
        newResources[rowData[primaryKey]] = rowData;

        // If the row is a parent, add all its children
        if (rowData.resources && rowData.resources.length > 0) {
          rowData.resources.forEach((child) => {
            if (!child.isDisabled) {
              newResources[child[childKeyName]] = child;
            }
          });
        } else {
          // make parent row selected if any one is selected
          data.forEach((d) => {
            d.resources.forEach((r) => {
              if (newResources[r.resourceID]) {
                newResources[d.workloadID] = d;
              }
            });
          });
        }
      }
    } else {
      // Remove the unselected row
      delete newResources[rowData[primaryKey]];

      // If the row is a parent, remove all its children
      if (rowData.resources && rowData.resources.length > 0) {
        rowData.resources.forEach((child) => {
          // child key is resourceID
          delete newResources[child[childKeyName]];
        });
      } else {
        // unselect parent if all child's are unselected
        data.forEach((d) => {
          let inUse = false;
          d.resources.forEach((r) => {
            if (newResources[r.resourceID]) {
              inUse = true;
            }
          });
          // not in use and marked as checked
          if (!inUse && selectedResources[d.workloadID]) {
            delete newResources[d.workloadID];
          }
        });
      }
    }

    // Update the state with the new resources
    dispatch(updateSelectedCleanupResources(newResources));
  };
}

export function cleanupToggleChildRow(rowID) {
  return (dispatch, getState) => {
    const { drPlans } = getState();
    const { cleanup } = drPlans;
    const { data = [], fullData = [] } = cleanup;
    const updatedData = [];
    data.forEach((d) => {
      const nd = { ...d };
      if (d && d.workloadID && d.workloadID === rowID) {
        nd.showChild = !d.showChild;
      }
      updatedData.push(nd);
    });
    dispatch(cleanupResourcesFetched(updatedData, fullData));
  };
}

// Fetch cleanup resources
export function fetchCleanupResources(type, id) {
  return (dispatch) => {
    // making the resources empty
    dispatch(cleanupResourcesFetched([], []));
    dispatch(showApplicationLoader('DR-CLEANUP-RESOURCES-FETCH', 'Loading clean-up resources...'));
    let url = API_CLEANUP_RECOVERIES_FETCH.replace('<id>', id);
    url = url.replace('<type>', type);
    return callAPI(url).then((json) => {
      dispatch(hideApplicationLoader('DR-CLEANUP-RESOURCES-FETCH'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        // modify the object to fit the component structure
        const data = [];
        if (json && json.length > 0) {
          json.forEach((o) => {
            const { workloadName, workloadID, description } = o;
            let resFDeletion = '';
            if (o.associatedResources && o.associatedResources.length > 0) {
              // resource type
              const resType = o.associatedResources[0].resourceType;
              switch (resType) {
                case 'volume':
                  let size = 0;
                  o.associatedResources.forEach((r) => {
                    size += r.size;
                  });
                  resFDeletion = `Volumes - ${o.associatedResources.length} [${getStorageWithUnit(size)}]`;
                  break;
                case 'instance':
                  if (type === CLEANUP_DR.TEST_RECOVERIES) {
                    resFDeletion = `Test Drill Instances - ${o.associatedResources.length}`;
                  } else {
                    resFDeletion = `Instances - ${o.associatedResources.length}`;
                  }
                  break;
                default:
                  resFDeletion = `Resources - ${o.associatedResources.length}`;
              }
            }
            const resources = [];
            if (o.associatedResources && o.associatedResources.length > 0) {
              o.associatedResources.forEach((r) => {
                const childObj = { ...r, description: `${r.resourceType} - ${r.resourceID}`, isDisabled: false };
                if (r.status !== '') {
                  childObj.description = `${r.status}`;
                  childObj.isDisabled = true;
                }
                if (r.resourceType === 'volume') {
                  const size = getStorageWithUnit(r.size);
                  childObj.resourceName = `${r.resourceName} [${size}]`;
                  childObj.resourceID = `${o.workloadID}^${r.resourceID}`;
                }
                resources.push(childObj);
              });
            }
            const c = { workloadName, workloadID, description, resources: [...resources], showChild: false, resourceName: resFDeletion };
            data.push(c);
          });
        }
        dispatch(cleanupResourcesFetched(data, data));
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('export-excel'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

// cleanup resources call
export function cleanupResources(id) {
  return (dispatch, getState) => {
    const { drPlans, user } = getState();
    const { values, platformType, localVMIP } = user;
    const { cleanup, protectionPlan } = drPlans;
    //
    const { protectedSite } = protectionPlan;
    const protectedSitePlatform = protectedSite.platformDetails.platformType;
    const isSourceSite = (platformType === protectedSitePlatform && localVMIP === protectedSite.node.hostname);
    //
    const payload = getCleanupResourcesPayload(cleanup);
    const ty = getValue('ui.cleanup.type.value', values);
    const obj = createPayload(API_TYPES.POST, payload);
    dispatch(showApplicationLoader('DR-CLEANUP-RESOURCES', 'Initiating cleanup on selected resources...'));
    let url = API_CLEANUP_RECOVERIES.replace('<id>', id);
    url = url.replace('<type>', ty);
    return callAPI(url, obj).then((json) => {
      dispatch(hideApplicationLoader('DR-CLEANUP-RESOURCES'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        const d = { msg: `Cleanup has been successfully initiated for ${payload.deletedCount} resource(s). The cleanup status can be monitored in recovery jobs.`, itemRenderer: RENDER_CLEANUP_MESSAGE, planID: id, isSourceSite };
        dispatch(addMessage('-', MESSAGE_TYPES.INFO, false, d));
        dispatch(closeModal());
        dispatch(updateSelectedCleanupResources({}));
        dispatch(fetchCleanupResources(ty, id));
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('DR-CLEANUP-RESOURCES'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      dispatch(closeModal());
    });
  };
}

export function onFilterTable(criteria) {
  return (dispatch, getState) => {
    const { drPlans } = getState();
    const { cleanup } = drPlans;
    const { fullData = [] } = cleanup;
    if (criteria.trim() === '') {
      dispatch(setCleanupData(fullData));
    } else {
      const newData = filterNestedCleanupData(fullData, criteria.trim(), TABLE_CLEANUP_DR_COPIES);
      dispatch(setCleanupData(newData));
    }
  };
}
