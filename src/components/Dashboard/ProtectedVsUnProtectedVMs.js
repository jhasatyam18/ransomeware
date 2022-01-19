import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { withTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { DANGER, LEGEND, STROKE, SUCCESS, WARNING } from '../../constants/ProtectionPlanAnalysisConstant';
import { addMessage } from '../../store/actions/MessageActions';
import { callAPI } from '../../utils/ApiUtils';
import { API_DASHBOARD_VIRTUAL_MACHINE_PROTECTION_ANALYSIS_PROTECTED_VMS, API_DASHBOARD_REPLICATION_STATS } from '../../constants/ApiConstants';
import Spinner from '../Common/Spinner';

function ProtectedVsUnProtectedVMs(props) {
  const { t, dispatch } = props;
  const refresh = useSelector((state) => state.user.context.refresh);
  const [loading, setLoading] = useState(false);

  const [protectedVMStats, setProtectedVMStats] = useState({ protectedVMs: 0, unprotectedVMs: 0 });
  const [replicationStats, setReplicationStat] = useState({});
  const { protectedVMs, unprotectedVMs } = protectedVMStats;
  const { inSync = 0, notInsync = 0 } = replicationStats;
  const protectedVMSeries = [protectedVMs, unprotectedVMs];
  const replicationSeries = [inSync, notInsync];
  const state = {
    walletOptions: {
      stroke: STROKE,
      colors: [SUCCESS, DANGER],
      labels: [t('protected'), t('unprotected')],
      legend: LEGEND,
    },

    replicationOptions: {
      stroke: STROKE,
      colors: [SUCCESS, WARNING],
      labels: [t('replication.in.sync'), t('replication.not.in.sync')],
      legend: LEGEND,
    },
  };

  useEffect(() => {
    setLoading(true);
    callAPI(API_DASHBOARD_VIRTUAL_MACHINE_PROTECTION_ANALYSIS_PROTECTED_VMS)
      .then((json) => {
        setLoading(false);
        setProtectedVMStats({ protectedVMs: json.protectedVMs, unprotectedVMs: json.unprotectedVMs });
      },
      (err) => {
        setLoading(false);
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
    callAPI(API_DASHBOARD_REPLICATION_STATS)
      .then((json) => {
        setReplicationStat(json);
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  }, [refresh]);

  const renderNoDataToShow = () => (
    <>
      <Card>
        <CardBody>
          <p className="font-weight-medium color-white">
            {loading === true ? <Spinner /> : t('no.data.to.display')}
          </p>
        </CardBody>
      </Card>
    </>
  );

  const renderData = () => {
    const { walletOptions, replicationOptions } = state;
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
  };
  return (
    <>
      <Card>
        <CardBody>
          <p className="font-weight-medium color-white">
            {t('virtual.machine.protection.analysis')}
          </p>
          <Row>
            {(protectedVMSeries.length > 0) && (replicationSeries.length > 0) && (loading === false) ? renderData(protectedVMSeries, replicationSeries) : renderNoDataToShow()}
          </Row>
        </CardBody>
      </Card>
    </>
  );
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(ProtectedVsUnProtectedVMs));
