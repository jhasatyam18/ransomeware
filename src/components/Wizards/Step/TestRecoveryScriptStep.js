import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, CardTitle, Form } from 'reactstrap';
import DMField from '../../Shared/DMField';

function TestRecoveryScriptStep(props) {
  const { user, dispatch, t } = props;
  return (
    <Card>
      <CardBody>
        <CardTitle>{t('tools.installation')}</CardTitle>
        <Form className="form_w">
          <DMField dispatch={dispatch} user={user} fieldKey="recovery.installSystemAgent" />
          <DMField dispatch={dispatch} user={user} fieldKey="recovery.installCloudPkg" />
          <DMField dispatch={dispatch} user={user} fieldKey="ui.installCloudPkg.warning" />
          <DMField dispatch={dispatch} user={user} fieldKey="recovery.removeFromAD" />
        </Form>
        <hr />
        <CardTitle>{t('pplan.scripts')}</CardTitle>
        <Form>
          <DMField dispatch={dispatch} user={user} fieldKey="recovery.runPPlanScripts" />
        </Form>
      </CardBody>
    </Card>
  );
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(TestRecoveryScriptStep));
