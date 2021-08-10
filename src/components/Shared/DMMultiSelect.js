import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Badge, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { getValue } from '../../utils/InputUtils';
import { valueChange } from '../../store/actions';

class DMMultiSelect extends Component {
  constructor() {
    super();
    this.state = { selectedItems: [], value: '-' };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { user, fieldKey } = this.props;
    const { values } = user;
    let msValues = getValue(fieldKey, values);
    if (typeof msValues === 'string' && msValues.length > 0) {
      msValues = msValues.split(',');
    }
    if (msValues) {
      this.setState({ selectedItems: msValues });
    }
  }

  handleChange = (e) => {
    const { selectedItems } = this.state;
    const { dispatch, fieldKey } = this.props;
    const isAlreadySelected = selectedItems.some((sg) => sg === e.target.value);
    if (!isAlreadySelected) {
      selectedItems.push(e.target.value);
      this.setState({ selectedItems, value: e.target.value });
      dispatch(valueChange(fieldKey, selectedItems));
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

  removeItem(item) {
    const { dispatch, fieldKey } = this.props;
    const { selectedItems } = this.state;
    const newData = selectedItems.filter((t) => t !== item);
    this.setState({ selectedItems: newData });
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
    const { selectedItems } = this.state;
    const { fieldKey } = this.props;
    return selectedItems.map((item, index) => (
      <div className="margin-left-10 padding-top-10 padding-bottom-10" key={`dm-sg-${fieldKey}${index * 1}`}>
        <Badge className="font-size-13 badge-soft-info" color="info" pill onClick={() => this.removeItem(item)}>
          {item}
          &nbsp;&nbsp;
          <i className="fa fa-minus-circle" />
        </Badge>
      </div>
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

  render() {
    const { fieldKey, hideLabel } = this.props;
    const { value } = this.state;
    const css = hideLabel ? '' : 'row mb-4 form-group';
    return (
      <>
        <FormGroup className={css}>
          {this.renderLabel()}
          <Col sm={hideLabel ? 12 : 8}>
            <div>
              <Input type="select" id={fieldKey} onSelect={this.handleChange} className="form-control form-control-sm custom-select" onChange={this.handleChange} value={value}>
                <option key={`${fieldKey}-default`} value="-">  </option>
                {this.renderOptions()}
              </Input>
            </div>
            <Row>
              {this.renderItems()}
            </Row>
          </Col>
        </FormGroup>
      </>
    );
  }
}

export default (withTranslation()(DMMultiSelect));
