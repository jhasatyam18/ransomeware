import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { API_FETCH_EVENTS } from '../../constants/ApiConstants';
import { TABLE_EVENTS, TABLE_FILTER_TEXT } from '../../constants/TableConstants';
import { eventsFetched } from '../../store/actions/EventActions';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import DMAPIPaginator from '../Table/DMAPIPaginator';
import DMTable from '../Table/DMTable';

/**
 * Component to render all events
 */
class Events extends Component {
  render() {
    const { events, dispatch } = this.props;
    const { data } = events;
    return (
      <>
        <>
          <Container fluid>
            <Card>
              <CardBody>
                <DMBreadCrumb links={[{ label: 'events', link: '#' }]} />
                <Row className="padding-left-20">
                  <Col sm={12}>
                    <div className="padding-right-30 padding-left-10">
                      <DMAPIPaginator
                        showFilter="true"
                        columns={TABLE_EVENTS}
                        filterHelpText={TABLE_FILTER_TEXT.TABLE_EVENTS}
                        apiUrl={API_FETCH_EVENTS}
                        storeFn={eventsFetched}
                        name="events"
                      />
                    </div>
                  </Col>
                </Row>
                <DMTable
                  dispatch={dispatch}
                  columns={TABLE_EVENTS}
                  data={data}
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
