import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {
  Card, CardBody, Col, Container, Row,
} from 'reactstrap';
import { fetchPlaybooks } from '../../store/actions/DrPlaybooksActions';
import DMTable from '../Table/DMTable';
import DRPlanActionBar from './DRPlanActionBar';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import { TABLE_HEADER_DR_PLANS } from '../../constants/TableConstants';
import { drPlansFetched, fetchDrPlans, handleDrPlanTableSelection, updateSelectedPlans } from '../../store/actions/DrPlanActions';

class DRPlans extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(updateSelectedPlans({}));
    dispatch(fetchDrPlans());
    dispatch(fetchPlaybooks());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(drPlansFetched([]));
    dispatch(updateSelectedPlans({}));
  }

  render() {
    const { drPlans, dispatch, user } = this.props;
    if (!drPlans && !drPlans.plans) { return null; }
    const data = (drPlans && drPlans.plans ? drPlans.plans : []);
    const { selectedPlans } = drPlans;
    return (
      <>
        <Container fluid>
          <Card>
            <CardBody>
              <DMBreadCrumb links={[{ label: 'protection.plans', link: '#' }]} />
              <Row>
                <Col>
                  <DRPlanActionBar dispatch={dispatch} selectedPlans={selectedPlans} user={user} />
                </Col>
              </Row>
              <DMTable
                dispatch={dispatch}
                columns={TABLE_HEADER_DR_PLANS}
                data={data}
                isSelectable
                onSelect={handleDrPlanTableSelection}
                selectedData={selectedPlans}
                primaryKey="id"
                selectionInput="rdo"
                user={user}
              />
            </CardBody>
          </Card>

        </Container>
      </>
    );
  }
}

const propTypes = {
  dispatch: PropTypes.func.isRequired,
  drPlans: PropTypes.any.isRequired,
};
DRPlans.propTypes = propTypes;

export default (withTranslation()(DRPlans));
