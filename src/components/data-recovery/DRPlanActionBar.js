import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import {
  drPlanStopStart, deletePlan, openRecoveryWizard, openMigrationWizard, openReverseWizard,
} from '../../store/actions/DrPlanActions';
import ActionButton from '../Common/ActionButton';
import { openModal } from '../../store/actions/ModalActions';
import { openWizard } from '../../store/actions/WizardActions';
import { fetchSites } from '../../store/actions/SiteActions';
import { clearValues, fetchScript } from '../../store/actions';
import { MODAL_CONFIRMATION_WARNING } from '../../constants/Modalconstant';
import { CREATE_DR_PLAN_WIZARDS } from '../../constants/WizardConstants';

class DRPlanActionBar extends Component {
  constructor() {
    super();
    this.planAction = this.planAction.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onInitiateRecovery = this.onInitiateRecovery.bind(this);
    this.onMigrate = this.onMigrate.bind(this);
    this.onReverse = this.onReverse.bind(this);
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
      return false;
    }
    return true;
  }

  renderServerOptions() {
    const actions = [{ label: 'recover', onClick: this.onInitiateRecovery, icon: 'fa fa-recycle', isDisabled: false },
      { label: 'Migrate', onClick: this.onMigrate, icon: 'fa fa-share-square', isDisabled: false },
      { label: 'Reverse', onClick: this.onReverse, icon: 'fa fa-backward', isDisabled: false }];
    return (
      <>
        {this.getActionButtons(actions)}
      </>
    );
  }

  renderGlobalActions() {
    const actions = [{ label: 'New', onClick: this.onCreate, icon: 'fa fa-plus', isDisabled: false }, { label: 'remove', onClick: this.onDelete, icon: 'fa fa-trash', isDisabled: this.shouldShowAction(false) }];
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
