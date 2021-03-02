import React, { Component } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';

class ReplicationStat extends Component {
  renderData(steps) {
    return (
      <div className="dashboard_replicaiton_info">
        {steps.map((task) => (
          <div className="dashboard_item">
            <Row>
              <Col sm={7}>
                <i className={task.icon} style={{ color: task.color }} />
                &nbsp;&nbsp;
                {`${task.label}`}
              </Col>
              <Col sm={5}>
                <p style={{ color: 'white' }}>{task.value}</p>
              </Col>
            </Row>
            <div className="dashboard_divider" />
          </div>
        ))}
      </div>
    );
  }

  render() {
    const { dashboard } = this.props;
    const { replicationStats } = dashboard;
    const { completed, running, failures, testExecutions = 0, fullRecovery = 0, migrations = 0 } = replicationStats;
    const data = { statTasks: [
      { label: 'Completed', value: completed, icon: 'fa fa-clipboard-check', color: 'green' },
      { label: 'Running', value: running, icon: 'fa fa-spinner fa-spin', color: 'orange' },
      { label: 'Failures', value: failures, icon: 'fa fa-exclamation-triangle', color: 'red' },
    ],
    statTest: [
      { label: 'Test Executions', value: testExecutions, icon: 'fa fa-tasks' },
      { label: 'Full Recovery', value: fullRecovery, icon: 'fa fa-bullseye', color: 'green' },
      { label: 'Migrations', value: migrations, icon: 'fa fa-cloud', color: '#87CEEB' },
    ],
    statRep: [
      { label: 'Copies', value: '54', icon: 'fa fa-camera', color: '#87CEEB' },
      { label: 'Change Rate', value: '8 GB', icon: 'fa fa-copy', color: 'green' },
      { label: 'Data Reduction', value: '60%', icon: 'fa fa-file-archive', color: 'green' },
    ] };
    const { statRep, statTest, statTasks } = data;
    return (
      <>
        <Card>
          <CardBody>
            <p className="font-weight-medium color-white">
              Replication Statistics
            </p>
            {this.renderData(statTasks)}
            {this.renderData(statRep)}
            {this.renderData(statTest)}
          </CardBody>
        </Card>
      </>
    );
  }
}

export default ReplicationStat;
