import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import DMTable from '../Table/DMTable';
import { TABLE_PROTECTION_PLAN_RECOVERY } from '../../constants/TableConstants';

class ProtectionPlanRecovery extends Component {
  constructor() {
    super();
    this.state = { isOpen: false };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    const { isOpen } = this.state;
    this.setState({ isOpen: !isOpen });
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

  renderTable(vms) {
    return (
      <DMTable auto="true" dispatch={null} columns={TABLE_PROTECTION_PLAN_RECOVERY} data={vms} />
    );
  }

  render() {
    const { isOpen } = this.state;
    const { title, vms } = this.props;
    return (
      <div key={`dm-accordion-${title}`}>
        <Card className="margin-bottom-10">
          <CardHeader>
            <Row>
              <Col sm={6}>
                <span aria-hidden className="link_color" onClick={this.toggle}>
                  {title}
                </span>
              </Col>
              <Col sm={6} className="d-flex flex-row-reverse">
                {this.renderIcon()}
              </Col>
            </Row>
            <Collapse isOpen={isOpen}>
              <CardBody className="padding-left-0 paddings-right-0">
                {this.renderTable(vms)}
              </CardBody>
            </Collapse>
          </CardHeader>
        </Card>
      </div>
    );
  }
}

export default ProtectionPlanRecovery;
