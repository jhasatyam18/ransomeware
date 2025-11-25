/* eslint-disable no-unused-vars */
import React from 'react';
import { ChangeEvent, Component, KeyboardEvent } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { Col, FormGroup, Row } from 'reactstrap';
import { FIELD_TYPE } from '../../Constants/FielsConstants';
import DMToolTip from './DMTooltip';

interface Props extends WithTranslation {
    dispatch: (_arg0: any, _arg1: any) => void;
    fieldKey: string;
    getValue: (arg0: { key: string; values: any }) => string;
    field: {
        type: string;
        errorMessage?: string;
        errorFunction?: (arg0: { fieldKey: string; user: any }) => string;
        label: string;
        labelFunction?: (arg0: { user: any; fieldKey: string; label: string }) => string;
        fieldInfo?: string;
        infoFunction?: (arg0: any, arg1: string) => string;
        shouldShow?: ((user: any) => boolean) | boolean;
        placeHolderText?: string;
        description: string;
        [key: string]: any;
        onChange?: (arg0: { value?: string; dispatch?: any; user?: any; fieldKey?: any }) => void;
    };
    user: {
        values: any;
        errors: { [key: string]: string };
    };
    hideLabel?: boolean | string;
    hidepassword?: boolean;
    disabled?: boolean;
}

interface State {
    type: string;
    isFocused: boolean;
    value: string | any;
}

class DMFieldText extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { type: 'text', isFocused: false, value: '' };
        this.typeToggle = this.typeToggle.bind(this);
        this.showPasswordToggle = this.showPasswordToggle.bind(this);
    }

    componentDidMount() {
        const { field } = this.props;
        const { type } = field;
        this.setState({ type });
    }

    handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.charCode === 13) {
            e.preventDefault();
        }
    };

    handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { dispatch, fieldKey, user, field } = this.props;
        this.setState({ value: e.target.value });
        // dispatch(valueChange(fieldKey, e.target.value));
        // validateField(field, fieldKey, e.target.value, dispatch, user);
        const { onChange } = field;
        if (typeof onChange !== 'undefined' && typeof onChange === 'function') {
            onChange({ value: e.target.value, dispatch, user, fieldKey });
        }
    };

    handleFocus(val: boolean) {
        this.setState({
            isFocused: val,
        });
    }

    getFieldValue() {
        const { user, fieldKey, getValue } = this.props;
        const { values } = user;
        if (values) {
            return getValue({ key: fieldKey, values });
        }
        return '';
    }

    onBlur = () => {
        const { fieldKey, dispatch, user, field } = this.props;
        const value = this.getFieldValue();
        this.setState({ isFocused: false });
        // dispatch(valueChange(fieldKey, value));
        // validateField(field, fieldKey, value, dispatch, user);
    };

    typeToggle() {
        const { state } = this;
        const newtype = state.type === FIELD_TYPE.PASSWORD ? FIELD_TYPE.TEXT : FIELD_TYPE.PASSWORD;
        this.setState({ type: newtype });
    }

    showPasswordToggle() {
        const { field, hidepassword } = this.props;
        const { type } = field;
        const { state } = this;
        if (hidepassword || type !== FIELD_TYPE.PASSWORD) {
            return null;
        }
        const icon = state.type === FIELD_TYPE.PASSWORD ? 'hide' : 'show';
        const focused = state.isFocused;
        return (
            <span className={focused && field.description ? 'field-icon' : 'field-icon'}>
                <box-icon name={icon} color="white" onClick={this.typeToggle} style={{ height: 16, width: 16 }} />
            </span>
        );
    }

    renderError(hasError: boolean) {
        const { fieldKey, field, user } = this.props;
        let { errorMessage } = field;
        const { errorFunction } = field;
        if (errorFunction && typeof errorFunction === 'function') {
            const res = errorFunction({ fieldKey, user });
            if (res !== '') {
                errorMessage = res;
            }
        }
        if (hasError) {
            return <small className="form-text app_danger">{errorMessage}</small>;
        }
        return null;
    }

    renderLabel() {
        const { t, hideLabel, field, user, fieldKey } = this.props;
        const { label, labelFunction } = field;
        if (hideLabel) {
            return null;
        }
        if (typeof labelFunction !== 'undefined' && typeof labelFunction === 'function') {
            const res = labelFunction({ user, fieldKey, label });
            return (
                <label htmlFor="horizontal-Input margin-top-10 padding-top=10" className="col-sm-4 col-form-Label">
                    {t(res)}
                </label>
            );
        }
        return (
            <label htmlFor="horizontal-Input margin-top-10 padding-top=10" className="col-sm-4 col-form-Label">
                {t(label)}
            </label>
        );
    }

    renderTooltip() {
        const { field, fieldKey, user } = this.props;
        let { fieldInfo } = field;
        const { infoFunction } = field;
        if (typeof fieldInfo === 'undefined') {
            return null;
        }
        if (infoFunction && typeof infoFunction === 'function') {
            const res = infoFunction(user, fieldKey);
            if (res !== '') {
                fieldInfo = res;
            }
        }
        return <DMToolTip tooltip={fieldInfo} />;
    }

    render() {
        const { field, fieldKey, user, hideLabel, disabled } = this.props;
        const { shouldShow, placeHolderText } = field;
        const { errors } = user;
        const { type } = this.state;
        const value = (this.state as any).value;
        const hasErrors = !!(errors && errors[fieldKey] !== undefined);
        const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);
        const css = hideLabel ? '' : 'row mb-4 form-group';
        if (!showField) return null;
        const placeH = placeHolderText || '';
        return (
            <>
                <FormGroup className={css}>
                    {this.renderLabel()}
                    <Col sm={hideLabel ? 12 : 8}>
                        <Row>
                            <Col sm={11}>
                                <div>
                                    <input
                                        type={type}
                                        className="form-control"
                                        id={fieldKey}
                                        value={value}
                                        onBlur={this.onBlur}
                                        onChange={this.handleChange}
                                        // invalid={hasErrors}
                                        autoComplete="none"
                                        placeholder={placeH}
                                        onFocus={() => this.handleFocus(true)}
                                        disabled={disabled}
                                        onKeyPress={this.handleKeyPress}
                                    />
                                    {this.showPasswordToggle()}
                                </div>
                            </Col>
                            <Col sm={1}>{this.renderTooltip()}</Col>
                        </Row>
                        {this.renderError(hasErrors)}
                    </Col>
                </FormGroup>
            </>
        );
    }
}

export default withTranslation()(DMFieldText);
