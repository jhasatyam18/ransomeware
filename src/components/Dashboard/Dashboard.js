import React, { Component } from 'react';
import { Container, Card, Row, Col, CardBody, Media } from 'reactstrap';
import { Link } from 'react-router-dom';
import BandwidthChart from './BandwidthChart';
import NodeInfo from './NodeInfo';
import ProtectedVsUnProtectedVMs from './ProtectedVsUnProtectedVMs';
import ReplicationStat from './ReplicationStat';
import Events from './Events';

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      reports: [
        { title: 'Sites', icon: 'cloud', description: '5' },
        { title: 'Protection Plans', icon: 'layer', description: '4' },
        { title: 'Protected Machines', icon: 'desktop', description: '39' },
        { title: 'Storage', icon: 'hdd', description: '2.25 TB' },
        // { title: 'Snapshots', icon: 'camera', description: '112' },
        // { title: 'Data Protected Per/Hour', icon: 'data', description: '8 GB' },
        // { title: 'Data Reduction', icon: 'file', description: '60 %' },
        // { title: 'TBB', icon: 'file', description: '60 %' },

      ],
    };
  }

  render() {
    const { reports } = this.state;
    return (
      <>
        <Container fluid>
          <Row>
            <Col xl="12">
              <Row>
                {reports.map((report, key) => (
                  <Col md="3" key={`_col_-${key * 2}`}>
                    <Card className="mini-stats-wid">
                      <CardBody>
                        <Media>
                          <Media body>
                            <p className="text-muted font-weight-medium">
                              {report.title}
                            </p>
                            <Link href="/dashboard"><h4 className="mb-0">{report.description}</h4></Link>
                          </Media>
                          <div className="mini-stat-icon avatar-sm rounded-circle align-self-center">
                            <span className="">
                              <box-icon name={report.icon} size="lg" color={report.color ? report.color : 'white'} />
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
            <Col sm={8}><ReplicationStat /></Col>
            <Col sm={4}><BandwidthChart /></Col>
          </Row>
          <Row>
            <ProtectedVsUnProtectedVMs />
            <Col sm={4}><Events /></Col>
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
