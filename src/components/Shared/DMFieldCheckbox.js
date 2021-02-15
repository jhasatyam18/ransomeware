import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col, FormGroup, Label,
} from 'reactstrap';
import { withTranslation } from 'react-i18next';
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
    if (typeof value !== 'undefined') {
      this.setState({ value: v });
    } else {
      v = (typeof defaultValue !== 'undefined' ? defaultValue : false);
      dispatch(valueChange(fieldKey, v));
      this.setState({ value: v });
    }
  }

  handleChange = (e) => {
    const { dispatch, fieldKey } = this.props;
    this.setState({
      value: e.target.checked,
    });
    dispatch(valueChange(fieldKey, e.target.checked));
  }

  render() {
    const { field, fieldKey, user, t } = this.props;
    const { label, shouldShow } = field;
    const { value } = this.state;
    const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);

    if (!showField) return null;
    return (
      <>
        <FormGroup className="row mb-4 form-group">
          <Label for={fieldKey} className="col-sm-4 col-form-Label">
            {t(label)}
          </Label>
          <Col sm={8}>
            <div className="custom-control custom-checkbox">
              <input type="checkbox" className="custom-control-input" id={fieldKey} name={fieldKey} checked={value} onChange={this.handleChange} />
              <label className="custom-control-label" htmlFor={fieldKey} />
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
DMFieldCheckbox.propTypes = propTypes;

export default (withTranslation()(DMFieldCheckbox));
