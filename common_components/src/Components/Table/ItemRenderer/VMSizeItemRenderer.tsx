import React from 'react';

interface VMSizeItemRendererProps {
  data: any;
  field: string;
}

function VMSizeItemRenderer({ data, field }: VMSizeItemRendererProps) {
  if (!data || !data[field]) {
    return <div>-</div>;
  }
  const getStorageWithUnit = (value: number) => {
    if (typeof value === 'undefined' || value === 0) {
      return '0 KB';
    }
    const units = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
    const unitIndex = Math.floor(Math.log(value) / Math.log(1024));
    return `${Number.parseFloat((value / (1024 ** unitIndex)).toFixed(2))} ${units[unitIndex]}`;
  }

  const size = getStorageWithUnit(data[field]);

  return <div>{size}</div>;
}

export default VMSizeItemRenderer;
