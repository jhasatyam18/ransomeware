import React from 'react';

function SizeItemRenderer({ data, field }) {
  if (!data) {
    return '-';
  }
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const bytes = data[field];
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (bytes === 0) return '0 Byte';
  return (
    <div>
      {`${Math.round(bytes / 1024 ** i, 2)}  ${sizes[i]}`}
    </div>
  );
}

export default SizeItemRenderer;
