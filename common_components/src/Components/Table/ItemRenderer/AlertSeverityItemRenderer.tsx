import React from 'react';
import { Badge } from 'reactstrap';

type Props = {
  data: Record<string, any> | null;
  field: string;
};

const AlertSeverityItemRenderer: React.FC<Props> = ({ data, field }) => {
  if (!data) {
    return <span>-</span>;
  }

  let status: string | undefined = data[field];

  if (!status) {
    return <span>-</span>;
  }

  status = status.toUpperCase();
  let cssName = '';
  let color: 'info' | 'warning' | 'danger' = 'info';

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
};

export default AlertSeverityItemRenderer;
