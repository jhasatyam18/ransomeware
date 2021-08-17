import React from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';

function ReplicationStat(props) {
  function renderData(steps) {
    return (
      <div className="dashboard_replicaiton_info">
        {steps.map((task) => (
          <div className="dashboard_item">
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
            <div className="dashboard_divider" />
          </div>
        ))}
      </div>
    );
  }

  function calculateDataReduction(val) {
    if (val === 0) {
      return;
    }
    return `${parseInt(val, 10)}%`;
  }

  function calculateChangedData(val) {
    if (val === 0) {
      return;
    }
    return `${parseInt(val / 1024, 10)} GB`;
  }

  function renderer() {
    const { dashboard } = props;
    const { replicationStats } = dashboard;
    const { completed, running, failures, dataReduction = 0, changedData = 0 } = replicationStats;
    const data = {
      statTasks: [
        { label: 'Completed', value: completed, icon: 'fa fa-clipboard-check', color: 'app_success' },
        { label: 'Running', value: running, icon: 'fa fa-spinner fa-spin', color: 'app_primary' },
        { label: 'Failures', value: failures, icon: 'fa fa-exclamation-triangle', color: 'app_danger' },
      ],
      statRep: [
        { label: 'Copies', value: '54', icon: 'fa fa-camera', color: 'app_primary' },
        { label: 'Change Rate', value: calculateChangedData(changedData), icon: 'fa fa-copy', color: 'app_success' },
        { label: 'Data Reduction', value: calculateDataReduction(dataReduction), icon: 'fa fa-file-archive', color: 'app_success' },
      ],
    };
    const { statRep, statTasks } = data;
    return (
      <>
        <Card>
          <CardBody style={{ minHeight: 188 }}>
            <p className="font-weight-medium color-white">
              Replication Statistics
            </p>
            {renderData(statTasks)}
            {renderData(statRep)}
          </CardBody>
        </Card>
      </>
    );
  }

  return renderer();
}

export default ReplicationStat;
