import { FIELDS } from '../constants/FieldsConstant';
import { UserInterface } from '../interfaces/interface';
import { AppDispatch } from '../store';
import { addErrorMessage, removeErrorMessage } from '../store/reducers/userReducer';
import { getValue } from './apiUtils';

export function isEmpty(value: unknown): boolean {
    let val = value;

    if (typeof value === 'object' && value !== null) {
        if (Array.isArray(value) && value.length > 0) {
            val = value;
        } else {
            val = (value as { value?: unknown }).value;
        }
    }

    return typeof val === 'undefined' || (typeof val === 'string' && val.trim() === '') || val === null || (Array.isArray(val) && val.length === 0);
}

export function validateField(field: any, fieldKey: string, value: any, dispatch: AppDispatch, user: UserInterface, emptyFields: string[] = []): boolean {
    const { patterns, validate, errorMessage } = field;
    const { errors } = user;
    let { label } = field;
    // Handle dynamic label functions
    if (typeof label === 'function') {
        label = label(user, fieldKey);
    }
    // Validate against patterns if they exist
    if (patterns) {
        let isValid = false;
        patterns.forEach((pattern: any) => {
            const re = new RegExp(pattern);
            if (value && value.match(re) !== null) {
                isValid = true;
            }
        });
        if (!isValid) {
            dispatch(addErrorMessage([fieldKey, errorMessage]));
            emptyFields.push(`${label}`);
            return false;
        }
    }
    // Custom validation function
    if (typeof validate === 'function') {
        const hasError = validate({ value, dispatch, user, fieldKey });
        if (hasError) {
            dispatch(addErrorMessage([fieldKey, errorMessage]));
            emptyFields.push(`${label}`);
            return false;
        }
    }
    // Remove error if it exists and validation passes
    if (errors[fieldKey]) {
        dispatch(removeErrorMessage(fieldKey));
    }
    return true;
}

export function validateConfigureSite(user: UserInterface, dispatch: AppDispatch) {
    const { values } = user;
    const fields = Object.keys(FIELDS).filter((key) => key.indexOf('configureSite') !== -1);
    let isClean = true;
    fields.map((fieldKey) => {
        const field = FIELDS[fieldKey as keyof typeof FIELDS];
        if (!validateField(field, fieldKey, getValue({ key: fieldKey, values }), dispatch, user)) {
            isClean = false;
        }
    });
    return isClean;
}

export function isEmptyNum({ value }: { value: number | unknown }): boolean {
    return typeof value === 'number' && value === 0;
}
