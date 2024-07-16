import * as Types from '../../constants/actionTypes';
import { API_BULK_GENERATE, API_GET_BULK_PLANS, API_GET_CONFIG_TEMPLATE_BY_ID, API_GET_PLAN_DIFF, API_UPDATE_ISPLAYBOOK_DOWNLOAD_STATUS, API_UPLOAD_TEMPLATED, API_VALIDATE_TEMPLATE, CREATE_PLAN_FROM_PLAYBOOK } from '../../constants/ApiConstants';
import { PLAYBOOK_IN_VALIDATED } from '../../constants/AppStatus';
import { FIELDS } from '../../constants/FieldsConstant';
import { PLATFORM_TYPES, PLAYBOOK_TYPE, STATIC_KEYS } from '../../constants/InputConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { MODAL_RECONFIGURE_PLAYBOOK, MODAL_TEMPLATE_SHOW_PPLAN_CHANGES } from '../../constants/Modalconstant';
import { PLAYBOOK_LIST } from '../../constants/RouterConstants';
import { API_TYPES, callAPI, createPayload, getUrlPath } from '../../utils/ApiUtils';
import { getValue } from '../../utils/InputUtils';
import { checkPlanConfigurationChanges, checkVmRecoveryConfigurationChanges, validateField } from '../../utils/validationUtils';
import { addMessage } from './MessageActions';
import { closeModal, openModal } from './ModalActions';
import { hideApplicationLoader, refresh, showApplicationLoader, valueChange } from './UserActions';

/**
 *
 * @param {*} user
 * @param {*} type
 * @returns create payload to generate excel file
 */
export function generatePlaybookPayload(user, type) {
  const { values } = user;
  const targetSiteID = getValue('drplan.recoverySite', values);
  const sourceSiteID = getValue('drplan.protectedSite', values);
  const entity = getVirtualMachines(user);
  const playbookEntities = [];

  const key = Object.keys(entity) || [];
  if (key.length > 0) {
    key.forEach((el) => {
      const obj = {};
      const en = entity[el];
      obj.name = en.name;
      obj.id = en.key || en.moref;
      playbookEntities.push(obj);
    });
  }

  return {
    targetSiteID,
    sourceSiteID,
    playbookEntities,
    PlaybookType: type,
  };
}

/**
 * return virtual machines value
 * @param {*} user
 * @returns
 */
export function getVirtualMachines(user) {
  const { values } = user;
  let entity;
  const sites = getValue('ui.values.sites', values);
  const targetSiteID = getValue('drplan.recoverySite', values);
  const sourcePlatform = getValue('ui.values.protectionPlatform', values);
  if (!targetSiteID || targetSiteID === '') {
    return [];
  }
  const platfromType = sites.filter((site) => `${site.id}` === `${targetSiteID}`)[0].platformDetails.platformType;
  if (platfromType !== PLATFORM_TYPES.VMware || platfromType === PLATFORM_TYPES.VMware && platfromType === sourcePlatform) {
    entity = getValue('ui.selectedvm.value', values) || getValue('ui.site.selectedVMs', values) || [];
  } else {
    entity = getValue('ui.site.selectedVMs', values) || [];
  }
  return entity;
}

/**
 * fetches list of playboks on the node
 * @returns
 */

export function fetchPlaybooks() {
  return (dispatch) => {
    dispatch(showApplicationLoader('Fetching', 'Loading Configured Playbooks...'));
    return callAPI(API_GET_BULK_PLANS)
      .then((json) => {
        dispatch(hideApplicationLoader('Fetching'));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(setPlaybookData(json));
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('Fetching'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * set fetched playbooks in the store
 * @param {*} templates
 * @returns
 */
export function setPlaybookData(templates) {
  return {
    type: Types.FETCH_PLAYBOOKS,
    templates,
  };
}

/**
 * fetched playbooks by it's id
 * @param {*} id
 * @returns
 */

export function fetchPlaybookById(id) {
  return (dispatch) => {
    const bulkConfigByIdURL = API_GET_CONFIG_TEMPLATE_BY_ID.replace('<id>', id);
    dispatch(showApplicationLoader('Fetching', 'Loading Playbook...'));
    return callAPI(bulkConfigByIdURL)
      .then((json) => {
        dispatch(hideApplicationLoader('Fetching'));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(valueChange(STATIC_KEYS.UI_TEMPLATE_BY_ID, json));
          dispatch(setSinglePlaybook(json));
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('Fetching'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function deletePlaybook(id, history) {
  return (dispatch) => {
    const bulkConfigByIdURL = API_GET_CONFIG_TEMPLATE_BY_ID.replace('<id>', id);
    const obj = createPayload(API_TYPES.DELETE, {});
    dispatch(showApplicationLoader('Fetching', 'Deleting playbooks...'));
    return callAPI(bulkConfigByIdURL, obj)
      .then((json) => {
        dispatch(hideApplicationLoader('Fetching'));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(closeModal());
          if (typeof history !== 'undefined') {
            history.push(PLAYBOOK_LIST);
          }
          dispatch(refresh());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('Fetching'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 *validate provided id playbook
 * @param {*} id - playbook id
 * @returns
 */

export function validatePlaybook(id) {
  return (dispatch) => {
    const obj = createPayload(API_TYPES.POST, { });
    dispatch(showApplicationLoader('configuring-bulk-upload', 'Playbook validation started successfully...'));
    const url = API_VALIDATE_TEMPLATE.replace('<id>', id);
    return callAPI(url, obj).then((json) => {
      dispatch(hideApplicationLoader('configuring-bulk-upload'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(addMessage('Playbook validation started successfully...', MESSAGE_TYPES.SUCCESS));
        dispatch(closeModal());
        dispatch(refresh());
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('configuring-bulk-upload'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

export function uploadFile(dispatch, file) {
  const formData = new FormData();
  formData.append('file', file);
  const url = getUrlPath(API_UPLOAD_TEMPLATED);
  fetch(url, {
    method: 'POST',
    body: formData,
  }).then((response) => response.json()).then((data) => {
    if (typeof data === 'object') {
      setTimeout(() => this.onValidateFile(dispatch, data), 1500);
    } else {
      dispatch(addMessage(data, MESSAGE_TYPES.ERROR));
    }
  }, (err) => {
    dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
  });
}

/**
 * set selected playbook in the store
 * @param {*} selectedPlaybook - object
 * @returns
 */
export function setSinglePlaybook(selectedPlaybook) {
  return {
    type: Types.SET_PLAYBOOK,
    selectedPlaybook,
  };
}

export function handlePlaybooksSelect(data, isSelected, primaryKey) {
  return (dispatch, getState) => {
    const { drPlaybooks } = getState();
    const { selectedPlaybook } = drPlaybooks;
    if (isSelected) {
      if (!selectedPlaybook || selectedPlaybook.length === 0 || !selectedPlaybook[data[primaryKey]]) {
        const newSelectedPlaybook = { ...selectedPlaybook, [data[primaryKey]]: data };
        dispatch(setSelectedPlaybook(newSelectedPlaybook));
      }
    } else if (selectedPlaybook[data[primaryKey]]) {
      const newSelectedPlaybook = selectedPlaybook;
      delete newSelectedPlaybook[data[primaryKey]];
      dispatch(setSelectedPlaybook(newSelectedPlaybook));
    }
  };
}

export function setSelectedPlaybook(selectedPlaybooks) {
  return {
    type: Types.SET_SELECTED_PLAYBOOKS,
    selectedPlaybooks,
  };
}

export function setAllPlaybooks(value) {
  return (dispatch, getState) => {
    const { drPlaybooks } = getState();
    if (value) {
      let newPlaybooks = {};
      drPlaybooks.templates.forEach((key) => {
        newPlaybooks = { ...newPlaybooks, [key.id]: key };
      });
      dispatch(setSelectedPlaybook(newPlaybooks));
    } else {
      dispatch(setSelectedPlaybook([]));
    }
  };
}

/**
 * deletes multiple selected playbooks
 * @returns
 */

export function onMultiplePlaybookDelete() {
  return (dispatch, getState) => {
    const { drPlaybooks } = getState();
    const { selectedPlaybook } = drPlaybooks;
    const ids = Object.keys(selectedPlaybook);
    const calls = [];
    ids.forEach((id) => {
      calls.push(dispatch(deletePlaybook(id)));
    });
    dispatch(setSelectedPlaybook([]));
  };
}

/**
 * creates plan from playbook
 * @param {*} id - playbook id
 * @returns
 */

export function onCreatePlanFromPlaybook(id) {
  return (dispatch) => {
    const obj = createPayload(API_TYPES.POST, {});
    dispatch(showApplicationLoader('configuring-bulk-upload', 'Configuring Protection plan from playbook...'));
    return callAPI(CREATE_PLAN_FROM_PLAYBOOK.replace('<id>', id), obj).then((json) => {
      dispatch(hideApplicationLoader('configuring-bulk-upload'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(addMessage('Protection plan configured successfully', MESSAGE_TYPES.SUCCESS));
        const { name, status } = json;
        if (status !== 'configPlanReconfigured' && typeof name !== 'undefined') {
          const result = `/playbooks/${json.name}`;
          const link = document.createElement('a');
          link.href = result;
          link.click();
        }
        dispatch(closeModal());
        dispatch(closeModal());
        dispatch(refresh());
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('configuring-bulk-upload'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

/**
 * download configured plan playbook used for edit
 * @param {*} id
 * @returns
 */
export function onPlanPlaybookExport(id) {
  return (dispatch) => {
    let url = API_BULK_GENERATE;
    url = `${url}/ ?planID=${id}`;

    dispatch(showApplicationLoader('configuring-bulk-plan-export', 'Exporting configured plan excel'));
    callAPI(url).then((json) => {
      dispatch(hideApplicationLoader('configuring-bulk-plan-export'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(addMessage('exported successfully ', MESSAGE_TYPES.SUCCESS));
        const { name = 'undefined' } = json;
        if (typeof name !== 'undefined') {
          const result = `/playbooks/download/${json.name}`;
          const link = document.createElement('a');
          link.href = result;
          link.click();
        }
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('configuring-bulk-plan-export'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

export function downloadRecoveryPlaybook(id) {
  return (dispatch) => {
    const payload = {
      planID: `${id}`,
      playbookType: 'recovery',
      targetSiteID: '0',
      playbookEntities: [],
    };
    const obj = createPayload(API_TYPES.POST, { ...payload });
    dispatch(showApplicationLoader('configuring-bulk-upload', 'Configuring Excel file to download'));
    return callAPI(API_BULK_GENERATE, obj).then((json) => {
      dispatch(hideApplicationLoader('configuring-bulk-upload'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(addMessage('Playbook Configured Successfully', MESSAGE_TYPES.SUCCESS));
        const { name = 'undefined' } = json;
        if (typeof name !== 'undefined') {
          const result = `/playbooks/download/${json.name}`;
          const link = document.createElement('a');
          link.href = result;
          link.click();
        }
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('configuring-bulk-upload'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

export function playbookFetchPlanDiff(id, playbook) {
  return (dispatch) => {
    const url = API_GET_PLAN_DIFF.replace('<id>', id);
    dispatch(showApplicationLoader('configuring-bulk-plan-export', 'Showing Playbook difference...'));
    return callAPI(url).then((json) => {
      dispatch(hideApplicationLoader('configuring-bulk-plan-export'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(checkPlanConfigurationChanges(json.currentPlanConfiguration[0], json.updatedPlanConfiguration[0]));
        const prevObj = {};
        json.currentPlanConfiguration[0].recoveryEntities.instanceDetails.forEach((d, ind) => {
          // added guest os and firmware information in recovery configuration to show different values for playbook diff page
          const data = d;
          data.guestOS = json.currentPlanConfiguration[0].protectedEntities.virtualMachines[ind].guestOS;
          data.firmwareType = json.currentPlanConfiguration[0].protectedEntities.virtualMachines[ind].firmwareType;
          data.replPostScript = json.currentPlanConfiguration[0].protectedEntities.virtualMachines[ind].postScript;
          data.replPreScript = json.currentPlanConfiguration[0].protectedEntities.virtualMachines[ind].preScript;
          prevObj[data.sourceMoref] = data;
        });
        const currObj = {};
        json.updatedPlanConfiguration[0].recoveryEntities.instanceDetails.forEach((d, ind) => {
          // added guest os and firmware information in recovery configuration to show different values for playbook diff page
          const data = d;
          data.guestOS = json.updatedPlanConfiguration[0].protectedEntities.virtualMachines[ind].guestOS;
          data.firmwareType = json.updatedPlanConfiguration[0].protectedEntities.virtualMachines[ind].firmwareType;
          data.replPostScript = json.updatedPlanConfiguration[0].protectedEntities.virtualMachines[ind].postScript;
          data.replPreScript = json.updatedPlanConfiguration[0].protectedEntities.virtualMachines[ind].preScript;
          currObj[data.sourceMoref] = data;
        });

        dispatch(checkVmRecoveryConfigurationChanges({ prevArr: prevObj, currentArr: currObj, recoveryPlatform: json.updatedPlanConfiguration[0].recoverySite.platformDetails.platformType, condition: 'sourceMoref', key: 'ans' }));
        if (playbook) {
          const { planConfigurations } = playbook;
          const disabledVMsName = {};
          if (planConfigurations[0].planValidationResponse !== '') {
            const validationResponse = JSON.parse(planConfigurations[0].planValidationResponse);
            validationResponse.forEach((vm, index) => {
              disabledVMsName[index] = { ...vm, changeTracking: false };
            });
          }
          const options = { title: 'Reconfigure Plan', playbookId: playbook.id, confirmAction: onCreatePlanFromPlaybook, message: `Are you sure want to configure protection plan from ${playbook.name} playbook ?`, footerLabel: 'Reconfigure Protection Plan', color: 'success', size: 'lg', planName: json.updatedPlanConfiguration[0].name, planId: id, disabledVMs: disabledVMsName };
          dispatch(openModal(MODAL_RECONFIGURE_PLAYBOOK, options));
          return;
        }
        const options = { title: 'View Changes', size: 'lg', planId: id, planName: json.updatedPlanConfiguration[0].name };
        dispatch(openModal(MODAL_TEMPLATE_SHOW_PPLAN_CHANGES, options));
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('configuring-bulk-plan-export'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

function validate(user, dispatch) {
  const recoverySiteField = FIELDS['drplan.recoverySite'];
  const sourceSiteField = FIELDS['drplan.protectedSite'];
  const { values } = user;
  const validateRecoverySite = validateField(recoverySiteField, 'drplan.recoverySite', getValue('drplan.recoverySite', values), dispatch, user);
  const validateSourceSite = validateField(sourceSiteField, 'drplan.recoverySite', getValue('drplan.recoverySite', values), dispatch, user);

  if (!validateRecoverySite || !validateSourceSite) { return false; }
  const selectedVms = getVirtualMachines(user);
  if (!selectedVms || selectedVms.length === 0) {
    dispatch(addMessage('Please select virtual machine', MESSAGE_TYPES.ERROR));
    return false;
  }
  return true;
}

export function configurePlaybookGenerate() {
  return (dispatch, getState) => {
    const { user } = getState();
    if (validate(user, dispatch)) {
      const payload = generatePlaybookPayload(user, 'protectionPlan');
      const obj = createPayload(API_TYPES.POST, { ...payload });
      dispatch(showApplicationLoader('configuring-bulk-upload', 'Configuring Excel file to download'));
      return callAPI(API_BULK_GENERATE, obj).then((json) => {
        dispatch(hideApplicationLoader('configuring-bulk-upload'));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(addMessage('Playbook generated and downloaded successfully', MESSAGE_TYPES.SUCCESS));
          const { name = 'undefined' } = json;
          if (typeof name !== 'undefined') {
            downloadDateModifiedPlaybook(name);
          }
          dispatch(closeModal(true));
          dispatch(refresh());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('configuring-bulk-upload'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
    }
  };
}

export function uploadFiles(file, apiUrl, msg1, msg2, method) {
  return (dispatch) => {
    const formData = new FormData();
    formData.append('file', file);
    const url = getUrlPath(apiUrl);
    dispatch(showApplicationLoader('playbook_upload_file', msg1));
    return fetch(url, {
      method: method || 'POST',
      body: formData,
    }).then((response) => response.json()).then((data) => {
      dispatch(hideApplicationLoader('playbook_upload_file'));
      if (typeof data === 'string') {
        dispatch(addMessage(data, MESSAGE_TYPES.ERROR));
      } else {
        if (msg2) {
          dispatch(addMessage(msg2, MESSAGE_TYPES.SUCCESS));
        }
        dispatch(closeModal(true));
        dispatch(refresh());
      }
    }, (err) => {
      dispatch(hideApplicationLoader('playbook_upload_file'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

export function updateIsPlaybookDownloadedStatus(playbookId) {
  return (dispatch) => {
    const url = API_UPDATE_ISPLAYBOOK_DOWNLOAD_STATUS.replace('<playbookid>', playbookId);
    const obj = createPayload(API_TYPES.PUT, { });
    return callAPI(url, obj).then((json) => {
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        dispatch(refresh());
      }
    },
    (err) => {
      dispatch(hideApplicationLoader('configuring-bulk-upload'));
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
  };
}

export function downloadPlaybooks(data, dispatch) {
  const { playbookStatus, id } = data;
  const payload = { playbookType: PLAYBOOK_TYPE.PLAN, playbookID: `${id}` };
  const obj = createPayload(API_TYPES.POST, payload);
  callAPI(API_BULK_GENERATE, obj).then((json) => {
    if (json) {
      if (json.name && typeof json.name !== 'undefined') {
        if (playbookStatus === PLAYBOOK_IN_VALIDATED) {
          dispatch(updateIsPlaybookDownloadedStatus(id));
        }
        const downloadURL = `${window.location.protocol}//${window.location.host}/playbooks/${json.name}`;
        const link = document.createElement('a');
        link.href = downloadURL;
        link.click();
        dispatch(refresh());
      }
    }
  },
  (err) => {
    dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
  });
}

export function downloadDateModifiedPlaybook(name) {
  const result = `/playbooks/download/${name}`;
  const nameSplitByDash = name.split('-');
  const d = new Date(parseInt(nameSplitByDash[nameSplitByDash.length - 1].split('.')[0], 10) * 1000);
  let resp = '';
  resp = `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`;
  resp = resp.replaceAll('/', '_').split(' ').join('_');
  const link = document.createElement('a');
  nameSplitByDash.pop();
  link.download = `${nameSplitByDash.join('_')}-${resp}`;
  link.href = result;
  link.click();
}
