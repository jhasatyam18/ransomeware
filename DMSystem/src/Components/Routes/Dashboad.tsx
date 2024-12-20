import React from 'react';
import { Container } from 'reactstrap';
import DashboardTitles from './Dashboard/DashboardTitles';
import NodeTable from './Dashboard/NodeTable';
import SiteTable from './Dashboard/SiteTable';
import SystemInfo from './Dashboard/SystemInfo';

const Dashboard: React.FC = () => {
    return (
        <div>
            <Container fluid>
                <DashboardTitles />
            </Container>
            <Container fluid>
                <SystemInfo />
            </Container>
            <Container fluid>
                <NodeTable />
            </Container>
            <Container fluid>
                <SiteTable />
            </Container>
        </div>
    );
};

export default Dashboard;
