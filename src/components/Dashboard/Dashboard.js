import React, { Component } from 'react';
import { Container, Card, Row, Col, CardBody, Media } from 'reactstrap';
import { Link } from 'react-router-dom';
import BandwidthChart from './BandwidthChart';
import NodeInfo from './NodeInfo';
import ProtectedVsUnProtectedVMs from './ProtectedVsUnProtectedVMs';
import RtoRpo from './RtoRpo';
import DashBoardJob from './DashboardJob';
import { fetchDashboardData, resetDashboard } from '../../store/actions/DashboardActions';
import { SITES_PATH, PROTECTION_PLANS_PATH } from '../../constants/RouterConstants';
import SiteConnection from './SiteConnection';
import DashboardEvents from './DashboardEvents';

class Dashboard extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchDashboardData());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(resetDashboard());
  }

  render() {
    const { dashboard } = this.props;
    const { titles } = dashboard;
    const { sites, protectionPlans, vms, storage } = titles;
    const reports = [
      { title: 'Sites', icon: 'cloud', description: sites, link: SITES_PATH },
      { title: 'Protection Plans', icon: 'layer', description: protectionPlans, link: PROTECTION_PLANS_PATH },
      { title: 'Protected Machines', icon: 'desktop', description: vms },
      { title: 'Protected Storage', icon: 'hdd', description: (storage > 1024 ? `${storage} TB` : `${storage} GB`) },
    ];
    return (
      <>
        <Container fluid>
          <Row>
            <Col xl="12">
              <Row>
                {reports.map((report, key) => (
                  <Col md="3" key={`_col_-${key * 2}`}>
                    <Card className="mini-stats-wid">
                      <Link to={report.link}>
                        <CardBody>
                          <Media>
                            <Media body>
                              <p className="text-muted font-weight-medium">
                                {report.title}
                              </p>
                              <h4 className="mb-0">{report.description}</h4>
                            </Media>
                            <div className="mini-stat-icon avatar-sm rounded-circle align-self-center">
                              <span className="">
                                <box-icon name={report.icon} size="lg" color={report.color ? report.color : 'white'} />
                              </span>
                            </div>
                          </Media>
                        </CardBody>
                      </Link>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
          <Row>
            <Col sm={8}><RtoRpo /></Col>
            <Col sm={4}><DashBoardJob protectionplanID={0} /></Col>
          </Row>
          <Row>
            <Col className="dashboard_component_size_handle" sm={8}><ProtectedVsUnProtectedVMs /></Col>
            <Col className="dashboard_component_size_handle" sm={4}><BandwidthChart {...this.props} /></Col>
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
}

export default Dashboard;
