import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, CardTitle, Col, Form, Row } from 'reactstrap';
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
    const vmNotCompletedReplication = getValue('recovery.discard.warning.vms', values) || [];
    const showOptionToDiscard = (workflow === UI_WORKFLOW.RECOVERY && recoveryPlatform === PLATFORM_TYPES.VMware) && vmNotCompletedReplication.length > 0;

    const onChange = (value) => {
      dispatch(valueChange('recovery.discardPartialChanges', value));
    };

    const renderOptionToDiscard = () => (
      <>
        <Row className="recovey_warn_text padding-top-10">
          <Col sm={12}>
            {' '}
            <input type="radio" id="cure" name="option" value="current" checked={!option} onChange={() => onChange(false)} />
            <label htmlFor="current" style={{ cursor: 'pointer', position: 'relative', top: '-2px', left: '5px' }} aria-hidden="true" onClick={() => onChange(false)}>{t('title.differntial.preserve.current')}</label>
          </Col>
          <Col sm={12}>
            <input type="radio" id="previous" name="option" value="previous" checked={option} onChange={() => onChange(true)} />
            <label htmlFor="previous" style={{ cursor: 'pointer', position: 'relative', top: '-2px', left: '5px' }} aria-hidden="true" onClick={() => onChange(true)}>{t('title.differential.discard.partial.changes')}</label>
          </Col>
        </Row>

      </>
    );

    const renderWarningText = () => {
      if (vmNotCompletedReplication.length === 0) {
        return null;
      }
      return (
        <div className="margin-top-5 card_note_warning ">
          <p className="rev_diff_warning">{t('reovery.discard.warning.txt')}</p>
          { vmNotCompletedReplication.map((el) => <li style={{ width: '800px', paddingLeft: '15px', position: 'relative', top: '-10px' }}>{el}</li>)}
        </div>
      );
    };

    return (
      <>
        <Card className="padding-20">
          <CardBody>
            <CardTitle>{t('Tools Installation')}</CardTitle>
            <Form className="form_w">
              <DMField dispatch={dispatch} user={user} fieldKey="recovery.installSystemAgent" />
              <DMField dispatch={dispatch} user={user} fieldKey="ui.installSystemAgent.warning" />
              <DMField dispatch={dispatch} user={user} fieldKey="recovery.installCloudPkg" />
              <DMField dispatch={dispatch} user={user} fieldKey="recovery.removeFromAD" />
            </Form>
            <hr />
            {showOptionToDiscard ? (
              <>
                <CardTitle>{t('Recovery Mode')}</CardTitle>
                {renderWarningText()}

                {renderOptionToDiscard()}
              </>
            ) : null}
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
