import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import PropTypes from 'prop-types';
import DMStackView from './DMStackView';

class DMAccordion extends Component {
  constructor() {
    super();
    this.state = { isOpen: false, stackIndex: -1 };
    this.toggle = this.toggle.bind(this);
    this.toggleStack = this.toggleStack.bind(this);
  }

  toggle() {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
  }

  toggleStack(index) {
    const { stackIndex } = this.state;
    if (stackIndex === index) {
      this.setState({ stackIndex: -1 });
    } else {
      this.setState({ stackIndex: index });
    }
  }

  renderChild() {
    const { dispatch, config, user } = this.props;
    const { stackIndex } = this.state;
    const { data } = config;
    return data.map((conf, index) => (
      <>
        <DMStackView dispatch={dispatch} index={index} user={user} configuration={conf} title={conf.title} hasChildren={conf.hasChildren} key={`stack-view-${index * 1}`} openStack={stackIndex === index} onToggleStack={this.toggleStack} />
      </>
    ));
  }

  renderIcon() {
    const { isOpen } = this.state;
    return (
      <div className="wizard-header-options">
        <div className="wizard-header-div">
          {isOpen ? <box-icon name="chevron-down" color="white" onClick={this.toggle} style={{ height: 20 }} />
            : <box-icon name="chevron-right" color="white" onClick={this.toggle} style={{ height: 20 }} /> }
        </div>
      </div>
    );
  }

  render() {
    const { isOpen } = this.state;
    const { title } = this.props;
    return (
      <div key={`dm-accordion-${title}`}>
        <Card style={{ marginBottom: 10 }}>
          <CardHeader>
            <Row>
              <Col sm={6}>
                {title}
              </Col>
              <Col sm={6} className="d-flex flex-row-reverse">
                {this.renderIcon()}
              </Col>
            </Row>
            <Collapse isOpen={isOpen}>
              <CardBody className="padding-left-0 paddings-right-0">
                {this.renderChild()}
              </CardBody>
            </Collapse>
          </CardHeader>
        </Card>
      </div>
    );
  }
}

const propTypes = {
  title: PropTypes.string.isRequired,
};

DMAccordion.propTypes = propTypes;
export default DMAccordion;
