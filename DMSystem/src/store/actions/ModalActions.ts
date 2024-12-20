import * as Types from '../../Constants/actionTypes';
import { clearValues } from './UserActions';
import { ThunkAction } from 'redux-thunk';
import { AnyAction } from 'redux';
import { INITIAL_STATE } from '../../interfaces/interfaces';

// Modal structure interface
interface ModalState {
    content: any; // Replace `any` with specific type if possible
    options: Record<string, any>; // Replace with a more specific type
    show: boolean;
    showFooter?: boolean;
}

// Close modal action
export function closeModal(clearValue?: boolean): ThunkAction<void, INITIAL_STATE, unknown, AnyAction> {
    return (dispatch, getState) => {
        const { modal } = getState();
        const updatedModal = modal.slice(0, modal.length - 1); // Avoid modifying the original state directly
        dispatch(modalClose(updatedModal));
        if (clearValue) {
            dispatch(clearValues());
        }
    };
}

// Open modal action
export function openModal(
    content: any, // Replace `any` with a specific type
    options: Record<string, any> = {}, // Replace with a more specific type
    showFooter: boolean = true,
) {
    return {
        type: Types.OPEN_MODAL,
        content,
        options,
        showFooter,
    };
}

// Modal close action
export function modalClose(updatedModal: ModalState[]) {
    return {
        type: Types.CLOSE_MODAL,
        updatedModal,
    };
}
