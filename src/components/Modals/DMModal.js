import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';
import { closeModal } from '../../store/actions/ModalActions';
import * as MODALS from '../../constants/Modalconstant';
import ModalConfigureSite from './ModalConigureSite';
import ConfirmationModal from './ConfirmationModal';
import ModalAbout from './ModalAbout';

class DMModal extends Component {
  constructor() {
    super();
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    const { dispatch } = this.props;
    dispatch(closeModal());
  }

  renderContent() {
    const { dispatch, modal, user } = this.props;
    const { content } = modal;
    if (content) {
      switch (content) {
        case MODALS.MODAL_CONFIGURE_NEW_SITE:
          return <ModalConfigureSite user={user} dispatch={dispatch} {...this.props} />;
        case MODALS.MODAL_CONFIRMATION_WARNING:
          return <ConfirmationModal dispatch={dispatch} {...this.props} />;
        case MODALS.MODAL_ABOUT:
          return <ModalAbout dispatch={dispatch} {...this.props} />;
        default:
          return (<div>404</div>);
      }
    }
    return null;
  }

  render() {
    const { modal } = this.props;
    const { show, options } = modal;
    if (!show) {
      return null;
    }
    return (
      <>
        <Modal isOpen centered style={{ minWidth: 600, maxHeight: 550 }} scrollable>
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="DMMODAL">
              {' '}
              {options.title}
              {' '}
            </h5>
          </div>
          {this.renderContent()}
        </Modal>
      </>
    );
  }
}
const propTypes = {
  dispatch: PropTypes.func.isRequired,
  modal: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};
DMModal.propTypes = propTypes;
export default DMModal;
