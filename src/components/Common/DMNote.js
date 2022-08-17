import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardHeader, Col, Collapse, Row } from 'reactstrap';

function DMNote(props) {
  const { title, t, info, color, open } = props;
  const [isOpen, setIopen] = useState(open);
  const noteText = t(info);
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
      <Card className="margin-bottom-10">
        <CardHeader className="card_note-backgrd">
          <Row>
            <Col sm={11}>
              {!isOpen ? (
                <>
                  <a href="#" onClick={toggle} className={`card_note_${color}`}>
                    {title}
                  </a>
                </>
              ) : (
                <>
                  <Collapse isOpen={isOpen}>
                    {noteText}
                  </Collapse>
                </>
              )}
            </Col>
            <Col sm={1} className="d-flex flex-row-reverse">
              {renderIcon()}
            </Col>
          </Row>
        </CardHeader>
      </Card>
    </div>
  );
}

export default (withTranslation()(DMNote));
