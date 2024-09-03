import React from 'react';

function ProtectedSiteLinkRenderer({ data, user }) {
  const { localVMIP } = user;
  const { protectedSite } = data;
  const { name, node } = protectedSite;
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

export default ProtectedSiteLinkRenderer;
