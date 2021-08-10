import React from 'react';
import { openModal } from '../../store/actions/ModalActions';
import { deleteRecipient } from '../../store/actions/EmailActions';
import { clearValues, valueChange } from '../../store/actions';
import { MODAL_CONFIRMATION_WARNING, MODAL_EMAIL_RECIPIENTS_CONFIGURATION } from '../../constants/Modalconstant';

function EmailRecipientItemRenderer({ data, dispatch }) {
  function onDelete() {
    const options = { title: 'Confirmation', confirmAction: deleteRecipient, message: `Are you sure want to delete email recipient - ${data.emailAddress} ?`, id: data.ID };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  }

  function onModify() {
    dispatch(clearValues());
    const options = { title: 'Email Recipient', config: data, isUpdate: true, id: data.ID };
    Object.keys(data).forEach((key) => {
      dispatch(valueChange(`emailRecipient.${key}`, data[key]));
    });
    dispatch(openModal(MODAL_EMAIL_RECIPIENTS_CONFIGURATION, options));
  }

  function renderDelete() {
    return (
      <a href="#" onClick={onDelete} className="text-danger" title="Remove">
        <i className="far fa-trash-alt fa-lg" />
      </a>
    );
  }

  function renderModifyRecipient() {
    return (
      <a href="#" onClick={onModify} title="Edit">
        <i className="far fa-edit fa-lg" />
      </a>
    );
  }

  return (
    <div>
      &nbsp;
      &nbsp;
      {renderDelete()}
      &nbsp;
      &nbsp;
      &nbsp;
      {renderModifyRecipient()}
    </div>
  );
}

export default EmailRecipientItemRenderer;
