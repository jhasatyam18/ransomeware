import 'boxicons';
import React from 'react';

function RecoverySiteLinkRenderer({ data, user }) {
  const { localVMIP } = user;
  const { recoverySite } = data;
  const { name, node } = recoverySite;
  const { hostname, managementPort } = node;
  if (localVMIP === hostname) {
    return name;
  }
  return (
    <a href={`https://${hostname}:${managementPort}`} target="_blank" rel="noopener noreferrer">
      {name}
    </a>
  );
}

export default RecoverySiteLinkRenderer;
