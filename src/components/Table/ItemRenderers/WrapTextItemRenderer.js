import React from 'react';

function WrapTextItemRenderer({ data, field }) {
  return (
    <div className="text-wrapper">
      {data[field]}
    </div>
  );
}

export default WrapTextItemRenderer;
