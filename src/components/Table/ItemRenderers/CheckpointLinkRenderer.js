import React from 'react';
import { withTranslation } from 'react-i18next';
import { RECOVERY_CHECKPOINT_TYPE } from '../../../constants/InputConstants';
import { changeCheckpointType } from '../../../store/actions/checkpointActions';
import { valueChange } from '../../../store/actions';
import { STORE_KEYS } from '../../../constants/StoreKeyConstants';
import { JOB_FAILED, RECOVERY_CHECKPOINT_JOB_CREATE } from '../../../constants/AppStatus';

function CheckpoinLinkRenderer({ data, dispatch, t }) {
  const { jobType } = data;
  const onCheckpointLinkClick = () => {
    dispatch(valueChange(STORE_KEYS.DRPLAN_DETAILS_ACTIVE_TAB, '5'));
    dispatch(changeCheckpointType(RECOVERY_CHECKPOINT_TYPE.VM));
    dispatch(valueChange(STORE_KEYS.RECOVERY_CHECKPOINT_JOB_LINK_INSTANCE, data));
  };

  if (data.status === JOB_FAILED) {
    return '-';
  }

  if (jobType === RECOVERY_CHECKPOINT_JOB_CREATE) {
    return (
      <a href="#" onClick={() => onCheckpointLinkClick()}>
        {t('title.go.to.checkpoint')}
      </a>
    );
  }
  return '-';
}

export default (withTranslation()(CheckpoinLinkRenderer));
