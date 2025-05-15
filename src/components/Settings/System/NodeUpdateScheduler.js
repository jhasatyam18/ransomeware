import React, { useEffect } from 'react';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import DMBreadCrumb from '../../Common/DMBreadCrumb';
import DMTable from '../../Table/DMTable';
import { TABLE_NODE_UPDATE_SCHEDULER } from '../../../constants/TableConstants';
import NodeSchedulerActionButton from './NodeSchedulerActionButton';
import { fetchSheduledNodes, handleNodeScheduleTableSelection } from '../../../store/actions/NodeScheduleAction';

function NodeUpdateScheduler(props) {
  const { dispatch, user, settings } = props;
  const { scheduledNodes, selectedScheduledNodes } = settings;
  useEffect(() => {
    let isUnmounting = false;
    if (!isUnmounting) {
      dispatch(fetchSheduledNodes());
    }
    return () => {
      isUnmounting = true;
    };
  }, []);

  return (
    <>
      <Container fluid>
        <Card>
          <CardBody>
            <DMBreadCrumb links={[{ label: 'node.system.update', link: '#' }]} />
            <NodeSchedulerActionButton user={user} dispatch={dispatch} settings={settings} />
            <Row>
              <Col sm={12}>
                <DMTable
                  columns={TABLE_NODE_UPDATE_SCHEDULER}
                  data={scheduledNodes}
                  primaryKey="nodeId"
                  isSelectable
                  dispatch={dispatch}
                  selectedData={selectedScheduledNodes}
                  onSelect={handleNodeScheduleTableSelection}
                />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Container>
    </>
  );
}

function mapStateToProps(state) {
  const { settings, user } = state;
  return { settings, user };
}
export default connect(mapStateToProps)(withTranslation()(NodeUpdateScheduler));
