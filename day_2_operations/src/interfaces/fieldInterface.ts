import { UserInterface } from "./interface";

interface FIELD_TYPE {
    TEXT: 'TEXT';
    NUMBER: 'NUMBER';
    SELECT: 'SELECT'
    // Add other field types if needed
};

type FieldValidator = (value: string, user: any) => boolean;

export interface FIELD_TYPES {
    label?: string;
    placeHolderText?: string;
    type: FIELD_TYPE; // This will be of type 'TEXT' or other field types you define
    validate?: FieldValidator; // A function that takes a value and user and returns a boolean
    errorMessage?: string;
    fieldInfo?: string;
    options?: any;
    handleChange?: (value: any, dispatch: any, user: UserInterface, fieldKey: string ) => void
};


