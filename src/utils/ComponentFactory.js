import React from 'react';
import NetworkConfig from '../components/Common/NetworkConfig';
import DMFieldSelect from '../components/Shared/DMFieldSelect';
import CloudTags from '../components/Common/CloudTags';
import { STACK_COMPONENT_NETWORK, STACK_COMPONENT_SECURITY_GROUP, STACK_COMPONENT_TAGS } from '../constants/StackConstants';
import { DATE_PICKER_COMP, FIELDS, MULTISELECT_ITEM_COMP, REPLICATION_INTERVAL_COMP } from '../constants/FieldsConstant';
import { DATE_ITEM_RENDERER, DR_PLAN_NAME_ITEM_RENDERER, OS_TYPE_ITEM_RENDERER, VM_SIZE_ITEM_RENDERER, STATUS_ITEM_RENDERER, TRANSFER_SIZE_ITEM_RENDERER, RECOVERY_TYPE_ITEM_RENDERER, TIME_DURATION_RENDERER, RECOVERY_SITE_LINK_ITEM_RENDERER, SSH_RDP_ITEM_RENDERER, VM_USERNAME_ITEM_RENDERER, VM_UPASSWORD_ITEM_RENDERER, REPLICATION_INTERVAL_ITEM_RENDERER, EVENT_LEVEL_ITEM_RENDERER, ALERT_ACK_ITEM_RENDERER, VIEW_ALERT_INFO_RENDERER, SERVER_PORT_ITEM_RENDERER, SIZE_ITEM_RENDERER, SUPPORT_BUNDLE_ACTION_ITEM_RENDERER, NODE_NAME_ITEM_RENDERER, EMAIL_RECIPIENT_ACTION_ITEM_RENDER, NODE_ACTION_RENDERER, VM_BOOT_ORDER_ITEM_RENDER, LICENSE_USAGE_ITEM_RENDERER, LICENSE_ACTION_ITEM_RENDERER, LICENSE_STATUS_ITEM_RENDER } from '../constants/TableConstants';
import ReplicationInterval from '../components/Forms/ReplicationInterval';
import SecurityGroups from '../components/Common/SecurityGroups';
import DMMultiSelect from '../components/Shared/DMMultiSelect';
import DMDatePicker from '../components/Shared/DMDatePicker';

// Table Item renderers
import OsTypeItemRenderer from '../components/Table/ItemRenderers/OsTypeItemRenderer';
import VMSizeItemRenderer from '../components/Table/ItemRenderers/VMSizeItemRenderer';
import DRPlanNameItemRenderer from '../components/Table/ItemRenderers/DRPlanNameItemRenderer';
import DateItemRenderer from '../components/Table/ItemRenderers/DateItemRenderer';
import StatusItemRenderer from '../components/Table/ItemRenderers/StatusItemRenderer';
import TransferSizeItemRenderer from '../components/Table/ItemRenderers/TransferSizeItemRenderer';
import RecoveryTypeItemRenderer from '../components/Table/ItemRenderers/RecoveryTypeItemRenderer';
import TimeDurationItemRenderer from '../components/Table/ItemRenderers/TimeDurationItemRenderer';
import RecoverySiteLinkRenderer from '../components/Table/ItemRenderers/RecoverySiteLinkRenderer';
import SshRdpRenderer from '../components/Table/ItemRenderers/SshRdpRenderer';
import VMUsernameItemRenderer from '../components/Table/ItemRenderers/VMUsernameItemRenderer';
import VMPasswordItemRenderer from '../components/Table/ItemRenderers/VMPasswordItemRenderer';
import ReplicationIntervalItemRenderer from '../components/Table/ItemRenderers/ReplicationIntervalItemRenderer';
import EventLevelItemRenderer from '../components/Table/ItemRenderers/EventLevelItemRenderer';
import AlertAckItemRenderer from '../components/Table/ItemRenderers/AlertAckItemRendrer';
import ViewAlertInfoItemRenderer from '../components/Table/ItemRenderers/ViewAlertInfoItemRenderer';
import ServerPortItemRenderer from '../components/Table/ItemRenderers/ServerPortItemRenderer';
import SizeItemRenderer from '../components/Table/ItemRenderers/SizeItemRenderer';
import SupportBundleActionsRenderer from '../components/Table/ItemRenderers/SupportBundleActionsRenderer';
import NodeNameItemRenderer from '../components/Table/ItemRenderers/NodeNameItemRenderer';
import EmailRecipientItemRenderer from '../components/Table/ItemRenderers/EmailRecipientItemRenderer';
import NodeActionItemRenderer from '../components/Table/ItemRenderers/NodeActionItemRenderer';
import VMBootOrderItemRenderer from '../components/Table/ItemRenderers/VMBootOrderItemRenderer';
import LicenseUsageItemRenderer from '../components/Table/ItemRenderers/LicenseUsageItemRenderer';
import LicenseActionItemRenderer from '../components/Table/ItemRenderers/LicenseActionItemRenderer';
import LicenseStatusItemRender from '../components/Table/ItemRenderers/LicenseStatusItemRender';

export function getStackComponent(dispatch, user, children, conf, data) {
  const field = children[conf];
  switch (field.type) {
    case STACK_COMPONENT_NETWORK:
      return <NetworkConfig dispatch={dispatch} networkKey={conf} field={children[conf]} user={user} data={data} />;
    case STACK_COMPONENT_TAGS:
      return <CloudTags dispatch={dispatch} vmKey={conf} user={user} />;
    case STACK_COMPONENT_SECURITY_GROUP:
      return <SecurityGroups dispatch={dispatch} vmKey={conf} user={user} />;
    default:
      return <DMFieldSelect dispatch={dispatch} fieldKey={conf} field={children[conf]} user={user} hideLabel="true" />;
  }
}

export function getFieldComponents(dispatch, fieldKey, user, component) {
  const field = FIELDS[fieldKey];
  switch (component) {
    case REPLICATION_INTERVAL_COMP:
      return <ReplicationInterval dispatch={dispatch} fieldKey={fieldKey} user={user} field={field} />;
    case MULTISELECT_ITEM_COMP:
      return <DMMultiSelect dispatch={dispatch} fieldKey={fieldKey} user={user} field={field} />;
    case DATE_PICKER_COMP:
      return <DMDatePicker dispatch={dispatch} fieldKey={fieldKey} user={user} field={field} />;
    default:
      return <div>404</div>;
  }
}

export function getItemRendererComponent(render, data, field, user, dispatch) {
  switch (render) {
    case OS_TYPE_ITEM_RENDERER:
      return <OsTypeItemRenderer data={data} />;
    case VM_SIZE_ITEM_RENDERER:
      return <VMSizeItemRenderer data={data} />;
    case DR_PLAN_NAME_ITEM_RENDERER:
      return <DRPlanNameItemRenderer data={data} />;
    case DATE_ITEM_RENDERER:
      return <DateItemRenderer data={data} field={field} />;
    case STATUS_ITEM_RENDERER:
      return <StatusItemRenderer data={data} field={field} />;
    case TRANSFER_SIZE_ITEM_RENDERER:
      return <TransferSizeItemRenderer data={data} field={field} />;
    case RECOVERY_TYPE_ITEM_RENDERER:
      return <RecoveryTypeItemRenderer data={data} field={field} />;
    case TIME_DURATION_RENDERER:
      return <TimeDurationItemRenderer data={data} field={field} />;
    case RECOVERY_SITE_LINK_ITEM_RENDERER:
      return <RecoverySiteLinkRenderer data={data} field={field} user={user} />;
    case SSH_RDP_ITEM_RENDERER:
      return <SshRdpRenderer data={data} field={field} user={user} />;
    case VM_USERNAME_ITEM_RENDERER:
      return <VMUsernameItemRenderer data={data} user={user} dispatch={dispatch} />;
    case VM_UPASSWORD_ITEM_RENDERER:
      return <VMPasswordItemRenderer data={data} user={user} dispatch={dispatch} />;
    case REPLICATION_INTERVAL_ITEM_RENDERER:
      return <ReplicationIntervalItemRenderer data={data} field={field} />;
    case EVENT_LEVEL_ITEM_RENDERER:
      return <EventLevelItemRenderer data={data} field={field} />;
    case ALERT_ACK_ITEM_RENDERER:
      return <AlertAckItemRenderer data={data} field={field} dispatch={dispatch} />;
    case VIEW_ALERT_INFO_RENDERER:
      return <ViewAlertInfoItemRenderer data={data} field={field} dispatch={dispatch} />;
    case SERVER_PORT_ITEM_RENDERER:
      return <ServerPortItemRenderer data={data} />;
    case SIZE_ITEM_RENDERER:
      return <SizeItemRenderer data={data} field={field} />;
    case SUPPORT_BUNDLE_ACTION_ITEM_RENDERER:
      return <SupportBundleActionsRenderer data={data} field={field} dispatch={dispatch} />;
    case NODE_NAME_ITEM_RENDERER:
      return <NodeNameItemRenderer data={data} />;
    case EMAIL_RECIPIENT_ACTION_ITEM_RENDER:
      return <EmailRecipientItemRenderer data={data} dispatch={dispatch} />;
    case NODE_ACTION_RENDERER:
      return <NodeActionItemRenderer data={data} dispatch={dispatch} />;
    case VM_BOOT_ORDER_ITEM_RENDER:
      return <VMBootOrderItemRenderer data={data} user={user} dispatch={dispatch} />;
    case LICENSE_USAGE_ITEM_RENDERER:
      return <LicenseUsageItemRenderer data={data} field={field} />;
    case LICENSE_ACTION_ITEM_RENDERER:
      return <LicenseActionItemRenderer data={data} dispatch={dispatch} />;
    case LICENSE_STATUS_ITEM_RENDER:
      return <LicenseStatusItemRender data={data} field={field} />;
    default:
      return (<div> 404 </div>);
  }
}
