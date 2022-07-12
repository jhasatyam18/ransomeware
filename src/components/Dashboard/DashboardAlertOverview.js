import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { addMessage } from '../../store/actions/MessageActions';
import { API_DASHBOARD_UNACK_ALERTS } from '../../constants/ApiConstants';
import { ALERTS_PATH } from '../../constants/RouterConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { callAPI } from '../../utils/ApiUtils';
import Spinner from '../Common/Spinner';

function DashboardAlertOverview(props) {
  const dispatch = useDispatch();
  const refresh = useSelector((state) => state.user.context.refresh);
  const [alert, setAlerts] = useState({ criticalAlerts: 0, errorAlerts: 0, majorAlerts: 0, warningAlerts: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isUnmounting = false;
    setLoading(true);
    setAlerts([]);
    callAPI(API_DASHBOARD_UNACK_ALERTS).then((json) => {
      if (isUnmounting) return;
      setAlerts(json);
      setLoading(false);
    },
    (err) => {
      if (isUnmounting) return;
      setAlerts([]);
      setLoading(false);
      dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    });

    return () => {
      isUnmounting = true;
    };
  }, [refresh]);
  const { t } = props;

  return (
    <Card>
      <CardBody style={{ maxHeight: 250 }}>
        <Link to={ALERTS_PATH} className="font-weight-medium text-white">
          <p className="font-weight-medium text-muted">{t('Alerts')}</p>
          <Row className="text-center" style={{ fontSize: '0.9rem' }}>
            <Col sm={4}>
              <span className="text-danger-1">{t('Alerts')}</span>
              <hr />
              {loading === true ? <Spinner /> : alert.criticalAlerts}
            </Col>
            <Col sm={4}>
              <span className="text-danger-2">{t('Error')}</span>
              <hr />
              {loading === true ? '' : alert.errorAlerts}
            </Col>
            <Col sm={4}>
              <span className="text-warning-1">{t('Major')}</span>
              <hr />
              {loading === true ? '' : alert.majorAlerts}
            </Col>
          </Row>
        </Link>
      </CardBody>
    </Card>
  );
}

export default withTranslation()(DashboardAlertOverview);
