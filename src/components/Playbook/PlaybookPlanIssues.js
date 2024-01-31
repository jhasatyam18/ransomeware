import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Collapse } from 'reactstrap';
import { PLAYBOOK_ISSUES } from '../../constants/TableConstants';
import DMTable from '../Table/DMTable';

function PlaybookPlanIssues({ data }) {
  const { planValidationResponse, name } = data;
  if (typeof planValidationResponse === 'undefined' || planValidationResponse === '') {
    return null;
  }
  const validate = JSON.parse(planValidationResponse);
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const renderIcon = () => (
    <div className="wizard-header-options">
      <div className="wizard-header-div">
        {isOpen ? <box-icon name="chevron-down" color="white" onClick={toggle} style={{ height: 20 }} />
          : <box-icon name="chevron-right" color="white" onClick={toggle} style={{ height: 20 }} /> }
      </div>
    </div>
  );

  return (
    <div key="dm-accordion-title" className="padding-10 width-50">
      <Card className="margin-bottom-10">
        <CardHeader>
          <Row>
            <Col sm={6}>
              <span aria-hidden className="link_color">
                {name}
              </span>
            </Col>
            <Col sm={6} className="d-flex flex-row-reverse">
              {renderIcon()}
            </Col>
          </Row>
          <Collapse isOpen={isOpen}>
            <CardBody className="padding-left-0 paddings-right-0">
              <DMTable
                columns={PLAYBOOK_ISSUES}
                data={validate}
              />
            </CardBody>
          </Collapse>
        </CardHeader>
      </Card>
    </div>
  );
}
export default PlaybookPlanIssues;
