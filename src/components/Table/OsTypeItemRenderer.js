import React from 'react';
import 'boxicons';

function OsTypeItemRenderer({ data }) {
  if (data.guestOS.toLowerCase().indexOf('window') !== -1) {
    return (
      <div>
        <i title={data.guestOS} className="fab fa-windows" />
      </div>
    );
  }
  if (data.guestOS.toLowerCase().indexOf('centos') !== -1) {
    return (
      <div>
        <i title={data.guestOS} className="fab fa-centos" />
      </div>
    );
  }
  if (data.guestOS.toLowerCase().indexOf('red hat') !== -1) {
    return (
      <div>
        <i title={data.guestOS} className="fab fa-redhat" />
      </div>
    );
  }
  return (
    <div>
      <i title={data.guestOS} className="fab fa-linux" />
    </div>
  );
}

export default OsTypeItemRenderer;
