import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AlertsState {
    data: Record<string, any>[];
    unread: Record<string, any>[];
}

const initialState: AlertsState = {
    data: [],
    unread: [],
};

const alertSlice = createSlice({
    name: 'alerts',
    initialState,
    reducers: {
        addAlertData: (state, action: PayloadAction<Record<string, any>[]>) => {
            // Replace the state.alerts with new data
            state.data = action.payload;
        },
        addUnreadAlert: (state, action: PayloadAction<Record<string, any>[]>) => {
            // Add to alerts.unread
            state.unread = action.payload;
        },
    },
});
export const { addAlertData, addUnreadAlert } = alertSlice.actions;
export default alertSlice.reducer;
