import INITIAL_STATE from '../../constants/InitialState';
import * as Types from '../../constants/actionTypes';

export default function sites(state = INITIAL_STATE.sites, action) {
  switch (action.type) {
    case Types.FETCH_SITES:
      return {
        selectedSites: [],
        sites: action.sites,
      };
    case Types.UPDATE_SELECTED_SITES:
      return {
        sites: state.sites,
        selectedSites: action.selectedSites,
      };
    default:
      return state;
  }
}
