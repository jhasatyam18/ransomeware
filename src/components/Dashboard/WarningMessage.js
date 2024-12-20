import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { connect, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Row } from 'reactstrap';
import { node } from 'prop-types';
import { fetchNodes } from '../../store/actions/NodeActions';
import { NODES_PATH } from '../../constants/RouterConstants';

const WarningMessage = (props) => {
  const { settings, t, dispatch } = props;
  const { nodes } = settings;
  let localNodeversion = '';
  const refresh = useSelector((state) => state.user.context.refresh);
  useEffect(() => {
    dispatch(fetchNodes());
  }, [refresh]);
  for (let i = 0; i < nodes.length; i += 1) {
    if (nodes[i].nodeType !== 'PrepNode' || (nodes[i].nodeType === 'Management' && node.isLocalNode)) {
      localNodeversion = localNodeversion < nodes[i].version ? nodes[i].version : localNodeversion;
    }
  }
  const isUpgradeRequired = nodes.filter((el) => el.isUpgradeRequired);
  if (isUpgradeRequired.length === 0) return null;
  return (
    <Card className="mb-0">
      <CardBody style={{ backgroundColor: '#d9a64f', borderRadius: '2px', color: 'black', fontSize: '14px', fontWeight: '390', padding: '5px', overflowX: 'hidden' }}>
        <Row>
          <Col sm={12} className="d-flex" style={{ justifyContent: 'space-between' }}>
            <div className="d-flex text-container" style={{ width: '90%', justifyContent: 'center' }}>
              <p className="mb-0">
                <span>{t('node.versions.mismatch.warning', { localNodeversion })}</span>
                &nbsp;
                <span>{t('Visit the')}</span>
                &nbsp;
                <Link to={NODES_PATH}>{t('Nodes page ')}</Link>
                &nbsp;
                <span>{t('to perform the upgrade.')}</span>
              </p>
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

const mapStateToProps = (state) => {
  const { settings, user } = state;
  return { settings, user };
};

export default connect(mapStateToProps)(withTranslation()(WarningMessage));
