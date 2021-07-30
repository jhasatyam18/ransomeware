import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Row, Col, Card, CardBody, Media } from 'reactstrap';
import { formatTime } from '../../utils/AppUtils';
import ReplicationStat from './ReplicationStat';

class RtoRpo extends Component {
  renderStatTest(steps) {
    return (
      <div className="dashboard_replicaiton_info stat_test_position">
        {steps.map((task) => (
          <div className="dashboard_item dashboard_divider_top">
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

  renderRto(rtoTime) {
    const tenMinutes = 600; // 600 sec( 10 minutes)
    const fifteenMinutes = 900; // 900 sec (15 minutes)

    if (rtoTime < tenMinutes) {
      return (
        this.renderRtoStatus(rtoTime, 'app_success')
      );
    } if (rtoTime > tenMinutes && rtoTime < fifteenMinutes) {
      return (
        this.renderRtoStatus(rtoTime, 'app_warning')
      );
    } if (rtoTime > fifteenMinutes) {
      return (
        this.renderRtoStatus(rtoTime, 'app_danger')
      );
    }
  }

  renderRtoStatus(rtoTime, css) {
    const { t } = this.props;
    return (
      <div>
        <Media>
          <Media body>
            <p className="text-muted font-weight-medium">{t('rto')}</p>
            <h4 className={`mb-0 ${css}`}>{formatTime(rtoTime)}</h4>
          </Media>
          <div className="mini-stat-icon avatar-sm rounded-circle align-self-center">
            <span className="">
              <box-icon name="timer" color="white" size="lg" />
            </span>
          </div>
        </Media>
      </div>
    );
  }

  renderData() {
    const { dashboard, t } = this.props;
    const { titles } = dashboard;
    const { rpo = 0, rto = 0 } = titles;
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
                  <box-icon name="data" color="white" size="lg" />
                </span>
              </div>
            </Media>
          </div>
        </Col>
        <Col>
          {this.renderRto(rto)}
        </Col>
      </>
    );
  }

  render() {
    const { dashboard } = this.props;
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
              {this.renderData()}
            </Row>
            {this.renderStatTest(statTest)}
          </CardBody>
        </Card>
        <ReplicationStat {...this.props} />
      </>
    );
  }
}

export default (withTranslation()(RtoRpo));
