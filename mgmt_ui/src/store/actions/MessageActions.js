import * as Types from '../../constants/actionTypes';

export function addMessage(message, msgType, isSticky = false, data = null) {
  return {
    type: Types.ADD_MESSAGE, msgType, message, isSticky, data,
  };
}

export function clearMessages() {
  return {
    type: Types.CLEAR_ALL_MESSAGES,
  };
}

export function removeMessage(id) {
  return {
    type: Types.REMOVE_MESSAGE,
    id,
  };
}
