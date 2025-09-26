import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

/**
 * Generic stepper component
 * @param {Array} steps - list of step objects { label, state, isDisabled }
 * @param {number} currentStep - index of active step
 * @param {function} onStepChange - callback when user clicks a completed step
 */
const Stepper = ({ steps, currentStep, onStepChange }) => {
  const handleStepClick = (step, index) => {
    if (step.state === 'done' && !step.isDisabled) {
      onStepChange(index);
    }
  };

  const renderStep = (step, index) => {
    const isLast = index === steps.length - 1;
    const isActive = currentStep === index;

    let colorClass = 'text-secondary';
    if (isActive) {
      colorClass = 'link_color';
    } else if (step.state === 'done') {
      colorClass = 'text-success';
    }

    return (
      <div
        key={index}
        role="button"
        tabIndex={0}
        className="link-item"
        onClick={() => handleStepClick(step, index)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleStepClick(step, index);
          }
        }}
        style={{ cursor: step.state === 'done' && !step.isDisabled ? 'pointer' : 'default' }}
      >
        <div className={`d-flex ${isLast ? 'upgrade_end_step' : ''}`}>
          <FontAwesomeIcon
            size="xl"
            icon={faCheckCircle}
            className={colorClass}
          />
          {!isLast && (
            <hr
              className={`upgrade_status_line ${
                step.state === 'done' ? 'upgrade_steps_success' : ''
              }`}
            />
          )}
        </div>
        <div
          style={isLast ? { position: 'relative', left: '-20px' } : { position: 'relative', right: '100px' }}
          className={colorClass}
        >
          {step.label}
        </div>
      </div>
    );
  };

  return (
    <div className="w-100 m-auto mb-5">
      <div style={{ paddingLeft: '2%' }} className="d-flex">
        {steps.map((step, index) => renderStep(step, index))}
      </div>
    </div>
  );
};

export default Stepper;
