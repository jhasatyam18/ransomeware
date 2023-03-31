// actions
import * as Types from '../../constants/actionTypes';
// constants
import { API_NODES } from '../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
// Util
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { addMessage } from './MessageActions';
import { closeModal } from './ModalActions';
import { hideApplicationLoader, showApplicationLoader, valueChange } from './UserActions';

/**
 * Fetch all the available nodes
 * @returns set of nodes data in redux managed state
 */
export function fetchNodes(key) {
  return (dispatch) => {
    dispatch(showApplicationLoader(API_NODES, 'Loading nodes ...'));
    return callAPI(API_NODES)
      .then((json) => {
        dispatch(hideApplicationLoader(API_NODES));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          if (key) {
            dispatch(valueChange(key, json));
          }
          if (!key) {
            dispatch(nodesFetched(json));
          }
          dispatch(setSelectedNodes({}));
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(API_NODES));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * Create or update node
 */
export function configureNode(node) {
  return (dispatch) => {
    dispatch(showApplicationLoader(API_NODES, 'Configuring node...'));
    const method = (typeof node.id === 'undefined' ? API_TYPES.POST : API_TYPES.PUT);
    const url = (typeof node.id === 'undefined' ? API_NODES : `${API_NODES}/${node.id}`);
    const obj = createPayload(method, node);
    return callAPI(url, obj)
      .then((json) => {
        dispatch(hideApplicationLoader(API_NODES));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(addMessage('Node configured successfully.', MESSAGE_TYPES.INFO));
          dispatch(fetchNodes());
          dispatch(closeModal());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(API_NODES));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * Delete node
 */
export function removeNode(id) {
  return (dispatch) => {
    dispatch(showApplicationLoader(`${API_NODES}-${id}`, 'Removing node'));
    const obj = createPayload(API_TYPES.DELETE, {});
    return callAPI(`${API_NODES}/${id}`, obj)
      .then((json) => {
        dispatch(hideApplicationLoader(`${API_NODES}-${id}`));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(addMessage('Node deleted successfully', MESSAGE_TYPES.INFO));
          dispatch(fetchNodes());
          dispatch(closeModal());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(`${API_NODES}-${id}`));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

export function moveNodesToOffline() {
  return (dispatch, getState) => {
    const { settings } = getState();
    const { selectedNodes } = settings;
    const ids = Object.keys(selectedNodes);
    const calls = [];
    ids.forEach((id) => {
      calls.push(dispatch(offlineNode(id, selectedNodes[id].name)));
    });
    dispatch(closeModal());
  };
}

export function moveNodesToOnline() {
  return (dispatch, getState) => {
    const { settings } = getState();
    const { selectedNodes } = settings;
    const ids = Object.keys(selectedNodes);
    const calls = [];
    ids.forEach((id) => {
      calls.push(dispatch(onlineNode(id, selectedNodes[id].name)));
    });
    dispatch(closeModal());
  };
}

/**
 * Move nodes to offline
 */
export function offlineNode(id, name) {
  return (dispatch) => {
    dispatch(showApplicationLoader(`${API_NODES}-${id}`, `Marking node ${name} to offline`));
    const obj = createPayload(API_TYPES.POST, {});
    return callAPI(`${API_NODES}/${id}/offline`, obj)
      .then((json) => {
        dispatch(hideApplicationLoader(`${API_NODES}-${id}`));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(addMessage(`Node ${name} successfully moved to offline.`, MESSAGE_TYPES.INFO));
          dispatch(fetchNodes());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(`${API_NODES}-${id}`));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * Move nodes to online
 */
export function onlineNode(id, name) {
  return (dispatch) => {
    dispatch(showApplicationLoader(`${API_NODES}-${id}`, `Marking node ${name} to online`));
    const obj = createPayload(API_TYPES.POST, {});
    return callAPI(`${API_NODES}/${id}/online`, obj)
      .then((json) => {
        dispatch(hideApplicationLoader(`${API_NODES}-${id}`));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(addMessage(`Node ${name} successfully moved to online`, MESSAGE_TYPES.INFO));
          dispatch(fetchNodes());
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(`${API_NODES}-${id}`));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}

/**
 * Handle table selection for nodes
 * @param {*} data
 * @param {*} isSelected
 * @param {*} primaryKey
 * @returns
 */
export function handleNodeTableSelection(data, isSelected, primaryKey) {
  return (dispatch, getState) => {
    const { settings } = getState();
    const { selectedNodes } = settings;
    if (isSelected) {
      if (!selectedNodes || selectedNodes.length === 0 || !selectedNodes[data[primaryKey]]) {
        const newNodes = { ...selectedNodes, [data[primaryKey]]: data };
        dispatch(setSelectedNodes(newNodes));
      }
    } else if (selectedNodes[data[primaryKey]]) {
      const newNodes = selectedNodes;
      delete newNodes[data[primaryKey]];
      dispatch(setSelectedNodes(newNodes));
    }
  };
}

// /**
//  * fetch the node encryption key and set result in key
//  * @param {*} data
//  * @param {*} value, password of admin
//  * @param {*} errorKey
//  * @returns
//  */
// export function getNodeEncryptionKey(data, value, errorKey) {
//   return (dispatch, getState) => {
//     const { user } = getState();
//     const useValue = (typeof value === 'string' && value !== '');
//     const { values } = user;
//     const url = NODE_GET_ENCRYPTION_KEY.replace('<id>', data.id);
//     const pass = getValue('ui.encryption.password', values);
//     const obj = createPayload(API_TYPES.POST, { username: 'admin', password: (useValue === true ? value : pass) });
//     dispatch(showApplicationLoader(url, `Fetching encryption key ${data.name}`));
//     return callAPI(url, obj)
//       .then((json) => {
//         dispatch(hideApplicationLoader(url));
//         if (json === '') {
//           dispatch(valueChange(STATIC_KEYS.UI_ENCRYPTION_KEY, errorKey));
//           return;
//         }
//         dispatch(valueChange(STATIC_KEYS.UI_ENCRYPTION_KEY, json));
//       },
//       (err) => {
//         dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
//         dispatch(hideApplicationLoader(url));
//       });
//   };
// }

export function setSelectedNodes(selectedNodes) {
  return {
    type: Types.SET_SELECTED_NODES,
    selectedNodes,
  };
}

export function nodesFetched(nodes) {
  return {
    type: Types.FETCH_NODES,
    nodes,
  };
}

export function resetSettings() {
  return {
    type: Types.RESET_SETTINGS,
  };
}
