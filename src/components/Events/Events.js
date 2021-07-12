import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Card, CardBody, Col, Container, Row,
} from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { TABLE_EVENTS, TABLE_FILTER_TEXT } from '../../constants/TableConstants';
import DMTable from '../Table/DMTable';
import { fetchEvents, resetEvents } from '../../store/actions/EventActions';
import DMTPaginator from '../Table/DMTPaginator';
import EventFilter from '../Shared/EventFilter';

/**
 * Component to render all events
 */
class Events extends Component {
  constructor() {
    super();
    this.state = { dataToDisplay: [] };
    this.setDataForDisplay = this.setDataForDisplay.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch(fetchEvents());
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(resetEvents());
  }

  setDataForDisplay(data) {
    this.setState({ dataToDisplay: data });
  }

  render() {
    const { events, dispatch } = this.props;
    const { filteredData, data } = events;
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
                      <EventFilter data={data} action="event" dispatch={dispatch} />
                    </div>
                  </Col>
                  <Col sm={10}>
                    <div className="padding-right-30 padding-left-10">
                      <DMTPaginator
                        data={filteredData}
                        setData={this.setDataForDisplay}
                        showFilter="true"
                        columns={TABLE_EVENTS}
                        filterHelpText={TABLE_FILTER_TEXT.TABLE_EVENTS}
                      />
                    </div>
                  </Col>
                </Row>
                <DMTable
                  dispatch={dispatch}
                  columns={TABLE_EVENTS}
                  data={dataToDisplay}
                  primaryKey="id"
                  name="events"
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
  const { events } = state;
  return { events };
}
export default connect(mapStateToProps)(withTranslation()(Events));
