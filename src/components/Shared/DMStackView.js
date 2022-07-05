import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Col, Row } from 'reactstrap';
import { getStackComponent } from '../../utils/ComponentFactory';

class DMStackView extends Component {
  constructor() {
    super();
    // this.state = { isOpen: false };
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    const { openByDefault } = this.props;
    if (typeof openByDefault !== 'undefined' && openByDefault === 'true') {
      this.toggle();
    }
  }

  toggle() {
    // const { isOpen } = this.state;
    const { onToggleStack, index } = this.props;
    // this.setState({ isOpen: !isOpen });
    onToggleStack(index);
  }

  renderIcon() {
    const { openStack } = this.props;
    return (
      <div className="wizard-header-options">
        <div className="wizard-header-div">
          {openStack ? <box-icon name="chevron-down" color="white" onClick={this.toggle} className="stackview-icon" />
            : <box-icon name="chevron-right" color="white" onClick={this.toggle} className="stackview-icon" />}
        </div>
      </div>
    );
  }

  renderChildren() {
    // const { isOpen } = this.state;
    const { openStack } = this.props;
    const { configuration, dispatch, user } = this.props;
    if (openStack) {
      const { children } = configuration;
      return Object.keys(children).map((conf, index) => (
        <Row className="stack__view" key={`stack-view-row-${index * 1}`}>
          <Col sm={4} className="key child">
            <p>
              {`${children[conf].label}`}
            </p>
          </Col>
          <Col sm={8} className="value padding-top-10 padding-bottom-10">
            {getStackComponent(dispatch, user, children, conf)}
          </Col>
        </Row>
      ));
    }
    return null;
  }

  renderComponent() {
    return (
      <div>TEST</div>
    );
  }

  renderParentHeader() {
    const { title } = this.props;
    return (
      <Row>
        <Col sm={2} className="padding-right-0 padding-left-5">
          {this.renderIcon()}
        </Col>
        <Col sm={10} className="padding-left-0">
          {title}
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
