import React from 'react';
import { Badge } from 'reactstrap';

function RecoveryStatusItemRenderer({ data }) {
  if (!data) {
    return '-';
  }
  function renderDeleted() {
    if (data.isDeleted === true) {
      return (
        <div>
          <Badge className="font-size-13 badge-soft-danger" color="danger" pill>
            Deleted From Source
          </Badge>
        </div>
      );
    }
    return null;
  }

  function renderStatus() {
    if (typeof data.recoveryStatus === 'undefined') {
      return null;
    }
    return (
      <div>
        <Badge className="font-size-13 badge-soft-success" color="success" pill>
          {data.recoveryStatus}
        </Badge>
      </div>
    );
  }

  return (
    <>
      { renderDeleted() }
      { renderStatus() }
    </>
  );
}

export default RecoveryStatusItemRenderer;
