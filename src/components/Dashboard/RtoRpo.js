import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Row, Col, Card, CardBody, Media } from 'reactstrap';
import { formatTime } from '../../utils/AppUtils';
import ReplicationStat from './ReplicationStat';

function RtoRpo(props) {
  function renderStatTest(steps) {
    return (
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
  }

  function renderRto(rtoTime) {
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
  }

  function renderRtoStatus(rtoTime, css) {
    const { t } = props;
    return (
      <div>
        <Media>
          <Media body>
            <p className="text-muted font-weight-medium">{t('rto')}</p>
            <h4 className={`mb-0 ${css}`}>{formatTime(rtoTime)}</h4>
          </Media>
          <div className="mini-stat-icon avatar-sm rounded-circle align-self-center">
            <span className="">
              <i className="fas fa-hourglass-half fa-3x" />
            </span>
          </div>
        </Media>
      </div>
    );
  }

  function renderData() {
    const { dashboard, t } = props;
    const { recoveryStats, replicationStats } = dashboard;
    const { rto = 0 } = recoveryStats;
    const { rpo = 0 } = replicationStats;
    return (
      <>
        <Col className="dashboard_divider_right">
          <div>
            <Media>
              <Media body>
                <p className="text-muted font-weight-medium">{t('rpo')}</p>
                <h4 className="mb-0">{formatTime(rpo)}</h4>
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
  }

  const { dashboard } = props;
  const { recoveryStats } = dashboard;
  const { testExecutions = 0, fullRecovery = 0, migrations = 0 } = recoveryStats;
  const data = {
    statTest: [
      { label: 'Test Executions', value: testExecutions, icon: 'fa fa-tasks' },
      { label: 'Full Recovery', value: fullRecovery, icon: 'fa fa-bullseye', color: 'app_success' },
      { label: 'Migrations', value: migrations, icon: 'fa fa-cloud', color: 'app_primary' },
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
      <ReplicationStat {...props} />
    </>
  );
}

function mapStateToProps(state) {
  const { dashboard } = state;
  return { dashboard };
}
export default connect(mapStateToProps)(withTranslation()(RtoRpo));
