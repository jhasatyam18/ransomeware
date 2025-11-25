import React, { useEffect } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'reactstrap';
import { GlobalInterface, INITIAL_STATE_INTERFACE, UserInterface } from '../../interfaces/interface';
import SiteConnection from './SiteConnection';
import BarRecoveeryStat from './BarRecoveryStat';
import ReplicationStat from './ReplicationStat';
import DashboardTitles from './DashboardTitles';
import NodeHealth from '../shared/NodeHealth';
import ReplicationStatBoard from './ReplicationStatBoard';
import RecoveryStatBoard from './RecoveryStatBoard';
import TestRecoveryChart from './TestRecoveryChart';
import { setActiveTab } from '../../store/reducers/userReducer';

type DahboardProps = {
    text: string;
    dispatch: any;
    nodes: any;
    user: UserInterface;
    global: GlobalInterface;
};
const DahboardTwo: React.FC<DahboardProps> = ({ dispatch }) => {
    const renderAll = () => {
        useEffect(() => {
            dispatch(setActiveTab(1));
        }, []);
        return (
            <>
                <Container fluid>
                    <DashboardTitles />
                </Container>
                <Container fluid>
                    <Row>
                        <Col sm={12} lg={6} md={12}>
                            <SiteConnection />
                        </Col>
                        <Col sm={12} lg={6} md={12}>
                            <NodeHealth type="success" message="Replication errors" />
                        </Col>
                    </Row>
                </Container>
                <Container fluid>
                    <Row>
                        <Col sm={12} lg={6} md={12}>
                            <ReplicationStatBoard />
                            <RecoveryStatBoard />
                        </Col>
                        <Col sm={12} lg={6} md={12}>
                            <ReplicationStat />
                        </Col>
                        <Col sm={12} lg={6} md={12}>
                            <BarRecoveeryStat />
                        </Col>
                        <Col sm={12} lg={6} md={12}>
                            <TestRecoveryChart />
                        </Col>
                    </Row>
                </Container>
            </>
        );
    };

    const renderContainer = () => {
        return renderAll();
    };
    return <>{renderContainer()}</>;
};

function mapStateToProps(state: INITIAL_STATE_INTERFACE) {
    const { global, nodes, user } = state;
    return {
        global,
        nodes,
        user,
    };
}

export default connect(mapStateToProps)(withTranslation()(DahboardTwo));
