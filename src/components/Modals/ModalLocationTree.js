import React, { useEffect, useState } from 'react';
import SimpleBar from 'simplebar-react';
import { withTranslation } from 'react-i18next';
import DMTree from '../Shared/DMTree';
import { closeModal } from '../../store/actions/ModalActions';
import { getComputeResources, valueChange } from '../../store/actions/UserActions';
import { getValue } from '../../utils/InputUtils';

function ModalLocationTree(props) {
  const { dispatch, user, options, fieldKey, t } = props;
  const { values } = user;
  const [original, setOriginal] = useState('');
  useEffect(() => {
    const fieldVal = getValue(fieldKey, values);
    setOriginal(fieldVal);
  }, []);
  const onClose = () => {
    dispatch(valueChange(fieldKey, original));
    dispatch(closeModal());
  };
  const onConfigure = () => {
    dispatch(getComputeResources(fieldKey));
  };
  function renderFooter() {
    return (
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={() => onClose()}>
          {t('title.cancel')}
        </button>
        <button type="button" className="btn btn-success" onClick={() => onConfigure()}>
          {' '}
          {t('title.ok')}
          {' '}
        </button>
      </div>
    );
  }

  return (
    <>
      <SimpleBar style={{ maxHeight: '600px' }}>
        <DMTree dispatch={dispatch} field={options} user={user} fieldKey={fieldKey} />
      </SimpleBar>
      {renderFooter()}
    </>
  );
}

export default (withTranslation()(ModalLocationTree));
