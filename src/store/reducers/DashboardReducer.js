import INITIAL_STATE from '../../constants/InitialState';
import * as Types from '../../constants/actionTypes';

export default function dashboard(state = INITIAL_STATE.dashboard, action) {
  switch (action.type) {
    case Types.DASHBOARD_TILE_DATA:
      return { ...state, titles: action.titles };
    case Types.DASHBOARD_REPLICATION_STAT:
      return { ...state, replicationStats: action.replicationStats };
    case Types.DASHBOARD_REPCOVERY_STAT:
      return { ...state, recoveryStats: action.recoveryStats };
    default:
      return state;
  }
}
