import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
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
import DashboardAlertOverview from './DashboardAlertOverview';
import { getStorageWithUnit } from '../../utils/AppUtils';
import GettingStarted from './GettingStarted';

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
    const { dashboard, t } = this.props;
    const { titles } = dashboard;
    const { sites = 0, protectionPlans = 0, vms = 0, storage = 0 } = titles;
    const reports = [
      { title: t('sites'), icon: 'cloud', description: sites, link: SITES_PATH },
      { title: t('protection.plans'), icon: 'layer', description: protectionPlans, link: PROTECTION_PLANS_PATH },
      { title: t('protected.machines'), icon: 'desktop', description: vms },
      { title: t('protected.storage'), icon: 'hdd', description: getStorageWithUnit(storage) },
    ];
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
            <Col sm={4}>
              <Row>
                <Col sm={12}>
                  <DashboardAlertOverview />
                </Col>
                <Col sm={12}>
                  <DashBoardJob protectionplanID={0} />
                </Col>
              </Row>
            </Col>
            <Col sm={8}><RtoRpo /></Col>
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

export default (withTranslation()(Dashboard));
