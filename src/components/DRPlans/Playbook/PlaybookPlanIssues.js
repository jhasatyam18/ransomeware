import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';
import { PLAYBOOK_ISSUES } from '../../../constants/TableConstants';
import { KEY_CONSTANTS } from '../../../constants/UserConstant';
import DMTable from '../../Table/DMTable';

function PlaybookPlanIssues({ data, t }) {
  const { planValidationResponse, name } = data;
  if (typeof planValidationResponse === 'undefined' || planValidationResponse === '') {
    return null;
  }
  const validate = JSON.parse(planValidationResponse);

  const vmValidation = [];
  const systemValidation = [];
  validate.forEach((element) => {
    if (element.name === KEY_CONSTANTS.PLAYBOOK_ERROR_SYSTEM_VALIDATIONS || element.name === KEY_CONSTANTS.PLAYBOOK_GENERAL_CONFIGURATION) {
      systemValidation.push(element);
    } else {
      vmValidation.push(element);
    }
  });

  const systemValidaionColumn = PLAYBOOK_ISSUES[PLAYBOOK_ISSUES.length - 1];
  const [isOpen, setIsOpen] = useState(true);
  const [sysOpen, setSysOpen] = useState(false);
  const toggle = (setFunction, val) => {
    setFunction(!val);
  };

  const renderIcon = (fun, val) => (
    <div className="wizard-header-options">
      <div className="wizard-header-div">
        {val ? <FontAwesomeIcon size="sm" icon={faChevronDown} onClick={() => toggle(fun, val)} />
          : <FontAwesomeIcon size="sm" icon={faChevronRight} onClick={() => toggle(fun, val)} />}
      </div>
    </div>
  );

  return (
    <div key="dm-accordion-title" className="padding-10 width-50">
      {vmValidation.length > 0 ? (
        <Card className="margin-bottom-10">
          <CardHeader>
            <Row>
              <Col sm={6}>
                <span aria-hidden className="link_color" onClick={() => toggle(setIsOpen, isOpen)}>
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
      ) : null}
      {systemValidation.length > 0 ? (
        <Card>
          <CardHeader className="margin-top10">
            <Row>
              <Col sm={6}>
                <span aria-hidden className="link_color" onClick={() => toggle(setSysOpen, sysOpen)}>
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
      ) : null}
    </div>
  );
}
export default (withTranslation()(PlaybookPlanIssues));
