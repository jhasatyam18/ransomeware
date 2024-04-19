import React from 'react';
import OsTypeItemRenderer from './OsTypeItemRenderer';

function QuiesceVmNameRenderer({ data }) {
  const { name } = data;
  return (
    <>
      <div className="d-flex">
        <span className="margin-right-10">{name}</span>
        <OsTypeItemRenderer data={data} />
      </div>
    </>
  );
}

export default QuiesceVmNameRenderer;
