import React, { Component } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';

class ReplicationStat extends Component {
  constructor() {
    super();
    this.state = {
      statTasks: [
        { label: 'Completed', value: '122', icon: 'fa fa-clipboard-check', color: 'green' },
        { label: 'Running', value: '12', icon: 'fa fa-spinner fa-spin', color: 'orange' },
        { label: 'Failures', value: '2', icon: 'fa fa-exclamation-triangle', color: 'red' },
      ],
      statTest: [
        { label: 'Test Executions', value: '14', icon: 'fa fa-tasks' },
        { label: 'Full Recovery', value: '10', icon: 'fa fa-bullseye', color: 'green' },
        { label: 'Migrations', value: '4', icon: 'fa fa-cloud', color: '#87CEEB' },
      ],
      statRep: [
        { label: 'Copies', value: '54', icon: 'fa fa-camera', color: '#87CEEB' },
        { label: 'Change Rate', value: '8 GB', icon: 'fa fa-copy', color: 'green' },
        { label: 'Data Reduction', value: '60%', icon: 'fa fa-file-archive', color: 'green' },
      ],
    };
  }

  renderData(steps) {
    return (
      <div className="dashboard_replicaiton_info">
        {steps.map((task) => (
          <div className="dashboard_item">
            <Row>
              <Col sm={9}>
                <i className={task.icon} style={{ color: task.color }} />
                &nbsp;&nbsp;
                {`${task.label}`}
              </Col>
              <Col sm={3}>
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
    const { statTasks, statTest, statRep } = this.state;
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
