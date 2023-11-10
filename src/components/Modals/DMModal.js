import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';
import { closeModal } from '../../store/actions/ModalActions';
import * as MODALS from '../../constants/Modalconstant';
import ModalConfigureSite from './ModalConigureSite';
import ConfirmationModal from './ConfirmationModal';
import ModalAbout from './ModalAbout';
import ModalAlertDetails from './ModalAlertDetails';
import ModalSupportBundle from './ModalSupportBundle';
import ModalConfigureNode from './ModalConfigureNode';
import ModalEmailConfiguration from './ModalEmailConfiguration';
import ModalEmailRecipient from './ModalEmailRecipient';
import ModalEncryptionKey from './ModalEncryptionKey';
import ModalNicConfig from './ModalNicConfig';
import ModalLicense from './ModalLicense';
import ModalBandwidthConfig from './ModalBandwidthConfig';
import ModalScripts from './ModalScripts';
import ModalLocationTree from './ModalLocationTree';
import ModalShowSummary from './ModalShowSummary';
import ModalChangeNodePassword from './ModalChangeNodePassword';
import ModalShowResetedVms from './ModalShowResetVm';
import ModalReplicationPriority from './ModalReplicationPriority';

class DMModal extends Component {
  constructor() {
    super();
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    const { dispatch } = this.props;
    dispatch(closeModal());
  }

  renderContent(options) {
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
        case MODALS.MODAL_ALERT_DETAILS:
          return <ModalAlertDetails />;
        case MODALS.MODAL_GENERATE_SUPPORT_BUNDLE:
          return <ModalSupportBundle />;
        case MODALS.MODAL_NODE_CONFIGURATION:
          return <ModalConfigureNode options={options} />;
        case MODALS.MODAL_EMAIL_CONFIGURATION:
          return <ModalEmailConfiguration options={options} />;
        case MODALS.MODAL_EMAIL_RECIPIENTS_CONFIGURATION:
          return <ModalEmailRecipient options={options} />;
        case MODALS.MODAL_BANDWIDTH_CONFIGURATION:
          return <ModalBandwidthConfig options={options} />;
        case MODALS.MODAL_SHOW_ENCRYPTION_KEY:
          return <ModalEncryptionKey options={options} />;
        case MODALS.MODAL_NETWORK_CONFIG:
          return <ModalNicConfig options={options} />;
        case MODALS.MODAL_INSTALL_NEW_LICENSE:
          return <ModalLicense options={options} />;
        case MODALS.MODAL_USER_SCRIPT:
          return <ModalScripts options={options} />;
        case MODALS.MODAL_LOCATION_CONFIG:
          return <ModalLocationTree dispatch={dispatch} user={user} options={options} fieldKey={options.fieldKey} />;
        case MODALS.MODAL_SUMMARY:
          return <ModalShowSummary dispatch={dispatch} options={options} />;
        case MODALS.MODAL_NODE_PASSWORD_CHANGE:
          return <ModalChangeNodePassword dispatch={dispatch} user={user} options={options} fieldKey={options.fieldKey} />;
        case MODALS.MODAL_SHOW_RESETED_VMS:
          return <ModalShowResetedVms dispatch={dispatch} user={user} options={options} />;
        case MODALS.MODAL_REPLICATION_PRIORITY:
          return <ModalReplicationPriority dispatch={dispatch} user={user} />;
        default:
          return (<div>404</div>);
      }
    }
    return null;
  }

  render() {
    const { modal } = this.props;
    const { show, options } = modal;
    const { css, size } = options;
    if (!show) {
      return null;
    }
    return (
      <>
        <Modal isOpen centered scrollable className={css} size={size}>
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="DMMODAL">
              {' '}
              {options.title}
              {' '}
            </h5>
          </div>
          {this.renderContent(options)}
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
