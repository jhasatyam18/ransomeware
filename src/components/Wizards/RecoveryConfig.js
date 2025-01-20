import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, CardTitle, Col, Form, Label, Row } from 'reactstrap';
import { PLATFORM_TYPES, STATIC_KEYS, UI_WORKFLOW } from '../../constants/InputConstants';
import { valueChange } from '../../store/actions';
import { getValue } from '../../utils/InputUtils';
import DMField from '../Shared/DMField';
import DMToolTip from '../Shared/DMToolTip';

class RecoveryConfig extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const v = this.getCheckboxValue('recovery.installSystemAgent');
    if (typeof v !== 'boolean') {
      dispatch(valueChange('recovery.installSystemAgent', v));
    }
  }

  getCheckboxValue(key) {
    const { user } = this.props;
    const { values } = user;
    const fieldValue = getValue(key, values);
    if (typeof fieldValue !== 'boolean') {
      return false;
    }
    return fieldValue;
  }

  handleChange = (e, key) => {
    const { dispatch } = this.props;
    dispatch(valueChange(key, e.target.checked));
  };

  render() {
    const { user, dispatch, t } = this.props;
    const { values } = user;
    const workflow = getValue(STATIC_KEYS.UI_WORKFLOW, values);
    const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
    const vmNotCompletedReplication = getValue('recovery.discard.warning.vms', values) || [];
    const showOptionToDiscard = (workflow === UI_WORKFLOW.RECOVERY && recoveryPlatform === PLATFORM_TYPES.VMware) && vmNotCompletedReplication.length > 0;

    const renderWarningText = () => {
      if (vmNotCompletedReplication.length === 0) {
        return null;
      }
      return (
        <>
          <div className="card_note_warning rec_warn_text ">
            <p className="rev_diff_warning mt-4">{t('reovery.discard.warning.txt')}</p>
            { vmNotCompletedReplication.map((el) => <li style={{ width: '800px', paddingLeft: '15px', position: 'relative', top: '-10px' }}>{el}</li>)}
          </div>
        </>
      );
    };

    const renderTooltip = (key) => (
      <DMToolTip tooltip={key} />
    );

    const renderCheckbox = (key, label) => {
      const checked = this.getCheckboxValue(key);
      return (
        <Row>
          <Label for="dm-checkbox" className="col-sm-4 col-form-Label" htmlFor={key}>
            {t(label)}
          </Label>
          <Col sm={8}>
            <Row>
              <Col sm={1}>
                <div className="custom-control custom-checkbox">
                  <input type="checkbox" className="custom-control-input" id={key} name={key} checked={checked} onChange={(e) => this.handleChange(e, key)} />
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
      <>
        <Card className="padding-20">
          <CardBody>
            <CardTitle>{t('Tools Installation')}</CardTitle>
            <Form className="form_w mt-3">
              {renderCheckbox('recovery.installSystemAgent', 'recovery.installSystemAgent') }
              {recoveryPlatform === PLATFORM_TYPES.VMware ? (
                <>
                  <p className="mb-0 text-warning margin-top-10">
                    <i className="fas fa-xs mb-10 mt-0 fa-exclamation-triangle padding-right-6" />
                    {t('recover.cloud.agent.ip.warning')}
                  </p>
                  <p className="mb-0 text-warning">
                    <i className="fas fa-xs mb-10 fa-exclamation-triangle padding-right-6" />
                    {t('recover.cloud.agent.warning')}
                  </p>
                </>
              ) : null}
              <DMField dispatch={dispatch} user={user} fieldKey="recovery.installCloudPkg" />
              {recoveryPlatform !== PLATFORM_TYPES.VMware ? (
                <p className="mb-0 text-warning">
                  <i className="fas fa-xs mb-10 fa-exclamation-triangle padding-right-6" />
                  {t('recover.common.installation.warning')}
                </p>
              ) : null}
              {showOptionToDiscard ? (
                <>
                  {renderWarningText()}
                </>
              ) : null}
            </Form>
          </CardBody>
        </Card>
      </>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(RecoveryConfig));
