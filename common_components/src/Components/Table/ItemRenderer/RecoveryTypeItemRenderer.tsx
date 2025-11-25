import React from 'react';

interface RecoveryTypeItemRendererProps {
  data?: Record<string, any>; // Data object with dynamic keys
  field: string; // Field name to access from data
}

const RecoveryTypeItemRenderer: React.FC<RecoveryTypeItemRendererProps> = ({ data, field }) => {
  if (!data || !field || !data[field]) {
    return null;
  }

  const recoveryType: string = String(data[field]); // Ensure value is treated as a string
  const formattedText = recoveryType.charAt(0).toUpperCase() + recoveryType.slice(1);

  return <>{formattedText}</>;
};

export default RecoveryTypeItemRenderer;
