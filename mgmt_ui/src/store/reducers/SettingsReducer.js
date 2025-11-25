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
    case Types.FETCH_THROTTLING_REPLNODES:
      return { ...state, replNodes: action.replNodes };
    case Types.RESET_SETTINGS:
      return { ...INITIAL_STATE.settings };
    case Types.FETCH_LICENSES:
      return { ...state, licenses: action.licenses };
    case Types.FETCH_IDP:
      return { ...state, idp: action.data };
    case Types.SET_SELECTED_USERS:
      return { ...state, selectedUsers: action.selectedUsers };
    case Types.FETCH_SCHEDULED_NODES:
      return { ...state, scheduledNodes: action.data };
    case Types.SET_SELECTED_SCEDULED_NODES:
      return { ...state, selectedScheduledNodes: action.selectedScheduledNodes };
    case Types.SET_SELECTED_CREATE_SCEDULED_NODES:
      return { ...state, selectedCreateScheduledNodes: action.selectedScheduledNodes };
    default:
      return state;
  }
}
