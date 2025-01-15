import * as Types from '../../constants/actionTypes';

export function handleCleanupTableSelection(data, isSelected, primaryKey) {
  return (dispatch, getState) => {
    const { drPlans } = getState();
    const { cleanup } = drPlans;
    const { selectedResources } = cleanup;

    const newResources = { ...selectedResources };

    if (isSelected) {
      // Add the selected row
      if (!selectedResources[data[primaryKey]]) {
        newResources[data[primaryKey]] = data;

        // If the row is a parent, add all its children
        if (data.resources && data.resources.length > 0) {
          data.resources.forEach((child) => {
            newResources[child[primaryKey]] = child;
          });
        }
      }
    } else {
      // Remove the unselected row
      delete newResources[data[primaryKey]];

      // If the row is a parent, remove all its children
      if (data.resources && data.resources.length > 0) {
        data.resources.forEach((child) => {
          delete newResources[child[primaryKey]];
        });
      }
    }

    // Update the state with the new resources
    dispatch(updateSelectedCleanupResources(newResources));
  };
}

export function updateSelectedCleanupResources(selectedCleanupSources) {
  return {
    type: Types.UPDATE_SELECTED_CLEANUP_RESOURCES,
    selectedCleanupSources,
  };
}

export function cleanupResourcesFetched(data) {
  return {
    type: Types.FETCHED_CLEAN_UP_RESOURCES,
    data,
  };
}

export function cleanupToggleChildRow(rowID) {
  return (dispatch, getState) => {
    const { drPlans } = getState();
    const { cleanup } = drPlans;
    const { data = [] } = cleanup;
    const updatedData = [];
    data.forEach((d) => {
      const nd = { ...d };
      if (d && d.id && d.id === rowID) {
        nd.showChild = !d.showChild;
      }
      updatedData.push(nd);
    });
    dispatch(cleanupResourcesFetched(updatedData));
  };
}

export function setDummyData() {
  return (dispatch) => {
    const data = [
      {
        id: 'row-1',
        workloadName: 'PROD-VM-1',
        resourcesForDeletion: 'Test Drill Instances - 4',
        createdAt: '29/11/2024-1:51:31 pm',
        description: 'Instances created for test recovery',
        showChild: true,
        resources: [
          { id: 'instance-1', resourcesForDeletion: 'PROD-VM-1-dm-test-drill-134885', createdAt: '29/11/2024-1:51:31 pm', description: 'Instance ID - i-hjuy6756897' },
          { id: 'instance-2', resourcesForDeletion: 'PROD-VM-1-dm-test-drill-144885', createdAt: '29/11/2024-3:51:31 pm', description: 'Instance ID - i-hjuy6787811' },
        ],
      },
      {
        id: 'row-2',
        workloadName: 'PROD-VM-2',
        resourcesForDeletion: 'Test Drill Instances - 3',
        createdAt: '30/11/2024-2:21:15 pm',
        description: 'Instances created for testing',
        // resources: [
        //   { id: 'instance-3', resourcesForDeletion: 'PROD-VM-2-dm-test-drill-234885', createdAt: '30/11/2024-2:51:31 pm', description: 'Instance ID - i-hjuy123456' },
        //   { id: 'instance-4', resourcesForDeletion: 'PROD-VM-2-dm-test-drill-244885', createdAt: '30/11/2024-4:15:31 pm', description: 'Instance ID - i-hjuy654321' },
        // ],
      },
    ];
    dispatch(cleanupResourcesFetched(data));
  };
}
