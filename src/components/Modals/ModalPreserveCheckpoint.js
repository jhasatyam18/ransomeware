import React from 'react';
import { withTranslation } from 'react-i18next';
import { Container } from 'reactstrap';
import { FIELD_TYPE } from '../../constants/FieldsConstant';
import { removeErrorMessage } from '../../store/actions';
import { createPayloadForCheckpoints, updateRecoveryCheckpoint } from '../../store/actions/checkpointActions';
import { closeModal } from '../../store/actions/ModalActions';
import { getValue } from '../../utils/InputUtils';
import { isEmpty, validateField } from '../../utils/validationUtils';
import DMFieldText from '../Shared/DMFieldText';

function ModalPreserveCheckpoint({ dispatch, options, user, t }) {
  const { values } = user;
  const { recoveryCheckpoint } = options;
  const { id, workloadName, creationTime } = recoveryCheckpoint;
  const key = `${id}-checkpoint.preserve`;
  const textField = { label: '', validate: ({ value }) => isEmpty({ value, user }), placeHolderText: 'Reason to preserve snapshot ', type: FIELD_TYPE.TEXT, shouldShow: true, errorMessage: 'Reason to preserve a checkpoint is mandatory', fieldInfo: 'Provide reason to preserve checkpoint' };
  const onClose = () => {
    dispatch(closeModal());
    dispatch(removeErrorMessage(key));
  };

  const onConfigureNode = () => {
    const reason = getValue(key, values);
    const resonToPreserve = validateField(textField, key, reason, dispatch, user);
    if (resonToPreserve) {
      const payload = createPayloadForCheckpoints(recoveryCheckpoint, user);
      dispatch(updateRecoveryCheckpoint(payload));
    }
  };
  const renderReasonDescription = () => {
    let time = creationTime * 1000;
    const d = new Date(time);
    time = `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`;
    return (
      <snap style={{ width: '90%' }}>
        {t('checkpoint.preserve.info', { workloadName, time })}
      </snap>
    );
  };
  const renderFooter = () => (
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={onClose}>
        {t('Close')}
      </button>
      <button type="button" className="btn btn-success" onClick={onConfigureNode}>{t('Preserve')}</button>
    </div>
  );

  return (
    <>
      <Container className="w-100">
        <div className="padding-15">
          {renderReasonDescription()}
        </div>
        <DMFieldText dispatch={dispatch} fieldKey={key} field={textField} user={user} hideLabel />
      </Container>
      {renderFooter()}
    </>
  );
}

export default (withTranslation()(ModalPreserveCheckpoint));
