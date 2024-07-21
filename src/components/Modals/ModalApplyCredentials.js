import React, { useEffect } from 'react';
import { Col, Row } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { FIELD_TYPE } from '../../constants/FieldsConstant';
import { closeModal } from '../../store/actions/ModalActions';
import DMFieldCheckbox from '../Shared/DMFieldCheckbox';
import DMFieldText from '../Shared/DMFieldText';
import { valueChange } from '../../store/actions';
import { getValue } from '../../utils/InputUtils';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';
import { addMessage } from '../../store/actions/MessageActions';
import { STORE_KEYS } from '../../constants/StoreKeyConstants';

const ModalApplyCredentials = (props) => {
  const { dispatch, user, t } = props;
  const { values } = user;

  useEffect(() => {
    const vms = getValue(STORE_KEYS.UI_RECOVERY_VMS, values) || [];
    if (vms.length > 0) {
      vms.forEach((el) => {
        if (el.showApplyToAll) {
          const { moref } = el;
          dispatch(valueChange(STORE_KEYS.UI_COPY_CONFIG_USERNAME, getValue(`${moref}-username`, values)));
          dispatch(valueChange(STORE_KEYS.UI_COPY_CONFIG_PASSWORD, getValue(`${moref}-password`, values)));
        }
      });
    }
  }, []);

  const renderFields = () => {
    const usernameCheckbox = { label: '', placeHolderText: '', type: FIELD_TYPE.CHECKBOX, shouldShow: true };
    const username = { label: '', placeHolderText: 'Enter username', type: FIELD_TYPE.TEXT, validate: null, errorMessage: 'Enter username.', shouldShow: true };
    const passwordCheckbox = { label: '', placeHolderText: '', type: FIELD_TYPE.CHECKBOX, shouldShow: true };
    const password = { label: '', placeHolderText: 'Enter password', type: FIELD_TYPE.PASSWORD, validate: null, errorMessage: 'Enter password.', shouldShow: true };
    return (
      <Row>
        <Col sm={1} className="mt-2"><DMFieldCheckbox dispatch={dispatch} fieldKey={STORE_KEYS.UI_COPY_CONFIG_USERNAME_CHECKBOX} field={usernameCheckbox} user={user} hideLabel /></Col>
        <Col sm={5}><DMFieldText dispatch={dispatch} fieldKey={STORE_KEYS.UI_COPY_CONFIG_USERNAME} field={username} user={user} hideLabel /></Col>
        <Col sm={1} className="mt-2"><DMFieldCheckbox dispatch={dispatch} fieldKey={STORE_KEYS.UI_COPY_CONFIG_PASSWORD_CHECKBOX} field={passwordCheckbox} user={user} hideLabel /></Col>
        <Col sm={5}><DMFieldText dispatch={dispatch} fieldKey={STORE_KEYS.UI_COPY_CONFIG_PASSWORD} field={password} user={user} hideLabel /></Col>
      </Row>
    );
  };

  const setCredentialsInAllVMs = () => {
    const usernameCheckbox = getValue(STORE_KEYS.UI_COPY_CONFIG_USERNAME_CHECKBOX, values);
    const passwordCheckbox = getValue(STORE_KEYS.UI_COPY_CONFIG_PASSWORD_CHECKBOX, values);
    const username = getValue(STORE_KEYS.UI_COPY_CONFIG_USERNAME, values);
    const password = getValue(STORE_KEYS.UI_COPY_CONFIG_PASSWORD, values);
    const VMs = getValue(STORE_KEYS.UI_RECOVERY_VMS, values);
    if (usernameCheckbox && passwordCheckbox) {
      VMs.forEach((el) => {
        dispatch(valueChange(`${el.moref}-username`, username));
        dispatch(valueChange(`${el.moref}-password`, password));
      });
    } else if (passwordCheckbox && !usernameCheckbox) {
      VMs.forEach((el) => {
        dispatch(valueChange(`${el.moref}-password`, password));
      });
    } else if (!passwordCheckbox && usernameCheckbox) {
      VMs.forEach((el) => {
        dispatch(valueChange(`${el.moref}-username`, username));
      });
    } else {
      dispatch(addMessage(t('apply.credentials.error.message'), MESSAGE_TYPES.ERROR));
      return;
    }
    dispatch(closeModal());
  };

  const onClose = () => {
    dispatch(closeModal());
  };

  const renderFooter = () => (
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        {t('cancel')}
      </button>
      <button type="button" className="btn btn-success" onClick={setCredentialsInAllVMs}>
        {t('Confirm')}
      </button>
    </div>
  );

  return (
    <>
      <div className="modal-body noPadding">
        <div className="container padding-20">
          {renderFields()}
        </div>
      </div>
      {renderFooter()}
    </>
  );
};

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}

export default connect(mapStateToProps)(withTranslation()(ModalApplyCredentials));
