import React from "react";
interface DateItemRendererProps {
  data: any;
  field: string;
}

export const DateItemRenderer: React.FC<DateItemRendererProps> = ({ data, field }) => {
  if (data && typeof data[field] === "undefined") {
    return null;
  }

  const fieldArray = ["currentSnapshotTime", "lastSyncTime"];
  const time = (data[field] as number) * 1000;
  const d = new Date(time);
  let resp = `${d.toLocaleDateString()} - ${d.toLocaleTimeString()}`;

  if (fieldArray.includes(field)) {
    if (data.status !== 'completed') {
      resp = "-";
    }
  }

  if (data[field] === 0) {
    resp = "-";
  }

  if (
    field === 'recoveryPointTime' &&
    data.status === 'completed' &&
    data.recoveryCheckpointID !== "-" &&
    data.recoveryCheckpointID !== ""
  ) {
    return (
      <>
        {resp}
      </>
    );
  }

  return <>{resp}</>;
};

