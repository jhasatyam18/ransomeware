import { faDownload, faEdit, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { Input } from 'reactstrap';
import { API_GET_CONFIG_TEMPLATE_BY_ID } from '../../constants/ApiConstants';
import { NOTE_TEXT } from '../../constants/DMNoteConstant';
import { MODAL_CONFIRMATION_WARNING } from '../../constants/Modalconstant';
import { playbookExport } from '../../store/actions/DrPlanActions';
import { deletePlaybook, downloadPlaybooks, uploadFiles } from '../../store/actions/DrPlaybooksActions';
import { closeModal, openModal } from '../../store/actions/ModalActions';
import { hasRequestedPrivileges } from '../../utils/PrivilegeUtils';
import DMNote from '../Common/DMNote';

function SinglePlaybookActions({ data, dispatch, t, user }) {
  const { id, name, planConfigurations } = data;

  const onDeleteTemplate = (e) => {
    if (!hasRequestedPrivileges(user, ['playbook.delete'])) {
      e.preventDefault();
      return;
    }
    const options = { title: t('confirm.delete.playbook'), confirmAction: deletePlaybook, message: t('confirm.remove.playbook', { name: data.name }), id };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  };

  const onFileChange = (e) => {
    const url = API_GET_CONFIG_TEMPLATE_BY_ID.replace('<id>', id);
    e.preventDefault();
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    dispatch(uploadFiles(e.target.files[0], url, t('configure.playbook.download'), '', 'PUT'));
  };

  const onExport = () => {
    dispatch(playbookExport(planConfigurations[0], planConfigurations[0].planID));
  };

  const onClose = () => {
    dispatch(closeModal(true));
  };

  const renderEditFooter = () => (
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={onClose}>Close </button>
    </div>
  );

  const renderWarningWhileEdit = () => (
    <>
      <i className="fas fa-exclamation-triangle text-warning" />
            &nbsp;&nbsp;&nbsp;
      <span className="text-warning">
        {t('edit.playbook.warn.msg', { name })}
      </span>
      <p className="margin-top-5 text-warning">
        <span aria-hidden className="text-primary" onClick={onExport}>[click here]</span>
        { t('title.download.configured.excel')}
      </p>
    </>
  );
  const renderedit = () => (
    <>
      <div style={{ textAlign: 'left' }} className="card_note_warning margin-top-5">
        {planConfigurations.length > 0 && planConfigurations[0]?.planID > 0
          ? (
            <>
              <DMNote component={renderWarningWhileEdit} title="Note" color={NOTE_TEXT.WARNING} open />
            </>
          )
          : null}
        <span className="text-muted margin-left-20">
          {t('title.upload.playbook')}
        </span>
        <label htmlFor={`reuploadFile-${name}`} className="margin-left-10 link_color">
          <FontAwesomeIcon size="xl" icon={faUpload} />
        </label>
        <Input type="file" accept=".xlsx*" id={`reuploadFile-${name}`} name={`reuploadFile-${name}`} className="modal-lic-upload" onSelect={onFileChange} onChange={onFileChange} />
      </div>
    </>
  );
  const onEdit = (e) => {
    if (!hasRequestedPrivileges(user, ['playbook.edit'])) {
      e.preventDefault();
      return;
    }
    const options = { title: 'Edit Playbook', footerComponent: renderEditFooter, component: renderedit, color: 'success', footerLabel: t('title.reupload.excel'), size: `${planConfigurations[0]?.planID > 0 ? 'lg' : ''}` };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  };
  const onDownloadClick = () => {
    downloadPlaybooks(data, dispatch);
  };

  return (
    <>
      <div className="margin-top-4 singlee_playbook_icon">
        <a href="#" onClick={onEdit}>
          <FontAwesomeIcon icon={faEdit} />
        </a>
        <a href="#" onClick={onDownloadClick} disabled={!hasRequestedPrivileges(user, ['playbook.generate'])}>
          <FontAwesomeIcon className="single_playbook_download" icon={faDownload} />
        </a>
        <a href="#" onClick={onDeleteTemplate}>
          <FontAwesomeIcon className="single_playbook_delete" icon={faTrash} />
        </a>
      </div>
    </>
  );
}

export default (withTranslation()(SinglePlaybookActions));
