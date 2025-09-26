import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {
  Card, CardBody, Col, Container, Row,
} from 'reactstrap';
import { TABLE_FILTER_TEXT, TABLE_HEADER_DR_PLANS } from '../../constants/TableConstants';
import { drPlansFetched, fetchDrPlans, handleDrPlanTableSelection, updateSelectedPlans } from '../../store/actions/DrPlanActions';
import { fetchPlaybooks } from '../../store/actions/DrPlaybooksActions';
import { filterData, processCriteria } from '../../utils/AppUtils';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import DMTable from '../Table/DMTable';
import DMTPaginator from '../Table/DMTPaginator';
import DRPlanActionBar from './DRPlanActionBar';

class DRPlans extends Component {
  constructor() {
    super();
    this.state = { hasFilterString: false, searchData: [], dataToDisplay: [] };
    this.setDataForDisplay = this.setDataForDisplay.bind(this);
    this.onFilter = this.onFilter.bind(this);
  }

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

  onFilter(criteria) {
    const { drPlans } = this.props;
    const data = (drPlans && drPlans.plans ? drPlans.plans : []);
    if (criteria.trim() === '') {
      this.setState({ hasFilterString: false, searchData: [] });
    } else {
      const processedCriteria = processCriteria(criteria.trim());
      const newData = filterData(data, processedCriteria, TABLE_HEADER_DR_PLANS);
      this.setState({ hasFilterString: true, searchData: newData });
    }
  }

  setDataForDisplay(data) {
    this.setState({ dataToDisplay: data });
  }

  render() {
    const { drPlans, dispatch, user } = this.props;
    const { hasFilterString, searchData, dataToDisplay } = this.state;
    if (!drPlans && !drPlans.plans) { return null; }
    const data = hasFilterString ? searchData : (drPlans && drPlans.plans) || [];
    const { selectedPlans } = drPlans;
    const cols = TABLE_HEADER_DR_PLANS;
    return (
      <>
        <Container fluid>
          <Card>
            <CardBody>
              <DMBreadCrumb links={[{ label: 'protection.plans', link: '#' }]} />
              <Row className="pr-4">
                <Col sm={5} className="mt-2">
                  <DRPlanActionBar dispatch={dispatch} selectedPlans={selectedPlans} user={user} />
                </Col>
                <Col sm={7}>
                  <DMTPaginator
                    data={data}
                    setData={this.setDataForDisplay}
                    showFilter="true"
                    onFilter={this.onFilter}
                    columns={cols}
                    filterHelpText={TABLE_FILTER_TEXT.TABLE_HEADER_DR_PLANS}
                    id="pplansearch"
                  />
                </Col>
              </Row>
              <DMTable
                dispatch={dispatch}
                columns={TABLE_HEADER_DR_PLANS}
                data={dataToDisplay}
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
