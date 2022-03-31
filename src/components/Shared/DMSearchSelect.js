import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import {
  Col, FormFeedback, FormGroup, Label, Row,
} from 'reactstrap';
import { withTranslation } from 'react-i18next';
import DMToolTip from './DMToolTip';
import { getValue } from '../../utils/InputUtils';
import { valueChange } from '../../store/actions/UserActions';
import { validateField } from '../../utils/validationUtils';

class DMSearchSelect extends Component {
  componentDidMount() {
    const { fieldKey, user, field, dispatch } = this.props;
    const { defaultValue } = field;
    const { values } = user;
    const fieldValue = getValue(fieldKey, values);

    if (!fieldValue && typeof fieldValue !== 'undefined') {
      dispatch(valueChange(fieldKey, defaultValue));
    }

    if (!fieldValue && defaultValue) {
      let defaultVal;
      if (typeof defaultValue === 'function') {
        defaultVal = defaultValue(user);
      } else {
        defaultVal = defaultValue;
      }
      dispatch(valueChange(fieldKey, defaultVal));
    }
  }

  getStyles() {
    const hoverColor = '#2a3042';
    const bckClr = '#2e3548';
    const fontClr = '#bfc8e2';
    const borderClr = '#32394e';
    return {
      control: (base, state) => ({
        ...base,
        background: bckClr,
        backgroundColor: bckClr,
        borderColor: borderClr,
        boxShadow: state.isFocused ? null : null,
      }),
      menu: (base) => ({
        ...base,
        borderRadius: 0,
        marginTop: 0,
        background: bckClr,
        backgroundColor: bckClr,
        zIndex: 9999,
      }),
      menuList: (base) => ({
        ...base,
        opacity: 1000,
        padding: 0,
        background: bckClr,
        backgroundColor: bckClr,
      }),
      singleValue: (base) => ({
        ...base,
        padding: 0,
        color: fontClr,
      }),
      input: (base) => ({
        ...base,
        color: fontClr,
      }),
      option: (base) => ({
        ...base,
        '&:hover': {
          backgroundColor: hoverColor,
          color: 'white',
        },
      }),
    };
  }

  getOptions() {
    const { field, user, fieldKey } = this.props;
    const { options } = field;
    let optionValues;
    if (typeof options === 'function') {
      optionValues = options(user, fieldKey);
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

  handleChange = (selectedOption) => {
    const { dispatch, fieldKey } = this.props;
    dispatch(valueChange(fieldKey, selectedOption));
  }

  getFieldValue() {
    const { user, fieldKey } = this.props;
    const { values } = user;
    if (values) {
      return getValue(fieldKey, values);
    }
    return '';
  }

  renderError(hasError) {
    const { field, fieldKey } = this.props;
    if (hasError) {
      return (
        <FormFeedback htmlFor={fieldKey}>{field.errorMessage}</FormFeedback>
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
    const { shouldShow } = field;
    const { errors } = user;
    const hasErrors = !!(errors && errors[fieldKey] !== undefined);
    const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);
    if (!showField) return null;
    const isSearch = true;
    const css = hideLabel ? '' : 'row mb-4 form-group';
    return (
      <>
        <FormGroup className={css}>
          <Col sm={hideLabel ? 12 : 8}>
            <Row>
              <Col sm={11}>
                <Select
                  id={fieldKey}
                  styles={this.getStyles()}
                  isDisabled={disabled}
                  isSearchable={isSearch}
                  options={this.getOptions()}
                  onChange={this.handleChange}
                  value={this.getFieldValue()}
                  style={{ width: '100%' }}
                />
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
DMSearchSelect.propTypes = propTypes;

export default (withTranslation()(DMSearchSelect));
