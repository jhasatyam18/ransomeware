import React from 'react';
import { AnyAction, Dispatch } from 'redux';
import { ALERT_ACTION_RENDERER, ALERT_COLUMN_ITEM_RENDERER, ALERTS_SEVERITY_ITEM_RENDERER, ALERTS_TITLE_ITEM_RENDERER, CLEANUP_ITEM_RENDERER, COUNT_ITEM_RENDERER, DATE_ITEM_RENDERER, DR_RECOVERY_RENDERER, LICENSE_STATUS_ITEM_RENDERER, LICENSE_USAGE_ITEM_RENDERER, NODE_NAME_ITEM_RENDERER, PLAN_ALERT_RENDERER, PLAN_REPLICATION_RENDERER, PROTECTION_PLAN_NAME_RENDERER, RECOVERY_STATUS_RENDERER, RECOVERY_TYPE_ITEM_RENDERER, SERVER_PORT_ITEM_RENDERER, SITE_LINK_RENDERER, SITE_LOCATION_ITEM_RENDERER, SSH_RDP_ITEM_RENDERER, STATUS_ITEM_RENDERER, STORAGE_ITEM_RENDERER, TEST_RECOVERY_TIME_ITEM_RENDERER, TIME_DURATION_RENDERER, VM_SIZE_ITEM_RENDERER, ALERT_ACK_ITEM_RENDERER, NODE_HEALTH_COLUMN_RENDERER, SIZE_ITEM_RENDERER, SUPPORT_BUNDLE_ACTION_ITEM_RENDERER, PLAN_DR_READY_RENDERER } from '../../Constants/RendererConstants';
import { UserInterface } from '../../interfaces/interfaces';
import RecoveryStatusRenderer from '../Shared/RecoveryStatusRenderer';
import AlertActionRenderer from './ItemRenderer/AlertActionRenderer';
import NodeNameItemRenderer from './ItemRenderer/NodeNameItemRenderer';
import { PlanAlertRenderer } from './ItemRenderer/PlanAlertRenderer';
import PlanReplicationRenderer from './ItemRenderer/PlanReplicationRenderer';
import ServerPortItemRenderer from './ItemRenderer/ServerPortItemRenderer';
import SiteLocationItemRenderer from './ItemRenderer/SiteLocationItemRenderer';
import StatusItemRenderer from './ItemRenderer/StatusItemRenderer';
import CountItemRenderer from './ItemRenderer/CountItemRenderer';
import TimeAgo from './ItemRenderer/TestRecoveryTimeRenderer';
import CleanupItemRenderer from './ItemRenderer/CleanupItemRenderer';
import SiteLinkRenderer from './ItemRenderer/SiteLinkRenderer';
import ProtectionPlanNameRenderer from './ItemRenderer/ProtectionPlanNameRenderer';
import TransferSizeItemRenderer from './ItemRenderer/StorageItemRenderer';
import { DateItemRenderer } from './ItemRenderer/DateItemRenderer';
import TimeDurationItemRenderer from './ItemRenderer/TimeDurationItemRenderer';
import SshRdpRenderer from './ItemRenderer/SshRdpRenderer';
import RecoveryTypeItemRenderer from './ItemRenderer/RecoveryTypeItemRenderer';
import DRReadyItemRenderer from './ItemRenderer/DRReadyItemRenderer';
import AlertSeverityItemRenderer from './ItemRenderer/AlertSeverityItemRenderer';
import AlertTitleItemRenderer from './ItemRenderer/AlertTitleItemRenderer';
import VMSizeItemRenderer from './ItemRenderer/VMSizeItemRenderer';
import LicenseUsageItemRenderer from './ItemRenderer/LicenseUsageItemRenderer';
import LicenseStatusItemRenderer from './ItemRenderer/LicenseStatusItemRenderer';
import AlertColumnItemRenderer from './ItemRenderer/AlertColumnItemRenderer';
import AlertAckItemRenderer from './ItemRenderer/AlertAckItemRenderer';
import SizeItemRenderer from './ItemRenderer/SizeItemRenderer';
import SupportBundleActionItemRenderer from './ItemRenderer/SupportBundleActionItemRenderer';
import { DopHealthStatusItem } from './ItemRenderer/DopHealthStatusItem';

interface Props {
    itemRenderer: string;
    data: any;
    field: string;
    user: UserInterface;
    dispatch: Dispatch<AnyAction>;
    options: any;
    [key: string]: any
}

const getItemRendererComponent: React.FC<Props> = (props) => {
    const { itemRenderer, data } = props;
    switch (itemRenderer) {
        case SITE_LOCATION_ITEM_RENDERER:
            return <SiteLocationItemRenderer data={data} />;
        case NODE_NAME_ITEM_RENDERER:
            return <NodeNameItemRenderer {...props} />;
        case SERVER_PORT_ITEM_RENDERER:
            return <ServerPortItemRenderer data={data} />;
        case PLAN_REPLICATION_RENDERER:
            return <PlanReplicationRenderer {...props} />;
        case PLAN_ALERT_RENDERER:
            return <PlanAlertRenderer {...props} />;
        case ALERT_ACTION_RENDERER:
            return <AlertActionRenderer {...props} />;
        case STATUS_ITEM_RENDERER:
            return <StatusItemRenderer {...props} />
        case RECOVERY_STATUS_RENDERER:
            return <RecoveryStatusRenderer {...props} />
        case COUNT_ITEM_RENDERER:
            return <CountItemRenderer {...props} />
        case TEST_RECOVERY_TIME_ITEM_RENDERER:
            return <TimeAgo {...props} />
        case CLEANUP_ITEM_RENDERER:
            return <CleanupItemRenderer {...props} />
        case SITE_LINK_RENDERER:
            return <SiteLinkRenderer {...props} />
        case PROTECTION_PLAN_NAME_RENDERER:
            return <ProtectionPlanNameRenderer {...props} />
        case STORAGE_ITEM_RENDERER:
            return <TransferSizeItemRenderer {...props} />
        case DATE_ITEM_RENDERER:
            return <DateItemRenderer {...props} />
        case TIME_DURATION_RENDERER:
            return <TimeDurationItemRenderer {...props} />
        case SSH_RDP_ITEM_RENDERER:
            return <SshRdpRenderer {...props} />
        case RECOVERY_TYPE_ITEM_RENDERER:
            return <RecoveryTypeItemRenderer {...props} />
        case DR_RECOVERY_RENDERER:
            return <DRReadyItemRenderer {...props} />
        case ALERTS_SEVERITY_ITEM_RENDERER:
            return <AlertSeverityItemRenderer {...props} />
        case ALERTS_TITLE_ITEM_RENDERER:
            return <AlertTitleItemRenderer {...props} />
        case VM_SIZE_ITEM_RENDERER:
            return <VMSizeItemRenderer {...props} />
        case LICENSE_USAGE_ITEM_RENDERER:
            return <LicenseUsageItemRenderer {...props} />
        case LICENSE_STATUS_ITEM_RENDERER:
            return <LicenseStatusItemRenderer {...props} />
        case ALERT_COLUMN_ITEM_RENDERER:
            return <AlertColumnItemRenderer {...props} />
        case ALERT_ACK_ITEM_RENDERER:
            return <AlertAckItemRenderer {...props} />
        case SIZE_ITEM_RENDERER:
            return <SizeItemRenderer {...props} />
        case SUPPORT_BUNDLE_ACTION_ITEM_RENDERER:
            return <SupportBundleActionItemRenderer {...props} />
        case PLAN_DR_READY_RENDERER:
            return <DopHealthStatusItem {...props} />
        default:
            return <div> 404 </div>;
    }
};

export default getItemRendererComponent;
