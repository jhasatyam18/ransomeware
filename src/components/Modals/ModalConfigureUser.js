import React from 'react';
import SimpleBar from 'simplebar-react';
import { CardBody, Form } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { closeModal } from '../../store/actions/ModalActions';
import { FIELDS } from '../../constants/FieldsConstant';
import DMField from '../Shared/DMField';
import { getKeyStruct } from '../../utils/PayloadUtil';
import { configureUser } from '../../store/actions';
import { validateSteps } from '../../utils/validationUtils';

function ModalConfigureUser(props) {
  const { dispatch, user, modal, t } = props;
  const { values } = user;
  const { options } = modal;
  const { isUpdate, roles } = options;
  const fields = Object.keys(FIELDS).filter((key) => key.indexOf('configureUser') !== -1);

  const onClose = () => {
    dispatch(closeModal(true));
  };

  const onConfigureUser = () => {
    let fieldsToCheck = fields;
    if (isUpdate) {
      fieldsToCheck = fieldsToCheck.filter((e) => e !== 'configureUser.password');
    }
    if (validateSteps(user, dispatch, fieldsToCheck)) {
      const payload = getKeyStruct('configureUser.', values);
      let selectedRole = null;
      // Setting the role of user in payload according to name
      roles.forEach((role) => {
        if (`${role.name}` === payload.configureUser.role) {
          selectedRole = role;
        }
      });
      payload.configureUser.role = selectedRole;
      if (isUpdate) {
        payload.id = options.id;
        dispatch(configureUser(payload, true));
      } else {
        dispatch(configureUser(payload, false));
      }
    }
  };

  const renderForm = () => {
    const renderFields = [];
    fields.forEach((field) => {
      let shouldDisable = false;
      if (typeof isUpdate !== 'undefined') {
        const allowedFields = ['fullName', 'email', 'description', 'role'];
        const fName = field.split('.')[1];
        shouldDisable = isUpdate && !(allowedFields.indexOf(fName) !== -1);
      }
      renderFields.push((<DMField dispatch={dispatch} user={user} fieldKey={field} key={`configureUser-${field}`} disabled={shouldDisable} />));
    });
    return (
      <CardBody className="modal-card-body">
        <Form>
          {
            renderFields
          }
        </Form>
      </CardBody>
    );
  };

  return (
    <>
      <div className="modal-body noPadding">
        <SimpleBar className="max-h-400">
          {renderForm()}
        </SimpleBar>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          {t('close')}
        </button>
        <button type="button" className="btn btn-success" onClick={onConfigureUser}>
          {t('configure')}
        </button>
      </div>
    </>
  );
}

export default (withTranslation()(ModalConfigureUser));
