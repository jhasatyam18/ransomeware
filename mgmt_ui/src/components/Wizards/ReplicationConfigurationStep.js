import React from 'react';
import { withTranslation } from 'react-i18next';
import ReplicationAdvancedConfig from './ReplicationAdvancedConfig';
import WizardStep from './WizardStep';

function ReplicationConfigurationStep(props) {
  const { fields } = props;

  return (
    <>
      <WizardStep {...props} fields={fields} />
      <ReplicationAdvancedConfig {...props} fields={fields} />
    </>
  );
}

export default (withTranslation()(ReplicationConfigurationStep));
