import React, { Component } from 'react';
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
    return (
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={this.onClose}>Close </button>
        <button type="button" className="btn btn-danger" onClick={this.onConfirm}> Confirm </button>
      </div>
    );
  }

  render() {
    const { modal } = this.props;
    const { options } = modal;
    const { message } = options;
    return (
      <>
        <div className="modal-body noPadding">
          <div className="container padding-20">
            <div className="row">
              <div className="col-sm-3 confirmation-icon">
                <i className="mdi mdi-alert-circle-outline" />
              </div>
              <div className="col-sm-8" style={{ margin: 'auto' }}>
                {message}
              </div>
            </div>

          </div>

        </div>
        {this.renderFooter()}
      </>
    );
  }
}

export default (withRouter(ConfirmationModal));
