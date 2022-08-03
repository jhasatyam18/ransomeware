import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, CardHeader, Col, Collapse, Row } from 'reactstrap';

function Note(props) {
  const { title, t, info } = props;
  const [isOpen, setIopen] = useState(false);
  const toggle = () => {
    setIopen(!isOpen);
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
    <div key={`dm-accordion-${title}`}>
      <Card className="margin-bottom-10 card-color">
        <CardHeader>
          <Row>
            <Col sm={6}>
              <a href="#" onClick={toggle}>
                {title}
              </a>
            </Col>
            <Col sm={6} className="d-flex flex-row-reverse">
              {renderIcon()}
            </Col>
          </Row>
          <Collapse isOpen={isOpen}>
            <CardBody className="padding-left-0 paddings-right-0">
              {t(info)}
            </CardBody>
          </Collapse>
        </CardHeader>
      </Card>
    </div>
  );
}

export default (withTranslation()(Note));
