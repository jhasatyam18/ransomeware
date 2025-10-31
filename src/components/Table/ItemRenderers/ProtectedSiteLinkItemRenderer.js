import React from 'react';

function ProtectedSiteLinkRenderer({ data, user }) {
  const { localVMIP } = user;
  const { protectedSite } = data;
  const { name, node } = protectedSite;
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

export default ProtectedSiteLinkRenderer;
