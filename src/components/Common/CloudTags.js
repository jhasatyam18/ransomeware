import React, { Component } from 'react';
import { Badge, Col, FormGroup, Input, Label, Row } from 'reactstrap';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { valueChange } from '../../store/actions';
import { addMessage } from '../../store/actions/MessageActions';
import { getSourceVMTags, getValue, isPlanWithSamePlatform } from '../../utils/InputUtils';
import DMToolTip from '../Shared/DMToolTip';

class CloudTags extends Component {
  constructor() {
    super();
    this.state = { tagKey: '', tagValue: '', tags: [], sourceTags: [], chkCopyTgs: false };
    this.handleChange = this.handleChange.bind(this);
    this.copyTags = this.copyTags.bind(this);
    this.addTags = this.addTags.bind(this);
  }

  componentDidMount() {
    const { user, vmKey } = this.props;
    const { values } = user;
    const tagData = getValue(vmKey, values);
    const srTags = getSourceVMTags(vmKey, values);
    this.setState({ tags: this.getInitialTagData(tagData), sourceTags: srTags });
  }

  getInitialTagData(data) {
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

  copyTags = (e) => {
    const { tags, sourceTags } = this.state;
    const { vmKey, dispatch } = this.props;
    let newTags = [...tags];
    if (e.target.checked === true) {
      sourceTags.forEach((st) => {
        const filteredTags = tags.filter((t) => t.key === st.key);
        if (filteredTags && filteredTags.length === 0) {
          newTags.push(st);
        }
      });
    } else {
      sourceTags.forEach((st) => {
        newTags = newTags.filter((t) => t.key !== st.key);
      });
    }
    this.setState({ tagKey: '', tagValue: '', tags: newTags, chkCopyTgs: e.target.checked });
    dispatch(valueChange(vmKey, newTags));
  }

  removeTag(tag) {
    const { dispatch, vmKey } = this.props;
    const { tags } = this.state;
    const newTags = tags.filter((t) => t.key !== tag.key);
    this.setState({ tags: newTags });
    dispatch(valueChange(vmKey, newTags));
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

  renderCopyTags() {
    const { chkCopyTgs } = this.state;
    const { vmKey, user } = this.props;
    if (!(isPlanWithSamePlatform(user))) {
      return null;
    }
    return (
      <Row className="padding-left-15">
        <Col sm={6}>
          <Label>Copy Source System Tags</Label>
        </Col>
        <Col sm={6}>
          <div className="custom-control custom-checkbox">
            <input key={`${vmKey}-cpyTag`} type="checkbox" className="custom-control-input" id={`${vmKey}-tags-copy`} name={`${vmKey}-tags-copy`} checked={chkCopyTgs} onChange={this.copyTags} />
            <label className="custom-control-label" htmlFor={`${vmKey}-tags-copy`} />
          </div>
        </Col>
      </Row>
    );
  }

  render() {
    const { tagKey, tagValue } = this.state;
    const { field = {} } = this.props;
    const { fieldInfo } = field;
    return (
      <>
        {this.renderCopyTags()}
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
