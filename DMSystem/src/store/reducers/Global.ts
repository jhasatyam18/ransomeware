import * as Types from '../../Constants/actionTypes';
import INITIAL_STATE from '../../Constants/InitialState';

interface GlobalAction {
    key: string;
    value: string;
    type: string;
}

export default function gobal(state = INITIAL_STATE.global, action: GlobalAction) {
    switch (action.type) {
        case Types.ADD_KEY_TO_APPLICATION_LOADER:
            const newKeys: Record<string, string> = state.loaderKeys;
            newKeys[action.key] = action.value;
            return { ...state, loaderKeys: newKeys };
        case Types.REMOVE_KEY_FROM_APPLICATION_LOADER:
            const deleteKeys: Record<string, string> = state.loaderKeys;
            delete deleteKeys[action.key];
            return { ...state, loaderKeys: deleteKeys };
        default:
            return state;
    }
}
