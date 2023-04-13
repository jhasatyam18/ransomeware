import React from 'react';
import { MODAL_SUMMARY } from '../../../constants/Modalconstant';
import { openModal } from '../../../store/actions/ModalActions';
import { getRecoveryInfoForVM } from '../../../utils/RecoveryUtils';

function RecoveryConfigurationSummary(props) {
  const { data, user, dispatch } = props;
  const parsedConfiguration = JSON.parse(data.config);
  const { values } = user;
  const COPY_CONFIG = [{ value: 'copy_gen_config', label: 'General' },
    { value: 'copy_net_config', label: 'Network' },
    { value: 'copy_rep_script_config', label: 'Replication Scripts' },
    { value: 'copy_rec_script_config', label: 'Recovery Scripts' }];
  const configData = getRecoveryInfoForVM({ user, configToCopy: COPY_CONFIG, recoveryConfig: parsedConfiguration, values });
  const options = { title: 'Recovery Configuration', data: configData, css: 'modal-lg', showSummary: true };

  const onClick = () => {
    dispatch(openModal(MODAL_SUMMARY, options));
  };
  return (
    <>
      <i className="fas fa-info-circle info__icon" aria-hidden="true" color="white" onClick={onClick} style={{ height: 20, cursor: 'pointer' }} />
    </>
  );
}

export default RecoveryConfigurationSummary;
