import 'boxicons';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { NODE_STATUS_OFFLINE } from '../../../constants/AppStatus';
import StatusItemRenderer from './StatusItemRenderer';

function NodeStatusRenderer({ data, user }) {
  const { localVMIP } = user;
  const { nodeType } = data;
  let { hostname } = data;
  if (nodeType === 'Replication') {
    hostname = localVMIP;
  }
  return (
    <div style={{ fontSize: '0.9rem', display: 'flex' }}>
      <StatusItemRenderer data={data} field="status" />
      {data.isUpgradeRequired && data.status !== NODE_STATUS_OFFLINE ? (
        <a href={`https://${hostname}:5004/upgrade`} key={`site-link-${hostname}-${data.id}`} style={{ fontSize: '0.8rem' }} className="margin-left-20" target="_blank" rel="noreferrer">Click to upgrade</a>
      ) : null}
    </div>
  );
}

export default withTranslation()(NodeStatusRenderer);
