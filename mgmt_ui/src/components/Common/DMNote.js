import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardHeader, Col, Collapse, Row } from 'reactstrap';

function DMNote(props) {
  const { title, t, info, color, open, subText, component } = props;
  const [isOpen, setIopen] = useState(open);
  const noteText = t(info);
  const toggle = () => {
    setIopen(!isOpen);
  };
  const renderIcon = () => (
    <div className="wizard-header-options">
      <div className="wizard-header-div">
        {isOpen ? <FontAwesomeIcon size="sm" icon={faChevronDown} onClick={toggle} className="text-white" />
          : <FontAwesomeIcon size="sm" icon={faChevronRight} onClick={toggle} className="text-white" />}
      </div>
    </div>
  );

  const renderSubText = () => {
    if (subText) {
      return (
        <div className="text-warning margin-top-5">
          <i className="fas fa-exclamation-triangle text-warning" />
          &nbsp;&nbsp;&nbsp;
          {t(subText)}
        </div>
      );
    }
  };

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
                    {component ? component() : null}
                    {noteText}
                    {renderSubText()}
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
