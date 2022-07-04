import React from 'react';
import { JOB_COMPLETION_STATUS } from '../../../constants/AppStatus';

function SshRdpRenderer({ data }) {
  function renderRDP() {
    const d = `charset=utf-8,${encodeURIComponent(`full address:s:${data.publicIP}`)}`;
    return (
      <div className="row">
        <div className="col-sm-8">
          {data.publicIP}
        </div>
        <div className="col-sm-4">
          <a download={`${data.vmName}.rdp`} href={`data:${d}`} title="Download rdp file.">
            <i className="fa fa-download" />
          </a>
        </div>
      </div>
    );
  }

  function renderPublicIP() {
    return (
      <div>
        {data.publicIP}
      </div>
    );
  }

  if (data && data.vmName && data.status === JOB_COMPLETION_STATUS && data.publicIP && data.guestOS) {
    if (data.guestOS.toLowerCase().indexOf('window') !== -1) {
      return renderRDP();
    }
    return renderPublicIP();
  }
  const ip = (typeof data.publicIP !== 'undefined' ? data.publicIP : '-');
  return (
    <div>
      {ip}
    </div>
  );
}

export default SshRdpRenderer;
