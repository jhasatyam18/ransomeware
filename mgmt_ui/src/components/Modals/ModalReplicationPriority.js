import React from 'react';
import SimpleBar from 'simplebar-react';
import { STATIC_KEYS } from '../../constants/InputConstants';
import { REPLICATION_PRIOPITY } from '../../constants/TableConstants';
import DMTable from '../Table/DMTable';
import { getValue } from '../../utils/InputUtils';
import { closeModal } from '../../store/actions/ModalActions';

function ModalReplicationPriority(props) {
  const { dispatch, user } = props;
  const { values } = user;
  const selectedVMs = getValue(STATIC_KEYS.UI_SITE_SELECTED_VMS, values);
  const vm = Object.values(selectedVMs);
  if (!selectedVMs) {
    return null;
  }
  const onClose = () => {
    dispatch(closeModal());
  };
  const renderFooter = () => (
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" onClick={onClose}>Close </button>
    </div>
  );

  const render = () => (
    <DMTable
      dispatch={dispatch}
      columns={REPLICATION_PRIOPITY}
      data={vm}
      selectedData={vm}
      user={user}
    />
  );
  return (
    <>
      <SimpleBar className="max-h-400">
        { render()}
      </SimpleBar>
      {renderFooter()}
    </>
  );
}

export default ModalReplicationPriority;
