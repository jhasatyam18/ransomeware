
import React, { useEffect, useState } from "react";
import { ProgressBar } from "../../Shared/ProgressBar";
import { JOB_IN_PROGRESS, JOB_RUNNING_STATUS, PARTIALLY_COMPLETED } from "../../../Constants/statusConstant";

interface TransferSizeData {
  id: number;
  transferSize?: number;
  changedTransfer?: number;
  changedSize?: number;
  transferredSize?: number;
  status?: string;
  [key: string]: any; // Allow additional fields
}

// Define props for the component
interface TransferSizeItemRendererProps {
  data: TransferSizeData;
  field: string;
}

const TransferSizeItemRenderer: React.FC<TransferSizeItemRendererProps> = ({ data, field }) => {
  let completed = 0;
  const [size, setSize] = useState<string | undefined>();

  useEffect(() => {
    let bytes = data[field];

    if (data.id === 172 && field === "transferSize") {
      setSize("");
    }

    if (field === "transferSize") {
      bytes = data.changedTransfer;
    }

    const convertedData = calculateSize(bytes);
    setSize(convertedData === "-" ? "" : convertedData);
  }, [data, field]);

  function calculateSize(bytes?: number): string {
    if (bytes === undefined || bytes <= 0) return "0 Bytes";

    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    let i = 0;

    try {
      i = Math.floor(Math.log(bytes) / Math.log(1024));
      if (Number.isNaN(i)) i = 0;
      if (bytes === 0 && data.status === JOB_IN_PROGRESS) return "-";

      return `${(bytes / 1024 ** i).toFixed(2).replace(/[.,]00$/, "")} ${sizes[i]}`;
    } catch (error) {
      return "-";
    }
  }

  // Calculate progress for `transferredSize`
  if (field === "transferredSize") {
    if (
      data.changedSize &&
      data.transferredSize &&
      (data.status === JOB_RUNNING_STATUS || data.status === JOB_IN_PROGRESS || data.status === PARTIALLY_COMPLETED)
    ) {
      const changeBytes = data.changedSize * 1024 * 1024;
      const changeTransferBytes = data.transferredSize * 1024 * 1024;
      completed = Math.round((changeTransferBytes / changeBytes) * 100);
    }
  }

  // Progress bar for disk transfer size
  if (field === "transferSize") {
    if (
      data.changedSize &&
      data.changedTransfer &&
      (data.status === JOB_RUNNING_STATUS || data.status === JOB_IN_PROGRESS || data.status === PARTIALLY_COMPLETED)
    ) {
      const changeBytes = data.changedSize * 1024 * 1024;
      const changeTransferBytes = data.changedTransfer * 1024 * 1024;
      completed = Math.round((changeTransferBytes / changeBytes) * 100);
    }
  }

  if (completed > 0 && completed < 100) {
    return (
      <div>
        <ProgressBar completed={completed} data={data} />
      </div>
    );
  }

  return <div>{calculateSize(data[field])}</div>;
};

export default TransferSizeItemRenderer;
