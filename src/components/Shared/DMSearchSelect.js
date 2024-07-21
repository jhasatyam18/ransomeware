import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import Select, { components } from 'react-select';
import { Col, FormGroup, Label, Row } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { valueChange } from '../../store/actions/UserActions';
import { getSearchSelectStyle } from '../../utils/ApiUtils';
import { getValue } from '../../utils/InputUtils';
import { validateField } from '../../utils/validationUtils';
import DMToolTip from './DMToolTip';

class DMSearchSelect extends Component {
  constructor() {
    super();
    this.state = { value: { label: '', value: '' } };
  }

  componentDidMount() {
    const { fieldKey, user, field, dispatch } = this.props;
    const { defaultValue } = field;
    const { values } = user;
    const fieldValue = getValue(fieldKey, values);
    if (fieldValue !== '' && typeof fieldValue === 'object') {
      this.setState({ value: fieldValue });
      dispatch(valueChange(fieldKey, fieldValue));
    }

    if (!fieldValue && defaultValue) {
      let defaultVal;
      if (typeof defaultValue === 'function') {
        defaultVal = defaultValue(user, fieldKey, dispatch);
      } else {
        defaultVal = defaultValue;
      }
      this.setState({ value: defaultVal });
      dispatch(valueChange(fieldKey, defaultVal));
    }
    const { options } = field;
    if (typeof options === 'function') {
      const optionValues = options(user, fieldKey) || [];
      optionValues.map((val) => {
        if (val.value === fieldValue.value) {
          dispatch(valueChange(fieldKey, val));
          this.setState({ value: val });
        }
      });
    }
    this.clearValueIfNotInOption(fieldValue);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { user, fieldKey, dispatch, field } = nextProps;
    const { values } = user;
    const { value } = prevState;
    const nextValue = getValue(fieldKey, values);
    if (nextValue.value !== value.value) {
      // if user first have selected empty value because of which field had error and parent component have selected value then error does not get clear
      // below code is to clear error from the field if value is changed from it's parent component
      if (typeof nextValue === 'object' && nextValue.value !== '') {
        validateField(field, fieldKey, nextValue, dispatch, user);
      }
      return ({ value: nextValue });
    }
    return null;
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
    this.setState({
      value: selectedOption,
    });
    dispatch(valueChange(fieldKey, selectedOption));
    if (typeof onChange === 'function') {
      dispatch(onChange({ selectedOption, dispatch, user, fieldKey }));
    }
    validateField(field, fieldKey, selectedOption, dispatch, user);
  };

  clearValueIfNotInOption(fieldValue) {
    if (fieldValue && fieldValue !== '' && Object.keys(fieldValue).length > 0) {
      const options = this.getOptions() || [];
      const { value } = fieldValue;
      const valueInOption = options.find((option) => option.value === value);
      if (options.length > 0 && !valueInOption) {
        this.setState({ value: '' });
      }
    }
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
    const { value } = this.state;
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
                  value={value}
                  components={{ MenuList: this.MenuList }}
                  captureMenuScroll={false}
                  onBlur={this.onBlur}
                  className="MyDropdown"
                  classNamePrefix="MyDropdown"
                  menuPlacement="auto"
                  maxMenuHeight={200}
                  menuPosition="fixed"
                  clearValue={this.clearValueIfNotInOption}
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

export default (withTranslation()(DMSearchSelect));
