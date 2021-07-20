import React from 'react';
import { openModal } from '../../store/actions/ModalActions';
import { deleteSupportBundle } from '../../store/actions/SupportActions';
import { MODAL_CONFIRMATION_WARNING } from '../../constants/Modalconstant';

function SupportBundleActionsRenderer({ data, dispatch }) {
  function onDelete() {
    const options = { title: 'Confirmation', confirmAction: deleteSupportBundle, message: `Are you sure want to delete support bundle ${data.name} ?`, id: data.id };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  }

  function renderDownload() {
    const downloadUrl = `${window.location.protocol}//${window.location.host}${data.bundleUrl}`;
    if (data.status !== 'completed') {
      return '';
    }
    return (
      <a href={downloadUrl}>
        <box-icon name="download" type="solid" color="#556ee6" />
      </a>
    );
  }

  function renderDelete() {
    if (data.status === 'inprogress') {
      return '';
    }
    return (
      <box-icon type="solid" color="#f46a6a" name="trash" onClick={onDelete} />
    );
  }

  return (
    <div>
      {renderDownload()}
      &nbsp;
      &nbsp;
      {renderDelete()}
    </div>
  );
}

export default SupportBundleActionsRenderer;
