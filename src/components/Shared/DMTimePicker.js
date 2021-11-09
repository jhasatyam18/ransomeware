import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDatePicker from 'react-datepicker';
import { withTranslation } from 'react-i18next';
import { Col, FormFeedback, FormGroup, Label } from 'reactstrap';
import { FIELDS } from '../../constants/FieldsConstant';
import { valueChange } from '../../store/actions/UserActions';
import { getValue } from '../../utils/InputUtils';
// Import Images

class DMTimePicker extends Component {
  constructor() {
    super();
    this.state = { value: '', isFocused: false };
  }

  componentDidMount() {
    const { fieldKey, user, field, dispatch } = this.props;
    const { defaultValue } = field;
    const { values } = user;
    const fieldValue = getValue(fieldKey, values);
    if (fieldValue) {
      this.setState({ value: fieldValue });
    }
    if (!fieldValue && defaultValue) {
      this.setState({ value: defaultValue });
      dispatch(valueChange(fieldKey, defaultValue));
    }
  }

  handleChange = (time) => {
    const { dispatch, fieldKey } = this.props;
    this.setState({
      value: time, isFocused: false,
    });
    dispatch(valueChange(fieldKey, time));
  }

  handleFocus(val) {
    this.setState({
      isFocused: val,
    });
  }

  onBlur = () => {
    const { fieldKey, dispatch } = this.props;
    const { value } = this.state;
    this.setState({ isFocused: false });
    dispatch(valueChange(fieldKey, value));
    // TODO: should be handled
    // validateField(field, fieldKey, value, dispatch, user);
  }

  getTimeValue() {
    const { value } = this.state;
    const { fieldKey, user } = this.props;
    const { values } = user;
    const fieldValue = getValue(fieldKey, values);
    if (value !== fieldValue) {
      this.setState({ value: fieldValue });
    }
    if (typeof fieldValue === 'string' && fieldValue === '') {
      return '';
    }
    if (typeof fieldValue !== 'object') {
      return new Date(fieldValue);
    }
    return fieldValue;
  }

  isDisabled(value) {
    if (value === true) {
      return value;
    }
    return false;
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

  renderError(hasError) {
    const { field, fieldKey } = this.props;
    const { isFocused } = this.state;
    if (hasError) {
      return (
        <FormFeedback for={fieldKey}>{FIELDS[fieldKey].errorMessage}</FormFeedback>
      );
    }
    if (isFocused) {
      return (
        <small className="form-text text-muted" htmlFor={fieldKey}>{field.description}</small>
      );
    }
    return null;
  }

  render() {
    const { field, fieldKey, user, hideLabel, disabled } = this.props;
    const { shouldShow } = field;
    const { errors } = user;
    const hasErrors = !!(errors && errors[fieldKey] !== undefined);
    const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);
    if (!showField) return null;
    const css = hideLabel ? '' : 'row mb-4 form-group';
    return (
      <>
        <FormGroup className={css}>
          {this.renderLabel()}
          <Col sm={hideLabel ? 12 : 8}>
            <ReactDatePicker
              className="form-control form-control-sm"
              selected={this.getTimeValue()}
              onChange={(time) => this.handleChange(time)}
              disabled={disabled}
              key={`timepicker-${fieldKey}`}
              invalid={hasErrors}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              onBlur={this.onBlur}
              onFocus={() => this.handleFocus(true)}
            />
          </Col>
          {/* <label className="margin-top-3">:</label>
          <Col sm={2}>
            <ReactDatePicker
              className="form-control form-control-sm"
              selected={value}
              onChange={(time) => this.handleEndChange(time)}
              disabled={disabled}
              key={`timepicker-${fieldKey}`}
              invalid={hasErrors}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={15}
              timeCaption="Time"
              dateFormat="h:mm aa"
              onFocus={() => this.handleEndFocus(true)}
            />
          </Col> */}
          {/* {this.renderError(hasErrors)} */}
        </FormGroup>
      </>
    );
  }
}
const propTypes = {
  dispatch: PropTypes.func.isRequired,
};
DMTimePicker.propTypes = propTypes;

export default (withTranslation()(DMTimePicker));
