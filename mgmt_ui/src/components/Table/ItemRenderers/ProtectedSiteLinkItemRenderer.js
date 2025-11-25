import React from 'react';
import { routeStart } from '../../../constants/ApiConstants';

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
    <a href={`https://${ip}:${managementPort}/${routeStart}`} target="_blank" rel="noopener noreferrer">
      {name}
    </a>
  );
}

export default ProtectedSiteLinkRenderer;
