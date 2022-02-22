import * as Types from '../../constants/actionTypes';
import INITIAL_STATE from '../../constants/InitialState';

export default function user(state = INITIAL_STATE.user, action) {
  switch (action.type) {
    case Types.APP_REFRESH:
      return {
        ...state, context: { refresh: state.context.refresh + 1 },
      };
    case Types.AUTHENTICATE_USER_REQUEST:
      return {
        ...state, isValidating: false, isAuthenticated: false, token: '',
      };
    case Types.AUTHENTICATE_USER_SUCCESS:
      return {
        ...state, isValidating: false, isAuthenticated: true, token: action.token,
      };
    case Types.AUTHENTICATE_USER_FAILED:
      return {
        ...state, isValidating: false, isAuthenticated: false, token: '',
      };
    case Types.LOG_OUT_USER:
      return {
        ...state, isValidating: false, isAuthenticated: false, token: '',
      };
    case Types.APP_TYPE:
      return {
        ...state, appType: action.appType, platformType: action.platformType, localVMIP: action.localVMIP, zone: action.zone,
      };
    case Types.APP_USER_CHANGE_PASSWORD:
      return {
        ...state, passwordChangeReq: action.passwordChangeReq, isAuthenticated: false, allowCancel: action.allowCancel,
      };
    case Types.AUTHENTICATE_USER_SUCCESS_PARTIAL:
      return {
        ...state, token: action.token,
      };
    case Types.VALUE_CHANGE:
      return {
        ...state,
        values: {
          ...state.values,
          [action.key]: action.value,
        },
      };
    case Types.ADD_ERROR_MESSAGE:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.key]: action.message,
        },
      };
    case Types.DELETE_ERROR_MESSAGE:
      const { errors } = state;
      if (errors && errors[action.key]) {
        delete errors[action.key];
      }
      return {
        ...state,
        errors: {
          ...errors,
        },
      };
    case Types.CLEAR_VALUES:
      return {
        ...state, values: {}, errors: {},
      };
    case Types.APP_LICENSE_INFO:
      return {
        ...state, license: action.license,
      };
    case Types.APP_USER_PRIVILEGES: {
      return {
        ...state, privileges: action.privileges,
      };
    }
    default:
      return state;
  }
}
