import * as Types from '../../Constants/actionTypes';
import INITIAL_STATE from '../../Constants/InitialState';

export default function modals(state = INITIAL_STATE.upgrade, action: any) {
    switch (action.type) {
        case Types.SET_UPGRADE_STEPS:
            return {
                ...state,
                steps: action.steps,
            };
        case Types.SET_CURRENT_UPGRADE_STEP:
            return {
                ...state,
                currentStep: action.currentStep,
            };
        case Types.UPDATE_UPGRADE_STEPS_DATA:
            return {
                ...state,
                steps: state.steps.map((item, i) => (i === action.stepInd ? action.stepObj : item)),
            };
        default:
            return state;
    }
}
