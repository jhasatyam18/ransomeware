import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ModalData } from '../../interfaces/interface';

const modalSlice = createSlice({
    name: 'modals',
    initialState: [] as ModalData[],
    reducers: {
        closeModal: (state) => state.slice(0, -1), // Removes the last modal by returning a new array
        openModal: (state, action: PayloadAction<{ options: Record<string, any>; content: string }>) => [...state, { options: action.payload.options || {}, content: action.payload.content }],
    },
});

export const { closeModal, openModal } = modalSlice.actions;
export default modalSlice.reducer;
