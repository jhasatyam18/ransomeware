import React from 'react';
import TransferSizeItemRenderer from './TransferSizeItemRenderer';

function ReportDataReductionRenderer({ data, field }) {
  if (!data || !data.totalIteration) {
    return '-';
  }
  if (field === 'totalChangedSize' || field === 'totalTransferredSize') {
    return <TransferSizeItemRenderer data={data} field={field} />;
  }
  return data[field] === '' ? '-' : data[field];
}

export default ReportDataReductionRenderer;
