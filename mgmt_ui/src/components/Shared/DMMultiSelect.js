import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Badge, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import DMToolTip from './DMToolTip';
import { getValue } from '../../utils/InputUtils';
import { valueChange } from '../../store/actions';

class DMMultiSelect extends Component {
  constructor() {
    super();
    this.state = { value: '-' };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { user, fieldKey } = this.props;
    const { values } = user;
    let msValues = getValue(fieldKey, values);
    if (typeof msValues === 'string' && msValues.length > 0) {
      msValues = msValues.split(',');
    }
  }

  getSelectedValues() {
    const { user, fieldKey } = this.props;
    const { values } = user;
    const msValues = getValue(fieldKey, values);
    if (typeof msValues === 'string' && msValues.length > 0) {
      return msValues.split(',');
    }
    if (msValues && msValues.length > 0) {
      return msValues;
    }
    return [];
  }

  handleChange = (e) => {
    const { dispatch, fieldKey } = this.props;
    const selectedItems = this.getSelectedValues();
    const isAlreadySelected = selectedItems.some((sg) => sg === e.target.value);
    if (!isAlreadySelected && e.target.value !== '') {
      selectedItems.push(e.target.value);
      this.setState({ value: e.target.value });
      dispatch(valueChange(fieldKey, selectedItems));
    }
  };

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

  getLabelByID(item) {
    const options = this.getOptions();
    let label = '';
    options.map((op) => {
      if (op.value === item) {
        label = op.label;
      }
    });
    if (label !== '') {
      return label;
    }
    return item;
  }

  removeItem(item) {
    const { dispatch, fieldKey } = this.props;
    const selectedItems = this.getSelectedValues();
    const newData = selectedItems.filter((t) => t !== item);
    if (newData.length === 0) {
      this.setState({ value: '-' });
    } else {
      this.setState({ value: newData[newData.length - 1] });
    }
    dispatch(valueChange(fieldKey, newData));
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

  renderItems() {
    const { fieldKey } = this.props;
    const selectedItems = this.getSelectedValues();
    return selectedItems.map((item, index) => (
      <Badge className="font-size-13 badge-soft-info me-2 mb-2" color="info" key={`dm-sg-${fieldKey}${index * 1}`} pill onClick={() => this.removeItem(item)}>
        {this.getLabelByID(item)}
        &nbsp;&nbsp;
        <i className="fa fa-minus-circle text-info" />
      </Badge>
    ));
  }

  renderOptions() {
    const { fieldKey } = this.props;
    const options = this.getOptions();
    return options.map((op) => {
      const { value, label } = op;
      return (
        <option key={`key-${fieldKey}-${value}`} value={value}>
          {' '}
          {label}
          {' '}
        </option>
      );
    });
  }

  renderTooltip() {
    const { field = {} } = this.props;
    const { fieldInfo } = field;
    if (typeof fieldInfo === 'undefined') {
      return null;
    }
    return (
      <DMToolTip tooltip={fieldInfo} />
    );
  }

  renderError(hasError) {
    const { fieldKey, field, user } = this.props;
    let { errorMessage } = field;
    const { errorFunction } = field;
    if (errorFunction && typeof errorFunction === 'function') {
      const res = errorFunction({ fieldKey, user });
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

  render() {
    const { fieldKey, hideLabel, user } = this.props;
    const { value } = this.state;
    const { errors } = user;
    const hasErrors = !!(errors && errors[fieldKey] !== undefined);
    const css = hideLabel ? '' : 'row mb-4 form-group';
    return (
      <>
        <FormGroup className={css}>
          {this.renderLabel()}
          <Col sm={hideLabel ? 12 : 8}>
            <Row>
              <Col sm={11}>
                <div className="mb-2">
                  <Input type="select" id={fieldKey} onSelect={this.handleChange} className="form-control form-control-sm custom-select" onChange={this.handleChange} value={value}>
                    <option key={`${fieldKey}-default`} value="">  </option>
                    {this.renderOptions()}
                  </Input>
                </div>
                {this.renderItems()}
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

export default (withTranslation()(DMMultiSelect));
