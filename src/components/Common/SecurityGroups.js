import React, { Component } from 'react';
import { Badge, Col, FormGroup, Input, Row } from 'reactstrap';
import { valueChange } from '../../store/actions';
import { getSecurityGroupOption, getValue } from '../../utils/InputUtils';

class SecurityGroups extends Component {
  constructor() {
    super();
    this.state = { selectedSG: [], value: '-' };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { user, vmKey } = this.props;
    const { values } = user;
    const sgs = getValue(vmKey, values);
    if (sgs) {
      this.setState({ selectedSG: sgs });
    }
  }

  handleChange = (e) => {
    const { selectedSG } = this.state;
    const { dispatch, vmKey } = this.props;
    const isAlreadySelected = selectedSG.some((sg) => sg === e.target.value);
    if (!isAlreadySelected && e.target.value !== '') {
      selectedSG.push(e.target.value);
      this.setState({ selectedSG, value: e.target.value });
      dispatch(valueChange(vmKey, selectedSG));
    }
  }

  removeSG(sg) {
    const { dispatch, vmKey } = this.props;
    const { selectedSG } = this.state;
    const newData = selectedSG.filter((t) => t !== sg);
    this.setState({ selectedSG: newData });
    dispatch(valueChange(vmKey, newData));
  }

  renderSGs() {
    const { selectedSG } = this.state;
    const { vmKey } = this.props;
    return selectedSG.map((sg, index) => (
      <div className="row margin-left-10 padding-bottom-10 col" key={`dm-sg-${vmKey}${index * 1}`}>
        <Badge className="font-size-13 badge-soft-info" color="info" pill onClick={() => this.removeSG(sg)}>
          {sg}
          &nbsp;&nbsp;
          <i className="fa fa-minus-circle" />
        </Badge>
      </div>
    ));
  }

  renderOptions() {
    const { vmKey } = this.props;
    const { user } = this.props;
    const options = getSecurityGroupOption(user, vmKey);
    return options.map((op) => {
      const { value, label } = op;
      return (
        <option key={`sg-${vmKey}-${value}`} value={value}>
          {' '}
          { label}
          {' '}
        </option>
      );
    });
  }

  render() {
    const { vmKey } = this.props;
    const { value } = this.state;
    return (
      <>
        <Row className="padding-left-10 padding-right-10">
          <Col sm={12}>
            <FormGroup className="row mb-4 form-group">
              <Input type="select" id={vmKey} onSelect={this.handleChange} className="form-control form-control-sm custom-select" onChange={this.handleChange} value={value}>
                <option key={`${vmKey}-default`} value="">  </option>
                {this.renderOptions()}
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <Row className="padding-left-5">
          {this.renderSGs()}
        </Row>
      </>
    );
  }
}

export default SecurityGroups;
