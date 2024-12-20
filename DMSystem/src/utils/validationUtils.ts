import { Dispatch } from 'redux'; // Assuming you're using Redux
import { DMTextInterface } from '../interfaces/fieldInterface';
import { UserInterface } from '../interfaces/interfaces';
import { addErrorMessage, removeErrorMessage } from '../store/actions/UserActions';
import { getValue } from '../utils/inputUtils';

export function isEmpty({ value }: { value: any }): boolean {
    let val = value;
    if (typeof value === 'object' && value !== null) {
        if (value.length > 0) {
            val = value;
        } else {
            val = value.value;
        }
    }
    return (typeof val === 'undefined' || typeof val === 'string') && (val?.trim() === '' || val === null || val?.length === 0);
} // Import the function used in the implementation

export function validatePassword({ value, user }: { value: string; user: any }): boolean {
    const { values } = user;
    const password = getValue('user.newPassword', values); // Assuming getValue has appropriate typings
    return value !== password;
} // Adjust this import as per your project structure

export function validateField(field: DMTextInterface, fieldKey: string, value: any, dispatch: Dispatch<any>, user: UserInterface, emptyFields: string[] = []) {
    const { patterns, validate, errorMessage } = field;
    const { errors } = user;

    if (patterns) {
        let isValid = false;
        patterns.forEach((pattern) => {
            const re = new RegExp(pattern);
            if (value && value.match(re) !== null) {
                isValid = true;
            }
        });
        if (!isValid) {
            dispatch(addErrorMessage(fieldKey, errorMessage));
            emptyFields.push(`${field.label}`);
            return false;
        }
    }

    if (typeof validate === 'function') {
        const hasError = validate({ value, dispatch, user, fieldKey });
        if (hasError) {
            dispatch(addErrorMessage(fieldKey, errorMessage));
            emptyFields.push(`${field.label}`);
            return false;
        }
    }

    if (errors[fieldKey]) {
        dispatch(removeErrorMessage(fieldKey));
    }
    return true;
}
