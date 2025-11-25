import React from 'react';
import { withTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { closeModal } from '../../store/actions/ModalActions';
import { getItemRendererComponent } from '../../utils/ComponentFactory';

const ConfirmationModal = ({ dispatch, modal = {}, user, t }) => {
  const { options = {} } = modal;
  const { message, component } = options;
  const history = useNavigate();

  const onClose = () => {
    dispatch(closeModal());
  };

  const onConfirm = () => {
    const { confirmAction, id } = options;
    if (typeof confirmAction === 'function') {
      dispatch(confirmAction(id, history));
    }
  };

  const modalItemRenderer = () => {
    const { render } = options;
    if (render) {
      return getItemRendererComponent({ render, user, dispatch, options });
    }
    return null;
  };

  const renderFooter = () => {
    const { footerLabel, color, footerComponent } = options;
    if (typeof footerComponent !== 'undefined') {
      return footerComponent();
    }
    return (
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          {t('close')}
        </button>
        {typeof footerLabel !== 'undefined' ? (
          <button type="button" className={`btn btn-${color || 'secondary'}`} onClick={onConfirm}>
            {footerLabel}
          </button>
        ) : (
          <button type="button" className="btn btn-danger" onClick={onConfirm}>
            {t('confirm')}
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="modal-body noPadding">
        <div className="container padding-20">
          <div className="row">
            {!component ? (
              <>
                <div className="col-sm-1 confirmation-icon">
                  <i className="fas fa-exclamation-triangle text-warning" />
                </div>
                <div className="col-sm-10 confirmation_modal_msg">
                  {message}
                  {modalItemRenderer()}
                </div>
              </>
            ) : (
              <div className="text-center width-100 confirmation_modal_msg">
                {component ? component() : message}
              </div>
            )}
          </div>
        </div>
      </div>
      {renderFooter()}
    </>
  );
};

export default withTranslation()(ConfirmationModal);
