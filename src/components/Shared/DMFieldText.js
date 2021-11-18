import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {
  Col, FormGroup, Row,
} from 'reactstrap';
import { FIELD_TYPE } from '../../constants/FieldsConstant';
import { valueChange } from '../../store/actions/UserActions';
import { getValue } from '../../utils/InputUtils';
import { validateField } from '../../utils/validationUtils';
import DMToolTip from './DMToolTip';
// Import Images

class DMFieldText extends Component {
  constructor() {
    super();
    this.state = { value: '', type: 'text', isFocused: false };
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

  handleKeyPress = (e) => {
    if (e.target.charCode === 13) {
      e.preventDefault();
    }
  }

  handleChange = (e) => {
    this.setState({
      value: e.target.value,
    });
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
    dispatch(valueChange(fieldKey, value));
    validateField(field, fieldKey, value, dispatch, user);
  }

  typeToggle() {
    const { state } = this;
    const newtype = (state.type === FIELD_TYPE.PASSWORD ? FIELD_TYPE.TEXT : FIELD_TYPE.PASSWORD);
    this.setState({ type: newtype });
  }

  showPasswordToggle() {
    const { fieldKey, user, field, hidepassword } = this.props;
    const { errors } = user;
    const hasErrors = !!(errors && errors[fieldKey] !== undefined);
    const { type } = field;
    const { state } = this;
    if (hidepassword || hasErrors || type !== FIELD_TYPE.PASSWORD) {
      return null;
    }
    const icon = (state.type === FIELD_TYPE.PASSWORD ? 'hide' : 'show');
    const focused = state.isFocused;
    return (
      <span className={(focused && field.description) ? 'field-icon-focused' : 'field-icon'}>
        <box-icon name={icon} color="white" onClick={this.typeToggle} style={{ height: 16, width: 16 }} />
      </span>
    );
  }

  renderError(hasError) {
    const { fieldKey, field } = this.props;
    if (hasError) {
      return (
        <small className="form-text app_danger" htmlFor={fieldKey}>{field.errorMessage}</small>
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
      <label htmlFor="horizontal-Input margin-top-10 padding-top=10" className="col-sm-4 col-form-Label">
        {t(label)}
      </label>
    );
  }

  renderTooltip() {
    const { field } = this.props;
    const { fieldInfo } = field;
    if (typeof fieldInfo === 'undefined') {
      return null;
    }
    return (
      <DMToolTip tooltip={fieldInfo} />
    );
  }

  render() {
    const { field, fieldKey, user, hideLabel, disabled } = this.props;
    const { shouldShow, placeHolderText } = field;
    const { errors } = user;
    const { value, type } = this.state;
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
                  <input
                    type={type}
                    className="form-control"
                    id={fieldKey}
                    value={value}
                    onBlur={this.onBlur}
                    onChange={this.handleChange}
                    invalid={hasErrors}
                    autoComplete="none"
                    placeholder={placeH}
                    onFocus={() => this.handleFocus(true)}
                    disabled={disabled}
                    onKeyPress={this.handleKeyPress}
                  />
                  {this.showPasswordToggle()}
                </div>
              </Col>
              <Col sm={1}>
                {this.renderTooltip()}
              </Col>
            </Row>
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
