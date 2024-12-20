import React from 'react';
import { NODE_TYPES } from '../../../Constants/InputConstants';
interface ServerPortItemRendererProps {
    data: {
        managementPort: number;
        replicationCtrlPort: number;
        replicationDataPort: number;
        nodeType: string;
    };
}

const ServerPortItemRenderer: React.FC<ServerPortItemRendererProps> = ({ data }) => {
    if (typeof data === 'undefined') {
        return null;
    }
    const mgmtPort = data.managementPort;
    const replCtrlPort = data.replicationCtrlPort;
    const replDataPort = data.replicationDataPort;
    let replPort: number | string = 0;

    if (replCtrlPort !== 0 && replDataPort !== 0) {
        replPort = `${replCtrlPort}, ${replDataPort}`;
    } else if (replCtrlPort !== 0) {
        replPort = replCtrlPort;
    }

    function getPort(icon: string, title: string, value: number | string) {
        return (
            <i className={icon} title={title}>
                &nbsp;&nbsp;{value}&nbsp;&nbsp;
            </i>
        );
    }

    return (
        <div>
            {mgmtPort !== 0 ? getPort('fas fa-user', 'Management', mgmtPort) : ''}
            {replPort !== 0 ? getPort('far fa-clone', 'Replication', replPort) : ''}
            {mgmtPort === 0 && replPort === 0 && data.nodeType === NODE_TYPES.PrepNode ? getPort('far fa-clone', 'Replication', '5985-5986') : ''}
        </div>
    );
};

export default ServerPortItemRenderer;
