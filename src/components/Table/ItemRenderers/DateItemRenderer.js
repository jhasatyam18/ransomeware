import 'boxicons';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { JOB_COMPLETION_STATUS } from '../../../constants/AppStatus';
import { MODAL_PRESERVE_CHECKPOINT } from '../../../constants/Modalconstant';
import { KEY_CONSTANTS } from '../../../constants/UserConstant';
import { openModal } from '../../../store/actions/ModalActions';

function DateItemRenderer({ data, field, dispatch, t }) {
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
    const options = { title: t('checkpoint.preserve.title'), selectedCheckpoints: { [checkpoint.id]: checkpoint }, size: 'lg' };
    dispatch(openModal(MODAL_PRESERVE_CHECKPOINT, options));
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
        { isPreserveCheckpoint
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
    );
  }
  return (
    <>
      {resp}
    </>
  );
}

export default (withTranslation()(DateItemRenderer));
