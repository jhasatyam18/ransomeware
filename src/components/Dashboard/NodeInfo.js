import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { withTranslation } from 'react-i18next';
import { Card, CardBody, Badge, Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { getStorageWithUnit } from '../../utils/AppUtils';
import { API_DASHBOARD_NODE_STATS } from '../../constants/ApiConstants';
import { addMessage } from '../../store/actions/MessageActions';
import { callAPI } from '../../utils/ApiUtils';
import { MESSAGE_TYPES } from '../../constants/MessageConstants';

function NodeInfo(props) {
  const { dispatch, t } = props;
  const refresh = useSelector((state) => state.user.context.refresh);
  const [nodes, setNodes] = useState([]);
  useEffect(() => {
    let isUnmounting = false;
    setNodes([]);
    callAPI(API_DASHBOARD_NODE_STATS)
      .then((json) => {
        if (isUnmounting) return;
        setNodes(json);
      },
      (err) => {
        if (isUnmounting) return;
        setNodes([]);
        dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
      });
    return () => {
      isUnmounting = true;
    };
  }, [refresh]);

  const renderNoDataToShow = () => (
    <>
      <Card>
        <CardBody>
          <p className="font-weight-medium color-white">
            {t('replication.nodes')}
          </p>
          {t('no.data.to.display')}
        </CardBody>
      </Card>
    </>
  );

  const renderOverallState = () => {
    let badgeColor = '';
    let OverallStatus = '';

    if (nodes.every((val) => val.status === 'online')) {
      badgeColor = 'success';
      OverallStatus = 'online';
    } else if (nodes.every((val) => val.status === 'offline')) {
      badgeColor = 'danger';
      OverallStatus = 'offline';
    } else {
      badgeColor = 'warning';
      OverallStatus = 'warning';
    }
    return (
      <div className="dashboard_replication_header_state">
        Overall State &nbsp;&nbsp;
        <Badge className={`font-size-12 badge-soft-${badgeColor}`} color={badgeColor} pill>
          {OverallStatus}
        </Badge>
      </div>
    );
  };

  function renderer() {
    if (!nodes) {
      return renderNoDataToShow();
    }
    return (
      <>
        <Card>
          <CardBody>
            <Row>
              <Col sm={9}>
                <p className="font-weight-medium dashboard-title">{`${t('datamotive.nodes')} (${nodes.length})`}</p>
              </Col>
              <Col sm={3}>
                {renderOverallState()}
              </Col>
            </Row>
            <div className="table-responsive">
              <table className="table table-centered table-nowrap mb-0">
                <thead className="thead-light">
                  <tr>
                    <th>{t('node')}</th>
                    <th>{t('type')}</th>
                    <th>{t('deployed.on')}</th>
                    <th>{t('ip.address')}</th>
                    <th>{t('vms')}</th>
                    <th>{t('usage')}</th>
                    <th>{t('status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {nodes.map((node, key) => (
                    <tr key={`tr---${key * 2}`}>
                      <td>{node.name}</td>
                      <td>{node.type}</td>
                      <td>{node.deployedOn}</td>
                      <td>
                        <Link to="#" className="text-body font-weight-bold">
                          {' '}
                          {node.hostname}
                          {' '}
                        </Link>
                        {' '}
                      </td>
                      <td>{node.vms}</td>
                      <td>{getStorageWithUnit(node.usage)}</td>
                      <td>
                        <Badge className={`font-size-12 badge-soft-${node.status === 'online' ? 'success' : 'danger'}`} color={node.status === 'online' ? 'success' : 'danger'} pill>
                          {node.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </>
    );
  }

  return renderer();
}

function mapStateToProps(state) {
  const { dashboard } = state;
  return { dashboard };
}
export default connect(mapStateToProps)(withTranslation()(NodeInfo));
