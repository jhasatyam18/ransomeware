import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Row, Col } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { closeWizard } from '../../store/actions/WizardActions';
import { clearValues } from '../../store/actions';
import { DRPLAN_GENERAL_SETTINGS_STEP, DRPLAN_PROTECT_STEP, DRPLAN_RECOVERY_STEP } from '../../constants/WizardConstants';
import Pages404 from '../../pages/Page-404';
import DRPlanRecoveryConfigStep from './DRPlanRecoveryConfigStep';
import DRPlanProtectVMStep from './DRPlanProtectVMStep';
import DRPlanGeneralSettingsStep from './DRPlanGeneralSettingsStep';
import DMWSteps from './DNWizardSteps';

class DMWizard extends React.Component {
  constructor() {
    super();
    this.state = { currentStep: 0, wizardSize: 'lg' };
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
      const { validate } = steps[currentStep];
      if (validate(user, dispatch, steps[currentStep].fields)) {
        this.setState({ currentStep: currentStep + 1 });
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
    this.setState({ currentStep, wizardSize: (wizardSize === 'xl' ? 'lg' : 'xl') });
  }

  getStep(name) {
    switch (name) {
      case DRPLAN_GENERAL_SETTINGS_STEP:
        return <DRPlanGeneralSettingsStep {...this.props} />;
      case DRPLAN_RECOVERY_STEP:
        return <DRPlanRecoveryConfigStep {...this.props} />;
      case DRPLAN_PROTECT_STEP:
        return <DRPlanProtectVMStep {...this.props} />;
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
                <SimpleBar style={{ minHeight: 400, maxHeight: 400 }}>
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
