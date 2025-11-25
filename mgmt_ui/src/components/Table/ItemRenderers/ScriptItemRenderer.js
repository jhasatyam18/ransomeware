import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { MODAL_CONFIRMATION_WARNING, MODAL_USER_SCRIPT } from '../../../constants/Modalconstant';
import { deleteScript } from '../../../store/actions';
import { openModal } from '../../../store/actions/ModalActions';
import { hasRequestedPrivileges } from '../../../utils/PrivilegeUtils';

export default function ScriptItemRenderer({ data, dispatch, user }) {
  const hasPrivilege = hasRequestedPrivileges(user, ['script.create', 'script.delete']);
  if (!data || !hasPrivilege) {
    return '-';
  }
  const onDelete = () => {
    const options = { title: 'Confirmation', confirmAction: deleteScript, message: `Are you sure you want to delete script ${data.name} ?`, id: data.ID };
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
        <FontAwesomeIcon size="sm" icon={faEdit} />
      </a>
      &nbsp;
      &nbsp;
      <a href="#" onClick={onDelete} className="text-danger" title="Remove">
        <FontAwesomeIcon size="sm" icon={faTrash} />
      </a>
    </div>
  );
}
