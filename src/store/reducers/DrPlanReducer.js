import * as Types from '../../constants/actionTypes';
import INITIAL_STATE from '../../constants/InitialState';

export default function drPlans(state = INITIAL_STATE.drPlans, action) {
  switch (action.type) {
    case Types.FETCH_DR_PLANS:
      return {
        ...state,
        plans: action.plans,
        selectedPlans: [],
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
    case Types.AL_VM_RECOVERED_IN_PLAN:
      return {
        ...state, allVmRecovered: action.allVmRecovered,
      };
    case Types.UPDATE_SELECTED_CLEANUP_RESOURCES:
      // const { data = [] } = state.cleanup || {};
      return {
        ...state, cleanup: { ...state.cleanup, selectedResources: action.selectedCleanupSources },
      };
    case Types.FETCHED_CLEAN_UP_RESOURCES:
      const { selectedResources = {} } = state.cleanup || {};
      return {
        ...state, cleanup: { data: action.data, fullData: action.fullData, selectedResources },
      };
    case Types.SET_CLEANUP_DATA:
      return {
        ...state, cleanup: { ...state.cleanup, data: action.data },
      };
    default:
      return state;
  }
}
