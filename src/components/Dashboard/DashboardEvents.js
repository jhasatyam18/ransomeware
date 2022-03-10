import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Media, Row } from 'reactstrap';
import { addMessage } from '../../store/actions/MessageActions';
import { EVENT_LEVELS } from '../../constants/EventConstant';
import { EVENTS_PATH } from '../../constants/RouterConstants';
import { API_FETCH_EVENTS } from '../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { callAPI } from '../../utils/ApiUtils';
import Spinner from '../Common/Spinner';

function DashBoardEvents(props) {
  const { t, dispatch } = props;
  const [data, setData] = useState([]);
  const refresh = useSelector((state) => state.user.context.refresh);
  const dataToDisplay = (data.length > 5 ? data.slice(0, 5) : data);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setData([]);
    callAPI(API_FETCH_EVENTS)
      .then((json) => {
        setData(json);
        setLoading(false);
      },
      (err) => {
        setData([]);
        setLoading(false);
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  }, [refresh]);

  const renderNoDataToShow = () => (
    <>
      <Card>
        <CardBody>
          <p className="font-weight-medium color-white">
            {t('events')}
          </p>
          {loading === true ? <Spinner /> : t('no.data.to.display')}
        </CardBody>
      </Card>
    </>
  );

  const renderData = (obj, css) => {
    const { description } = obj;
    return (
      <Media className="padding-10">
        <div className="mr-4">
          <h5 className="font-size-16">
            <i className={`bx ${css} font-size-14`} />
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
        return renderData(d, 'app_primary bxs-check-circle');
      case EVENT_LEVELS.WARNING:
        return renderData(d, 'app_warning bx bxs-error');
      case EVENT_LEVELS.ERROR:
        return renderData(d, 'app_danger bxs-x-circle');
      case EVENT_LEVELS.CRITICAL:
        return renderData(d, 'app_danger bxs-x-circle');
      default:
        return renderData(d, 'app_success bxs-check-circle');
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

function mapStateToProps(state) {
  const { events } = state;
  return { events };
}
export default connect(mapStateToProps)(withTranslation()(DashBoardEvents));
