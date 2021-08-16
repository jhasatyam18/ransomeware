import React from 'react';
import { Badge } from 'reactstrap';

function EventLevelItemRenderer({ data, field }) {
  if (!data) {
    return '-';
  }
  let status = data[field];
  if (!status) {
    return '-';
  }
  status = status.toUpperCase();
  let cssName = '';
  let color = 'info';
  if (status === 'INFO') {
    cssName = 'font-size-13 badge-soft-info';
  } else if (status === 'WARNING') {
    cssName = 'font-size-13 badge-soft-warning';
    color = 'warning';
  } else {
    cssName = 'font-size-13 badge-soft-danger';
    color = 'danger';
  }
  return (
    <div>
      <Badge className={cssName} color={color} pill>
        &nbsp;&nbsp;
        {status}
        &nbsp;&nbsp;
      </Badge>
    </div>
  );
}

export default EventLevelItemRenderer;
