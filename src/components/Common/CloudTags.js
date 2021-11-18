import React, { Component } from 'react';
import { Badge, Col, FormGroup, Input, Row } from 'reactstrap';
import DMToolTip from '../Shared/DMToolTip';
import { valueChange } from '../../store/actions';
import { addMessage } from '../../store/actions/MessageActions';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { getValue } from '../../utils/InputUtils';

class CloudTags extends Component {
  constructor() {
    super();
    this.state = { tagKey: '', tagValue: '', tags: [] };
    this.handleChange = this.handleChange.bind(this);
    this.addTags = this.addTags.bind(this);
  }

  componentDidMount() {
    const { user, vmKey } = this.props;
    const { values } = user;
    const tagData = getValue(vmKey, values);
    if (tagData) {
      this.setState({ tags: tagData });
    }
  }

  handleChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
    });
  }

  removeTag(tag) {
    const { dispatch, vmKey } = this.props;
    const { tags } = this.state;
    const newTags = tags.filter((t) => t.key !== tag.key);
    this.setState({ tags: newTags });
    dispatch(valueChange(vmKey, tags));
  }

  addTags() {
    const { tagKey, tagValue, tags } = this.state;
    const { dispatch, vmKey } = this.props;
    if (tagKey && tagValue) {
      const filteredTags = tags.filter((t) => t.key === tagKey);
      if (filteredTags && filteredTags.length > 0) {
        dispatch(addMessage('Tag key already exists.', MESSAGE_TYPES.ERROR));
        return;
      }
      const tag = { key: tagKey, value: tagValue };
      const newTags = [...tags, tag];
      this.setState({ tagKey: '', tagValue: '', tags: newTags });
      dispatch(valueChange(vmKey, newTags));
    }
  }

  renderTags() {
    const { tags } = this.state;
    const { vmKey } = this.state;
    return tags.map((tag, index) => (
      <div className="row margin-left-10 padding-bottom-10 col" key={`dm-tags-${vmKey}${index * 1}`}>
        <Badge className="font-size-13 badge-soft-info" color="info" pill onClick={() => this.removeTag(tag)}>
          {tag.key}
          -
          {tag.value}
          &nbsp;&nbsp;
          <i className="fa fa-minus-circle" />
        </Badge>
      </div>
    ));
  }

  render() {
    const { tagKey, tagValue } = this.state;
    const { field = {} } = this.props;
    const { fieldInfo } = field;
    return (
      <>
        <Row className="padding-left-10">
          <Col sm={5}>
            <FormGroup className="row mb-4 form-group">
              <Col sm={12}>
                <Input
                  type="text"
                  className="form-control form-control-sm"
                  id="tagKey"
                  value={tagKey}
                  onChange={this.handleChange}
                  placeholder="Tag Key"
                  autoComplete="off"
                />
              </Col>
            </FormGroup>
          </Col>
          <Col sm={5}>
            <FormGroup className="row mb-4 form-group">
              <Col sm={12}>
                <Input
                  type="text"
                  className="form-control form-control-sm"
                  id="tagValue"
                  value={tagValue}
                  onChange={this.handleChange}
                  placeholder="Tag Value"
                  autoComplete="off"
                />
              </Col>
            </FormGroup>
          </Col>
          <Col sm={1}>
            <FormGroup className="row mb-4 form-group">
              <Col sm={12}>
                <div className="wizard-header-options">
                  <div className="wizard-header-div">
                    <box-icon name="plus-circle" color="white" onClick={this.addTags} />
                  </div>
                </div>
              </Col>
            </FormGroup>
          </Col>
          <Col sm={1}>
            <FormGroup className="row mb-4 form-group">
              <Col sm={12}>
                <DMToolTip tooltip={fieldInfo} />
              </Col>
            </FormGroup>
          </Col>
        </Row>
        <Row className="padding-left-5">
          {this.renderTags()}
        </Row>
      </>
    );
  }
}

export default CloudTags;
