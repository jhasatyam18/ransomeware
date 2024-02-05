import React from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { PLAYBOOK_LIST } from '../../constants/RouterConstants';
import { clearValues, fetchScript, valueChange } from '../../store/actions';
import {
  deletePlan, openEditProtectionPlanWizard,
} from '../../store/actions/DrPlanActions';
import ActionButton from '../Common/ActionButton';
import { openModal } from '../../store/actions/ModalActions';
import { openWizard } from '../../store/actions/WizardActions';
import { fetchSites } from '../../store/actions/SiteActions';
import { MODAL_CONFIRMATION_WARNING } from '../../constants/Modalconstant';
import { CREATE_DR_PLAN_WIZARDS } from '../../constants/WizardConstants';
import { hasRequestedPrivileges } from '../../utils/PrivilegeUtils';
import { PROTECTION_PLANS_STATUS, STATIC_KEYS, UI_WORKFLOW } from '../../constants/InputConstants';
import { isPlanRecovered } from '../../utils/validationUtils';

function DRPlanActionBar(props) {
  const history = useHistory();

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
    const { dispatch } = props;
    const options = { title: 'Confirmation', confirmAction: deletePlan, message: 'Are you sure want to delete  ?' };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  };

  const onTemplateClick = () => {
    history.push(PLAYBOOK_LIST);
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
    const actions = [{ label: 'New', onClick: onCreate, icon: 'fa fa-plus', isDisabled: !hasRequestedPrivileges(user, ['protectionplan.edit']) },
      { label: 'Edit', onClick: onEdit, icon: 'fa fa-edit', isDisabled: (!hasRequestedPrivileges(user, ['protectionplan.create']) || showEdit()) },
      { label: 'remove', onClick: onDelete, icon: 'fa fa-trash', isDisabled: (!hasRequestedPrivileges(user, ['protectionplan.delete']) || disableDeletePlan(true)) },
      { label: 'Playbooks', onClick: onTemplateClick, icon: 'fa fa-file-excel', isDisabled: !hasRequestedPrivileges(user, ['playbook.list']) }];
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
