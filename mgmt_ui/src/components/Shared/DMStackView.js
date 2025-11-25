import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Col, Row } from 'reactstrap';
import { getStackComponent } from '../../utils/ComponentFactory';

class DMStackView extends Component {
  constructor() {
    super();
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    const { onToggleStack, index } = this.props;
    onToggleStack(index);
  }

  renderIcon() {
    const { openStack, vmMoref, title } = this.props;
    return (
      <div className="wizard-header-options">
        <div className="wizard-header-div">
          {openStack ? <FontAwesomeIcon style={{ fontSize: '10px' }} id={`${vmMoref}-${title}-down`} size="sm" icon={faChevronDown} onClick={this.toggle} />
            : <FontAwesomeIcon style={{ fontSize: '10px' }} id={`${vmMoref}-${title}-right`} size="sm" icon={faChevronRight} onClick={this.toggle} />}
        </div>
      </div>
    );
  }

  renderLabel(user, conf, label) {
    let lbl = label;
    if (typeof label === 'function') {
      lbl = label(user, conf);
    }
    return lbl;
  }

  renderChildren() {
    const { openStack } = this.props;
    const { configuration, dispatch, user } = this.props;
    if (openStack) {
      const { children } = configuration;
      return Object.keys(children).map((conf) => {
        // Add your condition here, for example, check if the label exists
        const { hideComponent } = children[conf];
        if (typeof hideComponent === 'function') {
          const response = hideComponent(user, conf);
          if (response === false) {
            return null;
          }
        }
        return (
          <Row className="stack__view" key={`stack-view-row-${conf}`}>
            <Col sm={4} className="key child">
              <p>{this.renderLabel(user, conf, children[conf].label)}</p>
            </Col>
            <Col sm={8} className="value padding-top-10 padding-bottom-10">
              {getStackComponent(dispatch, user, children, conf)}
            </Col>
          </Row>
        );
      });
    }
    return null;
  }

  renderComponent() {
    return (
      <div>TEST</div>
    );
  }

  renderParentHeader() {
    const { title, vmMoref } = this.props;
    return (
      <Row>
        <Col sm={2} className="padding-right-0 padding-bottom-5">
          {this.renderIcon()}
        </Col>
        <Col sm={10} className="padding-left-0">
          <span aria-hidden id={`${vmMoref}-${title}`} style={{ cursor: 'pointer' }} onClick={this.toggle}>
            {title}
          </span>
        </Col>
      </Row>
    );
  }

  render() {
    const { title, hasChildren } = this.props;
    return (
      <>
        <Row className="stack__view margin-left-0 margin-right-0">
          <Col sm={4} className="key">
            {hasChildren ? this.renderParentHeader() : `${title}`}
          </Col>
          <Col sm={8} className="value">
            {!hasChildren ? this.renderComponent() : null}
          </Col>
        </Row>
        {hasChildren ? this.renderChildren() : null}
      </>
    );
  }
}

const propTypes = {
  title: PropTypes.string.isRequired,
  hasChildren: PropTypes.bool.isRequired,
  configuration: PropTypes.any.isRequired,
};
DMStackView.propTypes = propTypes;
export default DMStackView;
