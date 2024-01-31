import INITIAL_STATE from '../../constants/InitialState';
import * as Types from '../../constants/actionTypes';

export default function drPlaybooks(state = INITIAL_STATE.drPlaybooks, action) {
  switch (action.type) {
    case Types.FETCH_PLAYBOOKS:
      return {
        ...state,
        templates: action.templates,
        playbook: {},
      };
    case Types.SET_SELECTED_PLAYBOOKS:
      return {
        ...state,
        selectedPlaybook: action.selectedPlaybooks,
        playbook: {},
      };
    case Types.SET_PLAYBOOK:
      return {
        ...state,
        playbook: action.selectedPlaybook,
      };
    default:
      return state;
  }
}
