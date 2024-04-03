import React, { useEffect, useRef } from 'react';
import { withTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { API_GET_BULK_PLANS } from '../../constants/ApiConstants';
import { MILI_SECONDS_TIME } from '../../constants/EventConstant';
import { STATIC_KEYS } from '../../constants/InputConstants';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { PROTECTION_PLANS_PATH } from '../../constants/RouterConstants';
import { PLAYBOOKS } from '../../constants/TableConstants';
import { handlePlaybooksSelect, setAllPlaybooks, setPlaybookData } from '../../store/actions/DrPlaybooksActions';
import { addMessage } from '../../store/actions/MessageActions';
import { callAPI } from '../../utils/ApiUtils';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import DMTable from '../Table/DMTable';
import CommonPlaybookActions from './CommonPlaybookActions';

function Playbooks(props) {
  const { dispatch, drPlaybooks, user } = props;
  const { templates, selectedPlaybook } = drPlaybooks;
  const timerId = useRef();
  const ref = useSelector((state) => state.user.context.refresh);

  useEffect(() => {
    getPlabooks();
    return () => {
      clearInterval(timerId.current);
      timerId.current = undefined;
    };
  }, [ref]);

  function getPlabooks() {
    callAPI(API_GET_BULK_PLANS)
      .then((json) => {
        if (json.hasError) {
          dispatch(addMessage(json.message, MESSAGE_TYPES.ERROR));
        } else {
          dispatch(setPlaybookData(json));
          let running = false;
          // check if any one of he playbook validation is running
          for (let i = 0; i < json.length; i += 1) {
            const element = json[i];
            if (element.status === STATIC_KEYS.PLAYBOOK_CONFIG_VALIDATING) {
              running = true;
              break;
            }
          }
          if (!running) {
            clearInterval(timerId.current);
          } else if (typeof timerId.current === 'undefined') {
            timerId.current = setTimer();
          }
        }
      },
      (err) => {
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
  }
  function setTimer() {
    return setInterval(() => {
      try {
        getPlabooks();
      } catch (e) {
        dispatch(addMessage(e, MESSAGE_TYPES.ERROR));
        clearInterval(timerId.current);
      }
    }, MILI_SECONDS_TIME.FIVE_THOUSAND);
  }

  if (!drPlaybooks || !templates) {
    return null;
  }
  return (
    <>
      <Container fluid>
        <Card>
          <CardBody>
            <DMBreadCrumb links={[{ label: 'protection.plans', link: PROTECTION_PLANS_PATH }, { label: 'title.templates', link: '#' }]} />
            <Row>
              <Col>
                <CommonPlaybookActions dispatch={dispatch} user={user} selectedPlaybook={selectedPlaybook} />
              </Col>
            </Row>
            <DMTable
              dispatch={dispatch}
              columns={PLAYBOOKS}
              data={templates}
              primaryKey="id"
              selectionInput="rdo"
              user={user}
              isSelectable
              onSelect={handlePlaybooksSelect}
              selectedData={selectedPlaybook}
              onSelectAll={setAllPlaybooks}
              name="playbooks"
            />
          </CardBody>
        </Card>
      </Container>
    </>
  );
}

export default (withTranslation()(Playbooks));
