import React from 'react';
import { JOB_COMPLETION_STATUS } from '../../../constants/AppStatus';

function SshRdpRenderer({ data }) {
  let ip = '';
  if (typeof data.publicIP !== 'undefined' && data.publicIP !== '') {
    ip = data.publicIP;
  } else if (typeof data.privateIP !== 'undefined' && data.privateIP !== '') {
    ip = data.privateIP;
  }
  function renderRDP() {
    const d = `charset=utf-8,${encodeURIComponent(`full address:s:${ip}`)}`;
    return (
      <div className="row">
        <div className="col-sm-8">
          {ip}
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
        {ip}
      </div>
    );
  }

  if (data && data.vmName && data.status === JOB_COMPLETION_STATUS && ip && data.guestOS) {
    if (data.guestOS.toLowerCase().indexOf('window') !== -1) {
      return renderRDP();
    }
    return renderPublicIP();
  }

  return (
    <div>
      {ip}
    </div>
  );
}

export default SshRdpRenderer;
