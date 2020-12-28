import React from 'react';
import DMWStep from './DMWStep';

const DMWSteps = (props) => {
  const { steps, currentStep } = props;
  return (
    <ul className="step-ul">
      {steps.map((step, index) => (
        <DMWStep label={step.label} isActive={index === currentStep} isCompleted={currentStep > index} />
      ))}
    </ul>
  );
};

export default DMWSteps;
