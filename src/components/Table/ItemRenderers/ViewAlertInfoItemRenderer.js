import React from 'react';
import { openModal } from '../../../store/actions/ModalActions';
import { alertSelected, getAlertEvent, markAsRead } from '../../../store/actions/AlertActions';
import { MODAL_ALERT_DETAILS } from '../../../constants/Modalconstant';

function ViewAlertInfoItemRenderer({ data, field, dispatch }) {
  if (!data) {
    return '-';
  }
  const title = data[field];
  if (!title) {
    return '-';
  }
  function onViewDetails() {
    dispatch(alertSelected(data));
    dispatch(getAlertEvent(data.id));
    if (data.isRead === false) {
      dispatch(markAsRead(data.id));
    }
    dispatch(openModal(MODAL_ALERT_DETAILS, { title }));
  }
  return (
    <div>
      <button type="button" className="btn btn-link" onClick={onViewDetails}>{title}</button>
    </div>
  );
}

export default ViewAlertInfoItemRenderer;
