import * as Types from '../../Constants/actionTypes';
import { MessageProps } from '../../interfaces/interfaces';
interface MessagesState {
    [key: string]: {
        type: string;
        text: string;
        isSticky?: boolean;
    };
}
export default function messages(state: MessagesState = {}, action: MessageProps) {
    switch (action.type) {
        case Types.ADD_MESSAGE:
            const time = Date.now();
            return {
                ...state,
                [time]: { type: action.msgType, text: action.text, isSticky: action.isSticky },
            };
        case Types.CLEAR_ALL_MESSAGES:
            return {};
        case Types.REMOVE_MESSAGE: {
            const newStateValues = { ...state };
            delete newStateValues[action.id];
            return newStateValues;
        }
        default:
            return state;
    }
}
