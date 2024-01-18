import React, { Component } from 'react';
import { Badge, Col, FormGroup, Input, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { valueChange } from '../../store/actions';
import { addMessage } from '../../store/actions/MessageActions';
import { getValue } from '../../utils/InputUtils';
import DMToolTip from '../Shared/DMToolTip';

class RoleMapper extends Component {
  constructor() {
    super();
    this.state = { roleSrc: '', roleValue: '', roles: [] };
    this.handleChange = this.handleChange.bind(this);
    this.addMapping = this.addMapping.bind(this);
    this.addMappingOnKeyPress = this.addMappingOnKeyPress.bind(this);
  }

  componentDidMount() {
    const { user, fieldKey } = this.props;
    const { values } = user;
    const mappingData = getValue(fieldKey, values);
    this.setState({ roles: this.getInitialMappingData(mappingData) });
  }

  getInitialMappingData(data) {
    if (data === '' || typeof data === 'undefined') {
      return [];
    }
    return data;
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  getOptions() {
    const { user, fieldKey, options } = this.props;
    let optionValues;
    if (typeof options === 'function') {
      optionValues = options(user, fieldKey);
      return optionValues;
    }
    optionValues = (options && options.length > 0 ? options : []);
    return optionValues;
  }

  addMapping() {
    const { roleSrc, roleValue, roles } = this.state;
    const { dispatch, fieldKey } = this.props;
    if (roleSrc && roleValue) {
      const filteredRoles = roles.filter((r) => r.key === roleSrc);
      if (filteredRoles && filteredRoles.length > 0) {
        dispatch(addMessage('Mapping already exists.', MESSAGE_TYPES.ERROR));
        return;
      }
      const role = { key: roleSrc, value: roleValue };
      const newRoles = [...roles, role];
      this.setState({ roleSrc: '', roleValue: '', roles: newRoles });
      dispatch(valueChange(fieldKey, newRoles));
    }
  }

  removeMapping(mapping) {
    const { dispatch, fieldKey } = this.props;
    const { roles } = this.state;
    const newMapping = roles.filter((t) => t.key !== mapping.key);
    this.setState({ roles: newMapping });
    dispatch(valueChange(fieldKey, newMapping));
  }

  addMappingOnKeyPress(e) {
    if (e.key === 'Enter') {
      this.addMapping();
    }
  }

  renderMapping() {
    const { roles } = this.state;
    const { fieldKey } = this.state;
    return roles.map((tag, index) => (
      <div className="row margin-left-10 padding-bottom-10 col" key={`dm-tags-${fieldKey}${index * 1}`}>
        <Badge className="font-size-13 badge-soft-info" color="info" pill onClick={() => this.removeMapping(tag)}>
          {tag.key}
          -
          {tag.value}
          &nbsp;&nbsp;
          <i className="fa fa-minus-circle" />
        </Badge>
      </div>
    ));
  }

  renderOptions() {
    const options = this.getOptions();
    return options.map((op) => {
      const { value, label } = op;
      return (
        <option key={`${label}-${value}`} value={value}>
          {' '}
          { label}
          {' '}
        </option>
      );
    });
  }

  render() {
    const { roleSrc, roleValue } = this.state;
    const { field = {}, t } = this.props;
    const { fieldInfo, srcAltText, srcLabel, tgtLabel } = field;
    return (
      <>
        <Row className="padding-left-10">
          <Col sm={5}>
            <FormGroup className="row mb-4 form-group">
              <label htmlFor="roleSrc" className="col-sm-12 col-form-label col-form-label-sm">{t(`${srcLabel}`)}</label>
              <Col sm={12}>
                <Input
                  type="text"
                  className="form-control form-control-sm"
                  id="roleSrc"
                  value={roleSrc}
                  onChange={this.handleChange}
                  placeholder={srcAltText}
                  autoComplete="off"
                />
              </Col>
            </FormGroup>
          </Col>
          <Col sm={5}>
            <FormGroup className="row mb-4 form-group">
              <label htmlFor="roleValue" className="col-sm-12 col-form-label col-form-label-sm">{t(`${tgtLabel}`)}</label>
              <Col sm={12}>
                <Input
                  type="select"
                  className="form-control form-control-sm"
                  id="roleValue"
                  value={roleValue}
                  onChange={this.handleChange}
                  placeholder="Value"
                  autoComplete="off"
                  onKeyPress={this.addMappingOnKeyPress}
                >
                  {this.renderOptions()}
                </Input>
              </Col>
            </FormGroup>
          </Col>
          <Col sm={1}>
            <FormGroup className="row mb-4 form-group">
              <Col sm={12}>
                <div className="wizard-header-options">
                  <div className="wizard-header-div padding-top-25">
                    <box-icon name="plus-circle" color="white" onClick={this.addMapping} />
                  </div>
                </div>
              </Col>
            </FormGroup>
          </Col>
          <Col sm={1}>
            <FormGroup className="row mb-4 form-group">
              <Col sm={12} className="padding-top-25">
                <DMToolTip tooltip={fieldInfo} />
              </Col>
            </FormGroup>
          </Col>
        </Row>
        <Row className="padding-left-5">
          {this.renderMapping()}
        </Row>
      </>
    );
  }
}

export default (withTranslation()(RoleMapper));
