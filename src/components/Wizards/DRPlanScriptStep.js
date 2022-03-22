import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Container, Col, Row, Label } from 'reactstrap';
import DMField from '../Shared/DMField';

function DRPlanScriptStep(props) {
  const { dispatch, user, t } = props;
  return (
    <Container fluid className="padding-10">
      <Label>{t('replication.script.message')}</Label>
      <Row>
        <Col sm={12} className="padding-top-10">
          <DMField dispatch={dispatch} user={user} fieldKey="drplan.replPreScript" />
          <DMField dispatch={dispatch} user={user} fieldKey="drplan.replPostScript" />
        </Col>
      </Row>
      <hr />
      <Label>{t('recovery.script.message')}</Label>
      <Row>
        <Col sm={12} className="padding-top-10">
          <DMField dispatch={dispatch} user={user} fieldKey="drplan.preScript" />
          <DMField dispatch={dispatch} user={user} fieldKey="drplan.postScript" />
        </Col>
      </Row>
      <hr />
      <Row>
        <Col sm={12} className="padding-top-10">
          <DMField dispatch={dispatch} user={user} fieldKey="drplan.scriptTimeout" />
        </Col>
      </Row>
    </Container>
  );
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(DRPlanScriptStep));
