import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { API_RECOVERY_CHECKPOINT_JOBS } from '../../constants/ApiConstants';
import { CHECKPOINTS_JOBS } from '../../constants/TableConstants';
import { setRecoveryCheckpointJobs } from '../../store/actions/checkpointActions';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import DMAPIPaginator from '../Table/DMAPIPaginator';
import DMTable from '../Table/DMTable';

class RecoveryCheckPointsJobs extends Component {
  render() {
    const { dispatch, jobs, drPlans } = this.props;
    const { protectionPlan } = drPlans;
    const { id } = protectionPlan;
    const { checkpointJobs } = jobs;
    const cols = CHECKPOINTS_JOBS;
    const url = API_RECOVERY_CHECKPOINT_JOBS.replace('<id>', id);

    return (

      <Container fluid>
        <Card>
          <CardBody>
            <Row>
              <Col sm={4}><DMBreadCrumb links={[{ label: 'recovery.checkpoint.jobs', link: '#' }]} /></Col>
              <Col sm={8}>
                <div>
                  <DMAPIPaginator
                    showFilter="true"
                    columns={cols}
                    apiUrl={url}
                    storeFn={setRecoveryCheckpointJobs}
                    name="recoverycheckpointsjobs"
                    isParameterizedUrl="true"
                  />
                </div>
              </Col>
            </Row>
            <DMTable
              dispatch={dispatch}
              columns={cols}
              data={checkpointJobs}
            />
          </CardBody>
        </Card>
      </Container>
    );
  }
}

export default (withTranslation()(RecoveryCheckPointsJobs));
