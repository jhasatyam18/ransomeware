import { hideApplicationLoader, refresh, showApplicationLoader, valueChange, valueChanges } from './UserActions';
import { addMessage } from './MessageActions';
import * as Types from '../../constants/actionTypes';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { API_IDP, API_ROLES, API_UPLOAD_IDP_CONFIG } from '../../constants/ApiConstants';
import { API_TYPES, callAPI, createPayload, getUrlPath } from '../../utils/ApiUtils';
import { validateConfigureIDP } from '../../utils/validationUtils';
import { getConfigureIDPPayload } from '../../utils/PayloadUtil';
import { closeModal } from './ModalActions';

// Reducer invoking function
export function setIDP(data) {
  return {
    type: Types.FETCH_IDP,
    data,
  };
}

export function setRoleData() {
  return (dispatch) => {
    dispatch(showApplicationLoader('FETCHING-ROLES', 'Loading roles...'));
    return callAPI(API_ROLES)
      .then((json = []) => {
        dispatch(hideApplicationLoader('FETCHING-ROLES'));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(valueChange('ui.values.roles', json));
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('FETCHING-ROLES'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function fetchRegisteredIDP() {
  return (dispatch) => {
    dispatch(showApplicationLoader('FETCHING_IDP', 'Loading Identity provider...'));
    return callAPI(API_IDP)
      .then((json = []) => {
        dispatch(hideApplicationLoader('FETCHING_IDP'));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(setIDP(json));
          dispatch(setIDPFields(json));
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('FETCHING_IDP'));
        const { message = '' } = err;
        // skip the error message if IDP is not configured
        if (message.indexOf('failed to retrieve Identity Provider configuration or settings are not configured') !== -1) {
          dispatch(setIDP({}));
          dispatch(setIDPFields({}));
          return;
        }
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function setIDPFields(data) {
  return (dispatch) => {
    const { name = '', metadataURL = '', attributes = {}, roleMaps = [], metadataFile = '' } = data;
    const { email = '', name: nameAttr = '', role = '' } = attributes;
    const val = {};
    val['configureIDP.name'] = name;
    val['configureIDP.metadataURL'] = metadataURL;
    val['configureIDP.metadataFile'] = metadataFile;
    val['configureIDP.attributes.email'] = email;
    val['configureIDP.attributes.name'] = nameAttr;
    val['configureIDP.attributes.role'] = role;
    let roles = [];
    // set role mapping if available
    if (roleMaps && roleMaps.length > 0) {
      roles = roleMaps.map((r) => {
        if (typeof r.adRole !== 'undefined' || typeof r.dmRole !== 'undefined') {
          return { key: r.adRole, value: r.dmRole };
        }
      });
    }
    val['configureIDP.roleMaps'] = roles;
    dispatch(valueChanges(val));
  };
}

export function saveIDPConfiguration() {
  return (dispatch, getState) => {
    const { user, settings } = getState();
    const { idp } = settings;
    const isValid = validateConfigureIDP(user, dispatch);
    if (isValid) {
      const isEdit = idp && typeof idp.id !== 'undefined' && idp.id !== 0;
      const payload = getConfigureIDPPayload(user, settings);
      const url = isEdit ? `${API_IDP}/${idp.id}` : API_IDP;
      const obj = createPayload(isEdit ? API_TYPES.PUT : API_TYPES.POST, { ...payload.configureIDP });
      dispatch(showApplicationLoader('CONFIGURING_IDP'));
      return callAPI(url, obj)
        .then((json = {}) => {
          dispatch(hideApplicationLoader('CONFIGURING_IDP'));
          if (json.hasError) {
            dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
          } else {
            dispatch(addMessage(json.message, MESSAGE_TYPES.SUCCESS));
            dispatch(refresh());
          }
        },
        (err) => {
          dispatch(hideApplicationLoader('CONFIGURING_IDP'));
          dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
        });
    }
  };
}

export function deleteIDPConfiguration() {
  return (dispatch, getState) => {
    const { settings } = getState();
    const { idp } = settings;
    const url = `${API_IDP}/${idp.id}`;
    const obj = createPayload(API_TYPES.DELETE, {});
    callAPI(url, obj)
      .then((json = []) => {
        dispatch(hideApplicationLoader('DELETING_IDP_CONFIGURATION'));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(addMessage(json.message, MESSAGE_TYPES.SUCCESS));
          dispatch(closeModal());
          dispatch(refresh());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('DELETING_IDP_CONFIGURATION'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function uploadMetadataFile(file, name) {
  return (dispatch, getState) => {
    const { settings } = getState();
    const { idp } = settings;
    const isEdit = idp && typeof idp.id !== 'undefined' && idp.id !== 0;
    // create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    formData.append('id', isEdit ? idp.id : 0);
    const url = getUrlPath(API_UPLOAD_IDP_CONFIG);
    dispatch(showApplicationLoader('UPLOADING_SAML_CONFIG', 'Uploading...'));
    fetch(url, {
      method: ('POST'),
      body: formData,
    }).then((response) => {
      if (response.ok) {
        dispatch(hideApplicationLoader('UPLOADING_SAML_CONFIG'));
        dispatch(valueChange('configureIDP.metadataFile', name));
      } else {
        dispatch(hideApplicationLoader('UPLOADING_SAML_CONFIG'));
        response.text().then((text) => {
          dispatch(addMessage(text, MESSAGE_TYPES.ERROR));
        });
      }
    })
      .catch((err) => {
        dispatch(hideApplicationLoader('UPLOADING_SAML_CONFIG'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}
