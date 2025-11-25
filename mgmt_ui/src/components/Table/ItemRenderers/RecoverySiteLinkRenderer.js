import React from 'react';
import { routeStart } from '../../../constants/ApiConstants';

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
    <a href={`https://${ip}:${managementPort}/${routeStart}`} target="_blank" rel="noopener noreferrer">
      {name}
    </a>
  );
}

export default RecoverySiteLinkRenderer;
