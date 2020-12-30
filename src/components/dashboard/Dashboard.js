import React, { Component } from 'react';
import { Container, Card, Row, Col, CardBody, Media } from 'reactstrap';
import BandwidthChart from './BandwidthChart';

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      reports: [
        { title: 'Configured Sites', icon: 'cloud', description: '3' },
        { title: 'Active Protection Plans', icon: 'layer', description: '2' },
        { title: 'Protected Virtual Machines', icon: 'desktop', description: '20' },
      ],
      status: [
        { title: 'Alert', icon: 'error-alt', description: '0' },
        { title: 'Info', icon: 'cloud', description: '2' },
        { title: 'Alert', icon: 'error-alt', description: '0' },
        { title: 'Info', icon: 'cloud', description: '2' },
      ],
    };
  }

  render() {
    const { reports, status } = this.state;
    return (
      <>
        <Container fluid>
          <Row>
            <Col xl="12">
              <Row>
                {reports.map((report, key) => (
                  <Col md="4" key={`_col_-${key * 2}`}>
                    <Card className="mini-stats-wid">
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
                              <box-icon name={report.icon} size="lg" color="white" />
                            </span>
                          </div>
                        </Media>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
          <Row>
            <Col xl={12}>
              <BandwidthChart />
            </Col>
            <Col xl={12}>
              <Row>
                {status.map((stat, key) => (
                  <Col md="6" key={`_col_-${key * 2}`}>
                    <Card className="mini-stats-wid">
                      <CardBody>
                        <Media>
                          <Media body>
                            <p className="text-muted font-weight-medium">
                              {stat.title}
                            </p>
                            <h4 className="mb-0">{stat.description}</h4>
                          </Media>
                          <div className="mini-stat-icon avatar-sm rounded-circle align-self-center">
                            <span className="">
                              <box-icon name={stat.icon} size="lg" color="white" />
                            </span>
                          </div>
                        </Media>
                      </CardBody>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        </Container>
      </>
    );
  }
}

export default Dashboard;
