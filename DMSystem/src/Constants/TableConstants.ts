import { SERVICE_UP_TIME_RENDERE } from './userConstants';

export const STATUS_ITEM_RENDERER = 'STATUS_ITEM_RENDERER';
export const OS_TYPE_ITEM_RENDERER = 'OS_TYPE_ITEM_RENDERER';
export const SITE_LOCATION_ITEM_RENDERER = 'SITE_LOCATION_ITEM_RENDERER';
export const NODE_NAME_ITEM_RENDERER = 'NODE_NAME_ITEM_RENDERER';
export const SERVER_PORT_ITEM_RENDERER = 'SERVER_PORT_ITEM_RENDERER';

// show time taken by any job
export const VM_BOOT_ORDER_ITEM_RENDER = 'TIME_RENDERER';
export const UPGRADE_NODE_STATUS_TABLE_STATUS_RENDERER = 'UPGRADE_NODE_STATUS_TABLE_STATUS_RENDERER';
export const LINK_RENDERER = 'LINK_RENDERER';

export const TABLE_BOOT_VM_VMWARE = [
    { label: 'Name', field: 'name' },
    { label: 'BootOrder', field: 'bootOrder' },
    { label: 'Guest Os', field: 'guestOS' },
];
export const TABLE_NODE = [
    { label: 'Name', field: 'name' },
    { label: 'Hostname', field: 'hostname' },
    { label: 'Type', field: 'nodeType' },
    { label: 'Platform Type', field: 'platformType' },
    { label: 'Ports', field: 'managementPort', itemRenderer: SERVER_PORT_ITEM_RENDERER },
    { label: 'Version', field: 'version' },
    { label: 'Status', field: 'status', itemRenderer: STATUS_ITEM_RENDERER },
];
export const TABLE_SITE = [
    { label: 'Name', field: 'name' },
    { label: 'Site Type', field: 'siteType' },
    { label: 'Platform', field: 'node.platformType' },
    { label: 'Location', itemRenderer: SITE_LOCATION_ITEM_RENDERER },
    { label: 'Node', field: 'node.name', itemRenderer: NODE_NAME_ITEM_RENDERER },
];

export const UPGRADE_NODE_VERSION_INFO_TABLE = [
    { label: 'Node', field: 'nodeName' },
    { label: 'Type', field: 'nodeType' },
    { label: 'Current Version', field: 'currentVersion' },
    { label: 'Status', field: 'nodeActiveStatus', itemRenderer: STATUS_ITEM_RENDERER },
];

export const UPGRADE_NODE_STATUS_TABLE = [
    { label: 'Node', field: 'nodeName' },
    { label: 'Type', field: 'nodeType' },
    { label: 'Status', field: 'status', itemRenderer: UPGRADE_NODE_STATUS_TABLE_STATUS_RENDERER },
    { label: 'Node Status', field: 'nodeStatus' },
];

export const UPGRADED_NODE_DETAILS = [
    { label: 'Node', field: 'nodeName' },
    { label: 'Type', field: 'nodeType' },
    { label: 'Previous Version', field: 'currentVersion' },
    { label: 'Current Version', field: 'appliedVersion' },
];

export const UPGRADE_ASSOCIATED_SITE_tABLE = [
    { label: 'Node', field: 'name' },
    { label: 'Type', field: 'nodeType' },
    { label: 'Platform Type', field: 'platformType' },
    { label: 'Version', field: 'version' },
    { label: '', field: '', itemRenderer: LINK_RENDERER },
];
export const NODE_NAME_POPOVER_FIELDS = [
    { label: 'Hostname', field: 'hostname' },
    { label: 'Platform', field: 'platformType' },
    { label: 'Type', field: 'nodeType' },
    { label: 'Status', field: 'status' },
];

export const UPGRADE_REVERT_TABLE = [
    { label: 'Node', field: 'nodeName' },
    { label: 'Type', field: 'nodeType' },
    { label: 'Current Version', field: 'currentVersion' },
    { label: 'Revert Version', field: 'appliedVersion' },
];

export const UPGRADE_REVERT_NODES_TABLE = [
    { label: 'Name', field: 'nodeName' },
    { label: 'Type', field: 'nodeType' },
    { label: 'Previous Version', field: 'currentVersion' },
    { label: 'Current Version', field: 'appliedVersion' },
];

export const SERVICE_INFORMATION_TABLE = [
    { label: 'Service Name', field: 'serviceName' },
    { label: 'Up Time', field: 'serviceStartTime', itemRenderer: SERVICE_UP_TIME_RENDERE },
    { label: 'Status', field: 'serviceStatus', itemRenderer: STATUS_ITEM_RENDERER },
];
