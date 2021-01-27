import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col, FormFeedback, FormGroup, Input, Label,
} from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { FIELDS, FIELD_TYPE } from '../../constants/FieldsConstant';
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
    const { fieldKey, dispatch, user } = this.props;
    const { value } = this.state;
    dispatch(valueChange(fieldKey, value));
    validateField(fieldKey, value, dispatch, user);
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
    const { fieldKey, user, field } = this.props;
    const { errors } = user;
    const hasErrors = !!(errors && errors[fieldKey] !== undefined);
    const { type } = field;
    const { state } = this;

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
    const { fieldKey } = this.props;
    if (hasError) {
      return (
        <FormFeedback for={fieldKey}>{FIELDS[fieldKey].errorMessage}</FormFeedback>
      );
    }
    return null;
  }

  render() {
    const { field, fieldKey, user, t } = this.props;
    const { label, shouldShow } = field;
    const { errors } = user;
    const { value, type } = this.state;
    const hasErrors = !!(errors && errors[fieldKey] !== undefined);
    const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);

    if (!showField) return null;
    return (
      <>
        <FormGroup className="row mb-4 form-group">
          <Label for={fieldKey} className="col-sm-3 col-form-Label">
            {t(label)}
          </Label>
          <Col sm={9}>
            <Input
              type={type}
              className="form-control form-control-sm"
              id={fieldKey}
              value={value}
              onBlur={this.onBlur}
              onChange={this.handleChange}
              invalid={hasErrors}
              autoComplete="off"
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
