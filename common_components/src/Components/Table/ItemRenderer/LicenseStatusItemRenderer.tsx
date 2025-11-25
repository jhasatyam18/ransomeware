import React from 'react';
import { Badge } from 'reactstrap';

interface LicenseStatusItemRendererProps {
  field: string;
  data: Record<string, any> | null;
}

const LicenseStatusItemRenderer: React.FC<LicenseStatusItemRendererProps> = ({ data, field }) => {
  if (!data) {
    return <span>-</span>; // ✅ Must return JSX, not plain string
  }

  if (data.isExpired) {
    return (
      <Badge className="font-size-13 badge-soft-danger" color="danger" pill>
        License Expired
      </Badge>
    );
  }

  if (data[field] === true) {
    return (
      <Badge className="font-size-13 badge-soft-success" color="success" pill>
        Active
      </Badge>
    );
  }

  return (
    <Badge className="font-size-13 badge-soft-danger" color="danger" pill>
      Deactivated
    </Badge>
  );
};

export default LicenseStatusItemRenderer;
