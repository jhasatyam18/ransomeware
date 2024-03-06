import { faLaptop, faLayerGroup } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Col, Row } from 'reactstrap';

function PlaybookConfigureRenderer({ data }) {
  const { protectedEntitiesCount, protectionPlansCount } = data;

  return (
    <Row className="margin-top-3">
      <Col sm={6}>
        <FontAwesomeIcon size="sm" icon={faLayerGroup} />
        <span className="padding-left-10">{protectionPlansCount}</span>
      </Col>
      <Col sm={6}>
        <FontAwesomeIcon size="sm" icon={faLaptop} />
        <span className="padding-left-10">{protectedEntitiesCount}</span>
      </Col>
    </Row>
  );
}

export default PlaybookConfigureRenderer;
