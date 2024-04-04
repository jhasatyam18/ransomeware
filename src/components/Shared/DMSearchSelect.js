import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Select, { components } from 'react-select';
import {
  Col, FormGroup, Label, Row,
} from 'reactstrap';
import { withTranslation } from 'react-i18next';
import SimpleBar from 'simplebar-react';
import { PLATFORM_TYPES } from '../../constants/InputConstants';
import DMToolTip from './DMToolTip';
import { getValue } from '../../utils/InputUtils';
import { valueChange } from '../../store/actions/UserActions';
import { validateField } from '../../utils/validationUtils';
import { getSearchSelectStyle } from '../../utils/ApiUtils';

class DMSearchSelect extends Component {
  componentDidMount() {
    const { fieldKey, user, field, dispatch } = this.props;
    const { defaultValue } = field;
    const { values } = user;
    const { options } = field;
    const fieldValue = getValue(fieldKey, values);

    if (!fieldValue && typeof fieldValue !== 'undefined') {
      dispatch(valueChange(fieldKey, defaultValue));
    }

    if (!fieldValue && defaultValue) {
      let defaultVal;
      if (typeof defaultValue === 'function') {
        defaultVal = defaultValue(user, fieldKey, dispatch);
      } else {
        defaultVal = defaultValue;
      }
      dispatch(valueChange(fieldKey, defaultVal));
    }
    // for edit pplan for vmware-vmware to get the options and label
    const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
    if (recoveryPlatform === PLATFORM_TYPES.VMware && fieldValue) {
      if (typeof options === 'function') {
        const optionValues = options(user, fieldKey) || [];
        optionValues.map((val) => {
          if (val.value === fieldValue.value) {
            dispatch(valueChange(fieldKey, val));
          }
        });
      }
    }
  }

  getStyles(hasError) {
    return getSearchSelectStyle(hasError);
  }

  getOptions() {
    const { field, user, fieldKey } = this.props;
    const { options } = field;
    let optionValues = [{ label: '', value: '' }];
    if (typeof options === 'function') {
      optionValues = [...optionValues, ...options(user, fieldKey)];
      return optionValues;
    }
    optionValues = (options && options.length > 0 ? [...optionValues, ...options] : optionValues);
    return optionValues;
  }

  onBlur = () => {
    const { fieldKey, dispatch, user, field } = this.props;
    const { values } = user;
    const val = getValue(fieldKey, values);
    validateField(field, fieldKey, val.value, dispatch, user);
  };

  handleChange = (selectedOption) => {
    const { dispatch, fieldKey, field, user } = this.props;
    const { onChange } = field;
    dispatch(valueChange(fieldKey, selectedOption));
    if (typeof onChange === 'function') {
      dispatch(onChange({ value: selectedOption.value, dispatch, user, fieldKey }));
    }
    validateField(field, fieldKey, selectedOption.value, dispatch, user);
  };

  getFieldValue() {
    const { user, fieldKey } = this.props;
    const { values } = user;
    if (values) {
      return getValue(fieldKey, values);
    }
    return '';
  }

  MenuList(props) {
    return (
      <components.MenuList {...props}>
        <SimpleBar style={{ maxHeight: '200px' }}>{props.children}</SimpleBar>
      </components.MenuList>
    );
  }

  renderError(hasError) {
    const { fieldKey, field, user } = this.props;
    let { errorMessage } = field;
    const { errorFunction } = field;
    const { values } = user;
    const val = getValue(fieldKey, values);
    if (errorFunction && typeof errorFunction === 'function') {
      const res = errorFunction({ fieldKey, user, value: val.value });
      if (res !== '') {
        errorMessage = res;
      }
    }
    if (hasError) {
      return (
        <small className="form-text app_danger" htmlFor={fieldKey}>{errorMessage}</small>
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
          {this.renderLabel()}
          <Col sm={hideLabel ? 12 : 8}>
            <Row>
              <Col sm={11}>
                <Select
                  inputId={fieldKey}
                  id={fieldKey}
                  styles={this.getStyles(hasErrors)}
                  isDisabled={disabled}
                  isSearchable={isSearch}
                  options={this.getOptions()}
                  onChange={this.handleChange}
                  value={this.getFieldValue()}
                  components={{ MenuList: this.MenuList }}
                  captureMenuScroll={false}
                  onBlur={this.onBlur}
                  className="MyDropdown"
                  classNamePrefix="MyDropdown"
                  menuPlacement="auto"
                  maxMenuHeight={200}
                  menuPosition="fixed"
                />
                {this.renderError(hasErrors)}
              </Col>
              <Col sm={1}>
                {this.renderTooltip()}
              </Col>
            </Row>
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
