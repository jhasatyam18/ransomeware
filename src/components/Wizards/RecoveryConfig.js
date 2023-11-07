import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, CardTitle, Form } from 'reactstrap';
import { valueChange } from '../../store/actions';
import { PLATFORM_TYPES, STATIC_KEYS, UI_WORKFLOW } from '../../constants/InputConstants';
import { getValue } from '../../utils/InputUtils';
import DMField from '../Shared/DMField';

class RecoveryConfig extends Component {
  render() {
    const { user, dispatch, t } = this.props;
    const { values } = user;
    const workflow = getValue(STATIC_KEYS.UI_WORKFLOW, values);
    const recoveryPlatform = getValue('ui.values.recoveryPlatform', values);
    const option = getValue('recovery.discardPartialChanges', values);
    const vmNotCompletedReplication = getValue('recovery.discard.warning.vms', values);
    const showOptionToDiscard = (workflow === UI_WORKFLOW.RECOVERY && vmNotCompletedReplication.length > 0 && recoveryPlatform === PLATFORM_TYPES.VMware);
    const onChange = (value) => {
      dispatch(valueChange('recovery.discardPartialChanges', value));
    };
    const renderOptionToDiscard = () => (
      <>
        <div>
          <input type="radio" id="cure" name="option" value="current" checked={!option} onChange={() => onChange(false)} />
          <label htmlFor="current" style={{ cursor: 'pointer', position: 'relative', top: '-2px', left: '5px' }} aria-hidden="true" onClick={() => onChange(false)}>Preserve Current State (Recovery operation might exceed the RTO)</label>
        </div>
        <div>
          <input type="radio" id="previous" name="option" value="previous" checked={option} onChange={() => onChange(true)} />
          <label htmlFor="previous" style={{ cursor: 'pointer', position: 'relative', top: '-2px', left: '5px' }} aria-hidden="true" onClick={() => onChange(true)}>Discard Partial Replicated Changes</label>

        </div>
      </>
    );

    const renderWarningText = () => (
      <div className="margin-top-5 card_note_warning ">
        <p style={{ width: '800px', paddingLeft: '20px' }}>{t('reovery.discard.warning.txt')}</p>
        { vmNotCompletedReplication.map((el) => <li style={{ width: '800px', paddingLeft: '22px', position: 'relative', top: '-10px' }}>{el}</li>)}

      </div>
    );
    return (
      <>
        <Card className="padding-20">
          <CardTitle>{t('Tools Installation')}</CardTitle>
          <CardBody>
            <Form className="form_w">
              <DMField dispatch={dispatch} user={user} fieldKey="recovery.installSystemAgent" />
              {recoveryPlatform !== PLATFORM_TYPES.VMware ? <DMField dispatch={dispatch} user={user} fieldKey="recovery.installCloudPkg" /> : null}
            </Form>
          </CardBody>
        </Card>
        {
            showOptionToDiscard ? (
              <Card className="padding-20">
                <CardTitle>{t('Recovery Mode')}</CardTitle>
                {renderWarningText()}
                <CardBody className="recovey_warn_text ">
                  <Form className="form_w">
                    {renderOptionToDiscard()}
                  </Form>
                </CardBody>
              </Card>
            ) : null
          }
      </>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(RecoveryConfig));
