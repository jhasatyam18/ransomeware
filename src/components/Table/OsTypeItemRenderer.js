import React from 'react';
import 'boxicons';

function OsTypeItemRenderer({ data }) {
  if (data.guestOS.toLowerCase().indexOf('window') !== -1) {
    return (
      <div>
        <i title={data.guestOS} className="fab fa-windows fa-2x" />
      </div>
    );
  }
  if (data.guestOS.toLowerCase().indexOf('centos') !== -1) {
    return (
      <div>
        <i title={data.guestOS} className="fab fa-centos fa-2x" />
      </div>
    );
  }
  if (data.guestOS.toLowerCase().indexOf('red hat') !== -1) {
    return (
      <div>
        <i title={data.guestOS} className="fab fa-redhat fa-2x" />
      </div>
    );
  }
  return (
    <div>
      <i title={data.guestOS} className="fab fa-linux fa-2x" />
    </div>
  );
}

export default OsTypeItemRenderer;
