import React from 'react';
import 'boxicons';

function OsTypeItemRenderer({ data }) {
  if (data.guestOS.toLowerCase().indexOf('window') !== -1) {
    return (
      <div>
        <box-icon type="logo" color="green" name="windows" />
      </div>
    );
  }
  return (
    <div>
      <box-icon type="logo" color="black" name="tux" />
    </div>
  );
}

export default OsTypeItemRenderer;
