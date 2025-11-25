// import React, { useEffect } from 'react';
// import { withTranslation } from 'react-i18next';
// import { Link } from 'react-router-dom';
// import { Card, CardBody, Col, Row } from 'reactstrap';
// import { STATIC_KEYS } from '../../constants/StoreKey';
// import { UserInterface } from '../../interfaces/interface';
// import { getValue } from '../../utils/apiUtils';
// import {  setDashboardDeployedNodes } from '../../utils/appUtils';

// interface DeployedNodesProps {
//   user: UserInterface,
//   dispatch:any
// }
// const DashboardDeployedNodes: React.FC<DeployedNodesProps> = ({user, dispatch}) =>{
//   const {values} = user;
//   const data = getValue({key:STATIC_KEYS.DASHBOARD_DEPLOYED_NODES, values})
//   const SITE_ID = getValue({key:STATIC_KEYS.GLOBAL_SITE_KEY, values})||''
//   useEffect(()=>{
//     dispatch(setDashboardDeployedNodes())
//   },[SITE_ID])
//   if(!data){
//     return <>Loading...</>
//   }
//   return (
//     <Card>
//       <CardBody className="max-h-250">
//         <Link className="font-weight-medium text-white">
//           <p className="font-weight-medium text-muted">
//             Deployed Nodes
//           </p>
//           <Row className="text-center font-size-point-9rem">
//             <Col sm={4}>
//               <span >Management</span>
//               <hr />
//               {data.mgmt}
//             </Col>
//             <Col sm={4}>
//               <span>Replication</span>
//               <hr />
//               {data.repl}
//             </Col>
//             <Col sm={4}>
//               <span >Win prep</span>
//               <hr />
//               {data.winprep}
//             </Col>
//           </Row>
//         </Link>
//       </CardBody>
//     </Card>
//   );
// }

// export default withTranslation()(DashboardDeployedNodes);

import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Card, CardBody, Col, Row } from 'reactstrap';
import styled from 'styled-components';
import { LEGEND, STROKE } from '../../constants/ColorConstant';
import { INITIAL_STATE_INTERFACE } from '../../interfaces/interface';
import TitleRenderer from './TitleRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const DashboardDeployedNodes: React.FC<{}> = () => {
    const protectedVMStats = { mgmt: 4, repl: 2, prep: 1 };
    const replicationStats = { inSync: 3, notInsync: 2, vmware: 1, hyd: 2 };
    const { mgmt, repl, prep } = protectedVMStats;
    const protectedVMSeries = [mgmt, repl, prep];
    const replicationSeries = [replicationStats.inSync, replicationStats.notInsync, replicationStats.hyd, replicationStats.vmware];
    const state = {
        walletOptions: {
            stroke: STROKE,
            colors: ['#48adc6', '#cea867', '#50a5f1'],
            labels: ['Management', 'Replication', 'Prep'],
            legend: LEGEND,
            dataLabels: {
                enabled: true,
                formatter: function (val: any, { seriesIndex, w }: any) {
                    return w.config.series[seriesIndex]; // Shows actual number instead of percentage
                },
            },
        },
        replicationOptions: {
            stroke: STROKE,
            colors: ['#b1d765', '#69470b', '#1c4c76', '#445b70'],
            labels: ['AWS-DM-MUM', 'AWS-DM-OHIO', 'AWS-DM-HYD', 'VMware'],
            legend: LEGEND,
            dataLabels: {
                enabled: true,
                formatter: function (val: any, { seriesIndex, w }: any) {
                    return w.config.series[seriesIndex]; // Shows actual number instead of percentage
                },
            },
        },
    };

    // useEffect(() => {
    //   let isUnmounting = false;
    //   setLoading(true);
    //   callAPI(API_DASHBOARD_VIRTUAL_MACHINE_PROTECTION_ANALYSIS_PROTECTED_VMS)
    //     .then((json) => {
    //       if (isUnmounting) return;
    //       setLoading(false);
    //       setProtectedVMStats({ mgmt: json.mgmt, unprotectedVMs: json.unprotectedVMs });
    //     },
    //     (err) => {
    //       if (isUnmounting) return;
    //       setLoading(false);
    //       dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    //     });
    //   callAPI(API_DASHBOARD_REPLICATION_STATS)
    //     .then((json) => {
    //       if (isUnmounting) return;
    //       setReplicationStat(json);
    //     },
    //     (err) => {
    //       if (isUnmounting) return;
    //       dispatch(addMessage(err.message, MESSAGE_TYPES.ERROR));
    //     });
    //   return () => {
    //     isUnmounting = true;
    //   };
    // }, [refresh]);

    // const renderNoDataToShow = () => (
    //   <>
    //     <Card>
    //       <CardBody>
    //         <p className="font-weight-medium color-white">
    //           NO DATA
    //         </p>
    //       </CardBody>
    //     </Card>
    //   </>
    // );

    const renderData = () => {
        const { walletOptions, replicationOptions } = state;
        return (
            <>
                <Col sm={3}>
                    <div>
                        <p className="font-size-13">Total Nodes</p>
                        <div id="vm-analysis-chart" className="apex-charts">
                            <ReactApexChart options={walletOptions} series={protectedVMSeries} type="donut" height={700} />
                        </div>
                    </div>
                </Col>
                <Col sm={2}>
                    <div className="mt-5">
                        <Row style={{ fontSize: '10px' }}>
                            <Col xs="12">
                                <div className="d-flex justify-content-between">
                                    <p className="mb-2">{walletOptions.labels[0]}</p>
                                    <span>{protectedVMSeries[0]}</span>
                                </div>
                            </Col>
                            <Col xs="12">
                                <div className="d-flex justify-content-between">
                                    <p className="mb-2">{walletOptions.labels[1]}</p>
                                    <span>{protectedVMSeries[1]}</span>
                                </div>
                            </Col>
                            <Col xs="12">
                                <div className="d-flex justify-content-between">
                                    <p className="mb-2">{walletOptions.labels[2]}</p>
                                    <span>{protectedVMSeries[2]}</span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
                <Col sm={1}></Col>

                <Col sm={3}>
                    <div>
                        <p className="font-size-13"> Nodes By Sites</p>
                    </div>
                    <div id="vm-analysis-chart" className="apex-charts">
                        <ReactApexChart options={replicationOptions} series={replicationSeries} type="pie" height={700} />
                    </div>
                </Col>
                <Col sm={3}>
                    <div className=" mt-5">
                        <Row style={{ fontSize: '10px' }}>
                            <Col xs="12">
                                <div className="d-flex justify-content-around">
                                    <p className="mb-2">{replicationOptions.labels[0]}</p>
                                    <span>{replicationSeries[0]}</span>
                                </div>
                            </Col>
                            <Col xs="12">
                                <div className="d-flex justify-content-around">
                                    <p className="mb-2">{replicationOptions.labels[1]}</p>
                                    <span>{replicationSeries[1]}</span>
                                </div>
                            </Col>
                            <Col xs="12">
                                <div className="d-flex justify-content-around">
                                    <p className="mb-2">{replicationOptions.labels[2]}</p>
                                    <span>{replicationSeries[2]}</span>
                                </div>
                            </Col>
                            <Col xs="12">
                                <div className="d-flex justify-content-around">
                                    <p className="mb-2">{replicationOptions.labels[3]}</p>
                                    <span>{replicationSeries[3]}</span>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </>
        );
    };
    return (
        <>
            <StyledCard>
                <CardBody>
                    <Row>
                        <Col sm={10}>
                            <TitleRenderer title="Deployed Nodes" />
                        </Col>
                        <Col>
                            <div title="Information about the widget" className="text-right">
                                <FontAwesomeIcon size="lg" icon={faInfoCircle} />
                            </div>
                        </Col>
                    </Row>
                    {/* <Row className='mb-0'>
           <Col sm={6}>
          <TitleRenderer title='Deployed Nodes' />
          </Col>
         </Row> */}
                    <hr />
                    <Row style={{ minHeight: '230px' }}>{renderData()}</Row>
                </CardBody>
            </StyledCard>
        </>
    );
};
const StyledCard = styled(Card)`
    background-color: #2a3042;
    border: none;
    border-radius: 4px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    color: #bfc8e2;
`;
function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { user } = state;
    return { user };
}
export default connect(mapStateToProps)(withTranslation()(DashboardDeployedNodes));
