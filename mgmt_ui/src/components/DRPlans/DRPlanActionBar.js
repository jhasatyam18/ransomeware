import { faEdit, faFileExcel, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MODAL_DELETE_VM_CONFIRMATON } from '../../constants/Modalconstant';
import { openModal } from '../../store/actions/ModalActions';
import { PROTECTION_PLANS_STATUS, STATIC_KEYS, UI_WORKFLOW } from '../../constants/InputConstants';
import { PLAYBOOK_LIST } from '../../constants/RouterConstants';
import { CREATE_DR_PLAN_WIZARDS } from '../../constants/WizardConstants';
import { clearValues, fetchScript, valueChange } from '../../store/actions';
import {
  deletePlan,
  openEditProtectionPlanWizard,
} from '../../store/actions/DrPlanActions';
import { fetchSites } from '../../store/actions/SiteActions';
import { openWizard } from '../../store/actions/WizardActions';
import { hasRequestedPrivileges } from '../../utils/PrivilegeUtils';
import { isPlanRecovered } from '../../utils/validationUtils';
import ActionButton from '../Common/ActionButton';

function DRPlanActionBar(props) {
  const history = useNavigate();

  const onCreate = () => {
    const { dispatch } = props;
    dispatch(clearValues());
    dispatch(fetchSites('ui.values.sites'));
    dispatch(fetchScript());
    dispatch(valueChange(STATIC_KEYS.UI_WORKFLOW, UI_WORKFLOW.CREATE_PLAN));
    dispatch(valueChange('drplan.isCompression', true));
    dispatch(openWizard(CREATE_DR_PLAN_WIZARDS.options, CREATE_DR_PLAN_WIZARDS.steps));
  };

  const onDelete = () => {
    const { selectedPlans, dispatch } = props;
    const selectedPlansKey = Object.keys(selectedPlans);
    const plan = selectedPlans[selectedPlansKey[0]];
    const options = { title: 'Confirmation', confirmAction: deletePlan, message: `Are you sure you want to delete protection plan ${plan.name} ?`, id: plan.id, css: 'confirmation', protectionPlan: plan };
    dispatch(openModal(MODAL_DELETE_VM_CONFIRMATON, options));
  };

  const onTemplateClick = () => {
    history(PLAYBOOK_LIST);
  };
  const onEdit = () => {
    const { dispatch } = props;
    dispatch(openEditProtectionPlanWizard());
  };

  const getActionButtons = (actions) => {
    const { t } = props;
    return (
      <div className="btn-toolbar">
        <div className="btn-group" role="group" aria-label="First group">
          {actions.map((item) => {
            const { label, onClick, icon, isDisabled } = item;
            return (
              <ActionButton label={label} onClick={onClick} icon={icon} isDisabled={isDisabled} t={t} key={`${label}-${icon}`} />
            );
          })}
        </div>
      </div>
    );
  };

  const showEdit = () => {
    const { selectedPlans, user } = props;
    const { localVMIP } = user;
    if (!selectedPlans) {
      return true;
    }
    const keys = Object.keys(selectedPlans);
    if (keys.length > 1 || keys.length === 0) {
      return true;
    }
    if (keys.length === 1) {
      const plan = selectedPlans[keys[0]];
      const { recoverySite } = plan;
      // disable if status of plan is recovered or migrated
      if (isPlanRecovered(plan) || localVMIP === recoverySite.node.hostname || plan.status === PROTECTION_PLANS_STATUS.INITIALIZING) {
        return true;
      }
    }
    return false;
  };

  const disableDeletePlan = () => {
    const { selectedPlans, user } = props;
    const { localVMIP } = user;
    if (!selectedPlans) { return true; }
    const keys = Object.keys(selectedPlans);
    if (keys.length > 1 || keys.length === 0) {
      return true;
    }
    const plan = selectedPlans[keys[0]];
    const { recoverySite } = plan;
    if (localVMIP === recoverySite.node.hostname) {
      return true;
    }
    return false;
  };

  const renderGlobalActions = () => {
    const { user } = props;
    const actions = [{ label: 'New', onClick: onCreate, icon: faPlus, isDisabled: !hasRequestedPrivileges(user, ['protectionplan.edit']) },
      { label: 'Edit', onClick: onEdit, icon: faEdit, isDisabled: (!hasRequestedPrivileges(user, ['protectionplan.create']) || showEdit()) },
      { label: 'remove', onClick: onDelete, icon: faTrash, isDisabled: (!hasRequestedPrivileges(user, ['protectionplan.delete']) || disableDeletePlan(true)) },
      { label: 'Playbooks', onClick: onTemplateClick, icon: faFileExcel, isDisabled: !hasRequestedPrivileges(user, ['playbook.list']) }];
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
  selectedPlans: PropTypes.any.isRequired,
};
DRPlanActionBar.propTypes = propTypes;
export default (withTranslation()(DRPlanActionBar));
