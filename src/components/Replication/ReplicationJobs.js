import React, { Component } from 'react';
import { Card, CardBody, CardTitle, Container } from 'reactstrap';
import DMTable from '../Table/DMTable';
import { REPLICATION_JOB_STATUS } from '../../constants/TableConstants';
import { hideApplicationLoader, showApplicationLoader } from '../../store/actions';
import { callAPI } from '../../utils/ApiUtils';
import { API_REPLICATION_JOBS } from '../../constants/ApiConstants';
import { addMessage } from '../../store/actions/MessageActions';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import DMTPaginator from '../Table/DMTPaginator';

class ReplicationJobs extends Component {
  constructor() {
    super();
    this.state = { data: [] };
  }

  componentDidMount() {
    this.fethData();
  }

  fethData() {
    const { dispatch } = this.props;
    dispatch(showApplicationLoader('JOBS_DATA', 'Fetching jobs...'));
    callAPI(API_REPLICATION_JOBS).then((json) => {
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
    const { data } = this.state;
    const { dispatch } = this.props;
    return (
      <>
        <Container fluid>
          <Card>
            <CardBody>
              <CardTitle className="mb-4">Replication Jobs</CardTitle>
              <DMTPaginator />
              <DMTable
                dispatch={dispatch}
                columns={REPLICATION_JOB_STATUS}
                data={data}
              />
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

export default ReplicationJobs;
