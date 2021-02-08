import React, { Component } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import ReactApexChart from 'react-apexcharts';

class ProtectedVsUnProtectedVMs extends Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   series: [39, 20, 10],
    //   options: {
    //     labels: ['Protected Virtual Machines', 'Unprotected Virtual Machines', 'Unprotected Virtual Machines With Heavy IOPS'],
    //     colors: ['#34c38f', '#556ee6', '#f46a6a'],
    //     legend: { show: !1 },
    //   },

    // };
    this.state = {
      series: [39, 21, 37, 2],
      walletOptions: {
        plotOptions: {
          radialBar: {
            offsetY: 0,
            startAngle: 0,
            endAngle: 270,
            hollow: {
              margin: 5,
              size: '35%',
              background: 'transparent',
              image: undefined,
            },
            track: {
              show: !0,
              startAngle: undefined,
              endAngle: undefined,
              background: '#f2f2f2',
              strokeWidth: '97%',
              opacity: 1,
              margin: 12,
              dropShadow: {
                enabled: !1,
                top: 0,
                left: 0,
                blur: 3,
                opacity: 0.5,
              },
            },
            dataLabels: {
              name: {
                show: !0,
                fontSize: '16px',
                fontWeight: 600,
                offsetY: -10,
              },
              value: {
                show: !0,
                fontSize: '14px',
                offsetY: 4,
                color: '#FFF',
                formatter(e) {
                  return e;
                },
              },
              total: {
                show: !0,
                label: 'VMs',
                color: '#FFF',
                fontSize: '16px',
                fontFamily: undefined,
                fontWeight: 600,
                formatter() {
                  return (
                    '60'
                  );
                },
              },
            },
          },
        },
        stroke: {
          lineCap: 'round',
        },
        colors: ['#3452e1', '#f1b44c', '#50a5f1'],
        labels: ['Protected', 'Unprotected', 'Insync', 'Not In Sync'],
        legend: { show: !1 },
      },
    };
  }

  render() {
    const { walletOptions, series } = this.state;
    return (
      <>
        <Col xl="8">
          <Card>
            <CardBody>
              <p className="font-weight-medium color-white">
                Virtual Machine Protection Analysis
              </p>
              <Row>
                <Col lg="3">
                  <div className="mt-4">
                    <p>Total Virtual Machines</p>
                    <h4>60</h4>

                    <p className="text-muted mb-4">
                      {' '}
                      {' '}
                      <i className="mdi mdi-arrow-up ml-1 text-success" />
                    </p>

                    <Row>
                      <Col xs="12">
                        <div>
                          <p className="mb-2">Protected</p>
                          <h4>39</h4>
                        </div>
                      </Col>
                      <Col xs="12">
                        <div>
                          <p className="mb-2">Unprotected</p>
                          <h4>21</h4>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>

                <Col lg="5" sm="6">
                  <div>
                    <div id="vm-analysis-chart" className="apex-charts">
                      <ReactApexChart
                        options={walletOptions}
                        series={series}
                        type="radialBar"
                        height={300}
                      />
                    </div>
                  </div>
                </Col>

                <Col lg="4" sm="6">
                  <Row>
                    <div className="mt-4">
                      <p className="text-muted mb-4">
                        <i className="mdi mdi-arrow-up ml-1 text-success" />
                      </p>

                      <Row>
                        <Col xs="12">
                          <div>
                            <p className="mb-2">Replication In-Sync</p>
                            <h4>37</h4>
                          </div>
                        </Col>
                        <Col xs="12">
                          <div>
                            <p className="mb-2">Replication Not In-Sync</p>
                            <h4>2</h4>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Row>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </>
    );
  }
}

export default ProtectedVsUnProtectedVMs;
