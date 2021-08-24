import React, { Component } from 'react';
import { Row, Col, Card, CardBody } from 'reactstrap';
import ReactApexChart from 'react-apexcharts';
import { connect } from 'react-redux';
// i18n
import { withTranslation } from 'react-i18next';
import { STROKE, SUCCESS, WARNING, DANGER, LEGEND } from '../../constants/ProtectionPlanAnalysisConstant';

class ProtectedVsUnProtectedVMs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      walletOptions: {
        stroke: STROKE,
        colors: [SUCCESS, DANGER],
        labels: ['protected', 'unprotected'],
        legend: LEGEND,
      },

      replicationOptions: {
        stroke: STROKE,
        colors: [SUCCESS, WARNING],
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

  renderData(protectedVMSeries, replicationSeries) {
    const { walletOptions, replicationOptions } = this.state;
    return (
      <>
        <Col>
          <div>
            <div id="vm-analysis-chart" className="apex-charts">
              <ReactApexChart
                options={walletOptions}
                series={protectedVMSeries}
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
                  <h4>{protectedVMSeries[0]}</h4>
                </div>
              </Col>
              <Col xs="12">
                <div>
                  <p className="mb-2">{walletOptions.labels[1]}</p>
                  <h4>{protectedVMSeries[1]}</h4>
                </div>
              </Col>
            </Row>
          </div>
        </Col>

        <Col>
          <div id="vm-analysis-chart" className="apex-charts">
            <ReactApexChart
              options={replicationOptions}
              series={replicationSeries}
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
                  <h4>{replicationSeries[0]}</h4>
                </div>
              </Col>
              <Col xs="12">
                <div>
                  <p className="mb-2">{replicationOptions.labels[1]}</p>
                  <h4>{replicationSeries[1]}</h4>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </>
    );
  }

  render() {
    const { t, dashboard } = this.props;
    const { protectedVMStats, replicationStats } = dashboard;
    const { protectedVMs, unprotectedVMs } = protectedVMStats;
    const { inSync, notInsync } = replicationStats;
    const protectedVMSeries = [protectedVMs, unprotectedVMs];
    const replicationSeries = [inSync, notInsync];
    return (
      <>
        <Card>
          <CardBody>
            <p className="font-weight-medium color-white">
              {t('virtual.machine.protection.analysis')}
            </p>
            <Row>
              {(protectedVMSeries.length > 0) && (replicationSeries.length > 0) ? this.renderData(protectedVMSeries, replicationSeries) : this.renderNoDataToShow()}
            </Row>
          </CardBody>
        </Card>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { dashboard } = state;
  return { dashboard };
}
export default connect(mapStateToProps)(withTranslation()(ProtectedVsUnProtectedVMs));
