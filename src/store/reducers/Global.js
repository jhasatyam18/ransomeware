import INITIAL_STATE from '../../constants/InitialState';
import * as Types from '../../constants/actionTypes';

export default function gobal(state = INITIAL_STATE.global, action) {
  switch (action.type) {
    case Types.ADD_KEY_TO_APPLICATION_LOADER:
      const newKeys = state.loaderKeys;
      newKeys[action.key] = action.value;
      return { ...state, loaderKeys: newKeys };
    case Types.REMOVE_KEY_FROM_APPLICATION_LOADER:
      const deleteKeys = state.loaderKeys;
      delete deleteKeys[action.key];
      return { ...state, loaderKeys: deleteKeys };
    default:
      return state;
  }
}
