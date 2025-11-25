import React from 'react';

function PlatformtypeItemRenderer({ data, user }) {
  if (typeof data === 'undefined') {
    return null;
  }
  const { platformType } = data;
  let dataToShow = platformType;
  if (dataToShow === '' && user && user.platformType) {
    dataToShow = user.platformType;
  }

  return (
    <div>
      {dataToShow}
    </div>
  );
}

export default PlatformtypeItemRenderer;
