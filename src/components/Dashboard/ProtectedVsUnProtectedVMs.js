import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { withTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { APPLICATION_THEME, THEME_CONSTANT } from '../../constants/UserConstant';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import {
  DANGER,
  DASHBOARD_BACKGROUND_COLOR,
  LEGEND,
  SUCCESS,
  WARNING,
} from '../../constants/ProtectionPlanAnalysisConstant';
import { addMessage } from '../../store/actions/MessageActions';
import { callAPI } from '../../utils/ApiUtils';
import {
  API_DASHBOARD_VIRTUAL_MACHINE_PROTECTION_ANALYSIS_PROTECTED_VMS,
  API_DASHBOARD_REPLICATION_STATS,
} from '../../constants/ApiConstants';
import Spinner from '../Common/Spinner';

function ProtectedVsUnProtectedVMs({ t, dispatch }) {
  const refresh = useSelector((state) => state.user.context.refresh);
  const [loading, setLoading] = useState(false);
  const [protectedVMStats, setProtectedVMStats] = useState({ protectedVMs: 0, unprotectedVMs: 0 });
  const [replicationStats, setReplicationStats] = useState({ inSync: 0, notInsync: 0 });

  const { protectedVMs, unprotectedVMs } = protectedVMStats;
  const { inSync, notInsync } = replicationStats;
  const protectedVMSeries = [protectedVMs || 0, unprotectedVMs || 0];
  const replicationSeries = [inSync || 0, notInsync || 0];

  const theme = localStorage.getItem(APPLICATION_THEME) || THEME_CONSTANT.DARK; // fallback if null

  const walletOptions = {
    stroke: {
      colors: DASHBOARD_BACKGROUND_COLOR[theme],
    },
    colors: [SUCCESS, DANGER],
    labels: [t('protected'), t('unprotected')],
    legend: LEGEND,
  };

  const replicationOptions = {
    stroke: {
      colors: DASHBOARD_BACKGROUND_COLOR[theme],
    },
    colors: [SUCCESS, WARNING],
    labels: [t('replication.in.sync'), t('replication.not.in.sync')],
    legend: LEGEND,
  };

  useEffect(() => {
    let isUnmounting = false;
    setLoading(true);

    Promise.all([
      callAPI(API_DASHBOARD_VIRTUAL_MACHINE_PROTECTION_ANALYSIS_PROTECTED_VMS),
      callAPI(API_DASHBOARD_REPLICATION_STATS),
    ])
      .then(([vmStats, replicationData]) => {
        if (isUnmounting) return;
        setProtectedVMStats({
          protectedVMs: vmStats?.protectedVMs || 0,
          unprotectedVMs: vmStats?.unprotectedVMs || 0,
        });
        setReplicationStats({
          inSync: replicationData?.inSync || 0,
          notInsync: replicationData?.notInsync || 0,
        });
        setLoading(false);
      })
      .catch((err) => {
        if (isUnmounting) return;
        setLoading(false);
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });

    return () => {
      isUnmounting = true;
    };
  }, [refresh, theme]);

  const renderNoDataToShow = () => (
    <Card>
      <CardBody>
        <p className="font-weight-medium color-white">
          {loading ? <Spinner /> : t('no.data.to.display')}
        </p>
      </CardBody>
    </Card>
  );

  const renderData = () => (
    <>
      <Col>
        <div id="vm-analysis-chart" className="apex-charts w-100">
          <ReactApexChart options={walletOptions} series={protectedVMSeries} type="pie" height={200} />
        </div>
      </Col>
      <Col sm={2}>
        <div className="mt-4">
          <Row>
            <Col xs="12">
              <p className="mb-2">{walletOptions.labels[0]}</p>
              <h4>{protectedVMSeries[0]}</h4>
            </Col>
            <Col xs="12">
              <p className="mb-2">{walletOptions.labels[1]}</p>
              <h4>{protectedVMSeries[1]}</h4>
            </Col>
          </Row>
        </div>
      </Col>

      <Col>
        <div id="vm-replication-chart" className="apex-charts w-100">
          <ReactApexChart options={replicationOptions} series={replicationSeries} type="donut" height={200} />
        </div>
      </Col>
      <Col>
        <div className="mt-4">
          <Row>
            <Col xs="12">
              <p className="mb-2">{replicationOptions.labels[0]}</p>
              <h4>{replicationSeries[0]}</h4>
            </Col>
            <Col xs="12">
              <p className="mb-2">{replicationOptions.labels[1]}</p>
              <h4>{replicationSeries[1]}</h4>
            </Col>
          </Row>
        </div>
      </Col>
    </>
  );

  return (
    <Card className="box-shadow">
      <CardBody>
        <p className="font-weight-medium color-white">
          {t('virtual.machine.protection.analysis')}
        </p>
        <Row>
          {!loading
            ? renderData()
            : renderNoDataToShow()}
        </Row>
      </CardBody>
    </Card>
  );
}

const mapStateToProps = (state) => ({ user: state.user, global: state.global });
export default connect(mapStateToProps)(withTranslation()(ProtectedVsUnProtectedVMs));
