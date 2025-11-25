import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Col, FormGroup, Label } from 'reactstrap';
import { valueChange } from '../../store/actions/UserActions';
import { getValue } from '../../utils/InputUtils';
// Import Images

class DMFieldRadio extends Component {
  constructor() {
    super();
    this.state = { selected: '' };
  }

  componentDidMount() {
    const { user, fieldKey, field, dispatch } = this.props;
    const { values } = user;
    const { defaultValue } = field;
    const value = getValue(fieldKey, values);
    if (value) {
      this.setState({ selected: value });
      return;
    }
    if (defaultValue) {
      this.setState({ selected: defaultValue });
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

  handleChange = (e) => {
    const { dispatch, fieldKey, user, field } = this.props;
    const { onChange } = field;
    this.setState({
      selected: e.target.value,
    });
    dispatch(valueChange(fieldKey, e.target.value));
    if (typeof onChange === 'function') {
      dispatch(onChange({ value: e.target.value, dispatch, user }));
    }
  };

  renderOptions() {
    const { selected } = this.state;
    const options = this.getOptions();
    return options.map((op) => {
      const { value, name, label } = op;
      const key = `$rdo-${value}`;
      return (
        <div className="form-check-inline" key={`key-${key}`}>
          <label className="form-check-label" htmlFor={key}>
            <input name={name} type="radio" className="form-check-input" id={key} value={value} checked={selected === value} onChange={this.handleChange} />
            { label }
          </label>
        </div>
      );
    });
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
    const { field, user, hideLabel } = this.props;
    const { shouldShow } = field;
    const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);
    if (!showField) return null;
    const css = hideLabel ? '' : 'row mb-4 form-group';
    return (
      <>
        <FormGroup className={css}>
          {this.renderLabel()}
          <Col sm={hideLabel ? 12 : 8}>
            <div>
              {this.renderOptions()}
            </div>
          </Col>
        </FormGroup>
      </>
    );
  }
}
const propTypes = {
  dispatch: PropTypes.func.isRequired,
};
DMFieldRadio.propTypes = propTypes;

export default (withTranslation()(DMFieldRadio));
