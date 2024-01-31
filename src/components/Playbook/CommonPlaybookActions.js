import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { API_UPLOAD_TEMPLATED } from '../../constants/ApiConstants';
import { clearValues } from '../../store/actions';
import { openModal } from '../../store/actions/ModalActions';
import { MODAL_PLAYBOOK_DOWNLOAD, MODAL_CONFIRMATION_WARNING, MODAL_PLAYBOOK_UPLOAD } from '../../constants/Modalconstant';
import { onMultiplePlaybookDelete, uploadFiles } from '../../store/actions/DrPlaybooksActions';

function CommonPlaybookActions(props) {
  const onGenerate = () => {
    const { dispatch } = props;
    const DRPLAN_SORCE_TARGET_SETTINGS = ['drplan.protectedSite', 'drplan.recoverySite'];
    const options = { title: 'Generate And Download Playbook Template', size: 'lg', fields: DRPLAN_SORCE_TARGET_SETTINGS, modalActions: true };
    dispatch(clearValues());
    dispatch(openModal(MODAL_PLAYBOOK_DOWNLOAD, options));
  };

  const uploadFile = (file) => {
    const { dispatch, t } = props;
    dispatch(uploadFiles(file, API_UPLOAD_TEMPLATED, t('upload.configured.playbook'), t('playbook.download.success')));
  };

  const onUpload = () => {
    const { dispatch, t } = props;
    dispatch(clearValues());
    const options = { title: t('upload.configured.playbooks'), url: API_UPLOAD_TEMPLATED, onUpload: uploadFile };
    dispatch(openModal(MODAL_PLAYBOOK_UPLOAD, options));
  };

  const renderButtons = (item) => {
    const { label, onClick, icon, isDisabled } = item;
    const { t } = props;
    return (
      <button type="button" key={`bulk_button_${label}`} className="btn btn-secondary btn-sm margin-right-2" onClick={onClick} disabled={isDisabled}>
        <FontAwesomeIcon size="sm" icon={icon} />
    &nbsp;&nbsp;
        {t(`${label}`)}
      </button>
    );
  };

  const getActionButtons = (actions) => (
    <div className="btn-toolbar">
      <div className="btn-group" role="group" aria-label="First group">
        {actions.map((item) => renderButtons(item))}
      </div>
    </div>
  );

  const onRemove = () => {
    const { dispatch, selectedPlaybook, t } = props;
    const options = { title: 'Confirmation', confirmAction: onMultiplePlaybookDelete, message: t('confirm.remove.playbook', { name: selectedPlaybook.name }) };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  };

  const renderGlobalActions = () => {
    const { selectedPlaybook } = props;
    const disabled = !Object.keys(selectedPlaybook).length === 0 || Object.keys(selectedPlaybook).length > 0;
    const disableOther = Object.keys(selectedPlaybook).length > 0;
    const actions = [{ label: 'Generate', onClick: onGenerate, icon: faDownload, isDisabled: disabled },
      { label: 'Upload', onClick: onUpload, icon: faUpload, isDisabled: disabled },
      { label: 'Remove', onClick: onRemove, icon: faTrash, isDisabled: !disableOther }];
    return (
      <>
        {getActionButtons(actions)}
      </>
    );
  };

  return (
    <div className="btn-toolbar padding-left-20">
      <div className="btn-group" role="group" aria-label="First group">
        { renderGlobalActions() }
      </div>
    </div>
  );
}
const propTypes = {
  dispatch: PropTypes.func.isRequired,
};
CommonPlaybookActions.propTypes = propTypes;
export default (withTranslation()(CommonPlaybookActions));
