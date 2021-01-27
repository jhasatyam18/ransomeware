import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, CardTitle, Container, Row, Col,
} from 'reactstrap';
import { withTranslation } from 'react-i18next';
import DMTable from '../Table/DMTable';
import { fetchDrPlans, handleDrPlanTableSelection } from '../../store/actions/DrPlanActions';
import { TABLE_HEADER_DR_PLANS } from '../../constants/TableConstants';
import DRPlanActionBar from './DRPlanActionBar';

class DRPlans extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchDrPlans());
  }

  render() {
    const { drPlans, dispatch, t, user } = this.props;
    if (!drPlans && !drPlans.plans) { return null; }
    const data = (drPlans && drPlans.plans ? drPlans.plans : []);
    const { selectedPlans } = drPlans;
    return (
      <>
        <Container fluid>
          <Card>
            <CardBody>
              <CardTitle className="mb-4">{t('protection.plans')}</CardTitle>
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
