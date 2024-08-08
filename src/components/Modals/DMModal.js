import React from 'react';
import { Modal } from 'reactstrap';
import * as MODALS from '../../constants/Modalconstant';
import { closeModal } from '../../store/actions/ModalActions';
import ConfirmationModal from './ConfirmationModal';
import ModalAbout from './ModalAbout';
import ModalAlertDetails from './ModalAlertDetails';
import ModalBandwidthConfig from './ModalBandwidthConfig';
import ModalCBTConfirmation from './ModalCBTConfirmation';
import ModalChangeNodePassword from './ModalChangeNodePassword';
import ModalConfigureNode from './ModalConfigureNode';
import ModalConfigureUser from './ModalConfigureUser';
import ModalConfigureSite from './ModalConigureSite';
import ModalEmailConfiguration from './ModalEmailConfiguration';
import ModalEmailRecipient from './ModalEmailRecipient';
import ModalEncryptionKey from './ModalEncryptionKey';
import ModalLicense from './ModalLicense';
import ModalLocationTree from './ModalLocationTree';
import ModalNicConfig from './ModalNicConfig';
import ModalPlaybookError from './ModalPlaybookError';
import ModalPlaybookReconfigure from './ModalPlaybookReconfigure';
import ModalApplyCredentials from './ModalApplyCredentials';
import ModalPreserveCheckpoint from './ModalPreserveCheckpoint';
import ModalReplicationPriority from './ModalReplicationPriority';
import ModalResetCredentials from './ModalResetCredentials';
import ResetDiskReplicationModal from './ModalResetDiskReplication';
import ModalScripts from './ModalScripts';
import ModalShowResetedVms from './ModalShowResetVm';
import ModalShowSummary from './ModalShowSummary';
import ModalSupportBundle from './ModalSupportBundle';
import ModalTemplateShowPplanChanges from './ModalTemplateShowPplanChanges';
import ModalTroubleShooting from './ModalTroubleShooting';
import ModalVMwareQuiesce from './ModalVMwareQuiesce';
import PlaybookGenerateModal from './PlaybookGenerateModal';
import PlaybookUploadModal from './PlaybookUploadModal';
import ModalReverseChangesWarning from './ModalReverseChangesWarning';

function DMModal(props) {
  const { modal, user, dispatch } = props;

  if (!modal || Object.keys(modal).length === 0) {
    return null;
  }
  const { show, options } = modal;
  const { css, modalActions, size } = options;
  const { content } = modal;

  const onClose = () => {
    dispatch(closeModal(true));
  };

  const renderContent = () => {
    if (content) {
      switch (content) {
        case MODALS.MODAL_CONFIGURE_NEW_SITE:
          return <ModalConfigureSite {...props} />;
        case MODALS.MODAL_CONFIRMATION_WARNING:
          return <ConfirmationModal {...props} />;
        case MODALS.MODAL_ABOUT:
          return <ModalAbout {...props} />;
        case MODALS.MODAL_ALERT_DETAILS:
          return <ModalAlertDetails {...props} options={options} />;
        case MODALS.MODAL_GENERATE_SUPPORT_BUNDLE:
          return <ModalSupportBundle {...props} />;
        case MODALS.MODAL_NODE_CONFIGURATION:
          return <ModalConfigureNode {...props} options={options} />;
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
        case MODALS.MODAL_RECONFIGURE_PLAYBOOK:
          return <ModalPlaybookReconfigure dispatch={dispatch} user={user} {...props} options={options} />;
        case MODALS.MODAL_CBT_CONFIRMATION:
          return <ModalCBTConfirmation dispatch={dispatch} user={user} {...props} />;
        case MODALS.MODAL_APPLY_CREDENTIALS:
          return <ModalApplyCredentials dispatch={dispatch} user={user} {...props} />;
        case MODALS.MODAL_TROUBLESHOOTING_WINDOW:
          return <ModalTroubleShooting dispatch={dispatch} options={options} />;
        case MODALS.MODAL_VMWARE_QUIESCE:
          return <ModalVMwareQuiesce dispatch={dispatch} user={user} />;
        case MODALS.MODAL_RESET_DISK_REPLICATION:
          return <ResetDiskReplicationModal dispatch={dispatch} user={user} options={options} />;
        case MODALS.MODAL_REVERSE_CHANGES_WARNING:
          return <ModalReverseChangesWarning dispatch={dispatch} user={user} {...props} />;
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

export default DMModal;
