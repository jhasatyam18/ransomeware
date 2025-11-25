import React, { Component } from 'react';
import {
  Col, FormGroup, Label,
} from 'reactstrap';
import { withTranslation } from 'react-i18next';

class DMFieldLabel extends Component {
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
    const { text, field, fieldKey, user, hideLabel } = this.props;
    const { label, shouldShow, layout } = field;
    const showField = typeof shouldShow === 'undefined' || (typeof shouldShow === 'function' ? shouldShow(user) : shouldShow);
    const css = hideLabel ? '' : 'row mb-4 form-group';
    if (!showField) return null;
    if (layout === 'vertical') {
      return (
        <form>
          <div className="form-group">
            <Label for={fieldKey}>
              {label}
            </Label>
            <span>
              {text}
            </span>
          </div>
        </form>
      );
    }
    return (
      <>
        <FormGroup className={css}>
          {this.renderLabel()}
          <Col sm={hideLabel ? 12 : 8}>
            <div>
              {text}
            </div>
          </Col>
        </FormGroup>
      </>
    );
  }
}

export default (withTranslation()(DMFieldLabel));
