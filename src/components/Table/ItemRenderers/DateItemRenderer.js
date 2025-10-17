import React from 'react';
import { withTranslation } from 'react-i18next';
import { getItemRendererComponent } from '../../../utils/ComponentFactory';
import { JOB_COMPLETION_STATUS } from '../../../constants/AppStatus';
import { MODAL_PRESERVE_CHECKPOINT } from '../../../constants/Modalconstant';
import { KEY_CONSTANTS } from '../../../constants/UserConstant';
import { openModal } from '../../../store/actions/ModalActions';
import { hasRequestedPrivileges } from '../../../utils/PrivilegeUtils';

function DateItemRenderer({ data, field, dispatch, t, user, options }) {
  if (data && typeof data[field] === 'undefined') {
    return '';
  }
  const fieldArray = ['currentSnapshotTime', 'lastSyncTime'];
  const time = data[field] * 1000;
  const { isPreserveCheckpoint } = data;
  const d = new Date(time);
  let resp = '';
  resp = `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`;

  const onPreserveCheckpoint = () => {
    const checkpoint = { ...data };
    checkpoint.id = checkpoint.recoveryCheckpointID;
    checkpoint.creationTime = checkpoint.recoveryPointTime;
    checkpoint.workloadName = checkpoint.vmName;
    const checkpointOptions = { title: t('checkpoint.preserve.title'), selectedCheckpoints: { [checkpoint.id]: checkpoint }, size: 'lg' };
    dispatch(openModal(MODAL_PRESERVE_CHECKPOINT, checkpointOptions));
  };

  if (fieldArray.includes(field)) {
    if (data.status !== JOB_COMPLETION_STATUS) {
      resp = '-';
    }
  }

  if (data[field] === 0 || (data.isPreserved && field === KEY_CONSTANTS.CHECKPOINT_EXPIRY_TIME)) {
    resp = '-';
  }
  if (field === KEY_CONSTANTS.CHECKPOINT_RECOVERY_POINT_TIME && data.status === JOB_COMPLETION_STATUS && data.recoveryCheckpointID !== '-' && data.recoveryCheckpointID !== '') {
    return (
      <>
        {resp}
        { hasRequestedPrivileges(user, ['checkpoint.edit']) ? (
          <>
            {isPreserveCheckpoint
              ? (
                <small
                  aria-hidden
                  className="checkpoint_preserved_text"
                >
                  ( Preserved )
                </small>
              )
              : (
                <small
                  aria-hidden
                  onClick={onPreserveCheckpoint}
                  className="checkpoint_preserve_text"
                >
                  ( Click To Preserve )

                </small>
              )}
          </>
        ) : null}
      </>
    );
  }
  return (
    <>
      {resp}
      {resp !== '-' && options && Object.keys(options).length > 0 && options?.ItemRenderer ? getItemRendererComponent({ render: options?.ItemRenderer, data, field: options?.field, user, dispatch, options }) : null}
    </>
  );
}

export default (withTranslation()(DateItemRenderer));
