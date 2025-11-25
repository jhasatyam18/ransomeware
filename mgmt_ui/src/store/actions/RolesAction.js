import { callAPI } from '../../utils/ApiUtils';
import { API_ROLES } from '../../constants/ApiConstants';
import { hideApplicationLoader, showApplicationLoader } from './UserActions';
import { addMessage } from './MessageActions';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import * as Types from '../../constants/actionTypes';

export function fetchRoles() {
  return (dispatch) => {
    dispatch(showApplicationLoader('Fetching', 'loading roles'));
    return callAPI(API_ROLES, 'loading roles')
      .then((json) => {
        dispatch(hideApplicationLoader('Fetching'));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(rolesFetched(json));
        }
      },
      (err) => {
        dispatch(hideApplicationLoader('Fetching'));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  };
}
export function rolesFetched(roles) {
  return {
    type: Types.FETCH_ROLES,
    roles,
  };
}
