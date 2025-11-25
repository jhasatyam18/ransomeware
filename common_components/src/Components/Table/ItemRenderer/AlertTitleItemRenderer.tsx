import React from 'react';
import { Badge } from 'reactstrap';

type ViewAlertInfoItemRendererProps = {
  data: {
    [key: string]: any;
    eventID: string;
    occurrence: number;
  } | null;
  field: string;
};

const AlertTitleItemRenderer: React.FC<ViewAlertInfoItemRendererProps> = ({ data, field }) => {
  if (!data) {
    return <span>-</span>;
  }

  const title: string = data[field];
  if (!title) {
    return <span>-</span>;
  }

//   const onViewDetails = () => {
//     dispatch(alertSelected(data));
//     dispatch(getAlertEvent(data.eventID));
//     dispatch(openModal(MODAL_ALERT_DETAILS, { title }));
//   };

  return (
    <div>
      <p className="text-white">
        {title}
        &nbsp;&nbsp;
        {data.occurrence > 1 && (
          <Badge className="font-size-13 badge-soft-info" color="info" pill>
            {data.occurrence}
          </Badge>
        )}
      </p>
    </div>
  );
};

export default AlertTitleItemRenderer;
