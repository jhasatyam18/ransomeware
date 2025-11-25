import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactFlow, { Controls, addEdge, Node, Edge, useNodesState, useEdgesState, Connection } from 'reactflow';
import 'reactflow/dist/style.css';
import { connect, useSelector } from 'react-redux';
import { Card, CardBody } from 'reactstrap';
import { withTranslation, WithTranslation } from 'react-i18next';
import { NODE_POSITIONS } from '../../constants/siteConnection';
import { APPLICATION_THEME, MESSAGE_TYPES } from '../../constants/userConstant';
import { callAPI, getValue } from '../../utils/apiUtils';
import { UserInterface } from '../../interfaces/interface';
import CardHeaderWithInfo from './CardHeaderWithInfo';
import { STATIC_KEYS } from '../../constants/StoreKey';
import { addMessage } from '../../store/reducers/messageReducer';
import { API_SITE_CONNECTIONS } from '../../constants/ApiUrlConstant';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

// Define types for the site details and site connections
interface SiteDetails {
    id: number;
    name: string;
}

interface SiteConnectionResponse {
    siteDetails: SiteDetails[];
    siteConnections: { sourceID: string; targetID: string }[];
}

interface SiteConnectionProps {
    t: (key: string) => string;
    user: UserInterface;
    dispatch: any;
}

const SiteConnection: React.FC<SiteConnectionProps & WithTranslation> = ({ t, user, dispatch }) => {
    const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);
    // eslint-disable-next-line no-unused-vars
    const [isHovered, setIsHovered] = useState(false);
    const [loader, setloader] = useState(false);
    const [connection, setConnection] = useState<SiteConnectionResponse | null>(null);
    const { values } = user;
    const SITE_ID = getValue({ key: STATIC_KEYS.GLOBAL_SITE_KEY, values }) || '1';
    const refresh = useSelector((state: any) => state.global.context.refresh);
    const theme = getValue({ key: APPLICATION_THEME, values });

    const measureTextWidth = (text: string, font = '14px sans-serif') => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (!context) return 100;
        context.font = font;
        return context.measureText(text).width + 20; // padding
    };
    const siteIdRef = useRef(SITE_ID);
    useEffect(() => {
        siteIdRef.current = SITE_ID;
    }, [SITE_ID]);

    useEffect(() => {
        let isUnmounting = false;
        const currentSiteId = SITE_ID;
        const url = SITE_ID.length > 1 ? `${API_SITE_CONNECTIONS}?siteID=${SITE_ID}` : API_SITE_CONNECTIONS;
        setloader(true);
        callAPI(url).then(
            (json) => {
                if (isUnmounting) return;
                if (siteIdRef.current !== currentSiteId) {
                    return;
                }
                setConnection(json);
                setloader(false);
            },
            (err) => {
                if (isUnmounting) return;
                dispatch(addMessage({ message: err.message, messageType: MESSAGE_TYPES.ERROR }));
                setloader(false);
            },
        );
        return () => {
            isUnmounting = true;
            setloader(false);
        };
    }, [SITE_ID, refresh]);

    useEffect(() => {
        if (!connection || !connection.siteDetails?.length) return;
        const node: Node[] = [];
        const edge: Edge[] = [];
        const { siteDetails, siteConnections } = connection;
        const displayType = siteDetails?.length > 6 ? 'inputs' : 'inputs';
        const siteDetailsToDisplay: SiteDetails[] = siteDetails?.length > 8 ? siteDetails.slice(0, 8) : siteDetails;

        // draw nodes
        for (let i = 0; i < siteDetailsToDisplay.length; i += 1) {
            const label = siteDetailsToDisplay[i].name;
            const font = '14px sans-serif';
            const textWidth = measureTextWidth(label, font);

            node.push({
                id: `${siteDetailsToDisplay[i].id}`,
                data: { label },
                type: displayType,
                position: { x: NODE_POSITIONS[i].x, y: NODE_POSITIONS[i].y },
                style: {
                    width: textWidth,
                    padding: 5,
                    fontFamily: 'sans-serif',
                    fontSize: 13,
                    border: '1px solid #ccc',
                    borderRadius: 6,
                    backgroundColor: '#fff',
                    color: '#1e293b',
                    textAlign: 'center',
                },
            });
        }
        setNodes(node);

        // draw connections
        if (siteConnections) {
            siteConnections.forEach((connection: any, i: number) => {
                edge.push({
                    id: `${connection.sourceID}-${connection.targetID}-${i}`,
                    source: `${connection.sourceID}`,
                    target: `${connection.targetID}`,
                    animated: true,

                    style: { stroke: theme === 'light' ? 'black' : 'white' },
                });
            });
        }
        setEdges(edge);
    }, [connection, theme]);

    const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), []);

    function renderer() {
        const proOptions = { hideAttribution: true };
        return (
            <Card style={{ maxHeight: '180px' }} className="site_connection p-2 box-shadow">
                <CardBody>
                    <CardHeaderWithInfo text="Site Connection" IconText={t('dashboard.icon.site.connection')} />
                    {loader ? (
                        <>
                            <h5 className="mb-0 mt-1 dashboard_rec_heading_size">
                                <FontAwesomeIcon className="fa-spin me-2" size="lg" icon={faSpinner} />
                                Loading...
                            </h5>
                        </>
                    ) : (
                        <>
                            {!connection?.siteDetails ? (
                                <p>{t('no.data.to.display')}</p>
                            ) : (
                                <ReactFlow
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                    nodes={nodes}
                                    onNodesChange={onNodesChange}
                                    edges={edges}
                                    onEdgesChange={onEdgesChange}
                                    onConnect={onConnect}
                                    fitView
                                    nodesDraggable={true}
                                    proOptions={proOptions}
                                    onInit={(instance: any) => {
                                        instance.fitView();
                                        window.addEventListener('resize', () => {
                                            instance.fitView();
                                        });
                                    }}
                                >
                                    <Controls className="react-flow__controls-custom" />
                                </ReactFlow>
                            )}
                        </>
                    )}
                </CardBody>
            </Card>
        );
    }

    return renderer();
};

const mapStateToProps = (state: any) => {
    const { user, global } = state;
    return { user, global };
};

export default connect(mapStateToProps)(withTranslation()(SiteConnection));
