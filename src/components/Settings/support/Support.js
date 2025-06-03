import { faPlus } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useRef, useState } from 'react';
import { withTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { filterData } from '../../../utils/AppUtils';
import DMTPaginator from '../../Table/DMTPaginator';
import { addMessage } from '../../../store/actions/MessageActions';
import { hideApplicationLoader, showApplicationLoader, refresh } from '../../../store/actions';
import { MESSAGE_TYPES } from '../../../constants/MessageConstants';
import { API_SUPPORT_BUNDLE } from '../../../constants/ApiConstants';
import { callAPI } from '../../../utils/ApiUtils';
import { MODAL_GENERATE_SUPPORT_BUNDLE } from '../../../constants/Modalconstant';
import { SUPPORT_BUNDLES } from '../../../constants/TableConstants';
import { openModal } from '../../../store/actions/ModalActions';
import { fetchSupportBundlesById, supportBundleFetched } from '../../../store/actions/SupportActions';
import { hasRequestedPrivileges } from '../../../utils/PrivilegeUtils';
import ActionButton from '../../Common/ActionButton';
import DMBreadCrumb from '../../Common/DMBreadCrumb';
import DMTable from '../../Table/DMTable';
import { NUMBER, STATIC_KEYS } from '../../../constants/InputConstants';
import { JOB_COMPLETION_STATUS, PARTIALLY_COMPLETED, JOB_FAILED, JOB_IN_PROGRESS } from '../../../constants/AppStatus';

function Support(props) {
  const { dispatch, settings, t, user } = props;
  const { bundles } = settings;
  const timerId = useRef(null);
  const disable = bundles && bundles.length > 0 && bundles[0].status === STATIC_KEYS.RUNNING || false;
  const refreshdata = useSelector((state) => state.user.context.refresh);
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState(false);
  const [searchData, setSearchData] = useState([]);
  const vmData = filter ? searchData : data;
  useEffect(() => {
    fetchSupportBundles();
    return () => {
      dispatch(supportBundleFetched([]));
      if (timerId.current !== null) {
        clearInterval(timerId.current);
      }
    };
  }, [refreshdata]);

  function onGenerate() {
    const options = { title: 'Generate Support Bundle' };
    dispatch(openModal(MODAL_GENERATE_SUPPORT_BUNDLE, options));
  }

  function fetchSupportBundles() {
    dispatch(showApplicationLoader(API_SUPPORT_BUNDLE, 'Loading support bundles...'));
    callAPI(API_SUPPORT_BUNDLE)
      .then((json) => {
        dispatch(hideApplicationLoader(API_SUPPORT_BUNDLE));
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(supportBundleFetched(json));
          if (json.length > 0 && json[0].status === JOB_IN_PROGRESS && timerId.current === null) {
            timerId.current = setInterval(() => {
              // Dispatch fetch to get latest bundle data
              dispatch(fetchSupportBundlesById(json[0].id)).then((latestBundle) => {
                if (latestBundle && (latestBundle.status === JOB_COMPLETION_STATUS || latestBundle.status === JOB_FAILED || latestBundle.status === PARTIALLY_COMPLETED)) {
                  clearInterval(timerId.current);
                  dispatch(refresh());
                  timerId.current = null;
                }
              });
            }, NUMBER.FIVE_THOUSAND);
          }
        }
      },
      (err) => {
        dispatch(hideApplicationLoader(API_SUPPORT_BUNDLE));
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  }

  function setDataForDisplay(d) {
    setData(d);
  }

  function onFilter(criteria) {
    const d = (bundles.length > 0 ? bundles : []);
    if (criteria.trim() === '') {
      setFilter(false);
      setSearchData([]);
    } else {
      const newData = filterData(d, criteria.trim(), SUPPORT_BUNDLES);
      setFilter(true);
      setSearchData(newData);
    }
  }
  return (
    <>
      <>
        <Container fluid>
          <Card>
            <CardBody>
              <DMBreadCrumb links={[{ label: 'tech.support', link: '#' }]} />
              <Row>
                <Col sm={6}>
                  <ActionButton cssName="btn btn-secondary btn-sm ms-4" label="Generate" onClick={onGenerate} icon={faPlus} isDisabled={!hasRequestedPrivileges(user, ['support.create']) || disable} t={t} key="newsupportbundle" />

                </Col>
                <Col sm={6}>
                  <DMTPaginator
                    data={bundles}
                    setData={setDataForDisplay}
                    showFilter="true"
                    onFilter={onFilter}
                    columns={SUPPORT_BUNDLES}
                    id="supportsearch"
                  />
                </Col>
              </Row>
              <DMTable
                dispatch={dispatch}
                columns={SUPPORT_BUNDLES}
                data={vmData}
              />
            </CardBody>
          </Card>
        </Container>
      </>
    </>
  );
}

function mapStateToProps(state) {
  const { settings, user } = state;
  return { settings, user };
}
export default connect(mapStateToProps)(withTranslation()(Support));
