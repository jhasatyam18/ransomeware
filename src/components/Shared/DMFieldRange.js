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
    this.state = { isFocused: false };
  }

  componentDidMount() {
    const { fieldKey, field, dispatch } = this.props;
    const { defaultValue } = field;
    if (defaultValue && isNumber(defaultValue)) {
      dispatch(valueChange(fieldKey, defaultValue));
    }
  }

  handleChange = (e) => {
    const { field, dispatch, fieldKey } = this.props;
    const { min, max } = field;
    const targetValue = parseInt(`${e.target.value}`, 10);
    if (targetValue < min) {
      dispatch(valueChange(fieldKey, min));
    } else if (targetValue > max) {
      dispatch(valueChange(fieldKey, max));
    } else if (Number.isNaN(targetValue)) {
      dispatch(valueChange(fieldKey, min));
    } else {
      dispatch(valueChange(fieldKey, targetValue));
    }
  }

  handleFocus(val) {
    const { fieldKey, dispatch, user } = this.props;
    const { values } = user;
    const fieldValue = getValue(fieldKey, values) || '';
    dispatch(valueChange(fieldKey, fieldValue));
    this.setState({
      isFocused: val,
    });
  }

  getRangeValue() {
    const { fieldKey, user, dispatch } = this.props;
    const { values } = user;
    const fieldValue = getValue(fieldKey, values) || '';
    if (fieldValue === '' || fieldValue === undefined) {
      return dispatch(valueChange(fieldKey, 0));
    }
    return fieldValue;
  }

  onBlur = () => {
    const { fieldKey, dispatch, user, field } = this.props;
    const { values } = user;
    const value = getValue(fieldKey, values);
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
