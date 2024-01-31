import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { withRouter } from 'react-router-dom';
import { closeModal } from '../../store/actions/ModalActions';

class ConfirmationModal extends Component {
  constructor() {
    super();
    this.onClose = this.onClose.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
  }

  onClose() {
    const { dispatch } = this.props;
    dispatch(closeModal());
  }

  onConfirm() {
    const { dispatch, modal, history } = this.props;
    const { options } = modal;
    const { confirmAction, id } = options;
    dispatch(confirmAction(id, history));
  }

  renderFooter() {
    const { modal, t } = this.props;
    const { options } = modal;
    const { footerLabel, color, footerComponent } = options;
    if (typeof footerComponent !== 'undefined') {
      return footerComponent();
    }
    return (
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={this.onClose}>
          {t('close')}
        </button>
        {typeof footerLabel !== 'undefined' ? (
          <button type="button" className={`btn btn-${color || 'secondary'}`} onClick={this.onConfirm}>
            {footerLabel}
          </button>
        ) : (
          <button type="button" className="btn btn-danger" onClick={this.onConfirm}>
            {t('confirm')}
          </button>
        )}
      </div>
    );
  }

  render() {
    const { modal } = this.props;
    const { options } = modal;
    const { message, component } = options;

    return (
      <>
        <div className="modal-body noPadding">
          <div className="container padding-20">
            <div className="row">
              {!component ? (
                <>
                  <div className="col-sm-3 confirmation-icon">
                    <i className="fas fa-exclamation-triangle" />
                  </div>
                  <div className="col-sm-8 confirmation_modal_msg">
                    {message}
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
        {this.renderFooter()}
      </>
    );
  }
}

export default (withTranslation()(withRouter(ConfirmationModal)));
