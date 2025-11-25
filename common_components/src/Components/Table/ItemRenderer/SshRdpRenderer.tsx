import React from 'react';
import { JOB_COMPLETION_STATUS } from '../../../Constants/statusConstant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faD, faDownload } from '@fortawesome/free-solid-svg-icons';

interface SshRdpRendererProps {
  data: {
    publicIP?: string;
    privateIP?: string;
    vmName?: string;
    status?: string;
    guestOS?: string;
  };
}

const SshRdpRenderer: React.FC<SshRdpRendererProps> = ({ data }) => {
  let ip: string = '';

  if (data.publicIP && data.publicIP.trim() !== '') {
    ip = data.publicIP;
  } else if (data.privateIP && data.privateIP.trim() !== '') {
    ip = data.privateIP;
  }

  const renderRDP = () => {
    const d = `charset=utf-8,${encodeURIComponent(`full address:s:${ip}`)}`;
    return (
      <div className="row">
        <div className="col-sm-8">{ip}</div>
        <div className="col-sm-4">
          <a download={`${data.vmName || 'default'}.rdp`} href={`data:${d}`} title="Download rdp file.">
            <FontAwesomeIcon size="lg" icon={faDownload} />
          </a>
        </div>
      </div>
    );
  };

  const renderPublicIP = () => <div>{ip}</div>;

  if (data.vmName && data.status === JOB_COMPLETION_STATUS && ip && data.guestOS) {
    if (data.guestOS.toLowerCase().includes('window')) {
      return renderRDP();
    }
    return renderPublicIP();
  }

  return <div>{ip}</div>;
};

export default SshRdpRenderer;
