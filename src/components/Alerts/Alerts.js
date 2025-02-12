import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { clearValues } from '../../store/actions';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import DMAPIPaginator from '../Table/DMAPIPaginator';
import DMTable from '../Table/DMTable';
import { addMessage } from '../../store/actions/MessageActions';
import { alertsFetched, unreadAlertFetched } from '../../store/actions/AlertActions';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { API_FETCH_ALERTS, API_MARK_READ_ALL } from '../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { ALERT_FILTERS, TABLE_ALERTS, TABLE_FILTER_TEXT } from '../../constants/TableConstants';

function Alerts({ alerts, dispatch, t }) {
  const [initDone, setInitDone] = useState(false);
  const alertFiltersRef = useRef(ALERT_FILTERS.map((col) => ({ ...col })));

  useEffect(() => {
    const payload = createPayload(API_TYPES.POST, {});
    callAPI(API_MARK_READ_ALL, payload)
      .then(() => {
        setInitDone(true);
        dispatch(unreadAlertFetched([]));
      })
      .catch((err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
        setInitDone(true);
      });

    return () => {
      dispatch(clearValues());
      if (alertFiltersRef.current) {
        alertFiltersRef.current = undefined;
      }
    };
  }, []);

  if (!initDone) {
    return null;
  }

  return (
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
                  subFilter={alertFiltersRef.current}
                  subFilterTitle={t('status')}
                />
              </div>
            </Col>
          </Row>
          <DMTable
            dispatch={dispatch}
            columns={TABLE_ALERTS}
            data={alerts.data || []}
            primaryKey="id"
            name="alerts"
          />
        </CardBody>
      </Card>
    </Container>
  );
}

function mapStateToProps(state) {
  const { alerts } = state;
  return { alerts };
}
export default connect(mapStateToProps)(withTranslation()(Alerts));
