import React from 'react';
import { openModal } from '../../../store/actions/ModalActions';
import { deleteScript } from '../../../store/actions';
import { hasRequestedPrivileges } from '../../../utils/PrivilegeUtils';
import { MODAL_CONFIRMATION_WARNING, MODAL_USER_SCRIPT } from '../../../constants/Modalconstant';

export default function ScriptItemRenderer({ data, dispatch, user }) {
  const hasPrivilege = hasRequestedPrivileges(user, ['script.create', 'script.delete']);
  if (!data || !hasPrivilege) {
    return '-';
  }
  const onDelete = () => {
    const options = { title: 'Confirmation', confirmAction: deleteScript, message: `Are you sure want to delete script ${data.name} ?`, id: data.ID };
    dispatch(openModal(MODAL_CONFIRMATION_WARNING, options));
  };

  const onEdit = () => {
    const options = { title: 'Script', data };
    dispatch(openModal(MODAL_USER_SCRIPT, options));
  };

  return (
    <div>
      &nbsp;
      &nbsp;
      <a href="#" onClick={onEdit} className="text-info" title="Update">
        <i className="fa fa-edit" />
      </a>
      &nbsp;
      &nbsp;
      <a href="#" onClick={onDelete} className="text-danger" title="Remove">
        <i className="far fa-trash-alt" />
      </a>
    </div>
  );
}
