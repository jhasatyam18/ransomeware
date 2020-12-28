import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  drPlanStopStart, startPlan, stopPlan, deletePlan,
} from '../../store/actions/DrPlanActions';
import { openModal } from '../../store/actions/ModalAcions';
import { MODAL_CONFIRMATION_WARNING } from '../../constants/Modalconstant';
import { CREATE_DR_PLAN_WIZARDS } from '../../constants/WizardConstants';
import { openWizard } from '../../store/actions/WizardActions';
import { fetchSites } from '../../store/actions/SiteActions';
import { clearValues } from '../../store/actions';

class DRPlanActionBar extends Component {
  constructor() {
    super();
    this.planAction = this.planAction.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onCreate = this.onCreate.bind(this);
  }

  onCreate() {
    const { dispatch } = this.props;
    dispatch(clearValues());
    dispatch(fetchSites('ui.values.sites'));
    dispatch(openWizard(CREATE_DR_PLAN_WIZARDS.options, CREATE_DR_PLAN_WIZARDS.steps));
  }

  onDelete() {
    const { dispatch } = this.props;
    const options = { title: 'Alert', confirmAction: deletePlan, message: 'Are you sure want to delete  ?' };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
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

  render() {
    return (
      <>
        <div className="btn-toolbar padding-left-20" role="toolbar" aria-label="Toolbar with button groups">
          <div className="btn-group mr-2" role="group" aria-label="dr_plan_action group">
            <button type="button" className="btn" color="secondary" onClick={this.onCreate}>
              <i className="bx bx-plus" />
              New Plan
            </button>
            <button className="btn" color="secondary" type="button" onClick={this.onDelete}>
              <i className="bx bxs-trash" />
              Remove
            </button>
            <button type="button" className="btn" color="secondary" onClick={() => { this.planAction(startPlan); }}>
              <i className="bx bx-play" />
              Start
            </button>
            <button type="button" className="btn" color="secondary" onClick={() => { this.planAction(stopPlan); }}>
              <i className="bx bx-stop" />
              Stop
            </button>
          </div>
        </div>
      </>
    );
  }
}
const propTypes = {
  dispatch: PropTypes.func.isRequired,
  selectedPlans: PropTypes.any.isRequired,
};
DRPlanActionBar.propTypes = propTypes;
export default DRPlanActionBar;
