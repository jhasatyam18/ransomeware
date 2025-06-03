/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Col, FormGroup, Label, Row } from 'reactstrap';
import { UserInterface } from '../../interfaces/interfaces';
import { getValue } from '../../utils/inputUtils';
import { valueChange } from '../../store/actions';

interface DMCheckboxProps extends WithTranslation {
    fieldKey: string;
    defaultValue?: boolean;
    dispatch: (_action: any) => void;
    user: any;
    field: {
        onChange?: (params: { value: boolean; fieldKey: string }) => void;
        label: string;
        fieldInfo?: string;
        shouldShow?: boolean | ((user: UserInterface) => boolean);
    };
    hideLabel?: boolean;
    disabled?: boolean;
}

class DMCheckbox extends Component<DMCheckboxProps> {
    componentDidMount() {
        const { fieldKey, defaultValue, dispatch } = this.props;
        let v = this.getCheckboxValue();
        if (typeof v !== 'boolean') {
            v = typeof defaultValue !== 'undefined' ? defaultValue : false;
            dispatch(valueChange(fieldKey, v));
        }
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { dispatch, fieldKey, field } = this.props;
        const { onChange } = field;
        dispatch(valueChange(fieldKey, e.target.checked));
        if (typeof onChange === 'function') {
            dispatch(onChange({ value: e.target.checked, fieldKey }));
        }
    };

    getCheckboxValue() {
        const { fieldKey, user } = this.props;
        const { values } = user;
        const fieldValue = getValue(fieldKey, values);
        if (typeof fieldValue !== 'boolean') {
            return false;
        }
        return fieldValue;
    }

    renderLabel() {
        const { t, hideLabel, field } = this.props;
        const { label } = field;
        if (hideLabel) {
            return null;
        }
        return (
            <Label for="dm-checkbox" className="col-sm-4 col-form-Label">
                {t(label)}
            </Label>
        );
    }

    render() {
        const { field, fieldKey, user, disabled, hideLabel } = this.props;
        const { shouldShow } = field;
        const value = this.getCheckboxValue();
        const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);
        const css = hideLabel ? '' : 'row mb-4 form-group';
        if (!showField) return null;
        return (
            <>
                <FormGroup className={css}>
                    {this.renderLabel()}
                    <Col sm={hideLabel ? 12 : 8}>
                        <Row>
                            <Col sm={1}>
                                <div className="form-check font-size-16">
                                    <input type="checkbox" className="form-check-input" id={fieldKey} name={fieldKey} checked={value} onChange={this.handleChange} disabled={disabled} />
                                    <label className="form-check-label" htmlFor={fieldKey} />
                                </div>
                            </Col>
                        </Row>
                    </Col>
                </FormGroup>
            </>
        );
    }
}

export default withTranslation()(DMCheckbox);
