import React from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { calculateChangedData } from '../../utils/AppUtils';

function ReplicationStat(props) {
  const { t } = props;
  function renderData(steps) {
    return (
      <div className="dashboard_replicaiton_info">
        {steps.map((task, index) => (
          <div className="dashboard_item" key={`replication-stat-${task.color}-${index + 1}`}>
            <Row>
              <Col sm={7}>
                <i className={`${task.icon} ${task.color}`} />
                &nbsp;&nbsp;
                {`${task.label}`}
              </Col>
              <Col sm={5}>
                <p className="color-white">{task.value}</p>
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

  function renderer() {
    const { replicationStats } = props;
    const { completed, running, failed = 0, dataReduction = 0, changedRate = 0 } = replicationStats;
    const data = {
      statTasks: [
        { label: t('completed'), value: completed, icon: 'fa fa-clipboard-check', color: 'app_success' },
        { label: t('running'), value: running, icon: 'fa fa-spinner fa-spin', color: 'app_primary' },
        { label: t('failures'), value: failed, icon: 'fa fa-exclamation-triangle', color: 'app_danger' },
      ],
      statRep: [
        { label: t('change.rate'), value: calculateChangedData(changedRate), icon: 'fa fa-copy', color: 'app_success' },
        { label: t('data.reduction'), value: calculateDataReduction(dataReduction), icon: 'fa fa-file-archive', color: 'app_success' },
      ],
    };
    const { statRep, statTasks } = data;
    return (
      <>
        <Card className="box-shadow">
          <CardBody className="min-h-188">
            <p className="font-weight-medium color-white">
              {t('replication.statistics')}
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

export default (withTranslation()(ReplicationStat));
