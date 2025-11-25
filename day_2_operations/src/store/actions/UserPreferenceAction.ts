import { API_USER_PREFERENCE } from '../../constants/ApiUrlConstant';
import { APPLICATION_THEME, APPLICATION_UID, MESSAGE_TYPES, SAML, THEME_CONSTANT } from '../../constants/userConstant';
import { UserDetails } from '../../interfaces/interface';
import { API_TYPES, callAPI, createPayload, getCookie } from '../../utils/apiUtils';
import { hideApplicationLoader, showApplicationLoader } from '../reducers/globalReducer';
import { addMessage } from '../reducers/messageReducer';
import { addUserPreferences, valueChange } from '../reducers/userReducer';

/**
 * For saving user theme preferences through api
 * @returns
 */
export const AddUserThemePreference = () => (dispatch: any, getState: any) => {
    const { user } = getState();
    const theme = localStorage.getItem(APPLICATION_THEME) || THEME_CONSTANT.DARK;
    const newTheme = theme === THEME_CONSTANT.LIGHT ? THEME_CONSTANT.DARK : THEME_CONSTANT.LIGHT;
    const { userDetails, userPreferences } = user;
    const obj = { ...userPreferences };
    // If the user is created but there were no preferences then do post call otherwise do put call
    const method = Object.keys(userPreferences).length > 0 && userPreferences.username ? API_TYPES.PUT : API_TYPES.POST;
    const url = API_USER_PREFERENCE;

    if (method === API_TYPES.POST) {
        const uid = getCookie(APPLICATION_UID);
        obj.username = userDetails.username;
        obj.userType = 'System';
        /**
       If doing post call then need to specify username and userType
       username we can get from user details key in store
       usertype can be SAML or System for saml we need to add some condition below
       */
        if (typeof uid !== 'undefined' && uid === '0') {
            obj.userType = SAML.DEFAULT_USERNAME;
        }
    }

    // wheathe it's put or post themepreference will always going to changes hence it's outside
    obj.themePreference = newTheme;

    const bodyJson = createPayload(method, obj);
    dispatch(showApplicationLoader({ key: 'CHANGE_THEME', value: 'Applying Theme...' }));
    return callAPI(url, bodyJson).then(
        (json) => {
            dispatch(hideApplicationLoader('CHANGE_THEME'));
            if (json.hasError) {
                dispatch(addMessage({ message: json.message, messageType: MESSAGE_TYPES.ERROR }));
            } else {
                localStorage.setItem(APPLICATION_THEME, json.themePreference);
                dispatch(valueChange([APPLICATION_THEME, json.themePreference]));
                dispatch(getUserPreference(json));
            }
        },
        (err) => {
            dispatch(hideApplicationLoader('CHANGE_THEME'));
            dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
        },
    );
};

/**
 * Fetch the user prefences for UI eg. theme
 *
 * @param {UserDetails} userDetails - An object containing user data
 * @returns
 */
export function getUserPreference(userDetails: UserDetails) {
    return (dispatch: any) => {
        const url = `${API_USER_PREFERENCE}/${userDetails.username}`;
        return callAPI(url).then(
            (json) => {
                if (!json.hasError) {
                    dispatch(valueChange([APPLICATION_THEME, json.themePreference]));
                    dispatch(addUserPreferences(json));
                    localStorage.setItem(APPLICATION_THEME, json.themePreference);
                }
            },
            () => {
                localStorage.setItem(APPLICATION_THEME, THEME_CONSTANT.DARK);
            },
        );
    };
}
