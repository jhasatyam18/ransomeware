import React from 'react';
import { Container } from 'reactstrap';
import { NODE_TYPE } from '../../Constants/InputConstants';
import { UserInterface } from '../../interfaces/interfaces';
import DashboardTitles from './Dashboard/DashboardTitles';
import NodeTable from './Dashboard/NodeTable';
import SiteTable from './Dashboard/SiteTable';
import SystemInfo from './Dashboard/SystemInfo';

type Props = {
    user: UserInterface;
};

const Dashboard: React.FC<Props> = ({ user }) => {
    const { nodeType } = user;
    return (
        <div>
            <Container fluid>
                <DashboardTitles />
            </Container>
            <Container fluid>
                <SystemInfo />
            </Container>
            {nodeType && nodeType === NODE_TYPE.DOP ? (
                ''
            ) : (
                <>
                    <Container fluid>
                        <NodeTable />
                    </Container>
                    <Container fluid>
                        <SiteTable />
                    </Container>
                </>
            )}
        </div>
    );
};

export default Dashboard;
