import React, { Component } from 'react';
import { Card, CardBody, Container } from 'reactstrap';
import DMTable from '../Table/DMTable';
import { RECOVERY_JOBS } from '../../constants/TableConstants';
import DMTPaginator from '../Table/DMTPaginator';
import { fetchRecoveryJobs } from '../../store/actions/JobActions';
import { fetchDrPlans } from '../../store/actions/DrPlanActions';

class Recovery extends Component {
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
    dispatch(fetchDrPlans('ui.values.drplan'));
    dispatch(fetchRecoveryJobs(protectionplanID));
  }

  render() {
    const { jobs, user } = this.props;
    const { recovery } = jobs;
    const { dataToDisplay } = this.state;
    const { dispatch } = this.props;
    return (
      <>
        <Container fluid>
          <Card>
            <CardBody>
              <div className="display__flex__reverse">
                <DMTPaginator data={recovery} setData={this.setDataForDisplay} showFilter="true" columns={RECOVERY_JOBS} />
              </div>
              <DMTable
                dispatch={dispatch}
                columns={RECOVERY_JOBS}
                data={dataToDisplay}
                user={user}
              />
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }
}

export default Recovery;
