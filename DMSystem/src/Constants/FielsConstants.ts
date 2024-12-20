// Constants.ts
export const FIELD_TYPE = {
    CHECKBOX: 'CHECKBOX',
    TEXT: 'TEXT',
    SELECT: 'SELECT',
    SELECT_SEARCH: 'SELECT_SEARCH',
    NUMBER: 'NUMBER',
    PASSWORD: 'PASSWORD',
    CUSTOM: 'CUSTOM',
    RADIO: 'RADIO',
    RANGE: 'RANGE',
    TREE: 'TREE',
    STATICTEXT: 'STATICTEXT',
    TEXTLABEL: 'TEXTLABEL',
};

export const FIELDS: { [key: string]: any } = {
    key1: { type: FIELD_TYPE.CHECKBOX },
    key2: { type: FIELD_TYPE.NUMBER },
    key3: { type: FIELD_TYPE.SELECT },
    'ui.upgrade.permission': {
        label: '',
        errorMessage: '',
        placeHolderText: 'Please provide upload url',
        shouldShow: true,
        type: FIELD_TYPE.CHECKBOX,
        hideLabel: true,
    },
};
