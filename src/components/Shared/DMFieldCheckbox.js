import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col, FormGroup, Label, Row,
} from 'reactstrap';
import { withTranslation } from 'react-i18next';
import DMToolTip from './DMToolTip';
import { getValue } from '../../utils/InputUtils';
import { valueChange } from '../../store/actions';

class DMFieldCheckbox extends Component {
  constructor() {
    super();
    this.state = { value: false };
  }

  componentDidMount() {
    const { user, fieldKey, defaultValue, dispatch } = this.props;
    const { values } = user;
    let v = getValue(fieldKey, values);
    if (v === true || v === false) {
      this.setState({ value: v });
    } else {
      v = (typeof defaultValue !== 'undefined' ? defaultValue : false);
      dispatch(valueChange(fieldKey, v));
      this.setState({ value: v });
    }
  }

  handleChange = (e) => {
    const { dispatch, fieldKey, field } = this.props;
    const { onChange } = field;
    this.setState({
      value: e.target.checked,
    });
    dispatch(valueChange(fieldKey, e.target.checked));
    if (typeof onChange === 'function') {
      dispatch(onChange({ value: e.target.checked }));
    }
  }

  getCheckboxValue() {
    const { value } = this.state;
    const { fieldKey, user } = this.props;
    const { values } = user;
    const fieldValue = getValue(fieldKey, values);
    if (value !== fieldValue) {
      this.setState({ value: fieldValue });
    }
    return fieldValue;
  }

  renderLabel() {
    const { t, hideLabel, field } = this.props;
    const { label } = field;
    if (hideLabel) {
      return null;
    }
    return (
      <Label for="dm-checkbox" className="col-sm-4 col-form-Label">
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
    const { field, fieldKey, user, disabled, hideLabel } = this.props;
    const { label, shouldShow } = field;
    const value = this.getCheckboxValue();
    const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);
    const css = hideLabel ? '' : 'row mb-4 form-group';
    if (!showField) return null;
    return (
      <>
        <FormGroup className={css}>
          {this.renderLabel()}
          <Col sm={hideLabel ? 12 : 8}>
            <Row>
              <Col sm={1}>
                <div className="custom-control custom-checkbox">
                  <input type="checkbox" className="custom-control-input" id={fieldKey} name={fieldKey} checked={value} onChange={this.handleChange} disabled={disabled} />
                  <label className="custom-control-label" htmlFor={fieldKey} />
                </div>
              </Col>
              <Col sm={2}>
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
DMFieldCheckbox.propTypes = propTypes;

export default (withTranslation()(DMFieldCheckbox));
