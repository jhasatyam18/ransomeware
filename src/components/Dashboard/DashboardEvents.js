import { faCircleCheck, faCircleXmark, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Media, Row } from 'reactstrap';
import { API_FETCH_EVENTS } from '../../constants/ApiConstants';
import { EVENT_LEVELS } from '../../constants/EventConstant';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { EVENTS_PATH } from '../../constants/RouterConstants';
import { addMessage } from '../../store/actions/MessageActions';
import { callAPI } from '../../utils/ApiUtils';
import Spinner from '../Common/Spinner';

function DashBoardEvents(props) {
  const { t, dispatch } = props;
  const [data, setData] = React.useState([]);
  const refresh = useSelector((state) => state.user.context.refresh);
  const [loading, setLoading] = useState(false);
  let dataToDisplay = [];
  if (typeof data !== 'undefined' && data.length > 0) {
    dataToDisplay = data.length > 5 ? data.slice(0, 5) : data;
  }

  useEffect(() => {
    let isUnmounting = false;
    setLoading(true);
    setData([]);
    callAPI(API_FETCH_EVENTS)
      .then((json) => {
        if (isUnmounting) return;
        setData(json.records);
        setLoading(false);
      },
      (err) => {
        if (isUnmounting) return;
        setData([]);
        setLoading(false);
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
    return () => {
      isUnmounting = true;
    };
  }, [refresh]);

  const renderNoDataToShow = () => (
    <>
      <Card>
        <CardBody>
          <p className="font-weight-medium color-white">{t('events')}</p>
          {loading === true ? <Spinner /> : t('no.data.to.display')}
        </CardBody>
      </Card>
    </>
  );

  const renderData = (obj, css, icon) => {
    const { description } = obj;
    return (
      <Media className="padding-10">
        <div className="mr-4">
          <h5 className="font-size-16">
            <FontAwesomeIcon size="sm" icon={icon} className={css} />
          </h5>
        </div>
        <Media body>
          <div>
            <Link to={EVENTS_PATH} className="color-white">
              {description.length > 65 ? `${description.substr(0, 65)}....` : description}
            </Link>
          </div>
        </Media>
      </Media>
    );
  };

  const checkStatus = (d) => {
    const { level } = d;
    switch (level) {
      case EVENT_LEVELS.ALL:
        return renderData(d, 'app_primary', faCircleCheck);
      case EVENT_LEVELS.WARNING:
        return renderData(d, 'app_warning', faTriangleExclamation);
      case EVENT_LEVELS.ERROR:
        return renderData(d, 'app_danger', faCircleXmark);
      case EVENT_LEVELS.CRITICAL:
        return renderData(d, 'app_danger', faCircleXmark);
      default:
        return renderData(d, 'app_success', faCircleCheck);
    }
  };

  if (dataToDisplay.length === 0) {
    return renderNoDataToShow();
  }

  return (
    <>
      <Card>
        <CardBody className="min-h-365">
          <p className="font-weight-medium color-white">
            {t('events')}
          </p>
          <Row>
            {dataToDisplay.map((val) => (
              <Col sm={12} key={`dashboard-event-${val.id}`}>
                {checkStatus(val)}
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>
    </>
  );
}

export default (withTranslation()(DashBoardEvents));
