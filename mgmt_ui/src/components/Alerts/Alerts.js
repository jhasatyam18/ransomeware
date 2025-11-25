import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { useParams, useNavigate } from 'react-router-dom';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import DMAPIPaginator from '../Table/DMAPIPaginator';
import DMTable from '../Table/DMTable';
import { addMessage } from '../../store/actions/MessageActions';
import { alertsFetched, unreadAlertFetched } from '../../store/actions/AlertActions';
import { API_TYPES, callAPI, createPayload } from '../../utils/ApiUtils';
import { API_FETCH_ALERTS, API_MARK_READ_ALL } from '../../constants/ApiConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { ALERT_FILTERS, TABLE_ALERTS, TABLE_FILTER_TEXT } from '../../constants/TableConstants';
import { ALERTS_PATH } from '../../constants/RouterConstants';

function Alerts({ alerts, dispatch, t }) {
  const [initDone, setInitDone] = useState(false);
  const { id, urnID, searchStr } = useParams();
  const alertFiltersRef = useRef(ALERT_FILTERS.map((col) => {
    if (urnID && col.value === '0') {
      return { ...col, checked: true };
    }
    return { ...col };
  }));
  let apiq = {};
  const history = useNavigate();
  let alertUrl = id ? `${API_FETCH_ALERTS}?alertID=${id}` : API_FETCH_ALERTS;
  if (urnID && searchStr) {
    alertUrl = `${API_FETCH_ALERTS}?objectURN=${urnID}`;
    apiq = { ack: ['0'] };
  }
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

    if (id) {
      // Example: only numeric IDs are valid
      const isValidId = /^\d+$/.test(id || '');
      if (!isValidId && !urnID) return history(ALERTS_PATH);
    }

    return () => {
      if (alertFiltersRef.current) {
        alertFiltersRef.current = undefined;
      }
    };
  }, [id]);

  if (!initDone) {
    return null;
  }

  const onInputChange = (e) => {
    /**
     * if in url there is object urn and alert type then it shows in seach box in dmapipaginator
     * if user do anything in search box it should remove objsct urn and alert type from url and get back to it's base url
     */
    if (e.nativeEvent.inputType === 'deleteContentBackward' || e.nativeEvent.inputType === 'insertText' && window.location.pathname !== ALERTS_PATH) {
      history(ALERTS_PATH);
    }
  };

  return (
    <Container fluid>
      <Card>
        <CardBody>
          <DMBreadCrumb links={[{ label: 'alerts', link: '#' }]} />
          <Row>
            <Col sm={12}>
              <div>
                <DMAPIPaginator
                  showFilter="true"
                  columns={TABLE_ALERTS}
                  filterHelpText={TABLE_FILTER_TEXT.TABLE_ALERTS}
                  apiUrl={alertUrl}
                  storeFn={alertsFetched}
                  name="alerts"
                  subFilter={alertFiltersRef.current}
                  subFilterTitle={t('status')}
                  isParameterizedUrl={id || searchStr ? 'true' : 'false'}
                  objectURN={urnID}
                  searchString={searchStr}
                  onSearchChange={onInputChange}
                  apiq={apiq}
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
