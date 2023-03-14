import React from 'react';

function SiteLinkRenderer(props) {
  const { data } = props;
  const { node, name } = data;
  const { hostname, managementPort } = node;
  if (node.isLocalNode) {
    return <span key={`site-link-${hostname}-${data.id}`}>{name}</span>;
  }
  return (
    <a href={`https://${hostname}:${managementPort}`} key={`site-link-${hostname}-${data.id}`} target="_blank" rel="noopener noreferrer">
      {name}
    </a>
  );
}

export default SiteLinkRenderer;
