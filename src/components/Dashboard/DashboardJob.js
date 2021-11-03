import React, { Component } from 'react';
import { Row, Col, Card, CardBody, Media } from 'reactstrap';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { REPLICATION_JOB_TYPE, RECOVERY_JOB_TYPE, MAX_RECOVERY_TIME } from '../../constants/InputConstants';
import { changeReplicationJobType, changeRecoveryJobType, fetchReplicationJobs, fetchRecoveryJobs, resetJobs } from '../../store/actions/JobActions';
import * as appStatus from '../../constants/AppStatus';
import { getMinutes } from '../../utils/AppUtils';
import { JOBS_PATH } from '../../constants/RouterConstants';

class DashBoardJob extends Component {
  componentDidMount() {
    const { dispatch, protectionplanID } = this.props;
    dispatch(changeReplicationJobType(REPLICATION_JOB_TYPE.VM));
    dispatch(changeRecoveryJobType(RECOVERY_JOB_TYPE.VM));
    dispatch(fetchReplicationJobs(protectionplanID));
    dispatch(fetchRecoveryJobs(protectionplanID));
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(resetJobs());
  }

  // checks the status and passes the css accordingly.
  checkStatus(data) {
    const { status } = data;

    switch (status) {
      case appStatus.JOB_COMPLETION_STATUS:
        return this.renderData(data, 'app_success bxs-check-circle');
      case appStatus.JOB_RUNNING_STATUS:
        return this.renderData(data, 'app_primary bxs-right-arrow-circle bx-fade-right');
      case appStatus.JOB_FAILED:
        return this.renderData(data, 'app_danger bxs-x-circle');
      case appStatus.JOB_IN_PROGRESS:
        return this.renderData(data, 'app_primary bxs-right-arrow-circle bx-fade-right');
      default:
        return this.renderData(data, 'app_secondary bx-info-circle');
    }
  }

  // checks if the character length are more than 65 and render data accordingly.
  renderData(data, css) {
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
            <Link to={(data.recoveryType ? `${JOBS_PATH}?tab=recovery` : `${JOBS_PATH}?tab=replication`)} style={{ color: 'white' }}>
              {message.length > 65 ? `${message.substr(0, 65)}....` : message}
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
              {t('jobs')}
            </p>
            {t('no.data.to.display')}
          </CardBody>
        </Card>
      </>
    );
  }

  render() {
    const { jobs, t } = this.props;
    const { recovery, replication } = jobs;
    const recoveryData = recovery.filter((data) => getMinutes(data.startTime) < MAX_RECOVERY_TIME); // checks if the time if less than 30 mins
    const combinedData = [...recoveryData, ...replication];
    const dataToDisplay = (combinedData.length > 5 ? combinedData.slice(0, 5) : combinedData);

    if (dataToDisplay.length === 0) {
      return this.renderNoDataToShow();
    }
    return (
      <>
        <Card>
          <CardBody style={{ minHeight: 365 }}>
            <p className="font-weight-medium color-white">
              {t('jobs')}
            </p>
            <Row>
              {dataToDisplay.map((data) => (
                <Col sm={12}>
                  {this.checkStatus(data)}
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
  const { jobs } = state;
  return { jobs };
}
export default connect(mapStateToProps)(withTranslation()(DashBoardJob));
