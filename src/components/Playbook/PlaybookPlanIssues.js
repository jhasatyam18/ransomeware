import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader, Col, Row, Collapse } from 'reactstrap';
import { PLAYBOOK_ISSUES } from '../../constants/TableConstants';
import DMTable from '../Table/DMTable';

function PlaybookPlanIssues({ data, t }) {
  const { planValidationResponse, name } = data;
  if (typeof planValidationResponse === 'undefined' || planValidationResponse === '') {
    return null;
  }
  const validate = JSON.parse(planValidationResponse);

  // System validation error comes at the last index from the response separated it from vm validation errors
  const vmValidation = validate.splice(0, validate.length - 1);
  const systemValidation = validate.splice(validate.length - 1, validate.length);
  // Only issues column will be shown for system validation error table
  const systemValidaionColumn = PLAYBOOK_ISSUES[PLAYBOOK_ISSUES.length - 1];
  const [isOpen, setIsOpen] = useState(true);
  const [sysOpen, setSysOpen] = useState(false);
  const toggle = (setFunction, val) => {
    setFunction(!val);
  };

  const renderIcon = (fun, val) => (
    <div className="wizard-header-options">
      <div className="wizard-header-div">
        {val ? <box-icon name="chevron-down" color="white" onClick={() => toggle(fun, val)} style={{ height: 20 }} />
          : <box-icon name="chevron-right" color="white" onClick={() => toggle(fun, val)} style={{ height: 20 }} /> }
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
              {renderIcon(setIsOpen, isOpen)}
            </Col>
          </Row>
          <Collapse isOpen={isOpen}>
            <CardBody className="padding-left-0 paddings-right-0">
              <DMTable
                columns={PLAYBOOK_ISSUES}
                data={vmValidation}
              />
            </CardBody>
          </Collapse>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="margin-top10">
          <Row>
            <Col sm={6}>
              <span aria-hidden className="link_color">
                {t('title.system.validation')}
              </span>
            </Col>
            <Col sm={6} className="d-flex flex-row-reverse">
              {renderIcon(setSysOpen, sysOpen)}
            </Col>
          </Row>
          <Collapse isOpen={sysOpen}>
            <CardBody className="padding-left-0 paddings-right-0">
              <DMTable
                columns={[systemValidaionColumn]}
                data={systemValidation}
              />
            </CardBody>
          </Collapse>
        </CardHeader>
      </Card>
    </div>
  );
}
export default (withTranslation()(PlaybookPlanIssues));
