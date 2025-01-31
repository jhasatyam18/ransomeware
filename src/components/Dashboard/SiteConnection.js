import React, { useCallback, useEffect } from 'react';
import ReactFlow, { Controls, addEdge, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import { connect } from 'react-redux';
import { Card, CardBody } from 'reactstrap';
import { withTranslation } from 'react-i18next';
import { NODE_POSITIONS } from '../../constants/SiteConnectionConstants';

function SiteConnection(props) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { dashboard, t } = props;
  const { titles } = dashboard;
  const { siteConnections, siteDetails } = titles;
  let siteDetailsToDisplay = [];

  useEffect(() => {
    const node = [];
    const edge = [];
    const displayType = (siteDetails?.length > 6 ? 'inputs' : 'inputs');
    siteDetailsToDisplay = (siteDetails?.length > 8 ? siteDetails.slice(0, 8) : siteDetails);

    // draw nodes
    for (let i = 0; i < siteDetailsToDisplay?.length; i += 1) {
      node.push({ id: `${siteDetailsToDisplay[i].id}`, data: { label: siteDetailsToDisplay[i].name }, type: displayType, position: { x: NODE_POSITIONS[i].x, y: NODE_POSITIONS[i].y } });
    }
    setNodes(node);

    // draw connections
    if (siteConnections) {
      siteConnections.forEach((connection, i) => {
        edge.push({ id: `${connection.sourceID}-${connection.targetID}-${i}`, source: `${connection.sourceID}`, target: `${connection.targetID}`, animated: true, style: { stroke: '#fff' } });
      });
    }
    setEdges(edge);
  }, [siteDetails]);

  function renderNoDataToShow() {
    return (
      <>
        <Card>
          <CardBody>
            <p className="font-weight-medium color-white">
              {t('site.connection')}
            </p>
            {t('no.data.to.display')}
          </CardBody>
        </Card>
      </>
    );
  }

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), []);

  function renderer() {
    if (!siteDetails) {
      return renderNoDataToShow();
    }

    const proOptions = { hideAttribution: true };

    return (
      <Card className="site_connection ">
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

  return renderer();
}

function mapStateToProps(state) {
  const { dashboard, user } = state;
  return { dashboard, user };
}
export default connect(mapStateToProps)(withTranslation()(SiteConnection));
