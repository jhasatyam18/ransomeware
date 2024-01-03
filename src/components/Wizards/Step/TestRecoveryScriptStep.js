import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, CardTitle, Col, Form, Label, Row } from 'reactstrap';
import { getValue } from '../../../utils/InputUtils';
import { showInstallSystemAgentOption } from '../../../store/actions/VMwareActions';
import { valueChange } from '../../../store/actions';
import DMToolTip from '../../Shared/DMToolTip';
import DMField from '../../Shared/DMField';

function TestRecoveryScriptStep(props) {
  const { user, dispatch, t } = props;

  const shouldShowInstallSysAgent = showInstallSystemAgentOption(user);
  const getCheckboxValue = (key) => {
    const { values } = user;
    const fieldValue = getValue(key, values);
    if (typeof fieldValue !== 'boolean') {
      return false;
    }
    return fieldValue;
  };

  const handleChange = (e, key) => {
    dispatch(valueChange(key, e.target.checked));
  };

  const renderTooltip = (key) => (
    <DMToolTip tooltip={key} />
  );

  const renderCheckbox = (key, label) => {
    const checked = getCheckboxValue(key);
    return (
      <Row>
        <Label for="dm-checkbox" className="col-sm-4 col-form-Label">
          {t(label)}
        </Label>
        <Col sm={8}>
          <Row>
            <Col sm={1}>
              <div className="custom-control custom-checkbox">
                <input type="checkbox" className="custom-control-input" id={key} name={key} checked={checked} onChange={(e) => handleChange(e, key)} />
                <label className="custom-control-label" htmlFor={key} />
              </div>
            </Col>
            <Col sm={2}>
              {renderTooltip('info.recovery.system.agent')}
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };
  return (
    <Card>
      <CardBody>
        <CardTitle>{t('tools.installation')}</CardTitle>
        <Form className="form_w">
          {shouldShowInstallSysAgent ? renderCheckbox('recovery.installSystemAgent', 'recovery.installSystemAgent') : null}
          <DMField dispatch={dispatch} user={user} fieldKey="ui.installSystemAgent.warning" />
          <DMField dispatch={dispatch} user={user} fieldKey="recovery.installCloudPkg" />
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
