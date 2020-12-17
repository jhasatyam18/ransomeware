import * as Types from '../../constants/actionTypes';

export default function messages(state = {}, action) {
  switch (action.type) {
    case Types.ADD_MESSAGE:
      const time = Date.now();
      return {
        ...state,
        [time]: { type: action.msgType, text: action.message, isSticky: action.isSticky },
      };
    case Types.CLEAR_ALL_MESSAGES:
      return {};
    case Types.REMOVE_MESSAGE:
      const newStateValues = { ...state };
      delete newStateValues[action.id];
      return newStateValues;
    default:
      return state;
  }
}
