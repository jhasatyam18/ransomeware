import 'boxicons';
import React from 'react';
import { MODAL_SHOW_ENCRYPTION_KEY } from '../../../constants/Modalconstant';
import { clearValues } from '../../../store/actions';
import { openModal } from '../../../store/actions/ModalActions';

function NodeActionItemRenderer({ data, dispatch }) {
  function showKey() {
    dispatch(clearValues());
    const options = { title: 'View encryption key', data };
    dispatch(openModal(MODAL_SHOW_ENCRYPTION_KEY, options));
  }

  return (
    <a title="View Encryption Key" href="#" onClick={showKey}>
      <i className="far fa-eye" />
      {' '}
    </a>
  );
}

export default NodeActionItemRenderer;
