import { faCheckCircle, faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import { withTranslation } from 'react-i18next';
import { Popover, PopoverBody } from 'reactstrap';
import { PLAYBOOKS_STATUS, PLAYBOOK_IN_VALIDATED, TEMPLATE_STATUS } from '../../constants/AppStatus';
import { MODAL_CBT_CONFIRMATION, MODAL_CONFIRMATION_WARNING, MODAL_TEMPLATE_ERROR } from '../../constants/Modalconstant';
import { KEY_CONSTANTS } from '../../constants/UserConstant';
import { onCreatePlanFromPlaybook, playbookFetchPlanDiff, validatePlaybook } from '../../store/actions/DrPlaybooksActions';
import { closeModal, openModal } from '../../store/actions/ModalActions';
import { hasRequestedPrivileges } from '../../utils/PrivilegeUtils';

function SinglePlaybookStatusRenderer({ playbook, field, showStatusLabel, dispatch, t, user, flow }) {
  const status = playbook[field];
  const [popoverOpen, setPopoverOpen] = useState(false);
  const { id, planConfigurations, playbookStatus } = playbook;
  const statusInd = TEMPLATE_STATUS.indexOf(status);
  const Uploaded = statusInd > 0 ? 'success_line' : '';
  const Validated = statusInd > 3 ? 'success_line' : '';
  let validateOnClick = '';
  let configureOnClick = '';
  let validateLable = t('validate');
  let configureLabel = t('configure');
  if (statusInd === 0) {
    validateLable = <p className="link_color"><ins>{t('validate')}</ins></p>;
  } else if (statusInd === 1) {
    validateLable = t('validating');
  } else if (statusInd === 3) {
    validateLable = <p className="link_color"><ins>{t('validate')}</ins></p>;
  } else if (statusInd < 4) {
    validateLable = t('validated');
  }
  if (planConfigurations[0]?.planID > 0) {
    if (statusInd === 2) {
      configureLabel = <p className="link_color"><ins>{t('reconfigure')}</ins></p>;
    } else if (statusInd === 5) {
      configureLabel = t('reconfigured');
    } else if (statusInd === 1 || statusInd === 0) {
      configureLabel = t('reconfigure');
    } else {
      configureLabel = t('configure');
    }
  } else if (statusInd === 4) {
    configureLabel = t('configured');
  } else if (statusInd === 2) {
    configureLabel = <p className="link_color"><ins>{t('configure')}</ins></p>;
  } else {
    configureLabel = t('configure');
  }
  const onClose = () => {
    dispatch(closeModal(true));
  };

  const onCreatePplanClick = () => {
    dispatch(onCreatePlanFromPlaybook(id));
  };

  const createPlanFooter = () => (
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        {t('close')}
      </button>
      <button type="button" className="btn btn-success" onClick={onCreatePplanClick}>
        { planConfigurations[0]?.planID > 0 ? t('title.edit.pplan') : t('confirm')}
      </button>
    </div>
  );

  const onCreatePplan = (e) => {
    if (!hasRequestedPrivileges(user, ['playbook.configure'])) {
      e.preventDefault();
      return;
    }
    let options = { title: t('confirm.playbook.plan.config'), footerComponent: createPlanFooter, confirmAction: onCreatePlanFromPlaybook, message: `Are you sure want to configure protection plan from ${playbook.name} playbook ?`, id, footerLabel: 'Create Protection Plan', color: 'success', size: 'lg' };
    if (planConfigurations[0]?.planID > 0) {
      dispatch(playbookFetchPlanDiff(id, playbook));
      return;
    }
    if (typeof planConfigurations[0].planValidationResponse === 'undefined' || planConfigurations[0].planValidationResponse === '') {
      dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
    } else {
      const validationResponse = JSON.parse(planConfigurations[0].planValidationResponse);
      const disabledVMsName = {};
      validationResponse.forEach((vm, index) => {
        disabledVMsName[index] = { ...vm, changeTracking: false };
      });
      options = { title: 'Change Block Tracking (CBT) Confirmation', selectedVMs: disabledVMsName, confirmAction: onCreatePlanFromPlaybook, id, size: 'lg' };
      dispatch(openModal(MODAL_CBT_CONFIRMATION, options));
    }
  };

  const onErrorValidateClick = (e) => {
    if (!hasRequestedPrivileges(user, ['playbook.validate'])) {
      e.preventDefault();
      return;
    }
    const options = { title: t('issues.identified'), size: 'lg', playbook };
    dispatch(openModal(MODAL_TEMPLATE_ERROR, options));
  };

  const onValidate = (e) => {
    const disableValidate = (status === PLAYBOOKS_STATUS.PLAYBOOK_PLAN_CREATED || status === PLAYBOOKS_STATUS.PLAYBOOK_PLAN_RECONFIGURED);
    if (!hasRequestedPrivileges(user, ['playbook.validate']) || disableValidate) {
      e.preventDefault();
      return;
    }
    const options = { title: t('title.validate.playbook'), confirmAction: validatePlaybook, message: `Are you sure want to Validate ${playbook.name} ?`, id: playbook.id, footerLabel: t('validate'), color: 'success', size: 'lg' };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  };

  if (statusInd < 2) {
    validateOnClick = onValidate;
  } else if (statusInd === 3) {
    validateOnClick = onErrorValidateClick;
  } if (statusInd > 3 || statusInd === 2) {
    validateOnClick = onValidate;
  }
  if (statusInd === 2) {
    configureOnClick = onCreatePplan;
  }

  const renderValidate = () => {
    if (statusInd === 1) {
      return (
        <>
          <i className="fa fa-spinner fa-lg fa-spin text-info recovery_step_icon" />
        </>
      );
    }
    if (statusInd < 2) {
      return (
        <>
          <FontAwesomeIcon onClick={validateOnClick} className="bulk_status_icon" icon={faCheckCircle} />
        </>
      );
    } if (statusInd === 3) {
      return (
        <>
          <FontAwesomeIcon
            onClick={validateOnClick}
            className="success bulk_status_icon error"
            icon={faCircleXmark}
          />
        </>
      );
    } if (statusInd === 2) {
      return (
        <>
          <FontAwesomeIcon onClick={validateOnClick} className="success bulk_status_icon" icon={faCheckCircle} />
        </>
      );
    }
    if (statusInd > 3) {
      return (
        <>
          <FontAwesomeIcon className="success bulk_status_icon" icon={faCheckCircle} />
        </>
      );
    }
  };

  const renderConfigure = () => {
    if (statusInd <= 3) {
      return (
        <>
          <FontAwesomeIcon className="bulk_status_icon" icon={faCheckCircle} />
        </>
      );
    } if (statusInd > 3) {
      return (
        <>
          <FontAwesomeIcon className="success bulk_status_icon" icon={faCheckCircle} onClick={configureOnClick} />
        </>
      );
    }
  };

  const renderPopOver = (hoverInfo, key) => (
    <Popover placement="bottom" isOpen={popoverOpen} target={key}>
      <PopoverBody style={{ maxHeight: '100px', minHeight: '30px', color: '#fff', backgroundColor: 'black', textAlign: 'center' }}>
        {hoverInfo}
      </PopoverBody>
    </Popover>
  );

  const renderStatusLabel = () => {
    if (playbookStatus === PLAYBOOK_IN_VALIDATED) {
      if (flow === KEY_CONSTANTS.PPLAN_DETAILS) {
        return (
          <>
            <p className="progress_text text-warning">{t('title.in.validated')}</p>
            <p className="invalidate_warn_sts">{t('playbook.invalidate.error')}</p>
          </>
        );
      }
      // for playbook listing page
      return (
        <>
          <p onMouseEnter={() => setPopoverOpen(true)} onMouseLeave={() => setPopoverOpen(false)} id={`plybook-in-validate-${playbook.id}`} className="invalidate_warn_sts margin-0 padding-left-20 text-warning">{t('title.in.validated')}</p>
          {renderPopOver(t('playbook.invalidate.error'), `plybook-in-validate-${playbook.id}`)}
        </>
      );
    }
    if (showStatusLabel) {
      // if playbook is reconfigured then set the status to in-sync
      if (status === KEY_CONSTANTS.PLAYBOOK_PLAN_RECONFIGURED || status === KEY_CONSTANTS.PLAYBOOK_PLAN_COFIGURE) {
        return <p className="progress_text">{t('In-Sync')}</p>;
      }
      return <p className="progress_text">{t('title.progress')}</p>;
    }
    return null;
  };

  return (
    <>
      {renderStatusLabel()}
      <div className="d-flex bulk_status_parent mt-0">
        <div>
          <FontAwesomeIcon className="success bulk_status_icon" icon={faCheckCircle} />
        </div>
        <div className="flex-item">
          <hr className={`bulk_sts_horizntal_line ${Uploaded}`} />
        </div>
        <div>{renderValidate()}</div>
        <div className="flex-item"><hr className={`bulk_sts_horizntal_line ${Validated}`} /></div>
        <div>
          {renderConfigure()}
        </div>
      </div>
      <div className="bulk_status_text_parent padding-left-27">
        <div className="template_status_text">
          Uploaded
        </div>
        <div aria-hidden className={`template_status_text ${configureLabel === 'Reconfigured' ? 'padding-left-10' : ''}`} onClick={validateOnClick}>
          {validateLable}
        </div>
        <div aria-hidden className={`template_status_text padding-right ${configureLabel === 'Reconfigured' ? '' : 'pr-2'}`} onClick={configureOnClick}>
          {configureLabel}
        </div>
      </div>
    </>
  );
}

export default (withTranslation()(SinglePlaybookStatusRenderer));
