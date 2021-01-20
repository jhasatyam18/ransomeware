import React, { Component } from 'react';
import { Card, CardBody, Container } from 'reactstrap';
import DMTable from '../Table/DMTable';
import { REPLICATION_JOBS } from '../../constants/TableConstants';
import DMTPaginator from '../Table/DMTPaginator';
import { fetchReplicationJobs } from '../../store/actions/JobActions';

class Replication extends Component {
  constructor() {
    super();
    this.state = { dataToDisplay: [] };
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
    const { dispatch, protectionplanID } = this.props;
    dispatch(fetchReplicationJobs(protectionplanID));
  }

  render() {
    const { jobs } = this.props;
    const { replication } = jobs;
    const { dataToDisplay } = this.state;
    const { dispatch } = this.props;
    return (
      <>
        <Container fluid>
          <Card>
            <CardBody>
              <DMTPaginator data={replication} setData={this.setDataForDisplay} showFilter="true" columns={REPLICATION_JOBS} />
              <DMTable
                dispatch={dispatch}
                columns={REPLICATION_JOBS}
                data={dataToDisplay}
              />
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

export default Replication;
