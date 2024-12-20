import * as Types from '../../Constants/actionTypes';
import INITIAL_STATE from '../../Constants/InitialState';

// Define the modal structure
interface ModalState {
    content?: any; // Replace `any` with specific type if possible
    options?: Record<string, any>; // Replace with a more specific type
    show: boolean;
    showFooter?: boolean;
}

// Define the possible actions
interface CloseModalAction {
    type: typeof Types.CLOSE_MODAL;
    updatedModal: ModalState[];
}

interface OpenModalAction {
    type: typeof Types.OPEN_MODAL;
    content: any; // Replace with specific type
    options: Record<string, any>; // Replace with a more specific type
    showFooter?: boolean;
}

type ModalActions = CloseModalAction | OpenModalAction;

// Define the reducer
export default function modals(state: ModalState[] = INITIAL_STATE.modal, action: ModalActions): ModalState[] {
    switch (action.type) {
        case Types.CLOSE_MODAL:
            return action.updatedModal;

        case Types.OPEN_MODAL:
            return [...state, { content: action.content, options: action.options, show: true, showFooter: action.showFooter }];

        default:
            return state;
    }
}
