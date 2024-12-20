import React, { ChangeEvent, Component } from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Col, FormGroup, Input, Row } from 'reactstrap';
import { Dispatch } from 'redux';
import { DMTextInterface } from '../../interfaces/fieldInterface';
import { INITIAL_STATE, UserInterface } from '../../interfaces/interfaces';
import { getValue } from '../../utils/inputUtils';
import { validateField } from '../../utils/validationUtils';
import { valueChange } from '../../store/actions/UserActions';
import DMToolTip from './DMTooltip';

interface Props extends WithTranslation {
    fieldKey: string;
    field: DMTextInterface;
    hideLabel?: boolean;
    hidepassword?: boolean;
    disabled?: boolean;
    user: UserInterface;
    dispatch: Dispatch<any>;
}

interface State {
    isFocused: boolean;
}

class DMFieldText extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { isFocused: false };
    }

    handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode === 13) {
            e.preventDefault();
        }
    };

    handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { dispatch, fieldKey, field, user } = this.props;
        dispatch(valueChange(fieldKey, e.target.value));
        validateField(field, fieldKey, e.target.value, dispatch, user);
        const { onChange } = field;
        if (typeof onChange !== 'undefined' && typeof onChange === 'function') {
            onChange({ value: e.target.value, dispatch, user, fieldKey });
        }
    };

    handleFocus = (val: boolean) => {
        this.setState({ isFocused: val });
    };

    getFieldValue() {
        const { user, fieldKey } = this.props;
        const { values } = user;
        return getValue(fieldKey, values);
    }

    onBlur = () => {
        const { fieldKey, dispatch, user, field } = this.props;
        const value = this.getFieldValue();
        this.setState({ isFocused: false });
        dispatch(valueChange(fieldKey, value));
        validateField(field, fieldKey, value, dispatch, user);
    };

    renderError = (hasError: boolean) => {
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
            return (
                <label className="form-text app_danger" htmlFor={fieldKey}>
                    {errorMessage}
                </label>
            );
        }
        return null;
    };

    renderLabel = () => {
        const { t, hideLabel, field, user, fieldKey } = this.props;
        const { label, labelFunction } = field;
        if (hideLabel) {
            return null;
        }
        if (typeof labelFunction !== 'undefined' && typeof labelFunction === 'function') {
            const res = labelFunction({ user, fieldKey, label });
            return (
                <label htmlFor="horizontal-Input margin-top-10 padding-top=10" className="col-sm-4 col-form-Label">
                    {t(String(res))}
                </label>
            );
        }
        return (
            <label htmlFor="horizontal-Input margin-top-10 padding-top=10" className="col-sm-4 col-form-Label">
                {t(label)}
            </label>
        );
    };

    renderTooltip = () => {
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
        return <DMToolTip tooltip={`${fieldInfo}`} />;
    };

    render() {
        const { field, fieldKey, user, hideLabel, disabled } = this.props;
        const { shouldShow, placeHolderText } = field;
        const { errors } = user;
        const value = this.getFieldValue();
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
                                    <Input type="text" className="form-control" id={fieldKey} value={value} onBlur={this.onBlur} onChange={this.handleChange} autoComplete="none" placeholder={placeH} onFocus={() => this.handleFocus(true)} disabled={disabled} onKeyPress={this.handleKeyPress} />
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

const mapStateToProps = (state: INITIAL_STATE) => {
    const { user } = state;
    return { user };
};

export default connect(mapStateToProps)(withTranslation()(DMFieldText));
