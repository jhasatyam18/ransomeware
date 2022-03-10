import React from 'react';
import { Badge } from 'reactstrap';
import { MODAL_ALERT_DETAILS } from '../../../constants/Modalconstant';
import { alertSelected, getAlertEvent } from '../../../store/actions/AlertActions';
import { openModal } from '../../../store/actions/ModalActions';

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
    dispatch(getAlertEvent(data.eventID));
    dispatch(openModal(MODAL_ALERT_DETAILS, { title }));
  }
  return (
    <div>
      <a href="#" className="text-white" onClick={onViewDetails}>
        {title}
        &nbsp;&nbsp;
        {data.occurrence > 1 ? (
          <Badge className="font-size-13 badge-soft-info" color="info" pill>
            {data.occurrence}
          </Badge>
        ) : null}
      </a>
    </div>
  );
}

export default ViewAlertInfoItemRenderer;
