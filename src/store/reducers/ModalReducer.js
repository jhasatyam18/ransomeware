import INITIAL_STATE from '../../constants/InitialState';
import * as Types from '../../constants/actionTypes';

export default function modals(state = INITIAL_STATE.modal, action) {
  switch (action.type) {
    case Types.CLOSE_MODAL:
      return {
        ...state, content: null, options: {}, show: false,
      };

    case Types.OPEN_MODAL:
      return {
        ...state, content: action.content, options: action.options, show: true, showFooter: action.showFooter,
      };

    default:
      return state;
  }
}
