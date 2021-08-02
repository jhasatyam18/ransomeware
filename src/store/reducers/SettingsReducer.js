import INITIAL_STATE from '../../constants/InitialState';
import * as Types from '../../constants/actionTypes';

export default function settings(state = INITIAL_STATE.settings, action) {
  switch (action.type) {
    case Types.FETCH_SUPPORT_BUNDLES:
      return { ...state, bundles: action.bundles };
    case Types.FETCH_NODES:
      return { ...state, nodes: action.nodes };
    case Types.SET_SELECTED_NODES:
      return { ...state, selectedNodes: action.selectedNodes };
    default:
      return state;
  }
}
