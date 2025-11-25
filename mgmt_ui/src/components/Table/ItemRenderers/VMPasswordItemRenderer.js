import React from 'react';
import { withTranslation } from 'react-i18next';
import { FIELD_TYPE } from '../../../constants/FieldsConstant';
import { MODAL_APPLY_CREDENTIALS } from '../../../constants/Modalconstant';
import { STORE_KEYS } from '../../../constants/StoreKeyConstants';
import { valueChange } from '../../../store/actions';
import { openModal } from '../../../store/actions/ModalActions';
import DMFieldText from '../../Shared/DMFieldText';

function VMPasswordItemRenderer({ data, user, dispatch, t }) {
  const onApplyCredentialsClick = () => {
    const options = { title: t('apply.credentials') };
    dispatch(valueChange(STORE_KEYS.UI_COPY_CONFIG_USERNAME_CHECKBOX, true));
    dispatch(valueChange(STORE_KEYS.UI_COPY_CONFIG_PASSWORD_CHECKBOX, true));
    dispatch(openModal(MODAL_APPLY_CREDENTIALS, options));
  };

  if ((typeof data.isDisabled !== 'undefined' && data.isDisabled === true)) {
    return (
      '-'
    );
  }
  const username = { label: '', placeHolderText: 'Enter password', type: FIELD_TYPE.PASSWORD, validate: null, errorMessage: 'Enter Password.', shouldShow: true };
  if (user && dispatch && data && data.guestOS) {
    return (
      <div className="text-right">
        <DMFieldText dispatch={dispatch} fieldKey={`${data.moref}-password`} field={username} user={user} hideLabel="true" />
        { data.showApplyToAll ? <button href="#" type="button" onClick={onApplyCredentialsClick} className="pr-4 mr-2 btn btn-link text-success noPadding text-decoration-none shadow-none">{t('copy.credentials')}</button> : null}
      </div>
    );
  }
  return null;
}

export default (withTranslation()(VMPasswordItemRenderer));
