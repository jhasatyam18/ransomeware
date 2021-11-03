import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Media } from 'reactstrap';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { fetchEvents, resetEvents } from '../../store/actions/EventActions';
import { EVENT_LEVELS } from '../../constants/EventConstant';
import { EVENTS_PATH } from '../../constants/RouterConstants';

class DashBoardEvents extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchEvents());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(resetEvents());
  }

  // checks the status and passes the css accordingly.
  checkStatus(data) {
    const { level } = data;

    switch (level) {
      case EVENT_LEVELS.ALL:
        return this.renderData(data, 'app_primary bxs-check-circle');
      case EVENT_LEVELS.WARNING:
        return this.renderData(data, 'app_warning bx bxs-error');
      case EVENT_LEVELS.ERROR:
        return this.renderData(data, 'app_danger bxs-x-circle');
      case EVENT_LEVELS.CRITICAL:
        return this.renderData(data, 'app_danger bxs-x-circle');
      default:
        return this.renderData(data, 'app_success bxs-check-circle');
    }
  }

  // checks if the character length are more than 65 and render data accordingly.
  renderData(data, css) {
    return (
      <Media className="padding-10">
        <div className="mr-4">
          <h5 className="font-size-16">
            <i className={`bx ${css} font-size-14`} />
          </h5>
        </div>
        <Media body>
          <div>
            <Link to={EVENTS_PATH} style={{ color: 'white' }}>
              {data.description.length > 65 ? `${data.description.substr(0, 65)}....` : data.description}
            </Link>
          </div>
        </Media>
      </Media>
    );
  }

  renderNoDataToShow() {
    const { t } = this.props;
    return (
      <>
        <Card>
          <CardBody>
            <p className="font-weight-medium color-white">
              {t('events')}
            </p>
            {t('no.data.to.display')}
          </CardBody>
        </Card>
      </>
    );
  }

  render() {
    const { events, t } = this.props;
    const { data } = events;
    const dataToDisplay = (data.length > 5 ? data.slice(0, 5) : data);

    if (dataToDisplay.length === 0) {
      return this.renderNoDataToShow();
    }

    return (
      <>
        <Card>
          <CardBody style={{ minHeight: 365 }}>
            <p className="font-weight-medium color-white">
              {t('events')}
            </p>
            <Row>
              {dataToDisplay.map((val) => (
                <Col sm={12}>
                  {this.checkStatus(val)}
                </Col>
              ))}
            </Row>
          </CardBody>
        </Card>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { events } = state;
  return { events };
}
export default connect(mapStateToProps)(withTranslation()(DashBoardEvents));
