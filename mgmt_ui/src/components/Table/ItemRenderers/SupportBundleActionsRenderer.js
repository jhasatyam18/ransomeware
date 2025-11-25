import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { openModal } from '../../../store/actions/ModalActions';
import { JOB_IN_PROGRESS, JOB_FAILED } from '../../../constants/AppStatus';
import { deleteSupportBundle } from '../../../store/actions/SupportActions';
import { MODAL_CONFIRMATION_WARNING } from '../../../constants/Modalconstant';
import { hasRequestedPrivileges } from '../../../utils/PrivilegeUtils';

function SupportBundleActionsRenderer({ data, dispatch, user }) {
  function onDelete() {
    const options = { title: 'Confirmation', confirmAction: deleteSupportBundle, message: `Are you sure you want to delete support bundle ${data.name} ?`, id: data.id };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  }

  function renderDownload() {
    const downloadUrl = `${window.location.protocol}//${window.location.host}/mgmt${data.bundleUrl}`;
    if (data.status === JOB_FAILED || data.status === JOB_IN_PROGRESS) {
      return '';
    }
    return (
      <a href={downloadUrl}>
        <i className="fas fa-download text-info fa-lg" />
      </a>
    );
  }

  function renderDelete() {
    const disabled = !hasRequestedPrivileges(user, ['support.delete']);
    if (data.status === 'inprogress') {
      return '';
    }

    return (
      <a href="#" onClick={onDelete} className={`${disabled ? 'disabled' : ''}`} title="Remove">
        <i className="far fa-trash-alt fa-lg text-danger " />
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

function mapStateToProps(state) {
  const { user } = state;
  return { user };
}
export default connect(mapStateToProps)(withTranslation()(SupportBundleActionsRenderer));
