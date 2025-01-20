import 'boxicons';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
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
    <Row>
      <Col sm={12} xl={3} className="mr-3 mb-2"><StatusItemRenderer data={data} field="status" /></Col>
      <Col sm={12} xl={8} className="resp_upgrade_link">
        {data.isUpgradeRequired && data.status !== NODE_STATUS_OFFLINE ? (
          <a href={`https://${hostname}:5004/upgrade`} key={`site-link-${hostname}-${data.id}`} target="_blank" rel="noreferrer">Click to upgrade</a>
        ) : null}
      </Col>
    </Row>
  );
}

export default withTranslation()(NodeStatusRenderer);
