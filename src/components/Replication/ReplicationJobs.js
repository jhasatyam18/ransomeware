import React, { Component } from 'react';
import { Card, CardBody, CardTitle, Container } from 'reactstrap';
import DMTable from '../Table/DMTable';
import { REPLICATION_JOB_STATUS } from '../../constants/TableConstants';
import { hideApplicationLoader, showApplicationLoader } from '../../store/actions';
import { callAPI } from '../../utils/ApiUtils';
import { API_DR_PLAN_REPLICATION_JOBS, API_REPLICATION_JOBS } from '../../constants/ApiConstants';
import { addMessage } from '../../store/actions/MessageActions';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import DMTPaginator from '../Table/DMTPaginator';

class ReplicationJobs extends Component {
  constructor() {
    super();
    this.state = { data: [], dataToDisplay: [] };
    this.setDataForDisplay = this.setDataForDisplay.bind(this);
  }

  componentDidMount() {
    this.fethData();
  }

  componentWillUnmount() {
    this.state = null;
  }

  setDataForDisplay(data) {
    this.setState({ dataToDisplay: data });
  }

  fethData() {
    const { dispatch, drPlanID } = this.props;
    dispatch(showApplicationLoader('JOBS_DATA', 'Fetching jobs...'));
    const url = (drPlanID === 0 ? API_REPLICATION_JOBS : API_DR_PLAN_REPLICATION_JOBS.replace('<id>', drPlanID));
    callAPI(url).then((json) => {
      dispatch(hideApplicationLoader('JOBS_DATA'));
      if (json.hasError) {
        dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
      } else {
        this.setState({ data: json });
      }
    },
    (err) => {
      alert(err);
    });
  }

  render() {
    const { data, dataToDisplay } = this.state;
    const { dispatch } = this.props;
    return (
      <>
        <Container fluid>
          <Card>
            <CardBody>
              <CardTitle className="mb-4">Replication Jobs</CardTitle>
              <DMTPaginator data={data} setData={this.setDataForDisplay} />
              <DMTable
                dispatch={dispatch}
                columns={REPLICATION_JOB_STATUS}
                data={dataToDisplay}
              />
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

export default ReplicationJobs;
