import React, { useEffect, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Media, Row } from 'reactstrap';
import { addMessage } from '../../store/actions/MessageActions';
import * as appStatus from '../../constants/AppStatus';
import { MAX_RECOVERY_TIME } from '../../constants/InputConstants';
import { JOBS_RECOVERY_PATH, JOBS_REPLICATION_PATH } from '../../constants/RouterConstants';
import { getMinutes } from '../../utils/AppUtils';
import { API_REPLICATION_JOBS, API_RECOVERY_JOBS } from '../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { callAPI } from '../../utils/ApiUtils';
import Spinner from '../Common/Spinner';

function DashBoardJob(props) {
  const { t, dispatch } = props;
  const [recovery, setRecoveryJobs] = useState([]);
  const [replication, setReplicationJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const refresh = useSelector((state) => state.user.context.refresh);
  const recoveryData = recovery.filter((data) => getMinutes(data.startTime) < MAX_RECOVERY_TIME); // checks if the time if less than 30 mins
  const combinedData = [...recoveryData, ...replication].sort((a, b) => a.startTime > b.startTime);
  const dataToDisplay = (combinedData.length > 2 ? combinedData.slice(0, 2) : combinedData);

  useEffect(() => {
    setRecoveryJobs([]);
    setLoading(true);
    setReplicationJobs([]);
    callAPI(API_REPLICATION_JOBS)
      .then((json) => {
        setLoading(false);
        setReplicationJobs(json);
      },
      (err) => {
        setLoading(false);
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });

    callAPI(API_RECOVERY_JOBS)
      .then((json) => {
        setRecoveryJobs(json);
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  }, [refresh]);

  const renderNoDataToShow = () => (
    <>
      <Card>
        <CardBody>
          <p className="font-weight-medium color-white">
            {t('jobs')}
          </p>
          { loading === true ? <Spinner /> : t('no.data.to.display') }
        </CardBody>
      </Card>
    </>
  );

  if (dataToDisplay.length === 0) {
    return renderNoDataToShow();
  }

  // checks if the character length are more than 65 and render data accordingly.
  const renderData = (data, css) => {
    const message = (data.recoveryType ? `Recovery for ${data.vmName} is ${data.status}.` : `Replication for ${data.vmName} is ${data.status}.`);
    return (
      <Media className="padding-10">
        <div className="mr-4">
          <h5 className="font-size-16">
            <i className={`bx ${css} font-size-14`} />
          </h5>
        </div>
        <Media body>
          <div>
            <Link to={(data.recoveryType ? `${JOBS_RECOVERY_PATH}` : `${JOBS_REPLICATION_PATH}`)} style={{ color: 'white' }}>
              {message.length > 65 ? `${message.substr(0, 65)}....` : message}
            </Link>
          </div>
        </Media>
      </Media>
    );
  };

  // checks the status and passes the css accordingly.
  const checkStatus = (data) => {
    const { status } = data;
    switch (status) {
      case appStatus.JOB_COMPLETION_STATUS:
        return renderData(data, 'app_success bxs-check-circle');
      case appStatus.JOB_RUNNING_STATUS:
        return renderData(data, 'app_primary bxs-right-arrow-circle bx-fade-right');
      case appStatus.JOB_FAILED:
        return renderData(data, 'app_danger bxs-x-circle');
      case appStatus.JOB_IN_PROGRESS:
        return renderData(data, 'app_primary bxs-right-arrow-circle bx-fade-right');
      default:
        return renderData(data, 'app_secondary bx-info-circle');
    }
  };

  return (
    <>
      <Card>
        <CardBody style={{ minHeight: 190 }}>
          <p className="font-weight-medium color-white">
            {t('jobs')}
          </p>
          <Row>
            {dataToDisplay.map((d, index) => (
              <Col sm={12} key={`dashboard-job-${index + 1}`}>
                {checkStatus(d)}
              </Col>
            ))}
          </Row>
        </CardBody>
      </Card>
    </>
  );
}

function mapStateToProps(state) {
  const { jobs } = state;
  return { jobs };
}
export default connect(mapStateToProps)(withTranslation()(DashBoardJob));
