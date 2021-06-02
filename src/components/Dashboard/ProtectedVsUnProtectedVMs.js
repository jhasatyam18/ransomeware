import React, { Component } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import ReactApexChart from 'react-apexcharts';
// i18n
import { withTranslation } from 'react-i18next';
import { STROKE, COLORS, LEGEND } from '../../constants/ProtectionPlanAnalysisConstant';

class ProtectedVsUnProtectedVMs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seriesOne: [39, 21],
      seriesTwo: [37, 2],
      walletOptions: {
        stroke: STROKE,
        colors: COLORS,
        labels: ['protected', 'unprotected'],
        legend: LEGEND,
      },

      replicationOptions: {
        stroke: STROKE,
        colors: COLORS,
        labels: ['replication.in.sync', 'replication.not.in.sync'],
        legend: LEGEND,
      },
    };
  }

  componentDidMount() {
    const { t } = this.props;
    const { walletOptions, replicationOptions } = this.state;
    const walletLabels = [t(walletOptions.labels[0]), t(walletOptions.labels[1])];
    const replicationLabels = [t(replicationOptions.labels[0]), t(replicationOptions.labels[1])];
    this.setState({
      walletOptions: { ...walletOptions, labels: walletLabels },
      replicationOptions: { ...replicationOptions, labels: replicationLabels },
    });
  }

  renderNoDataToShow() {
    const { t } = this.props;
    return (
      <>
        <Card>
          <CardBody>
            <p className="font-weight-medium color-white">
              {t('no.data.to.display')}
            </p>
          </CardBody>
        </Card>
      </>
    );
  }

  renderData() {
    const { walletOptions, replicationOptions, seriesOne, seriesTwo } = this.state;
    return (
      <>
        <Col>
          <div>
            <div id="vm-analysis-chart" className="apex-charts">
              <ReactApexChart
                options={walletOptions}
                series={seriesOne}
                type="pie"
                height={200}
              />
            </div>
          </div>
        </Col>
        <Col sm={2}>
          <div className="mt-4">
            <Row>
              <Col xs="12">
                <div>
                  <p className="mb-2">{walletOptions.labels[0]}</p>
                  <h4>39</h4>
                </div>
              </Col>
              <Col xs="12">
                <div>
                  <p className="mb-2">{walletOptions.labels[1]}</p>
                  <h4>21</h4>
                </div>
              </Col>
            </Row>
          </div>
        </Col>

        <Col>
          <div id="vm-analysis-chart" className="apex-charts">
            <ReactApexChart
              options={replicationOptions}
              series={seriesTwo}
              type="donut"
              height={200}
            />
          </div>
        </Col>
        <Col>
          <div className="mt-4">
            <Row>
              <Col xs="12">
                <div>
                  <p className="mb-2">{replicationOptions.labels[0]}</p>
                  <h4>37</h4>
                </div>
              </Col>
              <Col xs="12">
                <div>
                  <p className="mb-2">{replicationOptions.labels[1]}</p>
                  <h4>2</h4>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </>
    );
  }

  render() {
    const { seriesOne, seriesTwo } = this.state;
    const { t } = this.props;
    return (
      <>
        <Card>
          <CardBody>
            <p className="font-weight-medium color-white">
              {t('virtual.machine.protection.analysis')}
            </p>
            <Row>
              {(seriesOne.length > 0) && (seriesTwo.length > 0) ? this.renderData() : this.renderNoDataToShow()}
            </Row>
          </CardBody>
        </Card>
      </>
    );
  }
}

export default (withTranslation()(ProtectedVsUnProtectedVMs));
