import INITIAL_STATE from '../../constants/InitialState';
import * as Types from '../../constants/actionTypes';

export default function support(state = INITIAL_STATE.support, action) {
  switch (action.type) {
    case Types.FETCH_SUPPORT_BUNDLES:
      return { bundles: action.bundles };
    default:
      return state;
  }
}
