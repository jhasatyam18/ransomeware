import React from 'react';
import 'boxicons';

function VMSizeItemRenderer({ data }) {
  let size = 0;
  data.virtualDisks.forEach((disk) => {
    size += disk.size;
  });
  return (
    <div>
      {size}
      GB
    </div>
  );
}

export default VMSizeItemRenderer;
