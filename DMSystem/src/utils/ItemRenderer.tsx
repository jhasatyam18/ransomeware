import React from 'react';
import { AnyAction, Dispatch } from 'redux';
import LinkRenderer from '../Components/renderer/LinkRenderer';
import NodeUpgradeStatusRendere from '../Components/renderer/NodeUpgradeStatusRenderer';
import UPTimeRenderer from '../Components/renderer/UPTimeRenderer';
import NodeNameItemRenderer from '../Components/Table/ItemRenderer/NodeNameItemRenderer';
import ServerPortItemRenderer from '../Components/Table/ItemRenderer/ServerPortItemRenderer';
import SiteLocationItemRenderer from '../Components/Table/ItemRenderer/SiteLocationItemRenderer';
import StatusItemRenderer from '../Components/Table/ItemRenderer/StatusItemRenderer';
import { LINK_RENDERER, NODE_NAME_ITEM_RENDERER, SERVER_PORT_ITEM_RENDERER, SITE_LOCATION_ITEM_RENDERER, STATUS_ITEM_RENDERER, UPGRADE_NODE_STATUS_TABLE_STATUS_RENDERER } from '../Constants/TableConstants';
import { SERVICE_UP_TIME_RENDERE } from '../Constants/userConstants';
import { UserInterface } from '../interfaces/interfaces';

interface Options {
    title: string;
    confirmAction: Function;
    message: string;
    render: string;
    id: string;
}
interface Props {
    itemRenderer: string;
    data: any;
    field: string;
    user: UserInterface;
    dispatch: Dispatch<AnyAction>;
    options?: Options;
}

const getItemRendererComponent: React.FC<Props> = (props) => {
    const { itemRenderer, data, field } = props;
    switch (itemRenderer) {
        case UPGRADE_NODE_STATUS_TABLE_STATUS_RENDERER:
            return <NodeUpgradeStatusRendere data={data} />;
        case LINK_RENDERER:
            return <LinkRenderer {...props} />;
        case STATUS_ITEM_RENDERER:
            return <StatusItemRenderer data={data} field={field} />;
        case SITE_LOCATION_ITEM_RENDERER:
            return <SiteLocationItemRenderer data={data} />;
        case NODE_NAME_ITEM_RENDERER:
            return <NodeNameItemRenderer data={data} />;
        case SERVER_PORT_ITEM_RENDERER:
            return <ServerPortItemRenderer data={data} />;
        case SERVICE_UP_TIME_RENDERE:
            return <UPTimeRenderer {...props} />;
        default:
            return <div> 404 </div>;
    }
};

export default getItemRendererComponent;
