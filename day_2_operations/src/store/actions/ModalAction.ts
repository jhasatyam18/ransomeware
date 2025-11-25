import { createAsyncThunk } from '@reduxjs/toolkit';
import { INITIAL_STATE_INTERFACE } from '../../interfaces/interface';
import { closeModal } from '../reducers/ModalReducer';

// Thunk function to close modal with optional clearing of values
export const modalClose = createAsyncThunk<void, boolean | undefined, { state: INITIAL_STATE_INTERFACE }>('modal/closeModalThunk', async (clearValue, { dispatch, getState }) => {
    const { modal } = getState();

    if (modal.length > 0) {
        dispatch(closeModal());
    }

    // if (clearValue) {
    //   dispatch(clearValues());
    // }
});
