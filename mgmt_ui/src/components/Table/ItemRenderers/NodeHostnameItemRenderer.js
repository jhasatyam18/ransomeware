import React from 'react';

function NodeHostnameItemRender({ data }) {
  if (typeof data === 'undefined') {
    return null;
  }
  const { isBehindGateway, gatewayIP, hostname } = data;
  return (
    <div>
      {hostname}
      <br />
      {isBehindGateway && gatewayIP && `GatewayIP: (${gatewayIP})`}
    </div>
  );
}
export default NodeHostnameItemRender;
