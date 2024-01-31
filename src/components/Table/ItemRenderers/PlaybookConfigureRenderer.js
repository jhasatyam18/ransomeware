import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Col, Row } from 'reactstrap';
import { faLaptop, faLayerGroup } from '@fortawesome/free-solid-svg-icons';

function PlaybookConfigureRenderer({ data }) {
  const { protectedEntities, protectionPlans } = data;

  return (
    <Row className="margin-top-3">
      <Col sm={6}>
        <FontAwesomeIcon size="sm" icon={faLayerGroup} />
        <span className="padding-left-10">{protectionPlans}</span>
      </Col>
      <Col sm={6}>
        <FontAwesomeIcon size="sm" icon={faLaptop} />
        <span className="padding-left-10">{protectedEntities}</span>
      </Col>
    </Row>
  );
}

export default PlaybookConfigureRenderer;
