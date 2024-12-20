import { Dispatch } from 'redux';
import { UserInterface } from './interfaces';

interface ValidateArgs {
    value: any;
    dispatch: Dispatch<any>;
    user: UserInterface;
    fieldKey: string;
}
export interface DMTextInterface {
    label: string;
    errorMessage: string;
    errorFunction?: Function;
    labelFunction?: Function;
    infoFunction?: Function;
    shouldShow?: boolean | Function;
    placeHolderText?: string;
    type: string;
    fieldInfo?: string;
    patterns?: string[];
    validate?: (args: ValidateArgs) => boolean;
    onChange?: (arg0: { value?: string; dispatch?: any; user?: any; fieldKey?: any }) => void;
}

export type InputType = 'text' | 'email' | 'select' | 'file' | 'radio' | 'checkbox' | 'switch' | 'textarea' | 'button' | 'reset' | 'submit' | 'date' | 'datetime-local' | 'hidden' | 'image' | 'month' | 'number' | 'range' | 'search' | 'tel' | 'url' | 'week' | 'password' | 'datetime' | 'time' | 'color';
