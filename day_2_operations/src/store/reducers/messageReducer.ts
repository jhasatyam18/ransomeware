import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { INITIAL_STATE } from '../../constants/initState';

type addMessageType = {
    message: string;
    messageType: string;
    isSticky?: boolean;
};
interface MessagesState {
    [key: string]: {
        type: string;
        text: string;
        isSticky?: boolean;
    };
}

const mesageSlice = createSlice({
    name: 'global',
    initialState: INITIAL_STATE.messages,
    reducers: {
        addMessage: (state: MessagesState, action: PayloadAction<addMessageType>) => {
            const time = Date.now();
            state[time] = { text: action.payload.message, type: action.payload.messageType, isSticky: action.payload.isSticky };
        },
        removeMessage: (state: MessagesState, action: PayloadAction<string>) => {
            delete state[action.payload];
        },
        clearMessages: (state: MessagesState) => {
            state = {};
        },
    },
});

export const { addMessage, removeMessage, clearMessages } = mesageSlice.actions;
export default mesageSlice.reducer;
