import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactDatePicker from 'react-datepicker';
import { withTranslation } from 'react-i18next';
import { Col, FormGroup, Label } from 'reactstrap';
import { valueChange } from '../../store/actions/UserActions';
import { getValue } from '../../utils/InputUtils';
// Import Images

class DMDatePicker extends Component {
  constructor() {
    super();
    this.state = { value: new Date() };
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

  handleChange = (date) => {
    const { dispatch, fieldKey } = this.props;
    this.setState({
      value: date,
    });
    dispatch(valueChange(fieldKey, date));
  }

  minDate() {
    const { field } = this.props;
    const { minDate } = field;
    return minDate ? new Date() : 'undefined';
  }

  minTime() {
    const { field } = this.props;
    const { minDate, showTime } = field;
    if (minDate && showTime) {
      return new Date();
    }
    return 'undefined';
  }

  maxTime() {
    const { field } = this.props;
    const { minDate, showTime } = field;
    if (minDate && showTime) {
      return new Date().setHours(23, 55);
    }
    return 'undefined';
  }

  dateFormat() {
    const { field } = this.props;
    const { showTime } = field;
    return showTime ? 'MMMM d, yyyy h:mm aa' : 'MMMM d, yyyy';
  }

  renderLabel() {
    const { t, hideLabel, field } = this.props;
    const { label } = field;
    if (hideLabel) {
      return null;
    }
    return (
      <Label for="horizontal-firstname-Input" className="col-sm-4 col-form-Label padding-top-5">
        {t(label)}
      </Label>
    );
  }

  render() {
    const { field, fieldKey, user, hideLabel, disabled } = this.props;
    const { shouldShow, showTime } = field;
    const { value } = this.state;
    const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);
    if (!showField) return null;
    const css = hideLabel ? '' : 'row mb-4 form-group';
    const interval = showTime ? 15 : 'undefined';
    return (
      <>
        <FormGroup className={css}>
          {this.renderLabel()}
          <Col sm={hideLabel ? 12 : 8}>
            <ReactDatePicker
              className="form-control form-control-sm custom-select"
              selected={value}
              onChange={(date) => this.handleChange(date)}
              disabled={disabled}
              showTimeSelect={showTime}
              minDate={this.minDate()}
              minTime={this.minTime()}
              maxTime={this.maxTime()}
              timeIntervals={interval}
              dateFormat={this.dateFormat()}
              key={`datepicker-${fieldKey}`}
            />
          </Col>
        </FormGroup>
      </>
    );
  }
}
const propTypes = {
  dispatch: PropTypes.func.isRequired,
};
DMDatePicker.propTypes = propTypes;

export default (withTranslation()(DMDatePicker));
