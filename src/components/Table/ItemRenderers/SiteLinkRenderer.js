import React from 'react';

function SiteLinkRenderer(props) {
  const { data } = props;
  const { node, name } = data;
  const { hostname, managementPort, isBehindGateway, gatewayIP } = node;
  if (node.isLocalNode) {
    return <span key={`site-link-${hostname}-${data.id}`}>{name}</span>;
  }
  const ip = (isBehindGateway ? gatewayIP : hostname);
  return (
    <a href={`https://${ip}:${managementPort}`} key={`site-link-${ip}-${data.id}`} target="_blank" rel="noopener noreferrer">
      {name}
    </a>
  );
}

export default SiteLinkRenderer;
