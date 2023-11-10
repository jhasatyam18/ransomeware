import React from 'react';
import { PLATFORM_TYPES } from '../../constants/InputConstants';
import { getValue } from '../../utils/InputUtils';
import { MODAL_REPLICATION_PRIORITY } from '../../constants/Modalconstant';
import { openModal } from '../../store/actions/ModalActions';
import WizardStep from './WizardStep';

function ReplicationConfigurationStep(props) {
  const { fields, dispatch, user } = props;
  const { values } = user;
  const recoveryPlatform = getValue('ui.values.recoveryPlatform', values) || '';
  const onAdvanceClick = () => {
    const options = { title: 'Configure Replication Priority', size: 'lg' };
    dispatch(openModal(MODAL_REPLICATION_PRIORITY, options));
  };

  return (
    <>
      <WizardStep {...props} fields={fields} />
      {recoveryPlatform === PLATFORM_TYPES.AWS
        ? <a style={{ paddingLeft: '20px' }} href="#" onClick={onAdvanceClick}>Advance Configuration</a> : null}
    </>
  );
}

export default ReplicationConfigurationStep;
