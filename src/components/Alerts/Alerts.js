import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import DMAPIPaginator from '../Table/DMAPIPaginator';
import DMTable from '../Table/DMTable';
import { addMessage } from '../../store/actions/MessageActions';
import { alertsFetched } from '../../store/actions/AlertActions';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { API_FETCH_ALERTS, API_MARK_READ_ALL } from '../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { TABLE_ALERTS, TABLE_FILTER_TEXT } from '../../constants/TableConstants';
/**
 * Component to render Alerts.
 */
class Alerts extends Component {
  constructor() {
    super();
    this.state = { initDone: false };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const payload = createPayload(API_TYPES.POST, {});
    callAPI(API_MARK_READ_ALL, payload)
      .then(() => {
        this.setState({ initDone: true });
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
        this.setState({ initDone: true });
      });
  }

  render() {
    const { alerts, dispatch } = this.props;
    const { data = [] } = alerts;
    const { initDone } = this.state;
    if (initDone === false) {
      return null;
    }
    return (
      <>
        <>
          <Container fluid>
            <Card>
              <CardBody>
                <DMBreadCrumb links={[{ label: 'alerts', link: '#' }]} />
                <Row className="padding-left-20">
                  <Col sm={12}>
                    <div className="padding-right-30 padding-left-10">
                      <DMAPIPaginator
                        showFilter="true"
                        columns={TABLE_ALERTS}
                        filterHelpText={TABLE_FILTER_TEXT.TABLE_ALERTS}
                        apiUrl={API_FETCH_ALERTS}
                        storeFn={alertsFetched}
                        name="alerts"
                      />
                    </div>
                  </Col>
                </Row>
                <DMTable
                  dispatch={dispatch}
                  columns={TABLE_ALERTS}
                  data={data}
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
