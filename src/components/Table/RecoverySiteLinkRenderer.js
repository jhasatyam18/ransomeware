import React from 'react';
import 'boxicons';
import { APP_TYPE } from '../../constants/InputConstants';

function RecoverySiteLinkRenderer({ data, user }) {
  const { recoverySite } = data;
  const { siteType, name, node } = recoverySite;
  const { appType } = user;
  const { hostname } = node;
  if (siteType === 'Recovery' && appType === APP_TYPE.CLIENT) {
    return (
      <a href={`https://${hostname}:5000/`} target="_blank" rel="noopener noreferrer">
        {name}
      </a>
    );
  }
  if (siteType === 'Protect' && appType === APP_TYPE.SERVER) {
    return (
      <a href={`https://${hostname}:5001/`} target="_blank" rel="noopener noreferrer">
        {name}
      </a>
    );
  }
  return name;
}

export default RecoverySiteLinkRenderer;
