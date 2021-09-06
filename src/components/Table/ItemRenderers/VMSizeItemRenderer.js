import React from 'react';
import 'boxicons';

function VMSizeItemRenderer({ data }) {
  let size = 0;
  const { virtualDisks = [] } = data;
  if (virtualDisks !== null) {
    virtualDisks.forEach((disk) => {
      size += disk.size;
    });
  }
  return (
    <div>
      {size}
      {' '}
      GB
    </div>
  );
}

export default VMSizeItemRenderer;
