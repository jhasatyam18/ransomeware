import INITIAL_STATE from '../../constants/InitialState';
import * as Types from '../../constants/actionTypes';

export default function dashboard(state = INITIAL_STATE.dashboard, action) {
  switch (action.type) {
    case Types.DASHBOARD_TILE_DATA:
      return { ...state, titles: action.titles };
    case Types.DASHBOARD_REPLICATION_STAT:
      return { ...state, replicationStats: action.replicationStats };
    case Types.DASHBOARD_FETCH_DR_PLAN_DETAILS:
      return { ...state, recoveryStats: action.recoveryStats };
    case Types.DASHBOARD_PROTECTED_VM_STAT:
      return { ...state, protectedVMStats: action.protectedVMStat };
    case Types.DASHBOARD_NODE_INFO_STAT:
      return { ...state, nodes: action.nodeInfoStat };
    case Types.RESET_DASHBOARD:
      return INITIAL_STATE.dashboard;
    case Types.DASHBOARD_NODES_FETCHED:
      return { ...state, nodes: action.nodes };
    default:
      return state;
  }
}
