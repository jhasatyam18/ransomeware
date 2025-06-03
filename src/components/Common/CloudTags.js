import { faCirclePlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { Badge, Col, Input, Label, Row } from 'reactstrap';
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
    this.addTagsOnKeyPress = this.addTagsOnKeyPress.bind(this);
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
  };

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
  };

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

  addTagsOnKeyPress(e) {
    if (e.key === 'Enter') {
      this.addTags();
    }
  }

  renderTags() {
    const { tags } = this.state;
    const { vmKey } = this.state;
    return tags.map((tag, index) => (
      <div className="margin-left-10 padding-bottom-2" key={`dm-tags-${vmKey}${index * 1}`}>
        <Badge className="font-size-13 badge-soft-info" color="info" pill onClick={() => this.removeTag(tag)}>
          {tag.key}
          -
          {tag.value}
          &nbsp;&nbsp;
          <i className="fa fa-minus-circle text-info" />
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
          <div className="form-check">
            <input key={`${vmKey}-cpyTag`} type="checkbox" className="form-check-input" id={`${vmKey}-tags-copy`} name={`${vmKey}-tags-copy`} checked={chkCopyTgs} onChange={this.copyTags} />
            <label className="form-check-label" htmlFor={`${vmKey}-tags-copy`} />
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
        <Row className="padding-left-10 padding-right-10">
          <Col sm={5}>
            <Input
              type="text"
              className="form-control form-control-sm"
              id="tagKey"
              value={tagKey}
              onChange={this.handleChange}
              placeholder="Key"
              autoComplete="off"
            />
          </Col>
          <Col sm={5}>
            <Input
              type="text"
              className="form-control form-control-sm"
              id="tagValue"
              value={tagValue}
              onChange={this.handleChange}
              placeholder="Value"
              autoComplete="off"
              onKeyPress={this.addTagsOnKeyPress}
            />
          </Col>
          <Col sm={1} className="d-flex align-items-center">
            <FontAwesomeIcon size="lg" icon={faCirclePlus} className="pt-1" onClick={this.addTags} />
          </Col>
          <Col sm={1} className="d-flex align-items-center">
            <DMToolTip tooltip={fieldInfo} />
          </Col>
        </Row>
        <Row className="padding-left-2 mt-2">
          {this.renderTags()}
        </Row>
      </>
    );
  }
}

export default CloudTags;
