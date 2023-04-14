import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, CardTitle, Form } from 'reactstrap';
import { PLATFORM_TYPES } from '../../../constants/InputConstants';
import { getValue } from '../../../utils/InputUtils';
import DMField from '../../Shared/DMField';

function TestRecoveryScriptStep(props) {
  const { user, dispatch, t } = props;
  const { values } = user;
  const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
  return (
    <Card>
      <CardBody>
        <CardTitle>{t('tools.installation')}</CardTitle>
        <Form className="form_w">
          <DMField dispatch={dispatch} disabled={recoveryPlatform === PLATFORM_TYPES.VMware} user={user} fieldKey="recovery.installSystemAgent" />
          <DMField dispatch={dispatch} user={user} fieldKey="recovery.installCloudPkg" />
        </Form>
        <hr />
        <CardTitle>{t('pplan.scripts')}</CardTitle>
        <Form>
          <DMField dispatch={dispatch} disabled={recoveryPlatform === PLATFORM_TYPES.VMware} user={user} fieldKey="recovery.cleanupTestRecoveries" />
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
