import React, { useEffect, useState } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Col, FormFeedback, FormGroup, Input, Row } from 'reactstrap';
import { FIELDS } from '../../constants/FieldsConstant';
import { UserInterface } from '../../interfaces/interface';
import { Dispatch } from 'redux';
import { valueChange } from '../../store/reducers/userReducer';
import { getValue } from '../../utils/apiUtils';
import DMTooltip from './DMTooltip';
import { validateField } from '../../utils/ValidationUtils';

// Define the shape of the field object
interface FieldProps {
    defaultValue?: number | any;
    label?: string;
    shouldShow?: boolean | ((user: UserInterface, fieldKey: string) => boolean);
    min?: number;
    max?: number;
    getMinMax?: (user: UserInterface) => { min: number; max: number };
    onChange?: (args: { dispatch: Dispatch; user: UserInterface; fieldKey: string; value: number }) => void;
    errorMessage?: string;
    fieldInfo?: string;
    disabled?: boolean | ((user: UserInterface, fieldKey: string) => boolean);
}

interface PlaceHolderNumberProps extends WithTranslation {
    field: FieldProps;
    fieldKey: string;
    user: UserInterface;
    dispatch: Dispatch;
    disabled?: boolean;
    hideLabel?: boolean;
}

const PlaceHolderNumber: React.FC<PlaceHolderNumberProps> = ({ field, fieldKey, user, dispatch, disabled = false, hideLabel = false, t }) => {
    const { values, errors } = user;
    const { min, max, getMinMax, defaultValue } = field;
    const [value, setValue] = useState<number>(0);

    useEffect(() => {
        const fieldValue = getValue({ key: fieldKey, values });

        if (typeof defaultValue === 'function') {
            dispatch(defaultValue({ fieldKey, user }));
        }

        if (fieldValue && typeof fieldValue === 'number') {
            setValue(fieldValue);
        } else {
            dispatch(valueChange([fieldKey, defaultValue ?? 0]));
            setValue(defaultValue ?? 0);
        }
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let minVal = min;
        let maxVal = max;
        let inputValue = parseInt(e.target.value, 10);

        if (getMinMax) {
            const val = getMinMax(user);
            minVal = val.min;
            maxVal = val.max;
        }

        if (typeof minVal !== 'undefined' && Number.isNaN(inputValue)) {
            inputValue = minVal;
        } else if (typeof minVal !== 'undefined' && inputValue < minVal) {
            inputValue = minVal;
        } else if (typeof maxVal !== 'undefined' && inputValue > maxVal) {
            inputValue = maxVal;
        }

        setValue(inputValue);
        dispatch(valueChange([fieldKey, inputValue]));

        // if (typeof onChange === "function") {
        //   dispatch(onChange({ dispatch, user, fieldKey, value: inputValue }));
        // }
    };

    const onBlurFunc = () => {
        let fieldValue = value;
        if (min && fieldValue < min) {
            fieldValue = min;
        } else if (max && fieldValue > max) {
            fieldValue = max;
        }
        dispatch(valueChange([fieldKey, fieldValue]));
        validateField(field, fieldKey, fieldValue, dispatch, user);
    };

    const renderError = (hasError: boolean) => {
        let msg = FIELDS[fieldKey as keyof typeof FIELDS]?.errorMessage || field.errorMessage || '';
        return hasError ? <FormFeedback>{msg}</FormFeedback> : null;
    };

    const renderTooltip = () => {
        return field.fieldInfo ? <DMTooltip tooltip={field.fieldInfo} /> : null;
    };

    const renderLabel = () => {
        if (hideLabel || !field.label) return null;
        return <label className="col-sm-4 col-form-label">{t(field.label)}</label>;
    };

    const hasErrors = !!(errors && errors[fieldKey] !== undefined);
    const fieldDisabled = typeof field.disabled === 'function' ? field.disabled(user, fieldKey) : field.disabled;
    // const shouldDisplayField =
    //   typeof shouldShow === "function" ? shouldShow(user, fieldKey) : shouldShow;
    // const shouldBeDisabled = fieldDisabled ?? false;

    // if (!shouldDisplayField) return null;

    return (
        <FormGroup className={hideLabel ? '' : 'row mb-4 form-group'}>
            {renderLabel()}
            <Col sm={hideLabel ? 12 : 8}>
                <Row>
                    <Col sm={11}>
                        <Input type="number" className="form-control" id={fieldKey} value={value} min={min} max={max} onChange={handleChange} invalid={hasErrors} autoComplete="off" step="1" disabled={fieldDisabled} pattern="[0-9]" onBlur={onBlurFunc} />
                        {renderError(hasErrors)}
                    </Col>
                    <Col sm={1}>{renderTooltip()}</Col>
                </Row>
            </Col>
        </FormGroup>
    );
};

export default withTranslation()(PlaceHolderNumber);
