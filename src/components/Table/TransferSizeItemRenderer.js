import React from 'react';

function TransferSizeItemRenderer({ data }) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const bytes = data.TransferSize * 1024 * 1024;
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (bytes === 0) return '0 Byte';
  return (
    <div>
      {`${Math.round(bytes / 1024 ** i, 2)}  ${sizes[i]}`}
    </div>
  );
}

export default TransferSizeItemRenderer;
