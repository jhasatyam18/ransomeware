import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Container, Col, Row, Label } from 'reactstrap';
import { FIELDS, FIELD_TYPE } from '../../constants/FieldsConstant';
import DMFieldText from '../Shared/DMFieldText';
import DMFieldSelect from '../Shared/DMFieldSelect';
import DMFieldNumber from '../Shared/DMFieldNumber';
import { STATIC_KEYS, UI_WORKFLOW } from '../../constants/InputConstants';
import { getValue } from '../../utils/InputUtils';

function DRPlanScriptStep(props) {
  const { dispatch, user, t } = props;
  function renderLabel(FieldKey) {
    const { label, hideLabel } = FIELDS[FieldKey];
    if (hideLabel) {
      return null;
    }
    return (
      <Label for="horizontal-firstname-Input" className="col-sm-4 col-form-Label">
        {t(label)}
      </Label>
    );
  }

  function renderFields(fieldKey) {
    const field = FIELDS[fieldKey];
    const { type } = field;
    switch (type) {
      case FIELD_TYPE.SELECT:
        return <DMFieldSelect dispatch={dispatch} hideLabel="true" fieldKey={fieldKey} field={field} user={user} />;
      case FIELD_TYPE.TEXT:
        return <DMFieldText dispatch={dispatch} hideLabel="true" fieldKey={fieldKey} field={field} user={user} />;
      default:
        return <DMFieldNumber dispatch={dispatch} hideLabel="true" fieldKey={fieldKey} field={field} user={user} />;
    }
  }

  const renderScriptWarning = () => {
    const { values } = user;
    const workFlow = getValue(STATIC_KEYS.UI_WORKFLOW, values);
    if (workFlow !== UI_WORKFLOW.REVERSE_PLAN) {
      return null;
    }
    return (
      <p>
        <i className="fas fa-exclamation-triangle icon__warning padding-right-7" aria-hidden="true" />
        <span className="text-warning ">
          {t('script.warning.reverse')}
        </span>
      </p>
    );
  };

  return (
    <Container fluid className="padding-10">
      {renderScriptWarning()}
      <Label>{t('replication.script.message')}</Label>
      <Row>
        <Col sm={5}>
          {renderLabel('drplan.replPreScript')}
        </Col>
        <Col sm={7}>
          <Row>
            <Col sm={12}>
              {renderFields('drplan.replPreScript')}
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col sm={5} className="padding-top-10">
          {renderLabel('drplan.replPostScript')}
        </Col>
        <Col sm={7}>
          <Row>
            <Col sm={12} className="padding-top-10">
              {renderFields('drplan.replPostScript')}
            </Col>
          </Row>
        </Col>
      </Row>
      <hr />
      <Label>{t('recovery.script.message')}</Label>
      <Row>
        <Col sm={5}>
          {renderLabel('drplan.preScript')}
        </Col>
        <Col sm={7}>
          <Row>
            <Col sm={6}>
              <Row>
                <Col sm={12}>
                  {renderFields('drplan.preScript')}
                </Col>
                {/* {renderTooltip('info.protectionplan.preScript')} */}
              </Row>
            </Col>
            <Col sm={6}>
              <Row>
                <Col sm={12}>
                  {renderFields('drplan.preInputs')}
                </Col>
                {/* {renderTooltip('info.protectionplan.scriptInput')} */}
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col sm={5} className="padding-top-10">
          {renderLabel('drplan.postScript')}
        </Col>
        <Col sm={7}>
          <Row>
            <Col sm={6} className="padding-top-10">
              <Row>
                <Col sm={12}>
                  {renderFields('drplan.postScript')}
                </Col>
              </Row>
            </Col>
            <Col sm={6} className="padding-top-10">
              <Row>
                <Col sm={12}>
                  {renderFields('drplan.postInputs')}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
      <hr />
      <Row>
        <Col sm={5}>
          {renderLabel('drplan.scriptTimeout')}
        </Col>
        <Col sm={7} className="padding-top-10">
          <Row>
            <Col sm={12}>
              {renderFields('drplan.scriptTimeout')}
            </Col>
          </Row>
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
