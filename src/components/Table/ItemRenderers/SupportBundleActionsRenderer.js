import React from 'react';
import { openModal } from '../../../store/actions/ModalActions';
import { deleteSupportBundle } from '../../../store/actions/SupportActions';
import { MODAL_CONFIRMATION_WARNING } from '../../../constants/Modalconstant';

function SupportBundleActionsRenderer({ data, dispatch }) {
  function onDelete() {
    const options = { title: 'Confirmation', confirmAction: deleteSupportBundle, message: `Are you sure want to delete support bundle ${data.name} ?`, id: data.id };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  }

  function renderDownload() {
    const downloadUrl = `${window.location.protocol}//${window.location.host}${data.bundleUrl}`;
    if (data.status === 'failed' || data.status === 'running') {
      return '';
    }
    return (
      <a href={downloadUrl}>
        <i className="fas fa-download fa-lg" />
      </a>
    );
  }

  function renderDelete() {
    if (data.status === 'inprogress') {
      return '';
    }

    return (
      <a href="#" onClick={onDelete} className="text-danger" title="Remove">
        <i className="far fa-trash-alt fa-lg" />
      </a>
    );
  }

  return (
    <div>
      &nbsp;
      &nbsp;
      {renderDelete()}
      &nbsp;
      &nbsp;
      {renderDownload()}
    </div>
  );
}

export default SupportBundleActionsRenderer;
