import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Card, CardBody, Col, Container, Row,
} from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { TABLE_ALERTS, TABLE_FILTER_TEXT } from '../../constants/TableConstants';
import DMTable from '../Table/DMTable';
import { fetchAlerts, resetAlerts } from '../../store/actions/AlertActions';
import DMTPaginator from '../Table/DMTPaginator';
import { filterData } from '../../utils/AppUtils';
import EventFilter from '../Shared/EventFilter';

/**
 * Component to render Alerts.
 */
class Alerts extends Component {
  constructor() {
    super();
    this.state = { dataToDisplay: [], hasFilterString: false, searchData: [] };
    this.setDataForDisplay = this.setDataForDisplay.bind(this);
    this.onFilter = this.onFilter.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchAlerts());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(resetAlerts());
  }

  onFilter(criteria) {
    const { alerts } = this.props;
    const { data } = alerts;
    if (criteria === '') {
      this.setState({ hasFilterString: false, searchData: [] });
    } else {
      const newData = filterData(data, criteria, TABLE_ALERTS);
      this.setState({ hasFilterString: true, searchData: newData });
    }
  }

  setDataForDisplay(data) {
    this.setState({ dataToDisplay: data });
  }

  render() {
    const { alerts, dispatch } = this.props;
    const { data } = alerts;
    const { dataToDisplay, hasFilterString, searchData } = this.state;
    const alertsData = (hasFilterString ? searchData : data);
    return (
      <>
        <>
          <Container fluid>
            <Card>
              <CardBody>
                <Row className="padding-left-20">
                  <Col sm={2}>
                    <div>
                      <EventFilter data={data} action="event" dispatch={dispatch} />
                    </div>
                  </Col>
                  <Col sm={10}>
                    <div className="padding-right-30 padding-left-10">
                      <DMTPaginator
                        onFilter={this.onFilter}
                        data={alertsData}
                        setData={this.setDataForDisplay}
                        showFilter="true"
                        columns={TABLE_ALERTS}
                        filterHelpText={TABLE_FILTER_TEXT.TABLE_ALERTS}
                      />
                    </div>
                  </Col>
                </Row>
                <DMTable
                  dispatch={dispatch}
                  columns={TABLE_ALERTS}
                  data={dataToDisplay}
                  primaryKey="id"
                  name="alerts"
                />
              </CardBody>
            </Card>
          </Container>
        </>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { alerts } = state;
  return { alerts };
}
export default connect(mapStateToProps)(withTranslation()(Alerts));
