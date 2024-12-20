import * as Types from '../../Constants/actionTypes';

export function addMessage(text: string, msgType: string, isSticky?: boolean) {
    return {
        type: Types.ADD_MESSAGE,
        msgType,
        text,
        isSticky,
    };
}

export function clearMessages() {
    return {
        type: Types.CLEAR_ALL_MESSAGES,
    };
}

export function removeMessage(id: string | number) {
    return {
        type: Types.REMOVE_MESSAGE,
        id,
    };
}
