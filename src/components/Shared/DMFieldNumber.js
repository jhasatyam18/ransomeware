import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col, FormFeedback, FormGroup, Input, Label,
} from 'reactstrap';
import { isNumber } from 'lodash';
import { valueChange } from '../../store/actions/UserActions';
import { FIELDS } from '../../constants/FieldsConstant';
import { validateField } from '../../utils/validationUtils';
import { getValue } from '../../utils/InputUtils';
// Import Images

class placeHolderNumber extends Component {
  constructor() {
    super();
    this.state = { value: 0 };
  }

  componentDidMount() {
    const { user, fieldKey, field, dispatch } = this.props;
    const { values } = user;
    const { defaultValue } = field;
    const value = getValue(fieldKey, values);
    if (value && isNumber(value)) {
      this.setState({ value });
    } else {
      this.setState({ value: defaultValue });
      dispatch(valueChange(fieldKey, defaultValue));
    }
  }

  onBlur = () => {
    const { fieldKey, dispatch, user } = this.props;
    const { value } = this.state;
    dispatch(valueChange(fieldKey, parseInt(value, 10)));
    validateField(fieldKey, value, dispatch, user);
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

  renderError(hasError) {
    const { fieldKey } = this.props;
    if (hasError) {
      return (
        <FormFeedback for={fieldKey}>{FIELDS[fieldKey].errorMessage}</FormFeedback>
      );
    }
    return null;
  }

  render() {
    const { field, fieldKey, user } = this.props;
    const { label, shouldShow, min, max } = field;
    const { errors } = user;
    const { value } = this.state;
    const hasErrors = !!(errors && errors[fieldKey] !== undefined);
    const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);
    if (!showField) return null;
    return (
      <>
        <FormGroup className="row mb-4 form-group">
          <Label for={fieldKey} className="col-sm-3 col-form-Label">
            {label}
          </Label>
          <Col sm={9}>
            <Input
              type="number"
              className="form-control form-control-sm"
              id={fieldKey}
              value={value}
              min={min}
              max={max}
              onBlur={this.onBlur}
              onChange={this.handleChange}
              invalid={hasErrors}
              autoComplete="off"
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

export default placeHolderNumber;
