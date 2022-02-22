import React from 'react';
import { withTranslation } from 'react-i18next';
import { Col, Container, Row } from 'reactstrap';
import BandwidthChart from './BandwidthChart';
import DashboardAlertOverview from './DashboardAlertOverview';
import DashboardEvents from './DashboardEvents';
import DashBoardJob from './DashboardJob';
import DashboardTitles from './DashboardTitles';
import GettingStarted from './GettingStarted';
import NodeInfo from './NodeInfo';
import ProtectedVsUnProtectedVMs from './ProtectedVsUnProtectedVMs';
import RtoRpo from './RtoRpo';
import SiteConnection from './SiteConnection';

function Dashboard(props) {
  return (
    <>
      <Container fluid>
        <Row>
          <Col sm={12}>
            <GettingStarted />
          </Col>
        </Row>
        <Row>
          <Col xl="12">
            <DashboardTitles />
          </Col>
        </Row>
        <Row>
          <Col sm={4}>
            <Row>
              <Col sm={12}>
                <DashboardAlertOverview />
              </Col>
              <Col sm={12}>
                <DashBoardJob />
              </Col>
            </Row>
          </Col>
          <Col sm={8}><RtoRpo /></Col>
        </Row>
        <Row>
          <Col className="dashboard_component_size_handle" sm={8}><ProtectedVsUnProtectedVMs /></Col>
          <Col className="dashboard_component_size_handle" sm={4}><BandwidthChart {...props} /></Col>
        </Row>
        <Row>
          <Col sm={8}><SiteConnection /></Col>
          <Col sm={4}><DashboardEvents /></Col>
        </Row>
        <Row>
          <Col xl={12}>
            <NodeInfo />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default (withTranslation()(Dashboard));
