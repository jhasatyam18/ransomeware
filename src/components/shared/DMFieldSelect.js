import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col, FormFeedback, FormGroup, Label,
} from 'reactstrap';
import { FIELDS } from '../../constants/FieldsConstant';
import { getValue } from '../../utils/InputUtils';
import { valueChange } from '../../store/actions/UserActions';
// Import Images

class DMFieldSelect extends Component {
  constructor() {
    super();
    this.state = { value: '' };
  }

  componentDidMount() {
    const { fieldKey, user } = this.props;
    const { values } = user;
    const { value } = this.state;
    const fieldValue = getValue(fieldKey, values);
    if (fieldValue !== value) {
      this.setState({ value: fieldValue });
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
    const { fieldKey, dispatch } = this.props;
    const { value } = this.props;
    dispatch(valueChange(fieldKey, value));
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
    const { fieldKey } = this.props;
    if (hasError) {
      return (
        <FormFeedback for={fieldKey}>{FIELDS[fieldKey].errorMessage}</FormFeedback>
      );
    }
    return null;
  }

  render() {
    const { field, fieldKey } = this.props;
    const { label } = field;
    const { value } = this.state;
    return (
      <>
        <FormGroup className="row mb-4 form-group">
          <Label for="horizontal-firstname-Input" className="col-sm-3 col-form-Label">
            {label}
          </Label>
          <Col sm={9}>
            <select id={fieldKey} onSelect={this.handleChange} className="custom-select form-control form-control-sm" onChange={this.handleChange} value={value}>
              <option key={`${fieldKey}-default`} value="-">  </option>
              {this.renderOptions()}
            </select>
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

export default DMFieldSelect;
