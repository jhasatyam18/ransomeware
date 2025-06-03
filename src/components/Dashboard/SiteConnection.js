import React, { useCallback, useEffect, useState } from 'react';
import ReactFlow, {
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { connect } from 'react-redux';
import { Card, CardBody } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { NODE_POSITIONS } from '../../constants/SiteConnectionConstants';
import { THEME_CONSTANT } from '../../constants/UserConstant';
import Spinner from '../Common/Spinner';

function SiteConnection({ dashboard, t, global }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { titles } = dashboard || {};
  const { siteConnections = [], siteDetails = [] } = titles || {};
  const [loader, setLoader] = useState(false);

  const theme = global;
  useEffect(() => {
    if (!Array.isArray(siteDetails)) return;
    setLoader(true);
    const displayType = 'default'; // previously a pointless ternary
    const slicedDetails = siteDetails.length > 8
      ? siteDetails.slice(0, 8)
      : siteDetails;

    const newNodes = slicedDetails?.map((site, i) => ({
      id: `${site.id}`,
      data: { label: site.name },
      type: displayType,
      position: { x: NODE_POSITIONS[i]?.x || 0, y: NODE_POSITIONS[i]?.y || 0 },
    }));

    const newEdges = siteConnections?.map((connection, i) => ({
      id: `${connection.sourceID}-${connection.targetID}-${i}`,
      source: `${connection.sourceID}`,
      target: `${connection.targetID}`,
      animated: true,
      style: { stroke: THEME_CONSTANT.BANDWIDTH.XAXIX[theme] },
    }));

    setNodes(() => newNodes);
    setEdges(() => newEdges);

    setTimeout(() => {
      setLoader(false);
    }, 1000);
  }, [siteDetails, siteConnections, theme]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const renderNoDataToShow = () => (
    <Card>
      <CardBody>
        <p className="font-weight-medium color-white">
          {t('site.connection')}
        </p>
        {t('no.data.to.display')}
      </CardBody>
    </Card>
  );

  const proOptions = { hideAttribution: true };
  if (loader) {
    return (
      <>
        <Card>
          <CardBody>
            <p className="font-weight-medium color-white">
              {t('dashboard.bandwidth.usage.title')}
            </p>
            <div>
              <Spinner />
            </div>
          </CardBody>
        </Card>
      </>
    );
  }

  return !siteDetails?.length ? (
    renderNoDataToShow()
  ) : (
    <Card className="site_connection box-shadow">
      <CardBody>
        <p className="font-weight-medium color-white">
          {t('site.connection')}
        </p>
        <ReactFlow
          nodes={nodes}
          onNodesChange={onNodesChange}
          edges={edges}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          proOptions={proOptions}
        >
          <Controls className="react-flow__controls-custom" />
        </ReactFlow>
      </CardBody>
    </Card>
  );
}

const mapStateToProps = (state) => ({
  dashboard: state.dashboard,
  user: state.user,
  global: state.global,
});

export default connect(mapStateToProps)(withTranslation()(SiteConnection));
