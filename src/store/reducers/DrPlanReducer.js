import INITIAL_STATE from '../../constants/InitialState';
import * as Types from '../../constants/actionTypes';

export default function drPlans(state = INITIAL_STATE.drPlans, action) {
  switch (action.type) {
    case Types.FETCH_DR_PLANS:
      return {
        ...state,
        plans: action.plans,
      };
    case Types.UPDATE_SELECTED_DR_PLAN:
      return {
        plans: state.plans,
        selectedPlans: action.selectedPlans,
      };
    case Types.FETCH_DR_PLAN_DETAILS:
      return {
        ...state, protectionPlan: action.protectionPlan,
      };
    default:
      return state;
  }
}
