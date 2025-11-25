import React from 'react';

interface SizeItemRendererProps {
  data: Record<string, any>;
  field: string;
}

const SizeItemRenderer: React.FC<SizeItemRendererProps> = ({ data, field }) => {
  if (!data) {
    return <>-</>;
  }

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const bytes: number = data[field];

  if (bytes === 0) return <>0 Byte</>;

  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const value = parseFloat((bytes / 1024 ** i).toFixed(2));

  return (
    <div>
      {`${value} ${sizes[i]}`}
    </div>
  );
};

export default SizeItemRenderer;
