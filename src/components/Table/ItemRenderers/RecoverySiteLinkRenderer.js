import 'boxicons';
import React from 'react';

function RecoverySiteLinkRenderer({ data }) {
  const { recoverySite } = data;
  const { name, node } = recoverySite;
  const { hostname, managementPort } = node;
  if (hostname && managementPort) {
    return (
      <a href={`https://${hostname}:${managementPort}`} target="_blank" rel="noopener noreferrer">
        {name}
      </a>
    );
  }
  return name;
}

export default RecoverySiteLinkRenderer;
