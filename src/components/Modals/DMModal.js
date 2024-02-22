import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'reactstrap';
import { clearValues } from '../../store/actions';
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
import ModalPlaybookError from './ModalPlaybookError';
import PlaybookUploadModal from './PlaybookUploadModal';
import PlaybookGenerateModal from './PlaybookGenerateModal';
import ModalReplicationPriority from './ModalReplicationPriority';
import ModalPreserveCheckpoint from './ModalPreserveCheckpoint';
import ModalTemplateShowPplanChanges from './ModalTemplateShowPplanChanges';
import ModalConfigureUser from './ModalConfigureUser';
import ModalResetCredentials from './ModalResetCredentials';
import ModalCBTConfirmation from './ModalCBTConfirmation';

function DMModal(props) {
  const { modal, user, dispatch } = props;
  const { show, options } = modal;
  const { css, modalActions, size } = options;
  const { content } = modal;

  const onClose = () => {
    dispatch(closeModal());
    dispatch(clearValues());
  };

  const renderContent = () => {
    if (content) {
      switch (content) {
        case MODALS.MODAL_CONFIGURE_NEW_SITE:
          return <ModalConfigureSite user={user} dispatch={dispatch} {...props} />;
        case MODALS.MODAL_CONFIRMATION_WARNING:
          return <ConfirmationModal dispatch={dispatch} user={user} {...props} />;
        case MODALS.MODAL_ABOUT:
          return <ModalAbout dispatch={dispatch} {...props} />;
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
        case MODALS.MODAL_PLAYBOOK_DOWNLOAD:
          return <PlaybookGenerateModal dispatch={dispatch} user={user} options={options} />;
        case MODALS.MODAL_PLAYBOOK_UPLOAD:
          return <PlaybookUploadModal dispatch={dispatch} user={user} options={options} />;
        case MODALS.MODAL_TEMPLATE_ERROR:
          return <ModalPlaybookError dispatch={dispatch} user={user} options={options} />;
        case MODALS.MODAL_REPLICATION_PRIORITY:
          return <ModalReplicationPriority dispatch={dispatch} user={user} />;
        case MODALS.MODAL_PRESERVE_CHECKPOINT:
          return <ModalPreserveCheckpoint dispatch={dispatch} user={user} options={options} />;
        case MODALS.MODAL_TEMPLATE_SHOW_PPLAN_CHANGES:
          return <ModalTemplateShowPplanChanges dispatch={dispatch} user={user} options={options} />;
        case MODALS.MODAL_ADD_NEW_USER:
          return <ModalConfigureUser dispatch={dispatch} user={user} {...props} />;
        case MODALS.MODAL_RESET_CREDENTIALS:
          return <ModalResetCredentials dispatch={dispatch} user={user} {...props} />;
        case MODALS.MODAL_CBT_CONFIRMATION:
          return <ModalCBTConfirmation dispatch={dispatch} user={user} {...props} />;
        default:
          return (<div>404</div>);
      }
    }
    return null;
  };

  if (!show) {
    return null;
  }

  return (
    <>
      <Modal isOpen centered scrollable className={css} size={size || ''}>
        <div className="modal-header">
          <h5 className="modal-title mt-0" id="DMMODAL">
            {' '}
            {options.title}
            {' '}
          </h5>
          {modalActions ? (
            <div className="wizard-header-options">
              <div className="wizard-header-div">
                <box-icon name="x-circle" type="solid" color="white" style={{ width: 20 }} onClick={onClose} />
              </div>
            </div>
          ) : null}
        </div>
        {renderContent()}
      </Modal>
    </>
  );
}
const propTypes = {
  dispatch: PropTypes.func.isRequired,
  modal: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};
DMModal.propTypes = propTypes;
export default DMModal;
