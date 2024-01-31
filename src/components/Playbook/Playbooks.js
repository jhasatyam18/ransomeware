import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, Col, Container, Row } from 'reactstrap';
import { setAllPlaybooks, handlePlaybooksSelect, fetchPlaybooks } from '../../store/actions/DrPlaybooksActions';

import { PLAYBOOKS } from '../../constants/TableConstants';
import DMTable from '../Table/DMTable';
import { PROTECTION_PLANS_PATH } from '../../constants/RouterConstants';
import DMBreadCrumb from '../Common/DMBreadCrumb';
import CommonPlaybookActions from './CommonPlaybookActions';

function Playbooks(props) {
  const { dispatch, drPlaybooks, user } = props;
  const { templates, selectedPlaybook } = drPlaybooks;

  useEffect(() => {
    dispatch(fetchPlaybooks());
  }, []);

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
