import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Row, Col } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { closeWizard } from '../../store/actions/WizardActions';
import { clearValues } from '../../store/actions';
import { DRPLAN_PROTECT_STEP, DRPLAN_RECOVERY_STEP, PROTECTION_PLAN_SUMMARY_STEP, RECOVERY_PROTECT_VM_STEP, RECOVERY_SUMMARY, MIGRATION_GENERAL_STEP, DRPLAN_VM_CONFIG_STEP, WIZARD_STEP, RECOVERY_GENERAL_STEP, REVERSE_CONFIG_STEP, REVERSE_SUMMARY, RECOVERY_CONFIG, DRPLAN_BOOT_ORDER_STEP, DRPLAN_SCRIPT_STEP, TEST_RECOVERY_CONFIG_STEP, TEST_RECOVERY_CONFIG_SCRIPTS } from '../../constants/WizardConstants';
import Pages404 from '../../pages/Page-404';
import DRPlanRecoveryConfigStep from './DRPlanRecoveryConfigStep';
import DRPlanProtectVMStep from './DRPlanProtectVMStep';
import DMWSteps from './DNWizardSteps';
import RecoveryMachines from './RecoveryMachines';
import RecoverySummary from './RecoverySummary';
import ProtectionPlanSummaryStep from './ProtectionPlanSummaryStep';
import MigrationGeneralStep from './MigrationGeneralStep';
import VMConfigurationStep from './VMConfigurationStep';
import WizardStep from './WizardStep';
import RecoveryGeneralStep from './RecoveryGeneralStep';
import ReversePlanConfigStep from './ReversePlanConfigStep';
import ReversePlanSummary from './ReversePlanSummary';
import RecoveryConfig from './RecoveryConfig';
import DRPlanBootOrderStep from './DRPlanBootOrderStep';
import DRPlanScriptStep from './DRPlanScriptStep';
import TestRecoveryVMConfiguration from './Step/TestRecoveryVMConfiguration';
import TestRecoveryScriptStep from './Step/TestRecoveryScriptStep';

class DMWizard extends React.Component {
  constructor() {
    super();
    this.state = { currentStep: 0, wizardSize: 'xl' };
    this.onClose = this.onClose.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onBack = this.onBack.bind(this);
    this.onToggle = this.onToggle.bind(this);
    this.onFinish = this.onFinish.bind(this);
  }

  onNext() {
    const { wizard, user, dispatch } = this.props;
    const { steps } = wizard;
    const { currentStep } = this.state;
    if (!(currentStep >= steps.length - 1)) {
      const { validate, isAync, postAction } = steps[currentStep];
      const isValidated = validate(user, dispatch, steps[currentStep].fields);
      if (isAync) {
        isValidated.then((response) => {
          if (response) {
            if (typeof postAction !== 'undefined') {
              dispatch(postAction());
            }
            this.setNextStep();
          }
        });
      }
      if (isValidated && typeof isAync === 'undefined') {
        if (typeof postAction !== 'undefined') {
          dispatch(postAction());
        }
        this.setNextStep();
      }
    }
  }

  onBack() {
    const { currentStep } = this.state;
    if (!(currentStep <= 0)) {
      this.setState({ currentStep: currentStep - 1 });
    }
  }

  onFinish() {
    const { wizard, user, dispatch } = this.props;
    const { steps, options } = wizard;
    const { onFinish } = options;
    const { currentStep } = this.state;
    const { validate } = steps[currentStep];
    if (validate(user, dispatch, steps[currentStep].fields)) {
      dispatch(onFinish());
    }
  }

  onClose() {
    const { dispatch } = this.props;
    dispatch(closeWizard());
    dispatch(clearValues());
  }

  onToggle() {
    const { wizardSize, currentStep } = this.state;
    this.setState({ currentStep, wizardSize: (wizardSize === 'lg' ? 'xl' : 'lg') });
  }

  setNextStep() {
    const { currentStep } = this.state;
    this.setState({ currentStep: currentStep + 1 });
  }

  getStep(name) {
    const { wizard } = this.props;
    const { steps } = wizard;
    const { currentStep } = this.state;
    switch (name) {
      case DRPLAN_RECOVERY_STEP:
        return <DRPlanRecoveryConfigStep {...this.props} />;
      case DRPLAN_PROTECT_STEP:
        return <DRPlanProtectVMStep {...this.props} />;
      case RECOVERY_PROTECT_VM_STEP:
        return <RecoveryMachines {...this.props} />;
      case RECOVERY_SUMMARY:
        return <RecoverySummary {...this.props} />;
      case PROTECTION_PLAN_SUMMARY_STEP:
        return <ProtectionPlanSummaryStep {...this.props} />;
      case MIGRATION_GENERAL_STEP:
        return <MigrationGeneralStep {...this.props} />;
      case DRPLAN_VM_CONFIG_STEP:
        return <VMConfigurationStep {...this.props} />;
      case WIZARD_STEP:
        return <WizardStep {...this.props} fields={steps[currentStep].fields} />;
      case RECOVERY_GENERAL_STEP:
        return <RecoveryGeneralStep {...this.props} />;
      case REVERSE_CONFIG_STEP:
        return <ReversePlanConfigStep {...this.props} />;
      case REVERSE_SUMMARY:
        return <ReversePlanSummary {...this.props} />;
      case RECOVERY_CONFIG:
        return <RecoveryConfig {...this.props} />;
      case DRPLAN_BOOT_ORDER_STEP:
        return <DRPlanBootOrderStep {...this.props} />;
      case DRPLAN_SCRIPT_STEP:
        return <DRPlanScriptStep {...this.props} />;
      case TEST_RECOVERY_CONFIG_STEP:
        return <TestRecoveryVMConfiguration />;
      case TEST_RECOVERY_CONFIG_SCRIPTS:
        return <TestRecoveryScriptStep />;
      default:
        return <Pages404 />;
    }
  }

  renderFooter() {
    const { currentStep } = this.state;
    const { wizard } = this.props;
    const { steps } = wizard;
    const nextLabel = (currentStep === steps.length - 1 ? 'Finish' : 'Next');
    const nextCss = (nextLabel === 'Finish' ? 'btn-success' : 'btn-secondary');
    return (
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={this.onBack}>Back </button>
        <button type="button" className={`btn ${nextCss}`} onClick={(nextLabel === 'Next' ? this.onNext : this.onFinish)}>
          { nextLabel }
        </button>
      </div>
    );
  }

  render() {
    const { wizard } = this.props;
    const { show, options, steps } = wizard;
    const { currentStep, wizardSize } = this.state;
    if (!show) {
      return false;
    }
    const { title } = options;
    return (
      <>
        <Modal centered size={wizardSize} isOpen={show}>
          <div className="modal-header">
            <h5 className="modal-title mt-0" id="dmwizard">
              {title}
            </h5>
            <div className="wizard-header-options">
              <div className="wizard-header-div">
                <box-icon name="windows" color="white" onClick={this.onToggle} style={{ width: 20 }} />
              </div>
              <div className="wizard-header-div">
                <box-icon name="x-circle" type="solid" color="white" onClick={this.onClose} style={{ width: 20 }} />
              </div>
            </div>
          </div>
          <div className="modal-body noPadding">
            <Row style={{ margin: 0 }}>
              <Col sm={3} style={{ backgroundColor: '#333a4a' }}>
                <DMWSteps steps={steps} currentStep={currentStep} />
              </Col>
              <Col sm={9}>
                <SimpleBar style={{ minHeight: '65vh', maxHeight: '65vh' }}>
                  {this.getStep(steps[currentStep].component)}
                </SimpleBar>
              </Col>
            </Row>
          </div>
          {this.renderFooter()}
        </Modal>
      </>
    );
  }
}
const propTypes = {
  dispatch: PropTypes.func.isRequired,
  wizard: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
};
DMWizard.propTypes = propTypes;
export default DMWizard;
