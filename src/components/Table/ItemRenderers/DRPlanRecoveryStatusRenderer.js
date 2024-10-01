import React from 'react';
import { Badge } from 'reactstrap';

export const DrPlanRecoveryStatusRenderer = ({ data }) => {
  let { recoveryStatus, reverseStatus } = data;

  if (recoveryStatus) {
    recoveryStatus = recoveryStatus.charAt(0).toUpperCase() + recoveryStatus.slice(1);
    return (
      <Badge id={`status-${data.name}-${data.id}`} className="mr-1 font-size-13 badge-soft-success" color="success" pill>
        {recoveryStatus}
      </Badge>
    );
  }
  if (reverseStatus) {
    reverseStatus = reverseStatus.charAt(0).toUpperCase() + reverseStatus.slice(1);
    return (
      <Badge id={`status-${data.name}-${data.id}`} className="font-size-13 badge-soft-info" color="info" pill>
        {reverseStatus}
      </Badge>
    );
  }
  return '-';
};
