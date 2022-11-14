import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, Col, Container, Form, Row } from 'reactstrap';
import { NOTE_TEXT } from '../../constants/DMNoteConstant';
import { getValue } from '../../utils/InputUtils';
import { changeSystemPassword, valueChange } from '../../store/actions';
import { closeModal } from '../../store/actions/ModalActions';
import DMFieldText from '../Shared/DMFieldText';
import DMNote from '../Common/DMNote';
import { FIELDS, FIELD_TYPE } from '../../constants/FieldsConstant';

function ModalChangeNodePassword(props) {
  const { options, dispatch, user, t } = props;
  const passwordField = FIELDS['ui.new.password'];
  const cnfPasswordField = FIELDS['ui.cnfm.password'];
  const name = { type: FIELD_TYPE.TEXT, shouldShow: true, fieldInfo: 'info.node.name' };

  useEffect(() => {
    const { nodeName } = options;
    dispatch(valueChange('ui.node.name', nodeName));
  }, []);

  function onCancel() {
    dispatch(closeModal());
  }

  function onfieldCheck() {
    const { values } = user;
    const password = getValue('user.newPassword', values);
    const cnfPassword = getValue('user.confirmPassword', values);
    if (password !== '' && cnfPassword !== '' && password === cnfPassword) return true;
  }

  function onSave() {
    const { alerts } = props;
    const { selected } = alerts;
    const { nodeID } = options;
    if (onfieldCheck()) {
      dispatch(changeSystemPassword(nodeID, selected));
    }
  }
  const renderNote = () => <DMNote title="Info" info="info.node.password.change" color={NOTE_TEXT.INFO} open />;

  const arrayInput = [{ title: 'title.node.name', fieldKey: 'ui.node.name', field: name, disabled: true }, { title: 'title.node.new.password', fieldKey: 'user.newPassword', field: passwordField }, { title: 'title.node.cnf.password', fieldKey: 'user.confirmPassword', field: cnfPasswordField }];
  return (
    <Container className="margin-top-15 modal_node" fluid>
      <Card>
        <Form>
          { renderNote()}
          { arrayInput.map((el) => (
            <>
              <Row>
                <Col sm={4}>{t(el.title)}</Col>
                <Col sm={8}>
                  <DMFieldText dispatch={dispatch} fieldKey={el.fieldKey} field={el.field} user={user} hideLabel="true" disabled={el.disabled} />
                </Col>
              </Row>
            </>
          ))}
        </Form>
      </Card>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>{t('title.cancel')}</button>
        <button type="button" className="btn btn-success" onClick={onSave}>{t('title.save')}</button>
      </div>
    </Container>
  );
}

function mapStateToProps(state) {
  const { alerts, user } = state;
  return { alerts, user };
}
export default connect(mapStateToProps)(withTranslation()(ModalChangeNodePassword));
