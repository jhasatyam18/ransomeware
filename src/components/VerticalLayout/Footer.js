import React from 'react';
import { Row, Col } from 'reactstrap';

const Footer = () => (
  <>
    <footer className="footer">
      <div className="container-fluid">
        <Row>
          <Col sm={6}>
            <div className="text-sm-right d-none d-sm-block">
              Datamotive
            </div>
          </Col>
        </Row>
      </div>
    </footer>
  </>
);

export default Footer;
