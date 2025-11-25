import React from 'react';
import { withTranslation } from 'react-i18next';
import { closeModal } from '../../store/actions/ModalActions';
import { addMessage } from '../../store/actions/MessageActions';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';

function ModalScheduleStatusChange({ dispatch, modal, t }) {
  const { options } = modal;
  const { confirmAction, message, payload, history } = options;

  const onClose = () => {
    dispatch(closeModal(true));
  };

  const onConfigureUser = () => {
    if (payload && history && typeof confirmAction === 'function') {
      dispatch(confirmAction(payload, true, history, payload.id));
    } else {
      dispatch(addMessage('Unable to change schedule status', MESSAGE_TYPES.ERROR));
    }
  };

  return (
    <>
      <div className="modal-body noPadding">
        <div className="container padding-20">
          <div className="row">
            <div className="col-sm-1 confirmation-icon">
              <i className="fas fa-exclamation-triangle text-warning" />
            </div>
            <div className="col-sm-10 confirmation_modal_msg">
              {message}
            </div>
          </div>
        </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          {t('close')}
        </button>
        <button type="button" className="btn btn-danger" onClick={onConfigureUser}>
          {t('confirm')}
        </button>
      </div>
    </>
  );
}
export default (withTranslation()(ModalScheduleStatusChange));
