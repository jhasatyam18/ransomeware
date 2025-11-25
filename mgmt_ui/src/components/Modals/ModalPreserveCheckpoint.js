import React from 'react';
import { withTranslation } from 'react-i18next';
import { Container } from 'reactstrap';
import SimpleBar from 'simplebar-react';
import { FIELD_TYPE } from '../../constants/FieldsConstant';
import { removeErrorMessage } from '../../store/actions';
import { createPayloadForCheckpoints, PreserveCheckpointError, updateRecoveryCheckpoint, validatedCheckpointDescription } from '../../store/actions/checkpointActions';
import { closeModal } from '../../store/actions/ModalActions';
import { getValue } from '../../utils/InputUtils';
import { validateField } from '../../utils/validationUtils';
import DMFieldText from '../Shared/DMFieldText';

function ModalPreserveCheckpoint({ dispatch, options, user, t }) {
  const { values } = user;
  const { selectedCheckpoints } = options;
  const selectedCheckpointsKey = Object.keys(selectedCheckpoints);
  const textData = [];
  selectedCheckpointsKey.forEach((element) => {
    const { creationTime, workloadName } = selectedCheckpoints[element];
    let time = creationTime * 1000;
    const d = new Date(time);
    time = `${d.toLocaleDateString()}-${d.toLocaleTimeString()}`;
    const text = `${workloadName} created at ${time}`;
    textData.push(text);
  });
  const key = 'checkpoint.preserve';
  const textField = { label: '', validate: ({ value }) => validatedCheckpointDescription({ value, user }), errorFunction: ({ fieldKey }) => PreserveCheckpointError({ user, fieldKey }), placeHolderText: 'Reason to preserve snapshot ', type: FIELD_TYPE.TEXT, shouldShow: true, errorMessage: 'Reason to preserve a checkpoint is mandatory', fieldInfo: 'Provide reason to preserve checkpoint' };
  const onClose = () => {
    dispatch(closeModal());
    dispatch(removeErrorMessage(key));
  };

  const onConfigureNode = () => {
    const reason = getValue(key, values);
    const resonToPreserve = validateField(textField, key, reason, dispatch, user);
    if (resonToPreserve) {
      const payload = createPayloadForCheckpoints(selectedCheckpoints, user);
      dispatch(updateRecoveryCheckpoint(payload));
    }
  };
  const renderReasonDescription = () => (
    <>
      <snap style={{ width: '90%' }}>
        {t('checkpoint.preserve.info')}
      </snap>
      <ul>
        {textData.map((da) => (
          <li>
            {da}
          </li>
        ))}
      </ul>
    </>
  );
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
      <SimpleBar style={{ maxHeight: '55vh', minHeight: '10vh' }}>
        <Container className="w-100">
          <div className="padding-top-15 padding-left-15">
            {renderReasonDescription()}
          </div>
          <DMFieldText dispatch={dispatch} fieldKey="checkpoint.preserve" field={textField} user={user} hideLabel />
        </Container>
      </SimpleBar>
      {renderFooter()}
    </>
  );
}

export default (withTranslation()(ModalPreserveCheckpoint));
