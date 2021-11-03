import React from 'react';
import { Badge } from 'reactstrap';

export default function LicenseStatusItemRender({ data, field }) {
  if (!data) {
    return '-';
  }

  if (data.isExpired) {
    return (
      <div>
        <Badge className="font-size-13 badge-soft-danger" color="danger" pill>
          License Expired
        </Badge>
      </div>
    );
  }

  if (data[field] === true) {
    return (
      <div>
        <Badge className="font-size-13 badge-soft-success" color="success" pill>
          Active
        </Badge>
      </div>
    );
  }

  return (
    <div>
      <Badge className="font-size-13 badge-soft-danger" color="success" pill>
        Deactivate
      </Badge>
    </div>
  );
}
