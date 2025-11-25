import 'boxicons';
import React from 'react';
import { withTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import { NODE_STATUS_OFFLINE } from '../../../constants/AppStatus';
import StatusItemRenderer from './StatusItemRenderer';
import { systemConst } from '../../../constants/RouterConstants';

function NodeStatusRenderer({ data, user }) {
  const { localVMIP } = user;
  const { nodeType } = data;
  let { hostname } = data;
  if (nodeType === 'Replication') {
    hostname = localVMIP;
  }
  return (
    <Row>
      <Col sm={10} xl={2} className="mr-3 mb-2"><StatusItemRenderer data={data} field="status" /></Col>
      <Col sm={1} className="d-none d-xl-block" />
      <Col sm={10} xl={7} className="resp_upgrade_link">
        {data.isUpgradeRequired && data.status !== NODE_STATUS_OFFLINE ? (
          <a href={`https://${hostname}:5000${systemConst}/upgrade`} key={`site-link-${hostname}-${data.id}`} target="_blank" rel="noreferrer">Click to upgrade</a>
        ) : null}
      </Col>
    </Row>
  );
}

export default withTranslation()(NodeStatusRenderer);
