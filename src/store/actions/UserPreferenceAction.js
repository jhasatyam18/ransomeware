import { APPLICATION_THEME, APPLICATION_UID, THEME_CONSTANT } from '../../constants/UserConstant';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { getCookie } from '../../utils/CookieUtils';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { SAML } from '../../constants/InputConstants';
import { API_USER_PREFERENCE } from '../../constants/ApiConstants';
import * as Types from '../../constants/actionTypes';
import { addMessage } from './MessageActions';
import { hideApplicationLoader, showApplicationLoader } from './UserActions';

export function themeChange(value) {
  return {
    type: Types.CHANGE_THEME,
    value,
  };
}

/**
 * For saving user theme preferences through api
 * @returns
 */
export const AddUserThemePreference = () => (dispatch, getState) => {
  const { user } = getState();
  const theme = localStorage.getItem(APPLICATION_THEME) || THEME_CONSTANT.DARK;
  const newTheme = theme === THEME_CONSTANT.LIGHT ? THEME_CONSTANT.DARK : THEME_CONSTANT.LIGHT;
  const { userDetails, userPreferences } = user;

  // If the user is created but there were no preferences then do post call otherwise do put call
  const method = Object.keys(userPreferences).length > 0 ? API_TYPES.PUT : API_TYPES.POST;
  const url = API_USER_PREFERENCE;

  if (method === API_TYPES.POST) {
    const uid = getCookie(APPLICATION_UID);
    userPreferences.username = userDetails.username;
    userPreferences.userType = 'System';
    /**
       If doing post call then need to specify username and userType
       username we can get from user details key in store
       usertype can be SAML or System for saml we need to add some condition below
       */
    if (typeof uid !== 'undefined' && uid === '0') {
      userPreferences.userType = SAML.DEFAULT_USERNAME;
    }
  }

  // wheathe it's put or post themepreference will always going to changes hence it's outside
  userPreferences.themePreference = newTheme;

  const obj = createPayload(method, userPreferences);
  dispatch(showApplicationLoader('CHANGE_THEME', 'Applying Theme...'));
  return callAPI(url, obj).then((json) => {
    dispatch(hideApplicationLoader('CHANGE_THEME'));
    if (json.hasError) {
      dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
    } else {
      localStorage.setItem(APPLICATION_THEME, json.themePreference);
      dispatch(themeChange(json.themePreference));
      dispatch(getUserPreference(json));
    }
  },
  (err) => {
    dispatch(hideApplicationLoader('CHANGE_THEME'));
    dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
  });
};

/**
   * Fetch the user prefences for UI eg. theme
   *
   * @param {UserDetails} userDetails - An object containing user data
   * @returns
   */
export function getUserPreference(userDetails) {
  return (dispatch) => {
    dispatch(showApplicationLoader('USER_PREFERENCE', 'Loading user preferences...'));
    const url = `${API_USER_PREFERENCE}/${userDetails.username}`;
    return callAPI(url).then((json) => {
      dispatch(hideApplicationLoader('USER_PREFERENCE'));
      if (!json.hasError) {
        dispatch(setUserPreferences(json));
        localStorage.setItem(APPLICATION_THEME, json.themePreference);
      }
    },
    () => {
      dispatch(hideApplicationLoader('USER_PREFERENCE'));
      localStorage.setItem(APPLICATION_THEME, THEME_CONSTANT.DARK);
    });
  };
}

/**
   * Action for setting user preferences
   *
   * @param {userPreferences} Object containing user preferences data
   * @returns
   */
export function setUserPreferences(userPreferences) {
  return {
    type: Types.SET_USER_PREFERENCES,
    userPreferences,
  };
}
