import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col, FormFeedback, FormGroup, Input, Label,
} from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { FIELD_TYPE } from '../../constants/FieldsConstant';
import { validateField } from '../../utils/validationUtils';
import { getValue } from '../../utils/InputUtils';
import { valueChange } from '../../store/actions/UserActions';
// Import Images

class DMFieldText extends Component {
  constructor() {
    super();
    this.state = { value: '', type: 'text' };
    this.typeToggle = this.typeToggle.bind(this);
    this.showPasswordToggle = this.showPasswordToggle.bind(this);
  }

  componentDidMount() {
    const { user, fieldKey, field } = this.props;
    const { values } = user;
    const { type } = field;
    const value = getValue(fieldKey, values);
    this.setState({ value, type });
  }

  onBlur = () => {
    const { fieldKey, dispatch, user, field } = this.props;
    const { value } = this.state;
    dispatch(valueChange(fieldKey, value));
    validateField(field, fieldKey, value, dispatch, user);
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    });
  }

  typeToggle() {
    const { state } = this;
    const newtype = (state.type === FIELD_TYPE.PASSOWRD ? FIELD_TYPE.TEXT : FIELD_TYPE.PASSOWRD);
    this.setState({ type: newtype });
  }

  showPasswordToggle() {
    const { fieldKey, user, field, hidepassword } = this.props;
    const { errors } = user;
    const hasErrors = !!(errors && errors[fieldKey] !== undefined);
    const { type } = field;
    const { state } = this;
    if (hidepassword) {
      return null;
    }
    if (type === FIELD_TYPE.PASSOWRD && !hasErrors) {
      return (
        <button
          type="button"
          className="btn buttonwrapper waves-effect"
          onClick={this.typeToggle}
        >
          {state.type === FIELD_TYPE.PASSOWRD ? <i className="fas fa-eye" /> : <i className="fas fa-eye-slash" />}
        </button>
      );
    }
  }

  renderError(hasError) {
    const { fieldKey, field } = this.props;
    if (hasError) {
      return (
        <FormFeedback className="valid-feedback" for={fieldKey}>{field.errorMessage}</FormFeedback>
      );
    }
    return null;
  }

  renderLabel() {
    const { t, hideLabel, field } = this.props;
    const { label } = field;
    if (hideLabel) {
      return null;
    }
    return (
      <Label for="horizontal-firstname-Input" className="col-sm-4 col-form-Label">
        {t(label)}
      </Label>
    );
  }

  render() {
    const { field, fieldKey, user, hideLabel } = this.props;
    const { label, shouldShow, layout, placeHolderText } = field;
    const { errors } = user;
    const { value, type } = this.state;
    const hasErrors = !!(errors && errors[fieldKey] !== undefined);
    const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);
    const css = hideLabel ? '' : 'row mb-4 form-group';
    if (!showField) return null;
    const placeH = placeHolderText || '';
    if (layout === 'vertical') {
      return (
        <form>
          <div className="form-group">
            <Label for={fieldKey}>
              {label}
            </Label>
            <input
              type={type}
              className={`form-control ${hasErrors ? 'is-invalid' : ''}`}
              id={fieldKey}
              value={value}
              onBlur={this.onBlur}
              onChange={this.handleChange}
              invalid={hasErrors}
              placeholder={placeH}
              autoComplete="off"
            />
            {this.showPasswordToggle()}
            {this.renderError(hasErrors)}
          </div>
        </form>
      );
    }
    return (
      <>
        <FormGroup className={css}>
          {this.renderLabel()}
          <Col sm={hideLabel ? 12 : 8}>
            <Input
              type={type}
              className="form-control"
              id={fieldKey}
              value={value}
              onBlur={this.onBlur}
              onChange={this.handleChange}
              invalid={hasErrors}
              autoComplete="off"
              placeholder={placeH}
            />
            {this.showPasswordToggle()}
            {this.renderError(hasErrors)}
          </Col>
        </FormGroup>
      </>
    );
  }
}
const propTypes = {
  dispatch: PropTypes.func.isRequired,
};
DMFieldText.propTypes = propTypes;

export default (withTranslation()(DMFieldText));
