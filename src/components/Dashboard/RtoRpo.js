import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Row, Col, Card, CardBody, Media } from 'reactstrap';
import { addMessage } from '../../store/actions/MessageActions';
import { formatTime } from '../../utils/AppUtils';
import ReplicationStat from './ReplicationStat';
import { API_DASHBOARD_RECOVERY_STATS, API_DASHBOARD_REPLICATION_STATS } from '../../constants/ApiConstants';
import { callAPI } from '../../utils/ApiUtils';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import Spinner from '../Common/Spinner';

function RtoRpo(props) {
  const { dispatch, t } = props;
  const refresh = useSelector((state) => state.user.context.refresh);
  const [recoveryStats, setRecoveryStats] = useState({ testExecutions: 0, fullRecovery: 0, migrations: 0 });
  const [replicationStats, setReplicationStats] = useState({ completed: 0, running: 0, failures: 0, dataReduction: 0, changedRate: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isUnmounting = false;
    setLoading(true);
    setRecoveryStats({ testExecutions: 0, fullRecovery: 0, migrations: 0, rto: 0 });
    setReplicationStats({ completed: 0, running: 0, failures: 0, dataReduction: 0, changedRate: 0 });
    callAPI(API_DASHBOARD_RECOVERY_STATS)
      .then((json) => {
        if (isUnmounting) return;
        setLoading(false);
        setRecoveryStats(json);
      },
      (err) => {
        if (isUnmounting) return;
        setLoading(false);
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
    callAPI(API_DASHBOARD_REPLICATION_STATS)
      .then((json) => {
        if (isUnmounting) return;
        setReplicationStats(json);
      },
      (err) => {
        if (isUnmounting) return;
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
    return () => {
      isUnmounting = true;
    };
  }, [refresh]);

  const renderRtoStatus = (rtoTime, css) => (
    <div>
      <Media>
        <Media body>
          <p className="text-muted font-weight-medium">{t('rto')}</p>
          {loading === true ? <Spinner /> : <h4 className={`mb-0 ${css}`}>{formatTime(rtoTime)}</h4>}
        </Media>
        <div className="mini-stat-icon avatar-sm rounded-circle align-self-center">
          <span className="">
            <i className="fas fa-hourglass-half fa-3x" />
          </span>
        </div>
      </Media>
    </div>
  );

  const renderStatTest = (steps) => (
    <div className="dashboard_replicaiton_info stat_test_position">
      {steps.map((task) => (
        <div className="dashboard_item dashboard_divider_top" key={`rtorpo-${task.color}`}>
          &nbsp;
          <Row>
            <Col sm={7}>
              <i className={`${task.icon} ${task.color}`} />
              &nbsp;&nbsp;
              {`${task.label}`}
            </Col>
            <Col sm={5}>
              <p style={{ color: 'white' }}>{task.value}</p>
            </Col>
          </Row>
        </div>
      ))}
    </div>
  );

  const renderRto = (rtoTime) => {
    const tenMinutes = 600; // 600 sec( 10 minutes)
    const fifteenMinutes = 900; // 900 sec (15 minutes)
    let rtoStatus = null;

    if (rtoTime < tenMinutes) {
      rtoStatus = renderRtoStatus(rtoTime, 'app_success');
    } else if (rtoTime > tenMinutes && rtoTime < fifteenMinutes) {
      rtoStatus = renderRtoStatus(rtoTime, 'app_warning');
    } else {
      rtoStatus = renderRtoStatus(rtoTime, 'app_danger');
    }
    return rtoStatus;
  };

  const renderData = () => {
    const { rto = 0 } = recoveryStats;
    const { rpo = 0 } = replicationStats;
    return (
      <>
        <Col className="dashboard_divider_right">
          <div>
            <Media>
              <Media body>
                <p className="text-muted font-weight-medium">{t('rpo')}</p>
                {loading === true ? <Spinner /> : <h4 className="mb-0">{formatTime(rpo)}</h4>}
              </Media>
              <div className="mini-stat-icon avatar-sm rounded-circle align-self-center">
                <span className="">
                  <i className="fas fa-history fa-3x" />
                </span>
              </div>
            </Media>
          </div>
        </Col>
        <Col>
          {renderRto(rto)}
        </Col>
      </>
    );
  };

  const { testExecutions = 0, fullRecovery = 0, migrations = 0 } = recoveryStats;
  const data = {
    statTest: [
      { label: t('test.executions'), value: testExecutions, icon: 'fa fa-tasks' },
      { label: t('full.recovery'), value: fullRecovery, icon: 'fa fa-bullseye', color: 'app_success' },
      { label: t('migrations'), value: migrations, icon: 'fa fa-cloud', color: 'app_primary' },
    ],
  };
  const { statTest } = data;
  return (
    <>
      <Card>
        <CardBody>
          <Row>
            {renderData()}
          </Row>
          {renderStatTest(statTest)}
        </CardBody>
      </Card>
      <ReplicationStat replicationStats={replicationStats} />
    </>
  );
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(RtoRpo));
