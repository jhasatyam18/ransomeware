// Assuming getDefaultValueForType is imported or defined elsewhere with appropriate typings

import { FIELDS, FIELD_TYPE } from '../Constants/FielsConstants';

export function getValue(key: string, values: Record<string, any>): any {
    const ret = values[key];
    return typeof ret === 'undefined' ? getDefaultValueForType(key) : ret;
} // Assuming FIELD_TYPE and FIELDS are imported or defined elsewhere with appropriate typings

export function getDefaultValueForType(key: string): any {
    try {
        const type = FIELDS && FIELDS[key]?.type; // Use optional chaining to handle undefined or null FIELDS[key] gracefully
        if (type) {
            switch (type) {
                case FIELD_TYPE.CHECKBOX:
                    return false;
                case FIELD_TYPE.NUMBER:
                    return 0;
                case FIELD_TYPE.SELECT:
                    return null;
                default:
                    return '';
            }
        }
    } catch (error) {
        return '';
    }
}
