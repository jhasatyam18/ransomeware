import 'boxicons';
import React from 'react';

function OsTypeItemRenderer({ data, className }) {
  const clsName = typeof className !== 'undefined' ? className : '';
  if (data.guestOS.toLowerCase().indexOf('window') !== -1) {
    return (
      <div>
        <i title={data.guestOS} className={`fab fa-windows ${clsName}`} />
      </div>
    );
  }
  if (data.guestOS.toLowerCase().indexOf('ubuntu') !== -1) {
    return (
      <div>
        <i title={data.guestOS} className={`fab fa-ubuntu ${clsName}`} />
      </div>
    );
  }
  if (data.guestOS.toLowerCase().indexOf('centos') !== -1) {
    return (
      <div>
        <i title={data.guestOS} className={`fab fa-centos ${clsName}`} />
      </div>
    );
  }
  if (data.guestOS.toLowerCase().indexOf('red hat') !== -1 || data.guestOS.toLowerCase().indexOf('rhel') !== -1) {
    return (
      <div>
        <i title={data.guestOS} className={`fab fa-redhat ${clsName}`} />
      </div>
    );
  }
  if (data.guestOS.toLowerCase().indexOf('suse') !== -1) {
    return (
      <div>
        <i title={data.guestOS} className={`fab fa-suse ${clsName}`} />
      </div>
    );
  }
  if (data.guestOS.toLowerCase().indexOf('oracle') !== -1 || data.guestOS.toLowerCase().indexOf('debian') !== -1) {
    return (
      <div>
        <i title={data.guestOS} className={`fab fa-linux ${clsName}`} />
      </div>
    );
  }
  return (
    <div>
      -
    </div>
  );
}

export default OsTypeItemRenderer;
