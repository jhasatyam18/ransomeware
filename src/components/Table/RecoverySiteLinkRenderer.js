import React from 'react';
import 'boxicons';
import { APP_TYPE } from '../../constants/InputConstants';

function RecoverySiteLinkRenderer({ data, user }) {
  const { recoverySite } = data;
  const { platformDetails, siteType } = recoverySite;
  const { appType } = user;
  const { platformName, serverIp } = platformDetails;
  if (siteType === 'Recovery' && appType === APP_TYPE.CLIENT) {
    return (
      <a href={`https://${serverIp}:5000/`} target="_blank" rel="noopener noreferrer">
        {platformName}
      </a>
    );
  }
  return platformName;
}

export default RecoverySiteLinkRenderer;
