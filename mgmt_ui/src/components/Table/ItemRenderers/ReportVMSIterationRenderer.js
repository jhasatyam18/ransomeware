function ReportVMSIterationRenderer({ data, field }) {
  if (!data || !data[field]) {
    return '-';
  }
  return data[field];
}

export default ReportVMSIterationRenderer;
