import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Card, CardBody, Col, Container, Row,
} from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { TABLE_ALERTS } from '../../constants/TableConstants';
import DMTable from '../Table/DMTable';
import { fetchAlerts, resetAlerts } from '../../store/actions/AlertActions';
import DMTPaginator from '../Table/DMTPaginator';
import EventFilter from '../Shared/EventFilter';

/**
 * Component to render Alerts.
 */
class Alerts extends Component {
  constructor() {
    super();
    this.state = { dataToDisplay: [] };
    this.setDataForDisplay = this.setDataForDisplay.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchAlerts());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(resetAlerts());
  }

  setDataForDisplay(data) {
    this.setState({ dataToDisplay: data });
  }

  render() {
    const { alerts, dispatch } = this.props;
    const { filteredData, data } = alerts;
    const { dataToDisplay } = this.state;
    return (
      <>
        <>
          <Container fluid>
            <Card>
              <CardBody>
                <Row className="padding-left-20">
                  <Col sm={2}>
                    <div>
                      <EventFilter data={data} action="alert" dispatch={dispatch} />
                    </div>
                  </Col>
                  <Col sm={10}>
                    <div className="display__flex__reverse">
                      <DMTPaginator data={filteredData} setData={this.setDataForDisplay} showFilter="false" columns={TABLE_ALERTS} />
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
