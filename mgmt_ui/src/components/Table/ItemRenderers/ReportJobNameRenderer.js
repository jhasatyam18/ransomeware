import React from 'react';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ReportJobNameRenderer = ({ data, field }) => {
  const { filePath } = data || {};
  if (!filePath) return <span>-</span>;

  // Remove `/opt/dmservice/public` if present
  const relativePath = filePath.replace(/^\/?opt\/dmservice\/public/, '');
  const downloadURL = `${window.location.protocol}//${window.location.host}${relativePath}`;
  const fileName = relativePath.split('/').pop() || '-';

  // Only show download icon in job modal
  if (field === 'filePath') {
    return (
      <span>
        {data?.isDownloadable ? (
          <a href={downloadURL} download style={{ marginRight: '8px' }} title="Download file">
            <FontAwesomeIcon icon={faDownload} size="sm" className="text-primary" />
          </a>
        ) : (
          <FontAwesomeIcon icon={faDownload} size="sm" style={{ marginRight: '8px' }} className="text-muted" title="File not available for download" />
        )}
        {fileName}
      </span>
    );
  }

  return <span>{fileName}</span>;
};

export default ReportJobNameRenderer;
