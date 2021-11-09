import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col, FormFeedback, FormGroup, Input, Label, Row,
} from 'reactstrap';
import { isNumber } from 'lodash';
import { withTranslation } from 'react-i18next';
import { valueChange } from '../../store/actions/UserActions';
import { FIELDS } from '../../constants/FieldsConstant';
import { validateField } from '../../utils/validationUtils';
import { getValue } from '../../utils/InputUtils';
// Import Images

class DMFieldRange extends Component {
  constructor() {
    super();
    this.state = { value: 0, isFocused: false };
  }

  componentDidMount() {
    const { user, fieldKey, field, dispatch } = this.props;
    const { values } = user;
    const { defaultValue } = field;
    const value = getValue(fieldKey, values);
    if (value && isNumber(value)) {
      this.setState({ value });
    } else {
      dispatch(valueChange(fieldKey, defaultValue));
      this.setState({ value: defaultValue });
      dispatch(valueChange(fieldKey, defaultValue));
    }
  }

  handleChange = (e) => {
    const { field } = this.props;
    const { min, max } = field;
    const targetValue = parseInt(`${e.target.value}`, 10);
    if (targetValue < min) {
      this.setState({ value: min });
    } else if (targetValue > max) {
      this.setState({ value: max });
    } else if (Number.isNaN(targetValue)) {
      this.setState({ value: min });
    } else {
      this.setState({ value: targetValue });
    }
  }

  handleFocus(val) {
    const { fieldKey, dispatch } = this.props;
    dispatch(valueChange(fieldKey, undefined));
    this.setState({
      isFocused: val,
    });
  }

  getRangeValue() {
    const { value } = this.state;
    const { fieldKey, user } = this.props;
    const { values } = user;
    const fieldValue = getValue(fieldKey, values);
    if (fieldValue === '') {
      return value;
    }
    if (fieldValue === undefined) {
      return value;
    }
    if (value !== fieldValue) {
      this.setState({ value: fieldValue });
    }
    return fieldValue;
  }

  onBlur = () => {
    const { fieldKey, dispatch, user, field } = this.props;
    const { value } = this.state;
    this.setState({ isFocused: false });
    dispatch(valueChange(fieldKey, parseInt(value, 10)));
    validateField(field, fieldKey, value, dispatch, user);
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
    const { field, fieldKey, user, hideLabel, disabled } = this.props;
    const { shouldShow, min, max } = field;
    // const { value } = user;
    const { errors } = user;
    const hasErrors = !!(errors && errors[fieldKey] !== undefined);
    const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);
    if (!showField) return null;
    const css = hideLabel ? '' : 'row mb-4 form-group';
    return (
      <>
        <FormGroup className={css}>
          {this.renderLabel()}
          <Row>
            <Col sm={hideLabel ? 12 : 8}>
              <Input
                type="number"
                className="form-control"
                id={fieldKey}
                value={this.getRangeValue()}
                min={min}
                max={max}
                onBlur={this.onBlur}
                onChange={this.handleChange}
                invalid={hasErrors}
                autoComplete="off"
                onFocus={() => this.handleFocus(true)}
                disabled={disabled}
              />
            </Col>
            <Col className="margin-top-10" sm={hideLabel ? 12 : 8}>
              <Input
                type="range"
                className="form-control-range"
                id={`range-${fieldKey}`}
                value={this.getRangeValue()}
                min={min}
                max={max}
                onBlur={this.onBlur}
                onChange={this.handleChange}
                invalid={hasErrors}
                autoComplete="off"
                onFocus={() => this.handleFocus(true)}
                disabled={disabled}
              />
            </Col>
            {this.renderError(hasErrors)}
          </Row>
        </FormGroup>
      </>
    );
  }
}
const propTypes = {
  dispatch: PropTypes.func.isRequired,
};
DMFieldRange.propTypes = propTypes;

export default (withTranslation()(DMFieldRange));
