import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col, FormFeedback, FormGroup, Input, Label,
} from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { getValue } from '../../utils/InputUtils';
import { valueChange } from '../../store/actions/UserActions';
import { validateField } from '../../utils/validationUtils';
// Import Images

class DMFieldSelect extends Component {
  constructor() {
    super();
    this.state = { value: '' };
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

  getOptions() {
    const { field, user } = this.props;
    const { options } = field;
    let optionValues;
    if (typeof options === 'function') {
      optionValues = options(user);
      return optionValues;
    }
    optionValues = (options && options.length > 0 ? options : []);
    return optionValues;
  }

  onBlur = () => {
    const { fieldKey, dispatch, user, field } = this.props;
    const { value } = this.state;
    dispatch(valueChange(fieldKey, value));
    validateField(field, fieldKey, value, dispatch, user);
  }

  handleChange = (e) => {
    const { dispatch, fieldKey, user, field } = this.props;
    const { onChange } = field;
    this.setState({
      value: e.target.value,
    });
    dispatch(valueChange(fieldKey, e.target.value));
    if (typeof onChange === 'function') {
      dispatch(onChange({ value: e.target.value, dispatch, user }));
    }
  }

  renderOptions() {
    const options = this.getOptions();
    return options.map((op) => {
      const { value, label } = op;
      return (
        <option key={`${label}-${value}`} value={value}>
          {' '}
          { label}
          {' '}
        </option>
      );
    });
  }

  renderError(hasError) {
    const { field, fieldKey } = this.props;
    if (hasError) {
      return (
        <FormFeedback for={fieldKey}>{field.errorMessage}</FormFeedback>
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
    const { shouldShow } = field;
    const { value } = this.state;
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
            <Input type="select" id={fieldKey} onSelect={this.handleChange} className="form-control form-control-sm custom-select" onChange={this.handleChange} value={value} invalid={hasErrors}>
              <option key={`${fieldKey}-default`} value="-">  </option>
              {this.renderOptions()}
            </Input>
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
DMFieldSelect.propTypes = propTypes;

export default (withTranslation()(DMFieldSelect));
