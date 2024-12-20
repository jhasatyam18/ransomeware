import * as Types from '../../Constants/actionTypes';

export function loginSuccess(token: string, username: string) {
    return {
        type: Types.AUTHENTICATE_USER_SUCCESS,
        token,
        username,
    };
}
