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
    case Types.FETCH_EMAIL_CONFIGURATION:
      return { ...state, email: action.config };
    case Types.FETCH_EMAIL_RECIPIENTS:
      return { ...state, emailRecipients: action.emailRecipients };
    case Types.RESET_SETTINGS:
      return { ...INITIAL_STATE.settings };
    case Types.FETCH_LICENSES:
      return { ...state, licenses: action.licenses };
    default:
      return state;
  }
}
