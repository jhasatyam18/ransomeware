import * as Types from '../../constants/actionTypes';
import INITIAL_STATE from '../../constants/InitialState';

export default function user(state = INITIAL_STATE.user, action) {
  switch (action.type) {
    case Types.APP_REFRESH:
      return {
        ...state, context: { ...state.context, refresh: state.context.refresh + 1 },
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
    case Types.VALUE_CHANGES:
      return {
        ...state,
        values: {
          ...state.values,
          ...action.values,
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
    case Types.UPDATE_VALUES:
      return {
        ...state,
        values: {
          ...state.values,
          ...action.valueObject,
        },
        context: { ...state.context, updateID: state.context.updateID + 1 },
      };
    case Types.DM_FORCE_UPDATE:
      return {
        ...state, context: { ...state.context, updateID: state.context.updateID + 1 },
      };
    case Types.TREE_DATA: {
      return {
        ...state, values: { ...state.values, [action.key]: action.value },
      };
    }
    case Types.APP_USER_RESET_PASSWORD:
      return {
        ...state, passwordResetReq: action.passwordResetReq, allowReset: action.allowReset,
      };
    case Types.SET_USER_DETAILS: {
      return {
        ...state, id: action.data.id, userRole: action.data.role.name,

      };
    }
    case Types.FETCH_USERS: {
      return { ...state, users: action.data };
    }
    case Types.FETCH_ROLES: {
      return { ...state, roles: action.roles };
    }
    default:
      return state;
  }
}
