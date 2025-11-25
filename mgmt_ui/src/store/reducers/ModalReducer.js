import * as Types from '../../constants/actionTypes';
import INITIAL_STATE from '../../constants/InitialState';

export default function modals(state = INITIAL_STATE.modal, action) {
  switch (action.type) {
    case Types.CLOSE_MODAL:
      return action.updatedModal;
    case Types.OPEN_MODAL:
      return [
        ...state, { content: action.content, options: action.options, show: true, showFooter: action.showFooter },
      ];

    default:
      return state;
  }
}
