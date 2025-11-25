import React from 'react';
import { withTranslation } from 'react-i18next';
import { PLAYBOOKS_STATUS } from '../../constants/AppStatus';
import FixPlaybookErrors from '../DRPlans/Playbook/FixPlaybookErrors';
import { validatePlaybook } from '../../store/actions/DrPlaybooksActions';
import { closeModal } from '../../store/actions/ModalActions';

function ModalPlaybookValidate({ dispatch, options, t }) {
  const { id, selectedPlaybook } = options;
  const { status } = selectedPlaybook;
  const onClose = () => {
    dispatch(closeModal());
  };

  const onValidate = () => {
    dispatch(validatePlaybook(id));
  };
  const renderFooter = () => (
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        {t('close')}
      </button>
      <button type="button" className="btn btn-success" onClick={onValidate}>
        {t('validate')}
      </button>
    </div>
  );
  return (
    <>
      {status === PLAYBOOKS_STATUS.PLAYBOOK_VALIDATION_FAILED ? (
        <div className="padding-left-20">
          <FixPlaybookErrors dispatch={dispatch} playbook={selectedPlaybook} />
        </div>
      ) : null}
      {renderFooter()}
    </>
  );
}

export default (withTranslation()(ModalPlaybookValidate));
