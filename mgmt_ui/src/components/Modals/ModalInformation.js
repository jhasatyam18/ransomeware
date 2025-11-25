import React from 'react';
import { withTranslation } from 'react-i18next';

function InformationModal({ modal, t }) {
  const { options } = modal;
  const { textObject } = options;
  const { reasonTitle, reasonDescription, resolutionStepTitle, resolutionSteps, impactDescription } = textObject;
  if (typeof reasonTitle === 'undefined' || reasonTitle === '' || typeof reasonDescription === 'undefined' || reasonDescription === '' || typeof resolutionStepTitle === 'undefined' || typeof resolutionSteps === 'undefined' || resolutionSteps.length === 0) {
    return null;
  }
  return (
    <>
      <div className="padding-15">
        <h5>{reasonTitle}</h5>
        <p className="margin-bottom-30">{reasonDescription}</p>
        <h5>{resolutionStepTitle}</h5>
        {resolutionSteps.length > 0 ? (
          <ul className="margin-bottom-30">
            {resolutionSteps.map((el) => (
              <li>
                {el}
              </li>
            ))}
          </ul>
        ) : null}
        {impactDescription ? (
          <>
            <h5>
              {t('impact')}
            </h5>
            <p>{impactDescription}</p>
          </>
        ) : null}
      </div>
    </>
  );
}
export default (withTranslation()(InformationModal));
