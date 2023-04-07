import React, { useEffect, useState } from 'react';
import DMProgressBar from './DMProgressBar';
import { JOB_RUNNING_STATUS, JOB_IN_PROGRESS, PARTIALLY_COMPLETED } from '../../../constants/AppStatus';

function TransferSizeItemRenderer({ data, field }) {
  let completed = 0;
  const [size, setSize] = useState();
  useEffect(() => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    let bytes = data[field];
    if (field === 'transferSize') {
      bytes = data.changedTransfer;
    }
    let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
    try {
      if (Number.isNaN(i)) {
        i = 0;
      }
      if (bytes === 0 && data.status === 'running') {
        setSize('-');
      } else {
        setSize(`${Number.parseFloat((bytes / 1024 ** i).toFixed(2).replace(/[.,]00$/, ''))}  ${sizes[i]}`);
      }
    } catch (error) {
      setSize('-');
    }
  }, []);

  if (field === 'transferredSize') {
    if (data.changedSize !== 0 && data.transferredSize !== 0 && (data.status === JOB_RUNNING_STATUS || data.status === JOB_IN_PROGRESS || data.status === PARTIALLY_COMPLETED)) {
      const changeBytes = data.changedSize * 1024 * 1024;
      const changeTransferBytes = data.transferredSize * 1024 * 1024;
      completed = Math.round(changeTransferBytes / changeBytes * 100);
    }
  }

  // progress bar for disk transfer size
  if (field === 'transferSize') {
    if (data.changedSize !== 0 && data.changedTransfer !== 0 && (data.status === JOB_RUNNING_STATUS || data.status === JOB_IN_PROGRESS || data.status === PARTIALLY_COMPLETED)) {
      const changeBytes = data.changedSize * 1024 * 1024;
      const changeTransferBytes = data.changedTransfer * 1024 * 1024;
      completed = Math.round(changeTransferBytes / changeBytes * 100);
    }
  }

  if (completed > 0 && completed < 100) {
    return (
      <div>
        <DMProgressBar completed={completed} data={data} size={size} />
      </div>
    );
  }

  return (
    <div>
      {size}
    </div>
  );
}

export default TransferSizeItemRenderer;
