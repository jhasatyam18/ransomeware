import React, { useEffect, useState } from 'react';
import ReactDatePicker from 'react-datepicker';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Col, FormGroup, Label, Row } from 'reactstrap';
import { UserInterface } from '../../interfaces/interface';
import { getValue } from '../../utils/apiUtils';
import { valueChange } from '../../store/reducers/userReducer';
import DMTooltip from './DMTooltip';

interface FieldConfig {
    label?: string;
    defaultValue?: Date;
    minDate?: boolean | ((args: { user: UserInterface; dispatch: any; fieldKey: string; value: any }) => Date);
    maxDate?: boolean;
    showTime?: boolean;
    shouldShow?: boolean | ((user: UserInterface) => boolean);
    fieldInfo?: string;
}

interface Props extends WithTranslation {
    field: FieldConfig;
    fieldKey: string;
    user: UserInterface;
    hideLabel?: boolean;
    disabled?: boolean;
    dispatch: any;
}

const DMDatePicker: React.FC<Props> = ({ field, fieldKey, user, hideLabel, disabled, dispatch, t }) => {
    const [value, setValue] = useState<Date | null>(new Date());

    useEffect(() => {
        const { defaultValue } = field;
        const { values } = user;
        const fieldValue = getValue({ key: fieldKey, values });

        if (fieldValue) {
            setValue(new Date(fieldValue));
        } else if (defaultValue) {
            setValue(defaultValue);
            dispatch(valueChange([fieldKey, defaultValue]));
        }
    }, [dispatch, field, fieldKey, user]);

    const handleChange = (date: Date | null) => {
        setValue(date);
        dispatch(valueChange([fieldKey, date]));
    };

    const minDate = (): Date | undefined => {
        const { minDate } = field;
        const { values } = user;
        const val = getValue({ key: fieldKey, values });

        if (typeof minDate === 'function') {
            return minDate({ user, dispatch, fieldKey, value: val });
        }
        return minDate ? new Date() : undefined;
    };

    const maxDate = (): Date | undefined => {
        return field.maxDate ? new Date() : undefined;
    };

    const minTime = (): Date | undefined => {
        const { minDate, showTime } = field;
        if (minDate && showTime) {
            return new Date();
        }
        return undefined;
    };

    const maxTime = (): Date | undefined => {
        const { minDate, showTime } = field;
        if (minDate && showTime) {
            const d = new Date();
            d.setHours(23, 55);
            return d;
        }
        return undefined;
    };

    const dateFormat = (): string => {
        return field.showTime ? 'MMMM d, yyyy h:mm aa' : 'MMMM d, yyyy';
    };

    const renderLabel = () => {
        if (hideLabel) return null;
        return <Label className="dashboard_repl_size col-sm-4 col-form-Label padding-top-5">{t(field.label || '')}</Label>;
    };

    const renderTooltip = () => {
        if (typeof field.fieldInfo === 'undefined') return null;
        return <DMTooltip tooltip={field.fieldInfo} />;
    };

    const showField = typeof field.shouldShow === 'undefined' || (typeof field.shouldShow === 'function' ? field.shouldShow(user) : field.shouldShow);

    if (!showField) return null;

    const css = hideLabel ? '' : 'row mb-4 form-group';
    const interval = field.showTime ? 15 : undefined;

    return (
        <FormGroup className={css}>
            {renderLabel()}
            <Col sm={hideLabel ? 12 : 8}>
                <Row>
                    <Col sm={field.fieldInfo ? 11 : 12}>
                        <ReactDatePicker id={`datepicker-${fieldKey}`} className="placeholder-size form-control form-control-sm custom-select" selected={value} onChange={(date) => handleChange(date)} disabled={disabled} showTimeSelect={field.showTime} minDate={minDate()} maxDate={maxDate()} minTime={minTime()} maxTime={maxTime()} timeIntervals={interval} dateFormat={dateFormat()} />
                    </Col>
                    <Col sm={1}>{renderTooltip()}</Col>
                </Row>
            </Col>
        </FormGroup>
    );
};

export default withTranslation()(DMDatePicker);
