import { isNumber } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Col, FormFeedback, FormGroup, Input, Row } from 'reactstrap';
import { FIELDS } from '../../constants/FieldsConstant';
import { valueChange } from '../../store/actions/UserActions';
import { getValue } from '../../utils/InputUtils';
import { validateField } from '../../utils/validationUtils';
import DMToolTip from './DMToolTip';

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
    if (typeof defaultValue === 'function') {
      dispatch(defaultValue({ fieldKey, user }));
    }
    if (value && isNumber(value)) {
      this.setState({ value });
    } else {
      dispatch(valueChange(fieldKey, defaultValue));
      this.setState({ value: defaultValue });
      dispatch(valueChange(fieldKey, defaultValue));
    }
  }

  componentDidUpdate() {
    const { user, fieldKey } = this.props;
    const { values } = user;
    const { value } = this.state;
    const updatedValue = getValue(fieldKey, values);
    if (value !== updatedValue) {
      this.setState({ value: updatedValue });
    }
  }

  handleChange = (e) => {
    const { field, fieldKey, dispatch, user } = this.props;
    let { min, max } = field;
    const { onChange, getMinMax } = field;
    const targetValue = parseInt(`${e.target.value}`, 10);
    if (getMinMax && typeof getMinMax === 'function') {
      const val = getMinMax(user);
      min = val.min;
      max = val.max;
    }
    if (targetValue < min) {
      this.setState({ value: min });
    } else if (targetValue > max) {
      this.setState({ value: max });
    } else if (Number.isNaN(targetValue)) {
      this.setState({ value: min });
    } else {
      this.setState({ value: targetValue });
    }
    dispatch(valueChange(fieldKey, targetValue));
    if (typeof onChange === 'function') {
      dispatch(onChange({ dispatch, user, fieldKey, value: targetValue }));
    }
  }

  onBlur = () => {
    const { fieldKey, dispatch, user, field } = this.props;
    const { value } = this.state;
    dispatch(valueChange(fieldKey, parseInt(value, 10)));
    validateField(field, fieldKey, value, dispatch, user);
  }

  renderError(hasError) {
    const { fieldKey, field } = this.props;
    const { errorMessage = '' } = field;
    let msg = '';
    if (FIELDS[fieldKey]) {
      msg = FIELDS[fieldKey].errorMessage;
    } else {
      msg = errorMessage;
    }
    if (hasError) {
      return (
        <FormFeedback for={fieldKey}>{msg}</FormFeedback>
      );
    }
    return null;
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

  render() {
    const { field, fieldKey, user, disabled, hideLabel } = this.props;
    const { shouldShow, min, max } = field;
    const { errors } = user;
    const { value } = this.state;
    const hasErrors = !!(errors && errors[fieldKey] !== undefined);
    const fieldDisabled = (typeof field.disabled !== 'undefined' && typeof field.disabled === 'function' ? field.disabled(user, fieldKey) : null);
    const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user, fieldKey) : shouldShow);
    const css = hideLabel ? '' : 'row mb-4 form-group';
    const shouldDisabled = (fieldDisabled !== null ? fieldDisabled : disabled);
    if (!showField) return null;
    return (
      <>
        <FormGroup className={css}>
          {this.renderLabel()}
          <Col sm={hideLabel ? 12 : 8}>
            <Row>
              <Col sm={11}>
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
                  step="1"
                  disabled={shouldDisabled}
                  pattern="[0-9]"
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
placeHolderNumber.propTypes = propTypes;

export default (withTranslation()(placeHolderNumber));
