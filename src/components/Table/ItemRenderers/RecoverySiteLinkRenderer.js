import React from 'react';

function RecoverySiteLinkRenderer({ data, user }) {
  const { localVMIP } = user;
  const { recoverySite } = data;
  const { name, node } = recoverySite;
  const { hostname, managementPort, isBehindGateway, gatewayIP } = node;
  if (localVMIP === hostname) {
    return name;
  }
  const ip = (isBehindGateway ? gatewayIP : hostname);
  return (
    <a href={`https://${ip}:${managementPort}`} target="_blank" rel="noopener noreferrer">
      {name}
    </a>
  );
}

export default RecoverySiteLinkRenderer;
