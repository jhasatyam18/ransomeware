import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col, FormFeedback, FormGroup, Input, Label,
} from 'reactstrap';
import { isNumber } from 'lodash';
import { withTranslation } from 'react-i18next';
import { valueChange } from '../../store/actions/UserActions';
import { FIELDS } from '../../constants/FieldsConstant';
import { validateField } from '../../utils/validationUtils';
import { getValue } from '../../utils/InputUtils';
// Import Images

class placeHolderNumber extends Component {
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
    this.setState({
      isFocused: val,
    });
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

  render() {
    const { field, fieldKey, user, t } = this.props;
    const { label, shouldShow, min, max } = field;
    const { errors } = user;
    const { value } = this.state;
    const hasErrors = !!(errors && errors[fieldKey] !== undefined);
    const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);
    if (!showField) return null;
    return (
      <>
        <FormGroup className="row mb-4 form-group">
          <Label for={fieldKey} className="col-sm-4 col-form-Label">
            {t(label)}
          </Label>
          <Col sm={8}>
            <Input
              type="number"
              className="form-control"
              id={fieldKey}
              value={value}
              min={min}
              max={max}
              onBlur={this.onBlur}
              onChange={this.handleChange}
              invalid={hasErrors}
              autoComplete="off"
              onFocus={() => this.handleFocus(true)}
            />
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
placeHolderNumber.propTypes = propTypes;

export default (withTranslation()(placeHolderNumber));
