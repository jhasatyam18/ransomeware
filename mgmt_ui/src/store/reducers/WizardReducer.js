import INITIAL_STATE from '../../constants/InitialState';
import * as Types from '../../constants/actionTypes';

export default function wizards(state = INITIAL_STATE.wizard, action) {
  switch (action.type) {
    case Types.CLOSE_WIZARD:
      return {
        ...state, show: false, steps: [], options: action.options,
      };

    case Types.OPEN_WIZARD:
      return {
        ...state, show: true, steps: action.steps, options: action.options,
      };

    default:
      return state;
  }
}
