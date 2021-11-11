import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { addMessage } from '../../store/actions/MessageActions';
import { API_DASHBOARD_UNACK_ALERTS } from '../../constants/ApiConstants';
import { ALERTS_PATH } from '../../constants/RouterConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { callAPI } from '../../utils/ApiUtils';

function DashboardAlertOverview(props) {
  const dispatch = useDispatch();
  const [alert, setAlerts] = useState({ criticalAlerts: 0, errorAlerts: 0, majorAlerts: 0, warningAlerts: 0 });
  useEffect(() => {
    callAPI(API_DASHBOARD_UNACK_ALERTS).then((json) => {
      setAlerts(json);
    },
    (err) => {
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });
    return () => {
      setAlerts({ criticalAlerts: 0, errorAlerts: 0, majorAlerts: 0 });
    };
  }, []);
  const { t } = props;
  return (
    <Card>
      <CardBody style={{ maxHeight: 250 }}>
        <Link to={ALERTS_PATH} className="font-weight-medium text-white">
          <p className="font-weight-medium text-muted">
            {t('Alerts')}
          </p>
          <Row className="text-center" style={{ fontSize: '0.9rem' }}>
            <Col sm={4}>
              <span className="text-danger-1">Critical</span>
              <hr />
              {alert.criticalAlerts}
            </Col>
            <Col sm={4}>
              <span className="text-danger-2">Error</span>
              <hr />
              {alert.errorAlerts}
            </Col>
            <Col sm={4}>
              <span className="text-warning-1">Major</span>
              <hr />
              {alert.majorAlerts}
            </Col>
          </Row>
        </Link>
      </CardBody>
    </Card>
  );
}

export default (withTranslation()(DashboardAlertOverview));
