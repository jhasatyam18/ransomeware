import INITIAL_STATE from '../../constants/InitialState';
import * as Types from '../../constants/actionTypes';

export default function drPlans(state = INITIAL_STATE.drPlans, action) {
  switch (action.type) {
    case Types.FETCH_DR_PALNS:
      return {
        selectedPlans: [],
        plans: action.plans,
      };
    case Types.UPDATE_SELECTED_DR_PLAN:
      return {
        plans: state.plans,
        selectedPlans: action.selectedPlans,
      };
    case Types.FETCH_DR_PALN_DETAILS:
      return {
        ...state, details: action.details,
      };
    default:
      return state;
  }
}
