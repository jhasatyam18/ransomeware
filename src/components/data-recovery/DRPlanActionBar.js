import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { STATUS_STARTED } from '../../constants/AppStatus';
import { clearValues, fetchScript } from '../../store/actions';
import {
  drPlanStopStart, deletePlan, openRecoveryWizard, openMigrationWizard, openReverseWizard, openEditProtectionPlanWizard,
} from '../../store/actions/DrPlanActions';
import ActionButton from '../Common/ActionButton';
import { openModal } from '../../store/actions/ModalActions';
import { openWizard } from '../../store/actions/WizardActions';
import { fetchSites } from '../../store/actions/SiteActions';
import { MODAL_CONFIRMATION_WARNING } from '../../constants/Modalconstant';
import { CREATE_DR_PLAN_WIZARDS } from '../../constants/WizardConstants';
import { hasRequestedPrivileges } from '../../utils/PrivilegeUtils';
import { PROTECTION_PLANS_STATUS } from '../../constants/InputConstants';
import { isPlanRecovered } from '../../utils/validationUtils';

class DRPlanActionBar extends Component {
  constructor() {
    super();
    this.planAction = this.planAction.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onInitiateRecovery = this.onInitiateRecovery.bind(this);
    this.onMigrate = this.onMigrate.bind(this);
    this.onReverse = this.onReverse.bind(this);
    this.showEdit = this.showEdit.bind(this);
  }

  onCreate() {
    const { dispatch } = this.props;
    dispatch(clearValues());
    dispatch(fetchSites('ui.values.sites'));
    dispatch(fetchScript());
    dispatch(openWizard(CREATE_DR_PLAN_WIZARDS.options, CREATE_DR_PLAN_WIZARDS.steps));
  }

  onInitiateRecovery() {
    const { dispatch } = this.props;
    dispatch(openRecoveryWizard());
  }

  onMigrate() {
    const { dispatch } = this.props;
    dispatch(clearValues());
    dispatch(openMigrationWizard());
  }

  onReverse() {
    const { dispatch } = this.props;
    dispatch(openReverseWizard());
  }

  onDelete() {
    const { dispatch } = this.props;
    const options = { title: 'Confirmation', confirmAction: deletePlan, message: 'Are you sure want to delete  ?' };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  }

  onEdit = () => {
    const { dispatch } = this.props;
    dispatch(openEditProtectionPlanWizard());
  }

  getActionButtons(actions) {
    const { t } = this.props;
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
  }

  planAction(action) {
    const { dispatch } = this.props;
    dispatch(drPlanStopStart(action));
  }

  shouldShowAction(isSingle) {
    const { selectedPlans } = this.props;
    if (!selectedPlans) { return true; }
    const len = Object.keys(selectedPlans).length;
    if (!isSingle && len > 0) {
      return false;
    }
    if (isSingle && len === 1) {
      let key = Object.keys(selectedPlans);
      key = parseInt(key[0], 10);
      if (selectedPlans[key].status === STATUS_STARTED) {
        return true;
      }
      return false;
    }
    return true;
  }

  showEdit() {
    const { selectedPlans, user } = this.props;
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
  }

  disableDeletePlan() {
    const { selectedPlans, user } = this.props;
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
  }

  renderServerOptions() {
    const { user } = this.props;
    const hasPrivilege = this.hasPrivilege(user, ['asd']);
    const actions = [{ label: 'recover', onClick: this.onInitiateRecovery, icon: 'fa fa-recycle', isDisabled: !hasPrivilege },
      { label: 'Migrate', onClick: this.onMigrate, icon: 'fa fa-share-square', isDisabled: !hasPrivilege },
      { label: 'Reverse', onClick: this.onReverse, icon: 'fa fa-backward', isDisabled: !hasPrivilege }];
    return (
      <>
        {this.getActionButtons(actions)}
      </>
    );
  }

  renderGlobalActions() {
    const { user } = this.props;
    const actions = [{ label: 'New', onClick: this.onCreate, icon: 'fa fa-plus', isDisabled: !hasRequestedPrivileges(user, ['protectionplan.edit']) },
      { label: 'Edit', onClick: this.onEdit, icon: 'fa fa-edit', isDisabled: (!hasRequestedPrivileges(user, ['protectionplan.create']) || this.showEdit()) },
      { label: 'remove', onClick: this.onDelete, icon: 'fa fa-trash', isDisabled: (!hasRequestedPrivileges(user, ['protectionplan.delete']) || this.disableDeletePlan(true)) }];
      // { label: 'start', onClick: () => { this.planAction(startPlan); }, icon: 'fa fa-play', isDisabled: this.shouldShowAction(false) },
      // { label: 'stop', onClick: () => { this.planAction(stopPlan); }, icon: 'fa fa-stop', isDisabled: this.shouldShowAction(false) }
    return (
      <>
        {this.getActionButtons(actions)}
      </>
    );
  }

  render() {
    return (
      <div className="btn-toolbar padding-left-20">
        <div className="btn-group" role="group" aria-label="First group">
          { this.renderGlobalActions() }
        </div>
      </div>
    );
  }
}
const propTypes = {
  dispatch: PropTypes.func.isRequired,
  selectedPlans: PropTypes.any.isRequired,
};
DRPlanActionBar.propTypes = propTypes;
export default (withTranslation()(DRPlanActionBar));
